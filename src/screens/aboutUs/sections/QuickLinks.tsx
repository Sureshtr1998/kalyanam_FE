import { useNavigate } from "react-router-dom";

interface QuickLink {
  id: number;
  title: string;
  description: string;
  icon: string;
  path: string;
}

const QuickLinks = () => {
  const navigate = useNavigate();
  const quickLinks: QuickLink[] = [
    {
      id: 1,
      title: "FAQs",
      description:
        "Find answers to common questions about Seetha Rama Kalyana, our services, and platform usage.",
      icon: "pi pi-question-circle",
      path: "/faq",
    },
    {
      id: 2,
      title: "Blog",
      description:
        "Read tips, success stories, and lifestyle articles to guide your matrimonial journey.",
      icon: "pi  pi-file-edit",
      path: "/blog",
    },
    {
      id: 3,
      title: "Terms & Conditions",
      description:
        "Understand the rules, policies, and agreements for using Seetha Rama Kalyana safely.",
      icon: "pi pi-lock",
      path: "/terms",
    },
    {
      id: 4,
      title: "Privacy Policy",
      description:
        "Learn how we handle your personal data and protect your privacy on our platform.",
      icon: "pi  pi-shield",
      path: "/privacy",
    },
  ];

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-amber-900 sm:text-4xl">
            Quick Links & Resources
          </h2>
          <p className="mt-4 text-xl text-amber-800 max-w-3xl mx-auto">
            Behind Seetha Rama Kalyana is a dedicated team working to ensure
            quality, security, and exceptional service.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((quick) => (
            <div
              onClick={() => navigate(quick.path)}
              key={quick.id}
              className="group text-center cursor-pointer p-6 bg-amber-50 rounded-xl shadow-lg border border-amber-200 transition-style">
              <div className="flex justify-center mb-4">
                <i className={`icon-style ${quick.icon}`} />
              </div>
              <h3 className="text-xl font-semibold text-amber-900 group-hover:underline transition-all">
                {quick.title}
              </h3>
              <p className="mt-2 text-amber-800">{quick.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickLinks;
