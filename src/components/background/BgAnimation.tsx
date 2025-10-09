import './BgAnimation.scss';

const BgAnimation = ({ isAnimation }: { isAnimation: boolean }) => {
    return (
        <div className="bg-animation-container">
            {isAnimation && <div className="floating-container">
                {/* Oms */}
                {[...Array(5)].map((_, i) => (
                    <span
                        key={i + 10}
                        className="floating om"
                        style={{
                            left: `${7 + i * 20}%`,
                            animationDuration: `${9 + (i % 5)}s`,
                        }}
                    >
                        &#x0950; {/* ॐ */}
                    </span>
                ))}

                {/* Raam */}
                {[...Array(5)].map((_, i) => (
                    <span
                        key={i + 20}
                        className="floating raam"
                        style={{
                            left: `${9 + i * 20}%`,
                            animationDuration: `${8 + i % 5}s`,


                        }}
                    >
                        ಶ್ರೀ ರಾಮ
                    </span>
                ))}
                {/* Deepa */}
                {[...Array(5)].map((_, i) => (
                    <span
                        key={i}
                        className="floating"
                        style={{
                            left: `${4 + i * 20}%`,
                            animationDuration: `${10 + (i % 5)}s`,
                        }}
                    >
                        &#128293; {/* 🔥 */}
                    </span>
                ))}


            </div>
            }
        </div>

    );
};

export default BgAnimation;
