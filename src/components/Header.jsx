import { useState } from "react";

const Header = ({
  levelSelected,
  setLevelSelected,
  timeSelected,
  setTimeSelected,
  wpm,
  accuracy,
  typing,
  timeDisplay,
  timeDisplayMedium,
  timeDisplayHard,
}) => {
  const levelOptions = ["Easy", "Medium", "Hard"];
  const timeOptions = ["Timed", "Passage"];

  const [openLevel, setOpenLevel] = useState(false);
  const [openTime, setOpenTime] = useState(false);

  const { status } = typing;

  return (
    <div>
      <header className="bg-(--black) pb-2">
        <div className="text-(--white) lg:flex lg:items-center lg:justify-between lg:w-full">
          {/* Live stats */}
          <div className="flex items-center justify-around lg:w-[40%] pt-4 md:pt-0">
            <div className="flex flex-col lg:flex-row items-center ml-4 lg:ml-1 justify-left md:gap-2 border-r border-r-(--light-gray) md:w-[60%] w-full">
              <div className="text-(--light-gray) md:text-[12px]">WPM:</div>
              <div className="text-(--white) text-2xl font-semibold">{wpm}</div>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-center lg:gap-2 border-r border-r-(--light-gray) w-full">
              <div className="text-(--light-gray) md:text-[12px]">
                Accuracy:
              </div>
              <div
                className={`text-2xl font-semibold ${status === "idle" ? "text-(--white)" : "text-(--red)"}`}
              >
                {accuracy}%
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center pl-6 sm:pl-0 justify-center lg:gap-2 w-full">
              <div className="text-(--light-gray) md:text-[12px]">Time:</div>
              <div
                className={`text-2xl font-semibold ${status === "idle" ? "text-(--white)" : "text-(--yellow)"}`}
              >
                {typing.difficulty === "easy" && timeDisplay}
                {typing.difficulty === "medium" && timeDisplayMedium}
                {typing.difficulty === "hard" && timeDisplayHard}
              </div>
            </div>
          </div>

          {/* Mobile dropdown controls */}
          <div className="lg:hidden flex items-center justify-center my-4 gap-2">
            {/* Difficulty dropdown */}
            <div className="relative w-[40%]">
              <button
                type="button"
                onClick={() => setOpenLevel((prev) => !prev)}
                className="w-full py-1 border border-(--light-gray) cursor-pointer rounded-lg text-center"
              >
                {levelSelected || "Easy"}
              </button>

              {openLevel && (
                <ul className="absolute w-full mt-1 rounded-sm bg-(--off-black) shadow-md z-20">
                  {levelOptions.map((option) => (
                    <li
                      key={option}
                      className="relative border-b last:border-b-0 border-(--dark-gray) flex items-center gap-2 px-4 py-2 hover:bg-(--light-blue) cursor-pointer"
                      onClick={() => {
                        setLevelSelected(option);
                        setOpenLevel(false);
                      }}
                    >
                      <div className="relative">
                        <input
                          type="radio"
                          name="level-options"
                          checked={levelSelected === option}
                          onChange={() => setLevelSelected(option)}
                          className="form-checkbox relative cursor-pointer appearance-none peer checked:border-0 checked:bg-(--light-blue) bg-transparent border border-(--white) w-4 h-4 rounded-full"
                        />
                        <div
                          className="
                            pointer-events-none
                            absolute top-[40%] left-2
                            w-2 h-2 rounded-full
                            -translate-x-1/2 -translate-y-1/2
                            bg-black
                            scale-0 peer-checked:scale-100
                            transition
                        "
                        />
                      </div>
                      <span>{option}</span>
                    </li>
                  ))}
                </ul>
              )}

              <img
                src="/images/icon-down-arrow.svg"
                alt="dropdown arrow"
                className="pointer-events-none absolute right-5 sm:right-20 top-1/2 -translate-y-1/2"
              />
            </div>

            {/* Mode dropdown */}
            <div className="relative w-[45%]">
              <button
                type="button"
                onClick={() => setOpenTime((prev) => !prev)}
                className="w-full py-1 border border-(--light-gray) cursor-pointer rounded-lg text-center"
              >
                {typing.difficulty === "easy" && "Timed (60s)"}
                {typing.difficulty === "medium" && "Timed (90s)"}
                {typing.difficulty === "hard" && "Timed (120s)"}
              </button>

              {openTime && (
                <ul className="absolute w-full mt-1 rounded-sm bg-(--off-black) shadow-md z-20">
                  {timeOptions.map((option) => (
                    <li
                      key={option}
                      className="relative border-b last:border-b-0 border-(--dark-gray) flex items-center gap-2 px-4 py-2 hover:bg-(--light-blue) cursor-pointer"
                      onClick={() => {
                        setTimeSelected(option);
                        setOpenTime(false);
                      }}
                    >
                      <div className="relative">
                        <input
                          type="radio"
                          name="time-options"
                          checked={timeSelected === option}
                          onChange={() => setTimeSelected(option)}
                          className="form-checkbox relative cursor-pointer appearance-none peer checked:border-0 checked:bg-(--light-blue) bg-transparent border border-(--white) w-4 h-4 rounded-full"
                        />
                        <div
                          className="
                            pointer-events-none
                            absolute top-[40%] left-2
                            w-2 h-2 rounded-full
                            -translate-x-1/2 -translate-y-1/2
                            bg-black
                            scale-0 peer-checked:scale-100
                            transition
                        "
                        />
                      </div>
                      <span>{option}</span>
                    </li>
                  ))}
                </ul>
              )}

              <img
                src="/images/icon-down-arrow.svg"
                alt="dropdown arrow"
                className="pointer-events-none absolute right-4 sm:right-20 top-1/2 -translate-y-1/2"
              />
            </div>
          </div>

          {/* Desktop button controls */}
          <div className="hidden lg:flex items-center gap-5">
            <div className="flex items-center gap-1">
              <p className="text-(--dark-gray) text-[12px]">Difficulty:</p>
              {levelOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setLevelSelected(option)}
                  className={`px-3 rounded-md border ${
                    levelSelected === option
                      ? "border-(--light-blue) text-(--light-blue)"
                      : "border-(--light-gray) hover:text-(--light-blue) hover:border-(--light-blue) text-(--white)"
                  } cursor-pointer`}
                >
                  <span className="text-[12px]">{option}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 ">
              <p className="text-(--dark-gray) text-[12px]">Mode:</p>
              {timeOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setTimeSelected(option)}
                  className={`px-3 rounded-md border ${
                    timeSelected === option
                      ? "border-(--light-blue) text-(--light-blue)"
                      : "border-(--light-gray) hover:text-(--light-blue) hover:border-(--light-blue) text-(--white)"
                  } cursor-pointer`}
                >
                  <span className="text-[12px]">{option}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
