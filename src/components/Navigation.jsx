const Navigation = ({ typing }) => {
  const { best, bestAccuracy } = typing;
  return (
    <nav className="flex items-center justify-between py-4 md:py-8 md:mx-0 sm:mx-2 sm:py-4">
      <div>
        <picture>
          <source
            srcSet="/images/logo-small.svg"
            media="(max-width: 750px)"
            type="image/svg+xml"
          />
          <img src="/images/logo-large.svg" alt="logo" />
        </picture>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <img src="/images/icon-personal-best.svg" alt="personal best icon" />
          <p className="text-(--white)">
            <span className="sm:hidden text-(--light-gray)">Best:</span>
            <span className="hidden sm:inline text-(--light-gray)">
              Personal best:
            </span>
          </p>
          <h5 className="text-(--white)">{best ?? "--"} WPM</h5>
        </div>
        <div className="flex items-center gap-1">
          <img src="/images/icon-personal-best.svg" alt="personal best icon" />
          <p className="text-(--white)">
            <span className="sm:hidden text-(--light-gray)">Accuracy:</span>
            <span className="hidden sm:inline text-(--light-gray)">
              Best accuracy:
            </span>
          </p>
          <h5 className="text-(--white)">{bestAccuracy ?? "--"} %</h5>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
