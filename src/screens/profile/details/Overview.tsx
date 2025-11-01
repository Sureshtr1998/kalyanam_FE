import App from "../../../components/imageMedia/ImageMedia";
import type { BasicDetailsIn } from "../../../utils/interfaces";

interface Props {
  handleExisting: (files: string[]) => void;
  handleNew: (files: File[]) => void;
  basicData: BasicDetailsIn;
}

const Overview = (props: Props) => {
  const { basicData, handleExisting, handleNew } = props;
  return (
    <>
      {basicData.images && (
        <App
          initialImages={basicData.images}
          onUrlChange={handleExisting}
          onChange={handleNew}
        />
      )}
    </>
  );
};

export default Overview;
