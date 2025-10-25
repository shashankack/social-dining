import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { Box } from "@mui/material";

/**
 * @param {Object} props
 * @param {string[]} props.images - Array of image URLs
 * @param {number} [props.speed=20] - Duration (seconds) for one full loop
 * @param {"left"|"right"} [props.direction="left"] - Scroll direction
 * @param {boolean} [props.pauseOnHover=false] - Pause animation on hover
 * @param {number|string} [props.height=120] - Height of the marquee (px or CSS string)
 * @param {number|string} [props.size] - Size (width & height) of each image (px or CSS string, optional)
 */
const ImageMarquee = ({
  images = [
    "/images/dummy.jpg",
    "/images/dummy.jpg",
    "/images/dummy.jpg",
    "/images/dummy.jpg",
  ],
  speed = 20,
  direction = "left",
  pauseOnHover = false,
  borderRadius,
  gap,
  size,
}) => {
  const marqueeRef = useRef(null);
  const animRef = useRef(null);

  // Repeat images enough times to overflow the container
  const containerRef = useRef(null);
  const [repeatCount, setRepeatCount] = React.useState(2);

  useEffect(() => {
    if (!containerRef.current || images.length === 0) return;
    const containerWidth = containerRef.current.offsetWidth;
    // Estimate image width (use size prop or fallback to 120)
    const imgSize = size ? (typeof size === 'number' ? size : 120) : 120;
    const gapPx = gap ? (typeof gap === 'number' ? gap : 0) : 0;
    const totalImgWidth = images.length * (imgSize + gapPx);
    // Repeat enough times to overflow container by at least one set
    const minRepeat = Math.ceil((containerWidth * 2) / totalImgWidth);
    setRepeatCount(Math.max(2, minRepeat));
  }, [images, size, gap]);

  const allImages = Array.from({ length: repeatCount })
    .flatMap(() => images);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee || images.length === 0) return;

    // Get width of one set of images
    const totalWidth = marquee.scrollWidth / repeatCount;

    animRef.current?.kill();
    animRef.current = gsap.to(marquee, {
      x: direction === "left" ? -totalWidth : 0,
      duration: speed,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => {
          const val = parseFloat(x);
          return direction === "left" ? val % -totalWidth : val % totalWidth;
        }),
      },
    });

    return () => animRef.current?.kill();
  }, [images, speed, direction, repeatCount]);

  useEffect(() => {
    if (!pauseOnHover) return;
    const marquee = marqueeRef.current;
    if (!marquee) return;
    const pause = () => animRef.current?.pause();
    const play = () => animRef.current?.play();
    marquee.addEventListener("mouseenter", pause);
    marquee.addEventListener("mouseleave", play);
    return () => {
      marquee.removeEventListener("mouseenter", pause);
      marquee.removeEventListener("mouseleave", play);
    };
  }, [pauseOnHover]);

  return (
    <Box
      ref={containerRef}
      sx={{
        overflow: "hidden",
        position: "relative",
        width: "100%",
        bgcolor: "#fff",
      }}
    >
      <Box
        ref={marqueeRef}
        sx={{
          display: "flex",
          gap,
        }}
      >
        {allImages.map((src, i) => (
          <Box
            component="img"
            src={src}
            alt={"marquee-img-" + i}
            key={i}
            draggable={false}
            sx={{
              borderRadius,
              height: size
                ? typeof size === "number"
                  ? `${size}px`
                  : size
                : "100%",
              width: size
                ? typeof size === "number"
                  ? `${size}px`
                  : size
                : "auto",
              objectFit: "contain",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ImageMarquee;
