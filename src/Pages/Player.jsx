import React, { useEffect, useRef } from "react";
import shaka from "shaka-player/dist/shaka-player.ui.js"; // Shaka core + UI
import "shaka-player/dist/controls.css";

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
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

    // Configure Shaka UI
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
        "cast",
        "fullscreen",
      ],
      addSeekBar: true,
      addBigPlayButton: true,
      enableKeyboardPlaybackControls: true,
      singleClickForPlayAndPause: true,
      doubleClickForFullscreen: true,
      seekBarColors: {
        base: "rgba(255, 255, 255, 0.3)",
        buffered: "rgba(255, 255, 255, 0.54)",
        played: "#02a5f6",
      },
      volumeBarColors: {
        base: "rgba(255, 255, 255, 0.3)",
        level: "#02a5f6",
      },
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

        if (!stream) {
          throw new Error("Stream not found for ID: " + id);
        }

        // Configure player
        const playerConfig = {
          streaming: {
            lowLatencyMode: true,
            bufferingGoal: 3,
          },
        };

        if (stream.keyId && stream.key) {
          playerConfig.drm = {
            clearKeys: { [stream.keyId]: stream.key },
          };
        }

        player.configure(playerConfig);

        await player.load(stream.url);
        console.log("Stream loaded successfully");
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
  }, []);

  return (
    <div
      className="video-container"
      ref={containerRef}
      style={{
        width: "100%",
        height: "100vh", // full height
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
  );
};

export default VideoPlayer;
