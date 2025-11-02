import ImageMedia from "../../../components/imageMedia/ImageMedia";
import type { BasicDetailsIn } from "../../../utils/interfaces";

interface Props {
  handleExisting: (files: string[]) => void;
  handleNew: (files: File[]) => void;
  basicData: BasicDetailsIn;
  isReadOnly: boolean;
}

const Overview = (props: Props) => {
  const { basicData, handleExisting, handleNew, isReadOnly } = props;
  return (
    <>
      {basicData.images && (
        <ImageMedia
          isReadOnly={isReadOnly}
          initialImages={basicData.images}
          onUrlChange={handleExisting}
          onChange={handleNew}
        />
      )}
    </>
  );
};

export default Overview;
