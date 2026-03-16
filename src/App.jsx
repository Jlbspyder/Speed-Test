import { useState, useEffect, use } from "react";
import Header from "./components/Header";
import NotePad from "./components/NotePad";
import Complete from "./components/Complete";
import Navigation from "./components/Navigation";
import BaseLine from "./components/BaseLine";
import data from "../data.json";
import { useTypingTest } from "./hooks/useTypingTest";

const levelToKey = (v) => v.toLowerCase();
const timeToMode = (v) => (v.startsWith("Timed") ? "timed" : "passage");

function App() {
  const typing = useTypingTest(data);

  const minutes = Math.floor(typing.displayTime / 60);
  const seconds = typing.displayTime % 60;
  const formattedTime = `${minutes}:${String(seconds).padStart(2, "0")}`;

  const [levelSelected, setLevelSelected] = useState(
    () => typing.difficulty[0].toUpperCase() + typing.difficulty.slice(1),
  );

  const [timeSelected, setTimeSelected] = useState(() =>
    typing.mode === "timed" ? "Timed (60s)" : "Passage",
  );

  const [openLevel, setOpenLevel] = useState(false);
  const [openTime, setOpenTime] = useState(false);


  useEffect(
    () => typing.setDifficulty(levelToKey(levelSelected)),
    [levelSelected],
  );
  useEffect(() => typing.setMode(timeToMode(timeSelected)), [timeSelected]);

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
          openLevel={openLevel}
          openTime={openTime}
          setOpenLevel={setOpenLevel}
          setOpenTime={setOpenTime}
          accuracy={typing.accuracy}
          timeDisplay={formattedTime}
          personalBest={typing.best}
          typing={typing}
        />
      )}
      {typing.status !== "finished" && (
        <NotePad
          typing={typing}
          setOpenLevel={setOpenLevel}
          setOpenTime={setOpenTime}
        />
      )}
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
