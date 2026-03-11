import { useMemo } from "react";

const NotePad = ({ typing }) => {
  const { passage, typed, status, onChange, start, restart, onKeyDown, inputRef } =
    typing;

  // Passage render
  const renderedPassage = useMemo(() => {
    const characters = [...passage];
    const cursor = typed.length;

    return characters.map((character, idx) => {
      let cls = status === "idle" ? "text-gray-300" : "text-(--light-gray)";

      if (idx < cursor) {
        cls =
          typed[idx] === character
            ? "text-(--green)"
            : "text-(--red) underline";
      } else if (status === "running" && idx === cursor) {
        cls = "text-(--dark-gray) border-l-2 border-(--white) animate-blink";
      }

      const display = character === " " ? "\u00A0" : character;

      return (
        <span key={idx} className={cls}>
          {display}
        </span>
      );
    });
  }, [passage, typed, status]);

  

  return (
    <>
      <div className={`mt-6 relative ${status !== "idle" ? "border-b-(--dark-gray) border" : ""}`}>
        {/* Typing area */}
        <div
          className="relative bg-(--black) pb-4 px-1 rounded cursor-text"
          onClick={() => {
            inputRef.current?.focus();
            if (status === "idle") start();
          }}
        >
          {/* blurred passage when idle */}
          <div
            className={[
              "leading-7 text-lg sm:text-xl whitespace-pre-wrap wrap-break-words break-all transition duration-200",
              status === "idle"
                ? "blur-md brightness-95 select-none"
                : "blur-0 brightness-100",
            ].join(" ")}
          >
            {renderedPassage}
          </div>

          {/* overlay */}
          {status === "idle" && (
            <div className="absolute h-100 inset-0 flex flex-col items-center justify-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  start();
                }}
                className="bg-(--deep-blue) text-[22px] sm:text-[12px] text-(--white) rounded-lg cursor-pointer px-4 py-2 sm:rounded-md border-2 border-(--light-blue) hover:bg-(--light-blue) font-semibold"
              >
                Start Typing Test
              </button>
              <div className="text-[20px] sm:text-[12px] text-(--white)">
                Or click the text and start typing
              </div>
              //{" "}
            </div>
          )}

          {/* hidden input to capture typing */}
          <input
            ref={inputRef}
            onKeyDown={onKeyDown}
            value={typed}
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            onChange={onChange}
            className="absolute opacity-0 pointer-events-none"
            aria-label="Typing input"
          />
        </div>
      </div>
      {/* Controls */}
      {status !== "idle" && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={restart}
            className="px-3 py-2 cursor-pointer flex items-center md:text-[10px] rounded text-(--white) bg-(--off-black) hover:bg-(--light-gray) transition"
          >
            Restart Test
            <img
              src="/images/icon-restart.svg"
              alt="Restart"
              className="ml-2 md:w-2 md:h-2"
            />
          </button>
        </div>
      )}
    </>
  );
};
export default NotePad;
