import { REGISTRATION_FEE } from "../../../utils/constants";

const CommitmentSection = () => {
  interface CoreValue {
    id: number;
    title: string;
    description: string;
    icon: string;
  }

  const coreValues: CoreValue[] = [
    {
      id: 1,
      title: "Security & Trust",
      description:
        "We are a GST registered company, and our platform is certified by McAfee Secure, ensuring your data is always safe.",
      icon: "pi pi-shield",
    },
    {
      id: 2,
      title: `Minimal Pricing (₹${REGISTRATION_FEE} / year)`,
      description:
        "Our goal is to serve the community, not to make a profit. We keep our pricing minimal to ensure everyone can access our service.",
      icon: "pi pi-indian-rupee",
    },
    {
      id: 3,
      title: "Serving the Brahmin Community",
      description:
        "We are strictly focused on the Brahmin community, dedicating our resources to ensuring high-quality, relevant matches within our tradition.",
      icon: "pi pi-users",
    },
    {
      id: 4,
      title: "Active & Engaged",
      description:
        "Stay updated with instant email notifications when someone sends you an interest or accepts your request.",
      icon: "pi pi-envelope",
    },
    {
      id: 5,
      title: "Seamless Across All Devices",
      description:
        "Our applications automatically adapt to any device it may be mobile, tablet, or desktop offering consistent design and effortless usability.",
      icon: "pi pi-globe",
    },
    {
      id: 6,
      title: "Sacred Vows, Modern Tech",
      description:
        "We blend traditional values with a modern, easy-to-use platform to help you find your ideal life partner.",
      icon: "pi pi-heart",
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
              className="bg-white p-8 rounded-2xl shadow-lg border border-amber-300 transition-style">
              <div className="flex-shrink-0">
                <i className={`icon-style ${value.icon}`} />
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
