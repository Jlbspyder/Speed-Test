import { useState, useEffect } from "react";
import Header from "./components/Header";
import NotePad from "./components/NotePad";
import Complete from "./components/Complete";
import Navigation from "./components/Navigation";
import data from "../data.json";
import { useTypingTest } from "./hooks/useTypingTest";

const levelToKey = (v) => v.toLowerCase();

function App() {
  const typing = useTypingTest(data);

  const minutes = Math.floor(typing.displayTime / 60);
  const seconds = typing.displayTime % 60;
  const formattedTime = `${minutes}:${String(seconds).padStart(2, "0")}`;

  const [levelSelected, setLevelSelected] = useState(
    () => typing.difficulty[0].toUpperCase() + typing.difficulty.slice(1),
  );

  const [openLevel, setOpenLevel] = useState(false);
  const [openTime, setOpenTime] = useState(false);

  useEffect(
    () => typing.setDifficulty(levelToKey(levelSelected)),
    [levelSelected],
  );

  return (
    <div className="container min-h-screen">
      <Navigation typing={typing} />
      {typing.status !== "finished" && typing.status !== "timeout" && (
        <Header
          levelSelected={levelSelected}
          setLevelSelected={setLevelSelected}
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
      {typing.status !== "finished" && typing.status !== "timeout" && (
        <NotePad
          typing={typing}
          setOpenLevel={setOpenLevel}
          setOpenTime={setOpenTime}
        />
      )}
      {(typing.status === "finished" || typing.status === "timeout") && (
        <Complete typing={typing} />
      )}
    </div>
  );
}

export default App;
