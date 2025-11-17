const MissionSection = () => {
  return (
    <div className="relative bg-amber-50 pb-6">
      <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:gap-24 lg:items-start">
        <div className="relative sm:py-16 lg:py-0">
          <div className="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-0 lg:max-w-none lg:py-20">
            <div className="relative pt-64 pb-10 rounded-2xl shadow-xl overflow-hidden border border-amber-300">
              <img
                className="absolute inset-0 h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1184&q=80"
                alt="Our team collaborating"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; // Prevent infinite loop
                  target.src =
                    "https://placehold.co/600x400/fffbeb/78350f?text=Our+Team";
                }}
              />
            </div>
          </div>
        </div>

        <div className="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-0">
          <div className="pt-12 sm:pt-16 lg:pt-20">
            <h2 className="text-3xl text-amber-900 font-extrabold tracking-tight sm:text-4xl">
              Our Mission
            </h2>
            <div className="mt-6 text-amber-800 space-y-6 text-lg">
              <p>
                Seetha Rama Kalyana was born from a simple desire: to create a
                trusted and accessible platform for Brahmin families to find
                their perfect match. We understand the importance of community
                and tradition.
              </p>
              <p className="font-semibold text-amber-700">
                **A Note on Growth:** As a newly developed platform, we are
                actively working to build our community. We appreciate your
                patience, as the number of profiles might be smaller in the
                beginning. We are dedicated to rapidly expanding our user base
                to give you the best matching opportunities!
              </p>
              <p>
                Our service is built on a foundation of trust. We are not a
                profit-oriented business; we are a service dedicated to our
                community. This principle allows us to offer our full suite of
                services for a minimal fee, ensuring that everyone has the
                opportunity to find happiness.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionSection;
