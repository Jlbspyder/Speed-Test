import { useState, useEffect } from "react";
import Header from "./components/Header";
import NotePad from "./components/NotePad";
import Complete from "./components/Complete";
import Navigation from "./components/Navigation";
import BaseLine from "./components/BaseLine";
import data from "../data.json";
import { useTypingTest } from "./hooks/useTypingTest";

const levelToKey = (v) => v.toLowerCase();
const timeToMode = (v) => (v.startsWith("Timed") ? "timed" : "passage");

const formatTime = (sec) => {
  const mins = Math.floor(sec / 60);
  const seconds = String(sec % 60).padStart(2, "0");
  return `${mins}:${seconds}`;
};

function App() {
  const typing = useTypingTest(data);

  const [levelSelected, setLevelSelected] = useState(
    () => typing.difficulty[0].toUpperCase() + typing.difficulty.slice(1),
  );

  const [timeSelected, setTimeSelected] = useState(() =>
    typing.mode === "timed" ? "Timed (60s)" : "Passage",
  );

  useEffect(
    () => typing.setDifficulty(levelToKey(levelSelected)),
    [levelSelected],
  );
  useEffect(() => typing.setMode(timeToMode(timeSelected)), [timeSelected]);

  const timeDisplay =
    typing.mode === "timed" && typing.difficulty === "easy"
      ? formatTime(typing.timeLeft ?? 0)
      : formatTime(typing.elapsed);
  const timeDisplayMedium =
    typing.mode === "timed" && typing.difficulty === "medium"
      ? formatTime(typing.timeLeftMedium ?? 0)
      : formatTime(typing.elapsed);
  const timeDisplayHard =
    typing.mode === "timed" && typing.difficulty === "hard"
      ? formatTime(typing.timeLeftHard ?? 0)
      : formatTime(typing.elapsed);

  return (
    <div className="container min-h-screen">
      <Navigation typing={typing} />
      {typing.status !== "finished" && (
        <Header
          levelSelected={levelSelected}
          setLevelSelected={setLevelSelected}
          timeSelected={timeSelected}
          setTimeSelected={setTimeSelected}
          wpm={typing.wpm}
          accuracy={typing.accuracy}
          timeDisplay={timeDisplay}
          timeDisplayMedium={timeDisplayMedium}
          timeDisplayHard={timeDisplayHard}
          personalBest={typing.best}
          typing={typing}
        />
      )}
      {typing.status !== "finished" && <NotePad typing={typing} />}
      {typing.status === "finished" && <Complete typing={typing} />}
      {typing.status === "finished" && (
        <BaseLine
          type={typing.resultType}
          wpm={typing.wpm}
          accuracy={typing.accuracy}
          correct={typing.correctChars}
          incorrect={typing.incorrectChars}
          best={typing.best}
          onAgain={typing.restart}
        />
      )}
    </div>
  );
}

export default App;
