import React from "react";

const VideoPreloader = ({ urls = [] }) => {
  return (
    <>
      {urls.map((url, idx) => (
        <video
          key={idx}
          src={url}
          preload="metadata"
          style={{ display: "none" }}
        />
      ))}
    </>
  );
};

export default VideoPreloader;
