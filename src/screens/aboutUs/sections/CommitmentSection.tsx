import { Users, Heart, MapPin, Mail, Shield, IndianRupee } from "lucide-react";
import { REGISTRATION_FEE } from "../../../utils/constants";

const CommitmentSection = () => {
  interface CoreValue {
    id: number;
    title: string;
    description: string;
    Icon: React.ElementType;
  }

  const coreValues: CoreValue[] = [
    {
      id: 1,
      title: "Security & Trust",
      description:
        "We are a GST registered company, and our platform is certified by McAfee Secure, ensuring your data is always safe.",
      Icon: Shield,
    },
    {
      id: 2,
      title: `Minimal Pricing (₹${REGISTRATION_FEE})`,
      description:
        "Our goal is to serve the community, not to make a profit. We keep our pricing minimal to ensure everyone can access our service.",
      Icon: IndianRupee,
    },
    {
      id: 3,
      title: "Serving the Brahmin Community",
      description:
        "We are strictly focused on the Brahmin community, dedicating our resources to ensuring high-quality, relevant matches within our tradition.",
      Icon: Users,
    },
    {
      id: 4,
      title: "Active & Engaged",
      description:
        "Stay updated with instant email notifications when someone sends you an interest or accepts your request.",
      Icon: Mail,
    },
    {
      id: 5,
      title: "Growing Across South India",
      description:
        "Our network is rapidly expanding across Karnataka, Tamil Nadu, Andhra Pradesh, Telangana, and Kerala.",
      Icon: MapPin,
    },
    {
      id: 6,
      title: "Sacred Vows, Modern Tech",
      description:
        "We blend traditional values with a modern, easy-to-use platform to help you find your ideal life partner.",
      Icon: Heart,
    },
  ];
  return (
    <div className="bg-amber-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-amber-900 sm:text-4xl">
            Why Choose Us?
          </h2>
          <p className="mt-4 text-xl text-amber-800">
            Our commitment to you and our community.
          </p>
        </div>
        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {coreValues.map((value) => (
            <div
              key={value.id}
              className="bg-white p-8 rounded-2xl shadow-lg border border-amber-300
             transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex-shrink-0">
                <value.Icon
                  className="h-10 w-10 text-amber-600"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-amber-900">
                  {value.title}
                </h3>
                <p className="mt-2 text-base text-amber-800">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommitmentSection;
