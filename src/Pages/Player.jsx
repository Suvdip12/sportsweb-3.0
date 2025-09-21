import React, { useEffect, useRef, useState } from "react";
import "tailwindcss/tailwind.css"; // Ensure Tailwind CSS is included

const App = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [showDialog, setShowDialog] = useState(true);
  const [streamData, setStreamData] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dynamically load Shaka Player scripts and CSS
  useEffect(() => {
    if (!isDesktop) return;

    if (window.shaka && window.shaka.Player) {
      console.log("Shaka Player already loaded.");
      return;
    }

    const loadScripts = () => {
      const shakaCoreScript = document.createElement("script");
      shakaCoreScript.src =
        "https://cdn.jsdelivr.net/npm/shaka-player@4.16.2/dist/shaka-player.ui.js";
      shakaCoreScript.onload = initPlayer;
      document.head.appendChild(shakaCoreScript);

      const shakaCssLink = document.createElement("link");
      shakaCssLink.rel = "stylesheet";
      shakaCssLink.href =
        "https://cdn.jsdelivr.net/npm/shaka-player@4.16.2/dist/controls.css";
      document.head.appendChild(shakaCssLink);
    };

    const initPlayer = () => {
      shaka.polyfill.installAll();
      if (!shaka.Player.isBrowserSupported()) {
        console.error("Browser not supported!");
        return;
      }

      const video = videoRef.current;
      const container = containerRef.current;
      const player = new shaka.Player(video);
      playerRef.current = player;

      const ui = new shaka.ui.Overlay(player, container, video);

      const uiConfig = {
        controlPanelElements: [
          "rewind",
          "play_pause",
          "fast_forward",
          "time_and_duration",
          "mute",
          "volume",
          "spacer",
          "captions",
          "language",
          "quality",
          "playback_rate",
          "picture_in_picture",
          "fullscreen",
        ],
        addSeekBar: true,
        addBigPlayButton: true,
        enableKeyboardPlaybackControls: true,
        singleClickForPlayAndPause: true,
        doubleClickForFullscreen: true,
      };
      ui.configure(uiConfig);

      if (streamData) {
        loadStream();
      }
    };

    const loadStream = async () => {
      try {
        const player = playerRef.current;
        const playerConfig = {
          streaming: { lowLatencyMode: true, bufferingGoal: 3 },
        };

        if (streamData.keyId && streamData.key) {
          playerConfig.drm = {
            clearKeys: { [streamData.keyId]: streamData.key },
          };
        }

        player.configure(playerConfig);

        let finalUrl = streamData.url.includes(".m3u8")
          ? streamData.url.split("|")[0]
          : streamData.url;

        await player.load(finalUrl);
        console.log("Stream loaded:", finalUrl);
        setLoading(false);
      } catch (error) {
        console.error("Error loading stream:", error);
        setError("Error loading video stream.");
        setLoading(false);
      }
    };

    if (isDesktop) {
      setLoading(true);
      loadScripts();
    }

    return () => {
      if (playerRef.current) playerRef.current.destroy();
    };
  }, [isDesktop, streamData]);

  // Fetch stream only after user decides
  const fetchStream = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("id");

      if (!id) {
        console.error("No ID provided in URL");
        return null;
      }

      let stream = null;
      setLoading(true);
      setError(null);

      try {
        const ghRes = await fetch(
          "https://raw.githubusercontent.com/drmlive/fancode-live-events/main/fancode.json"
        );
        if (ghRes.ok) {
          const ghData = await ghRes.json();
          for (const key in ghData) {
            if (
              ghData[key].name &&
              ghData[key].name.toLowerCase() === id.toLowerCase()
            ) {
              stream = {
                url: ghData[key].url,
                keyId: ghData[key].keyId,
                key: ghData[key].key,
              };
              break;
            }
          }
        }
      } catch (e) {
        console.warn("GitHub fetch failed, fallback to Firebase");
      }

      if (!stream) {
        const fbRes = await fetch(
          "https://try-firebase-6d461-default-rtdb.firebaseio.com/keys.json"
        );
        if (fbRes.ok) {
          const fbData = await fbRes.json();
          for (const key in fbData) {
            if (
              fbData[key].name &&
              fbData[key].name.toLowerCase() === id.toLowerCase()
            ) {
              stream = {
                url: fbData[key].url,
                keyId: fbData[key].keyId,
                key: fbData[key].key,
              };
              break;
            }
          }
        }
      }

      if (!stream) {
        throw new Error("Stream not found for ID: " + id);
      }
      setStreamData(stream);
      return stream;
    } catch (error) {
      console.error("Error fetching stream:", error);
      setError("Stream not found or error fetching data.");
      setLoading(false);
      return null;
    }
  };

  const handleChoice = async (isMobile) => {
    setShowDialog(false);
    const stream = await fetchStream();
    if (!stream) {
      setError("Stream not found. Please check the URL ID.");
      return;
    }

    if (isMobile) {
      let finalUrl = stream.url.includes(".m3u8")
        ? stream.url.split("|")[0]
        : stream.url;

      if (stream.keyId && stream.key) {
        finalUrl += `|drmScheme=clearkey&drmLicense=${stream.keyId}:${stream.key}`;
      }

      // Correct Android Intent URL
      const intentUrl = `intent://${finalUrl}#Intent;scheme=https;package=com.genuine.leone;end`;

      console.log("Redirecting to:", intentUrl);
      window.location.href = intentUrl;

      // Fallback → after 1.5s, if NS Player not installed, load Shaka
      setTimeout(() => {
        if (!document.hidden) {
          console.warn("NS Player not installed, fallback to web player");
          setIsDesktop(true);
        }
      }, 1500);
    } else {
      setIsDesktop(true);
    }
  };

  return (
    <>
      {showDialog ? (
        <div className="fixed inset-0 bg-black/85 text-white flex flex-col items-center justify-center z-[9999] p-4">
          <h2 className="mb-8 text-2xl md:text-3xl font-bold text-center">
            Are you using a Mobile Device?
          </h2>
          <div>
            <button
              onClick={() => handleChoice(true)}
              className="px-6 py-3 m-2 rounded-xl text-white font-semibold transition-all duration-200 hover:scale-105 shadow-lg bg-sky-500"
            >
              Yes
            </button>
            <button
              onClick={() => handleChoice(false)}
              className="px-6 py-3 m-2 rounded-xl text-white font-semibold transition-all duration-200 hover:scale-105 shadow-lg bg-gray-600"
            >
              No
            </button>
          </div>
        </div>
      ) : (
        <div
          className="video-container relative w-full h-screen bg-black"
          ref={containerRef}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <svg
                className="animate-spin h-10 w-10 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center text-red-500 font-semibold p-4 text-center">
              {error}
            </div>
          )}
          <video
            id="video"
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-contain"
            style={{ visibility: loading || error ? "hidden" : "visible" }}
          />
        </div>
      )}
    </>
  );
};

export default App;
