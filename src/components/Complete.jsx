import { IoMdRefresh } from "react-icons/io";
import { VscError } from "react-icons/vsc";
const Complete = ({ typing }) => {
  const {
    wpm,
    accuracy,
    correctChars,
    incorrectChars,
    restart,
    best,
    resultType,
    elapsed,
  } = typing;

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const seconds = String(time % 60).padStart(2, "0");
    return `${mins}:${seconds}`;
  };

  return (
    <div className="relative flex flex-col items-center justify-center text-(--white) text-center md:mt-5 mt-15">
      <img
        src="/images/pattern-star-2.svg"
        alt="star"
        className="star-1 w-6 h-6 absolute top-10 left-0"
      />
      {(resultType === "complete" || resultType === "baseline" || resultType === "highscore") && <img
        src={
          resultType === "highscore"
            ? "/images/icon-new-pb.svg"
            : "/images/icon-completed.svg"
        }
        alt="pb"
        className="mb-8 md:mb-4"
      />}
      {resultType === "timeUP" && <VscError className="error" />}
      <h2 className="text-3xl font-semibold py-2">
        {resultType === "complete"
          ? "Test Complete!"
          : resultType === "timeUP"
          ? "Your Time Has Run Out!"
          : resultType === "baseline"
            ? "Baseline Established!"
            : resultType === "highscore"
              ? "High Score Smashed! 🎉"
              : "Keep Practicing!"}
      </h2>
      <p className="text-(--dark-gray) text-[18px] w-full">
        {resultType === "complete"
          ? "Solid run. Keep pushing to beat your high score."
          : resultType === "timeUP"
          ? "You need to up your speed so your time doesn't run out."
          : resultType === "baseline"
            ? "You've set the bar. Now the real challenge begins-time to beat it."
            : resultType === "highscore"
              ? "You're getting faster. That was incredible typing."
              : "Keep practicing to improve your speed and accuracy."}
      </p>
      <div className="flex-col flex items-center md:flex-row md:justify-around mt-4 w-full md:w-[40%] ">
        <div className="flex flex-col border border-(--off-black) mb-4 gap-1 rounded-md w-full md:w-[30%] p-4 md:py-0 pl-2 ">
          <p className="flex self-left text-(--dark-gray) text-[20px]">WPM:</p>
          <h3 className="flex self-left font-semibold text-[20px]">{wpm}</h3>
        </div>
        <div className="flex flex-col border border-(--off-black) mb-4 gap-1 rounded-md w-full md:w-[30%] p-4 md:py-0 pl-2 ">
          <p className="flex self-left text-(--dark-gray) text-[20px]">
            Accuracy:
          </p>
          <h3 className="flex self-left text-(--red) font-semibold text-[20px]">
            {!correctChars ? "0" : accuracy}%
          </h3>
        </div>
        <div className="flex flex-col border border-(--off-black) mb-4 gap-1 rounded-md w-full md:w-[30%] p-4 md:py-0 pl-2">
          <p className="flex self-left text-(--dark-gray) text-[20px]">
            Characters:
          </p>
          <h3 className="flex self-left font-semibold text-[20px]">
            <span className="text-(--green)">{correctChars}</span>
            <span className="text-(--dark-gray)">/</span>{" "}
            <span className="text-(--red)">{incorrectChars}</span>
          </h3>
        </div>
      </div>
      {typing.mode === "passage" && (
        <div className="text-(--dark-gray) mt-2">
          Completion time:{" "}
          <span className="text-(--white) font-semibold">
            {formatTime(elapsed)}
          </span>{" "}
          seconds
        </div>
      )}
      <button
        onClick={restart}
        className="mt-8 mb-18 z-10 sm:mb-8 bg-(--white) text-(--black) text-[18px] md:text-[12px] flex items-center md:py-2 md:px-4 py-4 px-6 gap-2 rounded-lg md:rounded-md font-semibold cursor-pointer hover:bg-(--light-gray) transition"
      >
        {resultType === "complete"
          ? "Go Again"
          : resultType === "baseline"
            ? "Beat This Score"
            : resultType === "highscore"
              ? "Beat The Score"
              : "Go Again"}{" "}
        {resultType === "highscore"
          ? `(${best} WPM)`
          : resultType === "baseline" && `(${best} WPM)`}
        <IoMdRefresh className="refresh" />
      </button>
      <img
        src="/images/pattern-star-1.svg"
        alt="star"
        className="star-2 w-10 h-10 absolute bottom-0 right-0"
      />
      {resultType === "highscore" && (
        <img
          src="/images/pattern-confetti.svg"
          alt="confetti"
          className="h-80 top-132 md:w-300 md:h-40 absolute md:top-90 right-0"
        />
      )}
    </div>
  );
};

export default Complete;
