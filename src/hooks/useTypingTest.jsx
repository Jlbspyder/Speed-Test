import { useEffect, useMemo, useRef, useState } from "react";

const TIME_LIMIT = 60;
const BEST_KEY = "personal_best";
const HAS_PLAYED_KEY = "typing_has_played_v1";
const MODE_KEY = "typing_mode_v1";
const DIFF_KEY = "typing_difficulty_v1";
const BEST_ACCURACY_KEY = "typing_best_accuracy_v1";

const pickRandom = (data, difficulty) => {
  const arr = data[difficulty] ?? [];
  if (!arr.length) return "";
  return arr[Math.floor(Math.random() * arr.length)]?.text ?? "";
};

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export function useTypingTest(data) {
  const [difficulty, setDifficulty] = useState(() => {
    const saved = localStorage.getItem(DIFF_KEY);
    return saved === "easy" || saved === "medium" || saved === "hard"
      ? saved
      : "easy";
  });

  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem(MODE_KEY);
    return saved === "timed" || saved === "passage" ? saved : "timed";
  });

  const [resultType, setResultType] = useState(null); // "baseline" | "highscore" | null
  const [hasPlayed, setHasPlayed] = useState(() => {
    return localStorage.getItem(HAS_PLAYED_KEY) === "true";
  });

  const [passage, setPassage] = useState(() => pickRandom(data, "easy"));
  const [status, setStatus] = useState("idle"); // "idle" | "running" | "finished"
  const [startMs, setStartMs] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  const [typed, setTyped] = useState("");
  const [totalKeys, setTotalKeys] = useState(0);
  const [errorKeys, setErrorKeys] = useState(0);

  const [best, setBest] = useState(() => {
    const raw = localStorage.getItem(BEST_KEY);
    const n = raw ? Number(raw) : null;
    return Number.isFinite(n) ? n : null;
  });

  const [bestAccuracy, setBestAccuracy] = useState(() => {
    const raw = localStorage.getItem(BEST_ACCURACY_KEY);
    const n = raw ? Number(raw) : null;
    return Number.isFinite(n) ? n : null;
  });

  // messages / celebration flags
  const [showBaseline, setShowBaseline] = useState(false);
  const [showHighScore, setShowHighScore] = useState(false);

  const inputRef = useRef(null);

  const reset = (newDifficulty = difficulty) => {
    setPassage(pickRandom(data, newDifficulty));
    setStatus("idle");
    setStartMs(null);
    setElapsed(0);
    setTyped("");
    setTotalKeys(0);
    setErrorKeys(0);
    setShowBaseline(false);
    setShowHighScore(false);
    setResultType(null);
  };

  // Persist difficulty and mode
  useEffect(() => {
    localStorage.setItem(DIFF_KEY, difficulty);
  }, [difficulty]);

  useEffect(() => {
    localStorage.setItem(MODE_KEY, mode);
  }, [mode]);

  // Difficulty change: refresh passage if not running
  useEffect(() => {
    if (status === "running") return;
    reset(difficulty);
  }, [difficulty]);

  // Mode change: refresh passage if not running
  useEffect(() => {
    if (status === "running") return;
    reset(difficulty);
  }, [mode]);

  // Timer
  useEffect(() => {
    if (status !== "running" || startMs == null) return;

    const id = setInterval(() => {
      const sec = Math.floor((Date.now() - startMs) / 1000);
      setElapsed(sec);

      if (mode === "timed" && sec >= TIME_LIMIT) {
        setElapsed(TIME_LIMIT);
        setStatus("finished");
      }
    }, 200);

    return () => clearInterval(id);
  }, [status, startMs, mode]);

  // Finish passage mode when typed reaches passage length
  useEffect(() => {
    if (status !== "running") return;
    if (passage.length === 0) return;
    if (typed.length >= passage.length) {
      setStatus("finished");
    }
  }, [typed, passage, status]);

  // Derived stats
  const correctChars = useMemo(() => {
    let characters = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === passage[i]) characters++;
    }
    return characters;
  }, [typed, passage]);

  const incorrectChars = useMemo(
    () => typed.length - correctChars,
    [typed.length, correctChars],
  );

  const minutes = Math.max(elapsed / 60, 1 / 60);
  const wpm = useMemo(
    () => Math.floor(correctChars / 5 / minutes),
    [correctChars, minutes],
  );

  const accuracy = useMemo(() => {
    if (totalKeys === 0) return 0;
    const acc = 1 - errorKeys / totalKeys;
    return Math.round(clamp(acc, 0, 1) * 100);
  }, [totalKeys, errorKeys]);

  const onChange = (e) => {
    const nextValue = e.target.value;

    // don't allow typing past passage length
    const limitedValue = nextValue.slice(0, passage.length);

    // start if idle and user begins typing
    if (status === "idle" && limitedValue.length > 0) {
      setStatus("running");
      setStartMs(Date.now());
      setElapsed(0);
    }

    // count total keys by change in length
    const prev = typed;
    const lengthDiff = limitedValue.length - prev.length;

    if (lengthDiff > 0) {
      setTotalKeys((k) => k + lengthDiff);

      for (let i = prev.length; i < limitedValue.length; i++) {
        if (limitedValue[i] !== passage[i]) {
          setErrorKeys((err) => err + 1);
        }
      }
    } else if (lengthDiff < 0) {
      // backspace / deletion
      setTotalKeys((k) => k + Math.abs(lengthDiff));
      // keep original errors counted
    }

    setTyped(limitedValue);
  };

  // timed: countdown; passage: counts up (no limit)
  const timeLeft =
    mode === "timed" ? clamp(TIME_LIMIT - elapsed, 0, TIME_LIMIT) : null;

  const start = () => {
    if (!passage) return;
    if (status === "running") return;
    setStatus("running");
    setStartMs(Date.now());
    setElapsed(0);
    setShowBaseline(false);
    setShowHighScore(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const restart = () => {
    reset(difficulty); // picks new random passage
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const onKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
  };

  // Baseline / high score + persist best on finish
  useEffect(() => {
    if (status !== "finished") return;

    const prevBest = best;

    // FIRST EVER TEST
    if (!hasPlayed) {
      localStorage.setItem(HAS_PLAYED_KEY, "true");
      setHasPlayed(true);

      localStorage.setItem(BEST_KEY, String(wpm));
      setBest(wpm);

      localStorage.setItem(BEST_ACCURACY_KEY, String(accuracy));
      setBestAccuracy(accuracy);

      setResultType("complete"); // 👈 first screen
      return;
    }

    // SECOND TEST (baseline moment)
    if (hasPlayed && prevBest != null && resultType == null) {
      if (wpm > prevBest) {
        setResultType("highscore");
        localStorage.setItem(BEST_KEY, String(wpm));
        setBest(wpm);
        return;
      }
      if (accuracy > bestAccuracy) {
        localStorage.setItem(BEST_ACCURACY_KEY, String(accuracy));
        setBestAccuracy(accuracy);
        return;
      }

      setResultType("baseline");
      return;
    }

    // Later tests
    if (wpm > prevBest) {
      setResultType("highscore");
      localStorage.setItem(BEST_KEY, String(wpm));
      setBest(wpm);
    } else {
      setResultType("complete");
    }
  }, [status]);

  return {
    // config
    difficulty,
    setDifficulty,
    mode,
    setMode,

    // test
    passage,
    status,
    elapsed,
    timeLeft,
    typed,

    // stats
    wpm,
    accuracy,
    best,
    bestAccuracy,
    correctChars,
    incorrectChars,

    // messages / celebration
    showBaseline,
    showHighScore,
    resultType,

    // actions
    start,
    restart,
    onKeyDown,
    inputRef,
    onChange,
  };
}
