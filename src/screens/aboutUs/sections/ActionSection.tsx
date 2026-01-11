import { useNavigate } from "react-router-dom";

const ActionSection = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-amber-900 sm:text-4xl">
          Ready to start your journey?
        </h2>
        <p className="mt-4 text-xl text-amber-800">
          Join our growing community and find your ideal partner today.
        </p>
        <div className="mt-10 flex justify-center space-x-4">
          <a
            onClick={() => navigate("/")}
            className="cursor-pointer inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
            Register Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default ActionSection;
