import { Code, Handshake, MapPin } from "lucide-react";

interface DedicatedTeam {
  id: number;
  title: string;
  description: string;
  Icon: React.ElementType;
}

const DedicatedTeamSection = () => {
  const dedicatedTeams: DedicatedTeam[] = [
    {
      id: 1,
      title: "Technical Development",
      description:
        "Our dedicated technical team constantly works to enhance security, improve matching algorithms, and ensure a seamless, reliable platform experience.",
      Icon: Code,
    },
    {
      id: 2,
      title: "Support & Verification",
      description:
        "The support team handles all user queries, manually verifies profiles, and enforces community rules to guarantee a safe and genuine environment.",
      Icon: Handshake,
    },
    {
      id: 3,
      title: "Community & Business",
      description:
        "This team focuses on strategic outreach and expanding our network across South India, bringing in new verified members to maximize your match potential.",
      Icon: MapPin,
    },
  ];
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-amber-900 sm:text-4xl">
            Our Dedicated Team & Commitment
          </h2>
          <p className="mt-4 text-xl text-amber-800 max-w-3xl mx-auto">
            Behind Seetha Rama Kalyana is a dedicated team working to ensure
            quality, security, and exceptional service.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {dedicatedTeams.map((team) => (
            <div
              key={team.id}
              className="text-center p-6 bg-amber-50 rounded-xl shadow-lg border border-amber-200 transition-style">
              <div className="flex justify-center mb-4">
                <team.Icon className="h-10 w-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-amber-900">
                {team.title}
              </h3>
              <p className="mt-2 text-amber-800">{team.description}</p>
            </div>
          ))}
        </div>

        {/* Commitment box */}
        <div className="mt-16 text-center max-w-3xl mx-auto p-8 rounded-2xl bg-amber-600 shadow-xl">
          <h3 className="text-2xl font-bold text-white mb-2">
            Guaranteed Response Time
          </h3>
          <p className="text-xl text-amber-100">
            We commit to acknowledging and addressing any query or support
            request you submit within{" "}
            <span className="font-bold"> 1 working day </span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DedicatedTeamSection;
