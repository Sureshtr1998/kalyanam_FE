import "./Spinner.scss"

interface Props {
    isLoading: boolean;
}

const Spinner = (props: Props) => {
    const { isLoading } = props;
    if (!isLoading) return null;

    return (
        <div className="overlay">
            <div className="box">
                <span className="spinner" />
            </div>
        </div>
    );
};

export default Spinner;
