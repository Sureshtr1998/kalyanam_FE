import { TEXT_COLOR } from '../../styles/variables';


const Logo = () => (
    <div className="flex flex-col items-center mb-6 mt-4">
        <i style={{ fontSize: '2rem' }} className={`w-8 ml-0 sm:ml-8  h-8 mb-2 ${TEXT_COLOR} pi pi-heart`} />
        <h1 className={`text-4xl font-bold font-serif ${TEXT_COLOR}`}>SEETHA RAMA</h1>
        <p className={`text-sm tracking-widest uppercase ${TEXT_COLOR}`}>Kalyana</p>
    </div>
);

export default Logo