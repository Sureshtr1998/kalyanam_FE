import { useState, useMemo } from "react";
import type { AstrologyIn } from "../../utils/interfaces";
import { parseGptResponse } from "../../utils/utils";
import { Button } from "primereact/button";

const formatDate = (dateValue?: Date | number) => {
  if (!dateValue) return "N/A";
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  return date.toLocaleString();
};

interface Props {
  astroData: AstrologyIn[];
}

const Consultations = ({ astroData: propAstroData }: Props) => {
  const astroData = propAstroData ?? [];
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const currentAstro = astroData[currentIndex];

  const NavButtons = () => {
    return (
      <div className="nav-btns">
        <Button
          className="normal-btn"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(currentIndex - 1)}>
          <i className="pi pi-arrow-left" />
        </Button>

        <Button
          className="normal-btn"
          disabled={currentIndex === astroData.length - 1}
          onClick={() => setCurrentIndex(currentIndex + 1)}>
          <i className="pi pi-arrow-right" />
        </Button>
      </div>
    );
  };

  const parsedResponse = useMemo(() => {
    return currentAstro?.status?.toLowerCase() !== "pending"
      ? parseGptResponse(currentAstro?.aiResponse ?? "")
      : {};
  }, [currentAstro]);

  if (astroData.length === 0) {
    return (
      <div className="consult-empty">
        <p>No Consultation History Available</p>
      </div>
    );
  }

  const isMatching = !!currentAstro.mName;

  const renderResponse = () => {
    if (currentAstro.status?.toLowerCase() === "pending") {
      return (
        <div className="pending-box font-semibold text-blue-700">
          Consultation Under Review
          <p className="mt-2 text-xs text-blue-600">
            Your request is currently being reviewed by our astrologer. Once the
            analysis is complete, we will send you an email notification.
          </p>
        </div>
      );
    }

    if (currentAstro.consultationMode === "Kundli Matching") {
      return (
        <div className="response-block">
          <InfoBlock title="Verdict" value={parsedResponse.verdict} />
          <InfoBlock
            title="Score"
            value={String(parsedResponse.score) + "/100"}
          />
          <InfoBlock
            title="Summary"
            value={parsedResponse.compatibility_summary}
            large
          />
        </div>
      );
    }

    if (currentAstro.consultationMode === "Personalized") {
      return (
        <div className="response-block">
          <p>Answer</p>
          <ul>
            {parsedResponse.answer.map((x: string, i: number) => (
              <li key={i}>{x}</li>
            ))}
          </ul>

          <InfoBlock title="Simple Remedy" value={parsedResponse.easy_remedy} />
          <InfoBlock
            title="Complex Remedy"
            value={parsedResponse.costly_remedy}
          />
        </div>
      );
    }

    if (currentAstro.consultationMode === "Overview") {
      return (
        <div className="response-block">
          <InfoBlock
            title="Personality Summary"
            value={parsedResponse.personality_summary}
            large
          />

          <p>Positive Characters:</p>
          <ul>
            {parsedResponse.positive_traits?.map((t: string, i: number) => (
              <li key={i}>{t}</li>
            ))}
          </ul>

          <p>Negative Characters:</p>
          <ul>
            {parsedResponse.negative_traits?.map((t: string, i: number) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      );
    }

    return <pre>{JSON.stringify(parsedResponse, null, 2)}</pre>;
  };

  return (
    <div className="consult-container">
      <h1 className="title">Consultation History</h1>
      <NavButtons />
      <div className="card">
        <h2 className="card-title">{currentAstro.consultationMode}</h2>

        <div className="grid-info">
          <div
            className={`p-1 rounded-lg ${
              currentAstro.status === "pending"
                ? "pending-status"
                : "completed-status"
            }`}>
            <InfoBlock
              title="Status"
              value={
                currentAstro.status
                  ? currentAstro.status[0].toUpperCase() +
                    currentAstro.status.slice(1)
                  : ""
              }
            />
          </div>
          <InfoBlock
            title="Generated At"
            value={formatDate(currentAstro.generatedAt)}
          />
        </div>

        <div className={`user-section ${isMatching ? "two-col" : ""}`}>
          <div className="user-box">
            <p className="label-astro">User Details</p>
            <InfoBlock title="Name" value={currentAstro.name} />
            <InfoBlock title="DOB" value={formatDate(currentAstro.dob)} />
            <InfoBlock title="Place" value={currentAstro.place} />
            <InfoBlock title="Gender" value={currentAstro.gender} />
          </div>

          {isMatching && (
            <div className="user-box">
              <p className="label-astro">Match Profile</p>
              <InfoBlock title="Name" value={currentAstro.mName} />
              <InfoBlock title="DOB" value={formatDate(currentAstro.mDob)} />
              <InfoBlock title="Place" value={currentAstro.mPlace} />
              <InfoBlock title="Gender" value={currentAstro.mGender} />
            </div>
          )}
        </div>

        {currentAstro.query && (
          <div className="query-box">
            CLIENT QUERY
            <p className="mt-2 italic">{currentAstro.query}</p>
          </div>
        )}
        <div className="mt-4">
          <p className="label-astro">Analysis</p>
        </div>
        <div className="response-section">{renderResponse()}</div>
      </div>
      <NavButtons />
    </div>
  );
};

interface InfoBlockProps {
  title: string;
  value?: string;
  large?: boolean;
}

const InfoBlock = ({ title, value, large = false }: InfoBlockProps) => (
  <div className={`info-block mt-2 ${large ? "large" : ""}`}>
    <p className="label">{title}</p>
    <p className="value">{value}</p>
  </div>
);

export default Consultations;
