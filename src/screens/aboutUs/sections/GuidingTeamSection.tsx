import brahmaPng from "../../../assets/brahma.png";
import vishnuPng from "../../../assets/vishnu.png";
import shivaPng from "../../../assets/shiva.png";
import ganeshaPng from "../../../assets/ganesh.png";

const GuidingTeamSection = () => {
  interface Deity {
    id: number;
    name: string;
    role: string;
    imageUrl: string;
  }
  const guidingDeities: Deity[] = [
    {
      id: 4,
      name: "Lord Ganesha",
      role: "Remover of Obstacles: Blessing the path to union.",
      imageUrl: ganeshaPng,
    },
    {
      id: 1,
      name: "Lord Brahma",
      role: "The Creator: Inspiration for new beginnings.",
      imageUrl: brahmaPng,
    },
    {
      id: 2,
      name: "Lord Vishnu",
      role: "The Preserver: Guiding the stability of the bond.",
      imageUrl: vishnuPng,
    },
    {
      id: 3,
      name: "Lord Shiva",
      role: "The Transformer: Encouraging growth and change.",
      imageUrl: shivaPng,
    },
  ];
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-amber-900 sm:text-4xl">
            Our Divine Inspiration
          </h2>
          <p className="mt-4 text-xl text-amber-800">
            We believe matrimony is a sacred journey guided by the divine forces
            of obstacle removal, creation, preservation, and blessing.
          </p>
        </div>
        {/* Updated grid to 4 columns for desktop screens */}
        <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {guidingDeities.map((deity) => (
            <div key={deity.id} className="text-center">
              <div className="relative rounded-xl overflow-hidden w-48 h-48 mx-auto border-4 border-amber-300 shadow-lg">
                <img
                  className="transition-transform duration-300 ease-in-out hover:scale-110 absolute inset-0 h-full w-full object-cover"
                  src={deity.imageUrl}
                  alt={deity.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Prevent infinite loop
                    // Fallback text uses the first letter of the last name
                    target.src = `https://placehold.co/400x400/fcd34d/78350f?text=${deity.name
                      .split(" ")
                      .pop()}`;
                  }}
                />
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-amber-900">
                  {deity.name}
                </h3>
                <p className="text-amber-600 font-medium px-2">{deity.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuidingTeamSection;
