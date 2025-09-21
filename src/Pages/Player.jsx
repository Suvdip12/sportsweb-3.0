import React, { useEffect, useRef, useState } from "react";
import shaka from "shaka-player/dist/shaka-player.ui.js"; // Shaka core + UI
import "shaka-player/dist/controls.css";

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [showDialog, setShowDialog] = useState(true);
  const [streamData, setStreamData] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);

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

      // Try GitHub JSON first
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

      // If not found in GitHub → fallback Firebase
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
      return null;
    }
  };

  // Play stream with Shaka (desktop only)
  useEffect(() => {
    if (!isDesktop || !streamData) return;

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

    const loadStream = async () => {
      try {
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
      } catch (error) {
        console.error("Error loading stream:", error);
      }
    };

    loadStream();

    return () => {
      if (playerRef.current) playerRef.current.destroy();
    };
  }, [isDesktop, streamData]);

  // Handle user choice
  const handleChoice = async (isMobile) => {
  const stream = await fetchStream();
  if (!stream) return;

  if (isMobile) {
    let finalUrl = stream.url.includes(".m3u8")
      ? stream.url.split("|")[0]
      : stream.url;

    let drmPart = "";
    if (stream.keyId && stream.key) {
      drmPart = `|drmScheme=clearkey&drmLicense=${stream.keyId}:${stream.key}`;
    }

    // Correct Intent URL format
    const intentUrl = `Intent://${finalUrl}${drmPart}#Intent;scheme=https;package=com.genuine.leone;end`;

    console.log("Redirecting to:", intentUrl);
    window.location.href = intentUrl;
  } else {
    setShowDialog(false);
    setIsDesktop(true);
  }
};

  return (
    <>
      {showDialog ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.85)",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>Are you using a Mobile Device?</h2>
          <div>
            <button
              onClick={() => handleChoice(true)}
              style={{
                padding: "10px 20px",
                margin: "10px",
                background: "#02a5f6",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Yes
            </button>
            <button
              onClick={() => handleChoice(false)}
              style={{
                padding: "10px 20px",
                margin: "10px",
                background: "#555",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              No
            </button>
          </div>
        </div>
      ) : (
        <div
          className="video-container"
          ref={containerRef}
          style={{
            width: "100%",
            height: "100vh",
            backgroundColor: "black",
          }}
        >
          <video
            id="video"
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}
    </>
  );
};

export default VideoPlayer;
