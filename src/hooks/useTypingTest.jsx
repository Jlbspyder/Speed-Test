import { useEffect, useMemo, useRef, useState } from "react";

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

const clamp = (num, min, max) => Math.max(min, Math.min(max, num));

export function useTypingTest(data) {
  const [difficulty, setDifficulty] = useState(() => {
    const saved = localStorage.getItem(DIFF_KEY);
    return saved === "easy" || saved === "medium" || saved === "hard"
      ? saved
      : "easy";
  });

  const timeByDifficulty = {
    easy: 60,
    medium: 90,
    hard: 120,
  };

  const timeLimit = timeByDifficulty[difficulty];

  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem(MODE_KEY);
    return saved === "timed" || saved === "passage" ? saved : "timed";
  });

  const [resultType, setResultType] = useState(null); // "baseline" | "highscore" | "timeUP" | null
  const [hasPlayed, setHasPlayed] = useState(() => {
    return localStorage.getItem(HAS_PLAYED_KEY) === "true";
  });

  const [passage, setPassage] = useState(() => pickRandom(data, "easy"));
  const [status, setStatus] = useState("idle"); // "idle" | "running" | "finished" | "timeout"
  const [startMs, setStartMs] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  const [typed, setTyped] = useState("");
  const [totalKeys, setTotalKeys] = useState(0);
  const [errorKeys, setErrorKeys] = useState(0);

  const [best, setBest] = useState(() => {
    const score = localStorage.getItem(BEST_KEY);
    const num = score ? Number(score) : null;
    return Number.isFinite(num) ? num : null;
  });

  const [bestAccuracy, setBestAccuracy] = useState(() => {
    const accuracyPoint = localStorage.getItem(BEST_ACCURACY_KEY);
    const num = accuracyPoint ? Number(accuracyPoint) : null;
    return Number.isFinite(num) ? num : null;
  });

  // messages / celebration flags
  const [showBaseline, setShowBaseline] = useState(false);
  const [showHighScore, setShowHighScore] = useState(false);

  const inputRef = useRef(null);

  const clearRunState = () => {
    setStartMs(null);
    setElapsed(0);
    setTyped("");
    setTotalKeys(0);
    setErrorKeys(0);
    setShowBaseline(false);
    setShowHighScore(false);
    setResultType(null);
  };

  const restart = () => {
    clearRunState();
    if (status === "finished") {
      reset(difficulty); // picks new random passage
    }
    if (status === "timeup") {
      reset(difficulty); // picks new random passage
    }
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      setStatus("running");
      setStartMs(Date.now());
      setElapsed(0);
    });
  };

  const reset = (newDifficulty = difficulty) => {
    setPassage(pickRandom(data, newDifficulty));
    clearRunState();
    requestAnimationFrame(() => inputRef.current?.focus());
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
    reset(difficulty);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      setStartMs(Date.now());
      setElapsed(0);
    });
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

      if (mode === "timed" && sec >= timeLimit) {
        setElapsed(timeLimit);
        setStatus("timeout");
      }
    }, 200);

    return () => clearInterval(id);
  }, [status, startMs, mode, timeLimit]);

  // When timer runs out before passage ends
  useEffect(() => {
    if (status !== "timeout") return;
    setResultType("timeUP");
  }, [status]);

  // Finish passage mode when typed reaches passage length
  useEffect(() => {
    if (status !== "running") return;
    if (passage.length === 0) return;
    if (typed.length === passage.length) {
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
    mode === "timed" ? clamp(timeLimit - elapsed, 0, timeLimit) : null;

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

  const onKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
  };

  // Baseline / high score + persist best on finish
  useEffect(() => {
    if (status !== "finished") return;

    const prevBest = best;

    // FIRST EVER TEST (baseline moment)
    if (!hasPlayed) {
      localStorage.setItem(HAS_PLAYED_KEY, "true");
      setHasPlayed(true);

      localStorage.setItem(BEST_KEY, String(wpm));
      setBest(wpm);

      localStorage.setItem(BEST_ACCURACY_KEY, String(accuracy));
      setBestAccuracy(accuracy);

      setResultType("baseline"); // second screen (beat baseline)
      return;
    }
    if (!hasPlayed && timeLeft === 0) {
      localStorage.setItem(HAS_PLAYED_KEY, "true");
      setHasPlayed(true);

      localStorage.setItem(BEST_KEY, String(wpm));
      setBest(wpm);

      localStorage.setItem(BEST_ACCURACY_KEY, String(accuracy));
      setBestAccuracy(accuracy);

      setResultType("timeUP"); // second screen (beat baseline)
      return;
    }

    // SECOND TEST (beat baseline moment)
    if (
      hasPlayed &&
      prevBest != null &&
      resultType != null &&
      accuracy != null
    ) {
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
      setResultType("highscore"); // second screen (beat baseline)
      return;
    }

    // Later tests
    if (wpm <= prevBest) {
      setResultType("complete");
      localStorage.setItem(BEST_KEY, String(wpm));
      setBest(prevBest);
    }
    if (wpm > prevBest) {
      setResultType("highscore");
      localStorage.setItem(BEST_KEY, String(wpm));
      setBest(wpm);
    }
    if (accuracy > bestAccuracy) {
      localStorage.setItem(BEST_ACCURACY_KEY, String(accuracy));
      setBestAccuracy(accuracy);
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
    timeByDifficulty,
    timeLimit,

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
