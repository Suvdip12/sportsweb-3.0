import React, { useState, useRef, useEffect } from "react";

const VideoPlayerPage = () => {
  const [showDialog, setShowDialog] = useState(true);
  const [useWebPlayer, setUseWebPlayer] = useState(false);
  const [error, setError] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null); // store API videoUrl
  const videoRef = useRef(null);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/drmlive/fancode-live-events/main/fancode.json"
    )
      .then((response) => response.json())
      .then((data) => {
        const matchesArray = data.matches;
        if (!matchesArray || matchesArray.length === 0) {
          setError("No matches found.");
          return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id")?.trim();
        if (!id) {
          setError("No ID provided in URL. Please add a valid ?id= parameter.");
          return;
        }

        const match = matchesArray.find((m) => String(m.match_id) === id);
        if (!match) {
          setError("No match found for this ID.");
          return;
        }

        setVideoUrl(match.hls || match.m3u8 || match.adfree_url); 
        console.log(videoUrl);// pick the correct field
      })
      .catch((err) => {
        console.error("Error fetching Fancode data:", err);
        setError("Error fetching matches. Please try again later.");
      });
  }, []);

  const intentUrl = videoUrl
    ? `intent:${videoUrl}#Intent;package=com.genuine.leone;end`
    : "#";

  const handleWebPlayerChoice = () => {
    setShowDialog(false);
    setUseWebPlayer(true);
  };

  useEffect(() => {
    if (useWebPlayer && videoRef.current && videoUrl) {
      videoRef.current.src = videoUrl;
      videoRef.current
        .play()
        .then(() => console.log("Web player started successfully"))
        .catch((err) => {
          console.error("Error playing video:", err);
          setError(
            "Failed to play video in browser. Try NS Player or check the URL."
          );
        });
    }
  }, [useWebPlayer, videoUrl]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000",
        position: "relative",
        fontFamily: "Arial, sans-serif",
      }}
    >
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
            Play video in NS Player or Web Player?
          </h2>
          <div>
            <a
              href={intentUrl}
              style={{
                padding: "0.75rem 1.5rem",
                margin: "0.5rem",
                borderRadius: "1rem",
                backgroundColor: "#0ea5e9",
                color: "white",
                fontWeight: "600",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              NS Player
            </a>
            <a
              href="#"
              onClick={handleWebPlayerChoice}
              style={{
                padding: "0.75rem 1.5rem",
                margin: "0.5rem",
                borderRadius: "1rem",
                backgroundColor: "#4b5563",
                color: "white",
                fontWeight: "600",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              Web Player
            </a>
          </div>
        </div>
      ) : (
        <div style={{ position: "relative", width: "100%", height: "100%", backgroundColor: "black" }}>
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
          {useWebPlayer && videoUrl && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              controls
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                visibility: error ? "hidden" : "visible",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default VideoPlayerPage;
