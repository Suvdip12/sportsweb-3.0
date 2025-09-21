import React, { useEffect, useRef, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

const Carousel = () => {
  const splideRef = useRef(null);
  const [matches, setMatches] = useState([]);

  // Fetch slide data from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch("https://raw.githubusercontent.com/drmlive/fancode-live-events/main/fancode.json");
        const data = await res.json();
        setMatches(data.matches || []);
      } catch (err) {
        console.error("Failed to load matches:", err);
      }
    };

    fetchSlides();
  }, []);

  // Re-mount Splide after items are loaded
  useEffect(() => {
    if (splideRef.current && matches.length > 0) {
      splideRef.current.splide?.destroy();
      splideRef.current.splide?.mount();
    }
  }, [matches]);

  const goPrev = () => {
    splideRef.current?.splide?.go("<");
  };

  const goNext = () => {
    splideRef.current?.splide?.go(">");
  };

  return (
    <section className="carousel" aria-label="hero banner carousel">
      <div className="MuiStack-root mui-style-1lkx84o">
        <div className="infinite-scroll-component__outerdiv">
          <div
            className="infinite-scroll-component"
            style={{
              height: "auto",
              overflow: "unset",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <div className="MuiGrid-root mui-style-ymleya">
              <div className="MuiGrid-root MuiGrid-item mui-style-6iih4l">
                {matches.length === 0 ? (
                  <div className="loading">Loading...</div>
                ) : (
                  <Splide
                    options={{
                      autoplay: true,
                      interval: 8000,
                      pauseOnHover: false,
                      arrows: false,
                      perPage: 1,
                      type: "loop",
                      pagination: true,
                      keyboard: false,
                      slideFocus: false,
                    }}
                    ref={splideRef}
                    className="splide"
                  >
                    {matches.map((match, index) => (
                      <SplideSlide
                        key={match.match_id}
                        className="splide__slide"
                        role="group"
                        aria-label={`slide ${index + 1} of ${matches.length}`}
                      >
                        <div className="mui-style-tm6sms-cntr">
                          <div className="mui-style-815i2y-root">
                            <div className="MuiStack-root mui-style-1ov46kg">
                              <div className="MuiStack-root mui-style-18zsr3k">
                                <a
                                  className="mui-style-o66pnj"
                                  href={`./player?id=${match.match_id}`}
                                  id={`shortTitle${index + 1}`}
                                >
                                  {match.title}
                                </a>
                                <p className="mui-style-1xn847g-line2">
                                  {match.event_category} • {match.event_name} •{" "}
                                  {match.status}
                                </p>
                              </div>
                              <div className="mui-style-pmv5z6-root">
                                <a
                                  id={`buttonAnchor${index + 1}`}
                                  href={`./player?id=${match.match_id}`}
                                >
                                  <button
                                    className="mui-style-haa95m-watchNowBtn"
                                    tabIndex={0}
                                    type="button"
                                  >
                                    <svg
                                      width="18"
                                      height="16"
                                      viewBox="0 0 15 18"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M2.43693 16.9865C1.77124 17.4108 0.899414 16.9326 0.899414 16.1432V1.85653C0.899414 1.0671 1.77124 0.588944 2.43694 1.01328L13.6432 8.15662C14.2599 8.54969 14.2598 9.45005 13.6432 9.84312L2.43693 16.9865Z"
                                        fill="#FFFFFF"
                                      />
                                    </svg>
                                    <p
                                      className="MuiTypography-root MuiTypography-body1Bold mui-style-6z4y8n"
                                      style={{ cursor: "pointer" }}
                                    >
                                      {match.status === "LIVE" ? "Watch Live" : "Details"}
                                    </p>
                                  </button>
                                </a>
                              </div>
                            </div>
                          </div>
                          <div className="MuiGrid-root MuiGrid-container mui-style-1d3bbye">
                            <div className="mui-style-efh377-metaBkg">
                              <div className="mui-style-19gfk8p-gradient"></div>
                            </div>
                            <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-1 MuiGrid-grid-md-1.5 MuiGrid-grid-lg-1.2 mui-style-13eysxj">
                              <a href={`./player?id=${match.match_id}`}>
                                <div className="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root mui-style-3m0n0e-card">
                                  <button
                                    className="MuiButtonBase-root MuiCardActionArea-root mui-style-wytmrr-cardActionArea"
                                    tabIndex={0}
                                    type="button"
                                  >
                                    <picture className="mui-style-1qswh78-fullOpacity">
                                      <source type="image/webp" srcSet={match.src} />
                                      <img
                                        className="mui-style-13exe5a-image-full"
                                        id={`ogImage${index + 1}`}
                                        src={match.src}
                                        alt={match.title}
                                      />
                                    </picture>
                                    <div className="mui-style-m8qrcw-overlay"></div>
                                    <span className="MuiCardActionArea-focusHighlight mui-style-jo3ec3"></span>
                                  </button>
                                </div>
                              </a>
                            </div>
                          </div>
                        </div>
                      </SplideSlide>
                    ))}
                  </Splide>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Prev/Next Buttons */}
      <div className="sbutton">
        <button className="previous-button is-control" onClick={goPrev}>
          <span className="fas fa-angle-left" aria-hidden="true"></span>
          <span className="sr-only">Previous slide</span>
        </button>
        <button className="next-button is-control" onClick={goNext}>
          <span className="fas fa-angle-right" aria-hidden="true"></span>
          <span className="sr-only">Next slide</span>
        </button>
      </div>
    </section>
  );
};

export default Carousel;
