import { useEffect, useState } from "react";
import Logo from "../../components/misc/Logo";
import { BG_COLOR } from "../../styles/variables";
import LoginForm from "../../components/forms/LoginForm";
import type { FormType } from "../../utils/interfaces";
import RegistrationForm from "../../components/forms/register/RegistrationForm";
import ForgotPasswordForm from "../../components/forms/ForgotPasswordForm";
import SEO from "../../components/misc/SEO";
import { getItem, user_login_token } from "../../utils/localStore";
import { useNavigate } from "react-router-dom";

const Lander = () => {
  const [currentForm, setCurrentForm] = useState<FormType>("login");

  const navigate = useNavigate();
  useEffect(() => {
    const token = getItem(user_login_token)?.token;
    if (token) navigate("/home");
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentForm]);

  const renderForm = () => {
    if (currentForm === "login")
      return <LoginForm setCurrentForm={setCurrentForm} />;
    else if (currentForm === "forgotPassword")
      return <ForgotPasswordForm setCurrentForm={setCurrentForm} />;

    return <RegistrationForm setCurrentForm={setCurrentForm} />;
  };
  return (
    <div>
      <SEO
        title="Seetha Rama Kalyana | Hindu Matrimony"
        description="Join Seetha Rama Kalyana, the trusted Hindu matrimony platform, to find your ideal life partner with respect, dharma, and tradition."
        keywords="hindu matrimony, hindu matrimony, seetha rama kalyana, matchmaking, marriage"
        url="https://www.seetharamakalyana.in"
      />

      <div
        className={`min-h-screen flex ${BG_COLOR} font-sans justify-center items-center`}>
        <div className="w-full max-w-7xl md:grid md:grid-cols-2 overflow-hidden shadow-2xl rounded-2xl m-4">
          {/* 1. Image Panel (Left Side on Desktop) */}
          <div className="relative overflow-hidden hidden md:flex items-center justify-center p-8 min-h-[650px]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url(/assets/seetha_ram.webp)",
                backgroundColor: "#FDE68A",
              }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            <div className="relative text-center text-white p-6 bg-black/30 rounded-xl">
              <h2 className="text-4xl lg:text-5xl font-extrabold font-serif mb-4 drop-shadow-lg">
                {currentForm === "login" ? "Eternal Union" : "A Step Closer"}
              </h2>
              <p className="text-xl lg:text-2xl drop-shadow-lg">
                {currentForm === "login"
                  ? "Discover the one written for you in the stars of dharma and love."
                  : "Complete your profile to find your perfect match."}
              </p>
            </div>
          </div>

          {/* 2. Form Panel (Right Side on Desktop, Full Width on Mobile) */}
          <div className="flex flex-col  items-center p-6 sm:p-8 lg:p-12 bg-white/95 backdrop-blur-sm min-h-[650px]">
            <div className="block md:hidden w-full mb-6">
              <img
                src="/assets/seetha_ram.webp"
                alt="Lord Rama and Seetha - Kalyana Symbol"
                className="w-full h-40 min-h-[14rem] object-cover object-top rounded-lg shadow-lg border-2 border-amber-300"
                loading="eager"
              />
            </div>

            <Logo key={currentForm} />

            {renderForm()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lander;
