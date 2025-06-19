import React, { useState, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";

function App() {
  let [showContent, setShowContent] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showTimer, setShowTimer] = useState(false);
  const timerRef = useRef(null);

  // GTA VI release date (26th May 2026)
  const releaseDate = new Date("2026-05-26T00:00:00");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = releaseDate - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Show timer only when scrolled into view
  useEffect(() => {
    const handleScroll = () => {
      if (timerRef.current) {
        const rect = timerRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setShowTimer(true);
        } else {
          setShowTimer(false);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.to(".vi-mask-group", {
      rotate: 10,
      duration: 2,
      ease: "Power4.easeInOut",
      transformOrigin: "50% 50%",
    })
    .to(".vi-mask-group", {
      scale: 10,
      duration: 2,
      delay: -1.8,
      ease: "Expo.easeInOut",
      transformOrigin: "50% 50%",
      opacity: 0,
      onUpdate: function () {
        if (this.progress() >= 0.9) {
          document.querySelector(".svg").remove();
          setShowContent(true);
          this.kill();
        }
      },
    });
  });

  useGSAP(() => {
    if (!showContent) return;

    gsap.to(".main", {
      scale: 1,
      rotate: 0,
      duration: 2,
      delay: "-1",
      ease: "Expo.easeInOut",
    });

    gsap.to(".sky", {
      scale: 1.1,
      rotate: 0,
      duration: 2,
      delay: "-.8",
      ease: "Expo.easeInOut",
    });

    gsap.to(".bg", {
      scale: 1.1,
      rotate: 0,
      duration: 2,
      delay: "-.8",
      ease: "Expo.easeInOut",
    });

    gsap.to(".character", {
      scale: 1.4,
      x: "-50%",
      bottom: "-25%",
      rotate: 0,
      duration: 2,
      delay: "-.8",
      ease: "Expo.easeInOut",
    });

    gsap.to(".text", {
      scale: 1,
      rotate: 0,
      duration: 2,
      delay: "-.8",
      ease: "Expo.easeInOut",
    });

    const main = document.querySelector(".main");

    main?.addEventListener("mousemove", function (e) {
      const xMove = (e.clientX / window.innerWidth - 0.5) * 40;
      const yMove = (e.clientY / window.innerHeight - 0.5) * 40;
      gsap.to(".main .text", {
        x: `${xMove * 0.4}%`,
        y: `${yMove * 0.4}%`,
      });
      gsap.to(".sky", {
        x: xMove,
        y: yMove,
      });
      gsap.to(".bg", {
        x: xMove * 1.7,
        y: yMove * 1.7,
      });
    });
  }, [showContent]);

  return (
    <>
      <div className="svg flex items-center justify-center fixed top-0 left-0 z-[100] w-full h-screen overflow-hidden bg-[#000]">
        <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <mask id="viMask">
              <rect width="100%" height="100%" fill="black" />
              <g className="vi-mask-group">
                <text
                  x="50%"
                  y="50%"
                  fontSize="250"
                  textAnchor="middle"
                  fill="white"
                  dominantBaseline="middle"
                  fontFamily="Arial Black"
                >
                  VI
                </text>
              </g>
            </mask>
          </defs>
          <image
            href="./sky.png"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            mask="url(#viMask)"
          />
          <image
            href="./bg.png"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            mask="url(#viMask)"
          />
        </svg>
      </div>
      {showContent && (
        <div className="main w-full rotate-[-10deg] scale-[1.7]">
          <div className="landing overflow-hidden relative w-full min-h-screen bg-black">
            <div className="navbar absolute top-0 left-0 z-[10] w-full py-4 px-4">
              <div className="logo flex gap-5">
                <div className="lines flex flex-col gap-[5px]">
                  <div className="line w-10 h-1.5 bg-white"></div>
                  <div className="line w-6 h-1.5 bg-white"></div>
                  <div className="line w-3 h-1.5 bg-white"></div>
                </div>
                <h3 className="text-3xl -mt-[4.5px] leading-none text-white ml-0">Rockstar</h3>
              </div>
              <img
                src="./logo18.png"
                alt="Logo"
                className="absolute top-0 right-0 mt-2 mr-4 w-24 h-auto z-20"
              />
            </div>

            <div className="imagesdiv relative overflow-hidden w-full h-screen">
              <img
                className="absolute sky scale-[1.5] rotate-[-20deg] top-0 left-0 w-full h-full object-cover"
                src="./sky.png"
                alt=""
              />
              <img
                className="absolute scale-[1.8] rotate-[-3deg] bg top-0 left-0 w-full h-full object-cover"
                src="./bg.png"
                alt=""
              />
              <div className="text text-white flex flex-col gap-3 absolute top-1 left-1/2 -translate-x-[70%] scale-[1.4] rotate-[-10deg]">
                <h1 className="text-[11rem] leading-none -ml-40">grand</h1>
                <h1 className="text-[11rem] leading-none ml-20">theft</h1>
                <h1 className="text-[11rem] leading-none -ml-40">auto</h1>
              </div>
              <img
                className="absolute character top-1/2 left-1/2 translate-x-[10%] -translate-y-[15%] scale-90 rotate-[-20deg]"
                style={{ height: '85vh', width: 'auto' }}
                src="./girlbg.png"
                alt=""
              />
            </div>
            <div className="btmbar text-white absolute bottom-0 left-0 w-full py-9 px-7 bg-gradient-to-t from-black to-transparent">
              <div className="flex gap-4 items-center">
                <i className="text-2xl ri-arrow-down-line"></i>
                <h3 className="text-xl font-[Helvetica_Now_Display]">
                  Scroll Down
                </h3>
              </div>
              <img
                className="absolute h-[55px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                src="./ps5.png"
                alt=""
              />
            </div>
          </div>
          <div className="w-full flex items-center justify-center bg-black relative" style={{ minHeight: '100vh' }}>
            <div className="cntnr flex text-white w-full h-[80%] ">
              <div className="limg relative w-1/2 h-full">
                <img
                  className="absolute scale-[1.3] top-1/2 left-1/2 -translate-x-1/2 -translate-y-[-17%]"
                  src="./imag.png"
                  alt=""
                />
              </div>
              <div className="rg w-[30%] py-30">
                <h1 className="text-8xl">Still Running,</h1>
                <h1 className="text-8xl">Not Hunting</h1>
                <p className="mt-10 text-xl font-[Helvetica_Now_Display]">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Distinctio possimus, asperiores nam, omnis inventore nesciunt
                  a architecto eveniet saepe, ducimus necessitatibus at
                  voluptate.
                </p>
                <p className="mt-3 text-xl font-[Helvetica_Now_Display]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. At
                  eius illum fugit eligendi nesciunt quia similique velit
                  excepturi soluta tenetur illo repellat consectetur laborum
                  eveniet eaque, dicta, hic quisquam? Ex cupiditate ipsa nostrum
                  autem sapiente.
                </p>
                <p className="mt-10 text-xl font-[Helvetica_Now_Display]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. At
                  eius illum fugit eligendi nesciunt quia similique velit
                  excepturi soluta tenetur illo repellat consectetur laborum
                  eveniet eaque, dicta, hic quisquam? Ex cupiditate ipsa nostrum
                  autem sapiente.
                </p>
                <button className="bg-yellow-500 px-10 py-10 text-black mt-10 text-4xl" onClick={() => setShowPopup(true)}>
                  Download Now
                </button>
              </div>
            </div>
            {/* Page 2 Scroll Down Indicator (same as page 1) */}
            <div className="btmbar text-white absolute bottom-0 left-0 w-full py-15 px-10 bg-gradient-to-t from-black to-transparent">
              <div className="flex gap-4 items-center">
                <i className="text-2xl ri-arrow-down-line"></i>
                <h3 className="text-xl font-[Helvetica_Now_Display]">Scroll Down</h3>
              </div>
            </div>
          </div>
          {/* Third Page: Countdown Timer */}
          <div ref={timerRef} className="w-full min-h-screen flex flex-col items-center justify-center bg-black py-20">
            {showTimer && (
              <>
                <h1 className="text-[5rem] text-yellow-400 font-bold mb-8 font-[pricedown] drop-shadow-lg" style={{ fontFamily: 'pricedown, Arial Black, sans-serif' }}>
                  GTA VI Release Countdown
                </h1>
                <div className="flex gap-10 text-white text-6xl font-bold bg-gradient-to-r from-yellow-500/30 via-black to-yellow-500/30 px-16 py-10 rounded-3xl shadow-2xl border-4 border-yellow-400">
                  <div className="flex flex-col items-center">
                    <span>{timeLeft.days}</span>
                    <span className="text-xl mt-2 text-yellow-300">Days</span>
                  </div>
                  <span className="mx-2">:</span>
                  <div className="flex flex-col items-center">
                    <span>{timeLeft.hours.toString().padStart(2, '0')}</span>
                    <span className="text-xl mt-2 text-yellow-300">Hours</span>
                  </div>
                  <span className="mx-2">:</span>
                  <div className="flex flex-col items-center">
                    <span>{timeLeft.minutes.toString().padStart(2, '0')}</span>
                    <span className="text-xl mt-2 text-yellow-300">Minutes</span>
                  </div>
                  <span className="mx-2">:</span>
                  <div className="flex flex-col items-center">
                    <span>{timeLeft.seconds.toString().padStart(2, '0')}</span>
                    <span className="text-xl mt-2 text-yellow-300">Seconds</span>
                  </div>
                </div>
                <p className="mt-10 text-2xl text-yellow-200 font-[Helvetica_Now_Display] text-center max-w-2xl">
                  The wait wil be over! Get ready for the most anticipated game of the decade. Stay tuned for the official release of GTA VI!
                </p>
              </>
            )}
          </div>
        </div>
      )}
      {showPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-lg p-10 shadow-lg flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-black text-center">Your pc is not eligible to handle GTA VI</h2>
            <button className="mt-4 px-6 py-2 bg-black text-white rounded" onClick={() => setShowPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;