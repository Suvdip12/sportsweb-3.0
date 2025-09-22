import React, { useEffect, useRef } from "react";
import shaka from "shaka-player/dist/shaka-player.ui.js";
import "shaka-player/dist/controls.css";

const VideoPlayer = ({ seriesName, videoUrl }) => {
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

    const loadStream = async () => {
      try {
        if (videoUrl) {
          await player.load(videoUrl);
          console.log("Stream loaded successfully");
        } else {
          console.error("No videoUrl provided");
        }
      } catch (error) {
        console.error("Error loading stream:", error);
      }
    };

    loadStream();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoUrl]);

  return (
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
  );
};

export default VideoPlayer;
