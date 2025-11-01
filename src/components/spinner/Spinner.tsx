import "./Spinner.scss";

interface Props {
  isLoading: boolean;
}

const Spinner = (props: Props) => {
  const { isLoading } = props;
  if (!isLoading) return null;

  return (
    <div className="overlay">
      <div className="flex flex-col items-center justify-center">
        <div className="om-chakra-spinner-fancy">
          <span className="om-symbol">ॐ</span>
        </div>
        <div className="loading-text">One Step Closer to Your Match...</div>
      </div>
    </div>
  );
};

export default Spinner;
