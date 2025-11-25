import "./Spinner.scss";
interface Props {
  isLoading: boolean;
  hideText?: boolean;
}

const Spinner = (props: Props) => {
  const { isLoading, hideText } = props;
  if (!isLoading) return null;

  return (
    <div className="app-container flex items-center justify-center min-h-screen p-4">
      <div className="flex flex-col items-center space-y-8">
        <div className="chakra-card relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center rounded-full shadow-xl">
          <div className="spinner-ring absolute w-full h-full rounded-full" />

          <div className="om-symbol absolute z-20 text-5xl md:text-6xl font-bold flex items-center justify-center">
            ॐ
          </div>
        </div>

        {!hideText && (
          <p className="loading-text text-xl font-medium">
            One Step Closer to Your Match...
          </p>
        )}
      </div>
    </div>
  );
};

export default Spinner;
