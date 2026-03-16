const Header = ({
  levelSelected,
  setLevelSelected,
  wpm,
  accuracy,
  typing,
  openLevel,
  openTime,
  setOpenLevel,
  setOpenTime,
}) => {
  const { status, mode, setMode, timeLeft, elapsed, timeLimit } = typing;

  const levelOptions = ["Easy", "Medium", "Hard"];
  const modeOptions = [
    { value: "timed", label: `Timed (${timeLimit}s)` },
    { value: "passage", label: "Passage" },
  ];

  const displayTime = mode === "timed" ? timeLeft : elapsed;

  const minutes = Math.floor(displayTime / 60);
  const seconds = displayTime % 60;
  const formattedTime = `${minutes}:${String(seconds).padStart(2, "0")}`;

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
                {formattedTime}
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
                className="w-full py-1  border border-(--light-gray) cursor-pointer rounded-lg text-center"
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
                      <span className="max-[395px]:text-[13px]">{option}</span>
                    </li>
                  ))}
                </ul>
              )}

              <img
                src="/images/icon-down-arrow.svg"
                alt="dropdown arrow"
                className={`pointer-events-none absolute right-5 sm:right-20 top-1/2 -translate-y-1/2 ${openLevel ? "rotate-180 transition duration-300" : "transition duration-300"}`}
              />
            </div>

            {/* Mode dropdown */}
            <div className="relative w-[45%]">
              <button
                type="button"
                onClick={() => setOpenTime((prev) => !prev)}
                className="w-full py-1 border border-(--light-gray) cursor-pointer rounded-lg text-center"
              >
                {typing.mode === "timed"
                  ? `Timed (${typing.timeLimit}s)`
                  : "Passage"}
              </button>

              {openTime && (
                <ul className="absolute w-full mt-1 rounded-sm bg-(--off-black) shadow-md z-20">
                  {modeOptions.map((option) => (
                    <li
                      key={option.value}
                      onClick={() => {
                        setMode(option.value);
                        setOpenTime(false);
                      }}
                      className="relative border-b last:border-b-0 border-(--dark-gray) flex items-center gap-2 px-4 py-2 hover:bg-(--light-blue) cursor-pointer"
                    >
                      <label key={option.value} className="relative">
                        <input
                          type="radio"
                          name="mode"
                          value={option.value}
                          checked={mode === option.value}
                          onChange={() => setMode(option.value)}
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
                      </label>
                      <span className="max-[395px]:text-[13px]">
                        {option.label}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <img
                src="/images/icon-down-arrow.svg"
                alt="dropdown arrow"
                className={`pointer-events-none absolute max-[395px]:right-2 right-4 sm:right-20 top-1/2 -translate-y-1/2 ${openTime ? "rotate-180 transition duration-300" : "transition duration-300"}`}
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
              {modeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setMode(option.value)}
                  className={`px-3 rounded-md border ${
                    mode === option.value
                      ? "border-(--light-blue) text-(--light-blue)"
                      : "border-(--light-gray) hover:text-(--light-blue) hover:border-(--light-blue) text-(--white)"
                  } cursor-pointer`}
                >
                  <span className="text-[12px]">{option.label}</span>
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
