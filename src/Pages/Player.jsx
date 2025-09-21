import React, { useEffect, useRef, useState } from "react";

const App = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const playerRef = useRef(null);

  const [showDialog, setShowDialog] = useState(true);
  const [streamData, setStreamData] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isDesktop) return;

    if (window.shaka && window.shaka.Player) {
      console.log("Shaka Player already loaded.");
      return;
    }

    const shakaScript = document.createElement("script");
    shakaScript.src =
      "https://cdn.jsdelivr.net/npm/shaka-player@4.16.2/dist/shaka-player.ui.js";
    shakaScript.onload = initPlayer;
    document.head.appendChild(shakaScript);

    const shakaCss = document.createElement("link");
    shakaCss.rel = "stylesheet";
    shakaCss.href =
      "https://cdn.jsdelivr.net/npm/shaka-player@4.16.2/dist/controls.css";
    document.head.appendChild(shakaCss);

    return () => {
      if (playerRef.current) playerRef.current.destroy();
    };
  }, [isDesktop]);

  useEffect(() => {
    if (streamData && playerRef.current) {
      loadStream(streamData);
    }
  }, [streamData]);

  const initPlayer = () => {
    if (!window.shaka) return;

    window.shaka.polyfill.installAll();
    if (!window.shaka.Player.isBrowserSupported()) {
      console.error("Browser not supported!");
      return;
    }

    const video = videoRef.current;
    const container = containerRef.current;
    const player = new window.shaka.Player(video);
    playerRef.current = player;

    const ui = new window.shaka.ui.Overlay(player, container, video);
    ui.configure({
      controlPanelElements: [
        "rewind", "play_pause", "fast_forward", "time_and_duration",
        "mute", "volume", "spacer", "captions", "language", "quality",
        "playback_rate", "picture_in_picture", "fullscreen",
      ],
      addSeekBar: true,
      addBigPlayButton: true,
      enableKeyboardPlaybackControls: true,
      singleClickForPlayAndPause: true,
      doubleClickForFullscreen: true,
    });

    if (streamData) {
      loadStream(streamData);
    }
  };

  const loadStream = async (stream) => {
    try {
      const player = playerRef.current;
      const config = {
        streaming: { lowLatencyMode: true, bufferingGoal: 3 },
      };

      if (stream.keyId && stream.key) {
        config.drm = {
          clearKeys: { [stream.keyId]: stream.key },
        };
      }

      player.configure(config);

      const finalUrl = stream.url.includes(".m3u8")
        ? stream.url.split("|")[0]
        : stream.url;

      await player.load(finalUrl);
      console.log("Stream loaded:", finalUrl);
      setLoading(false);
    } catch (err) {
      console.error("Error loading stream:", err);
      setError("Error loading video stream.");
      setLoading(false);
    }
  };

  const fetchStream = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("id");
      if (!id) throw new Error("No ID provided in URL");

      setLoading(true);
      setError(null);

      let stream = null;

      try {
        const ghRes = await fetch(
          "https://raw.githubusercontent.com/drmlive/fancode-live-events/main/fancode.json"
        );
        if (ghRes.ok) {
          const ghData = await ghRes.json();
          stream = Object.values(ghData).find(
            (item) => item.name?.toLowerCase() === id.toLowerCase()
          );
        }
      } catch {
        console.warn("GitHub fetch failed, fallback to Firebase");
      }

      if (!stream) {
        const fbRes = await fetch(
          "https://try-firebase-6d461-default-rtdb.firebaseio.com/keys.json"
        );
        if (fbRes.ok) {
          const fbData = await fbRes.json();
          stream = Object.values(fbData).find(
            (item) => item.name?.toLowerCase() === id.toLowerCase()
          );
        }
      }

      if (!stream) throw new Error("Stream not found for ID: " + id);

      setStreamData(stream);
      return stream;
    } catch (err) {
      console.error("Error fetching stream:", err);
      setError("Stream not found or error fetching data.");
      setLoading(false);
      return null;
    }
  };

  const handleChoice = async (isMobile) => {
    setShowDialog(false);
    const stream = await fetchStream();
    if (!stream) return;

    if (isMobile) {
      let finalUrl = stream.url.includes(".m3u8")
        ? stream.url.split("|")[0]
        : stream.url;

      if (stream.keyId && stream.key) {
        finalUrl += `|drmScheme=clearkey&drmLicense=${stream.keyId}:${stream.key}`;
      }

      const encodedUrl = encodeURIComponent(finalUrl);
      const intentUrl = `intent://${encodedUrl}#Intent;scheme=https;package=com.genuine.leone;end`;

      window.location.href = intentUrl;

      setTimeout(() => {
        if (!document.hidden && !window.shaka) {
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
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: "2rem", fontSize: "2rem", fontWeight: "bold" }}>
            Are you using a Mobile Device?
          </h2>
          <div>
            <button
              onClick={() => handleChoice(true)}
              style={{
                padding: "0.75rem 1.5rem",
                margin: "0.5rem",
                borderRadius: "1rem",
                backgroundColor: "#0ea5e9",
                color: "white",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Yes
            </button>
            <button
              onClick={() => handleChoice(false)}
              style={{
                padding: "0.75rem 1.5rem",
                margin: "0.5rem",
                borderRadius: "1rem",
                backgroundColor: "#4b5563",
                color: "white",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              No
            </button>
          </div>
        </div>
      ) : (
        <div
          ref={containerRef}
          style={{
            position: "relative",
            width: "100%",
            height: "100vh",
            backgroundColor: "black",
          }}
        >
          {loading && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <div style={{ fontSize: "2rem" }}>Loading...</div>
            </div>
          )}
          {error && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "red",
                fontWeight: "bold",
                padding: "1rem",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}
          <video
            id="video"
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              visibility: loading || error ? "hidden" : "visible",
            }}
          />
        </div>
      )}
    </>
  );
};

export default App;