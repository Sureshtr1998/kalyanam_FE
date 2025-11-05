import { TEXT_COLOR } from "../../styles/variables";
import Info from "../info/Info";

const Logo = () => (
  <div className="flex flex-col items-center mt-4 mb-6">
    <Info />
    <h1 className={`text-4xl font-bold font-serif ${TEXT_COLOR}`}>
      SEETHA RAMA
    </h1>
    <p className={`text-sm tracking-widest uppercase ${TEXT_COLOR}`}>Kalyana</p>
  </div>
);

export default Logo;
