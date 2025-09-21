import React, { useEffect, useRef, useState } from "react";
import shaka from "shaka-player/dist/shaka-player.ui.js"; // Shaka core + UI
import "shaka-player/dist/controls.css";

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [showDialog, setShowDialog] = useState(true); // show dialog on start

  useEffect(() => {
    if (showDialog) return; // wait until user answers dialog

    shaka.polyfill.installAll();

    if (!shaka.Player.isBrowserSupported()) {
      console.error("Browser not supported!");
      return;
    }

    const video = videoRef.current;
    const container = containerRef.current;

    // Create player
    const player = new shaka.Player(video);
    playerRef.current = player;

    // Create Shaka UI overlay
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

    const fetchAndLoadStream = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");

        if (!id) {
          console.error("No ID provided in URL");
          return;
        }

        const response = await fetch(
          "https://try-firebase-6d461-default-rtdb.firebaseio.com/keys.json"
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        let stream = null;
        for (const key in data) {
          if (
            data[key].name &&
            data[key].name.toLowerCase() === id.toLowerCase()
          ) {
            stream = {
              url: data[key].url,
              keyId: data[key].keyId,
              key: data[key].key,
            };
            break;
          }
        }

        if (!stream) throw new Error("Stream not found for ID: " + id);

        const playerConfig = {
          streaming: {
            lowLatencyMode: true,
            bufferingGoal: 3,
          },
        };

        // Check if DRM
        if (stream.keyId && stream.key) {
          playerConfig.drm = {
            clearKeys: { [stream.keyId]: stream.key },
          };
        }

        player.configure(playerConfig);

        // Handle m3u8 or mpd
        let finalUrl = stream.url;
        if (finalUrl.includes(".m3u8")) {
          finalUrl = finalUrl.split("|")[0]; // ensure clean m3u8 URL
        }

        await player.load(finalUrl);
        console.log("Stream loaded:", finalUrl);
      } catch (error) {
        console.error("Error loading stream:", error);
      }
    };

    fetchAndLoadStream();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [showDialog]);

  // Handle user choice
  const handleChoice = (isMobile) => {
    if (isMobile) {
      // Redirect with intent
      window.location.href =
        "Intent:https://live-cito.9c9media.ca/1c3b314400c213d678f83ef6687899a3dfb7c8b21674096484889/f/tsn1/manifest.mpd?|drmScheme=clearkey&drmLicense=8df41512092240d38550e83dc05e157e:f29f106ec9f58b41c7c8391b64f3bb25#Intent;package=com.genuine.leone;end";
    } else {
      setShowDialog(false); // continue with Shaka
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
          <h2 style={{ marginBottom: "20px" }}>
            📱 Are you using a Mobile Device?
          </h2>
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
