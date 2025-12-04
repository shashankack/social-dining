import React from "react";
import {
  Box,
  ImageList,
  ImageListItem as ImageListimg,
  Dialog,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const NewGallery = () => {
  const media = [
    { type: "image", src: "/images/gallery/image1.png" },
    { type: "image", src: "/images/gallery/image2.png" },
    { type: "video", src: "/videos/FITNESS.mp4", thumbnail: "/images/gallery/image3.png" },
    { type: "image", src: "/images/gallery/image3.png" },
    { type: "image", src: "/images/gallery/image4.png" },
    { type: "video", src: "/videos/FOUNDERS.mp4", thumbnail: "/images/gallery/image5.png" },
    { type: "image", src: "/images/gallery/image5.png" },
    { type: "image", src: "/images/gallery/image6.png" },
    { type: "image", src: "/images/gallery/image7.png" },
    { type: "image", src: "/images/gallery/image8.png" },
  ];

  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState(0);
  const [hoveredIndex, setHoveredIndex] = React.useState(null);
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleOpen = (idx) => {
    setCurrent(idx);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrent((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };
  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrent((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <Box sx={{ width: "100%", height: "100%", overflowY: "auto" }}>
      <Box maxWidth={1400} mx="auto">
        <ImageList variant="masonry" cols={3} gap={8}>
          {media.map((item, index) => (
            <ImageListimg
              key={index}
              onClick={() => handleOpen(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              sx={{
                overflow: "hidden",
                position: "relative",
                transition: "all 0.2s ease",
                "& img, & video": {
                  transform: "scale(1.1)",
                  transition: "all 0.2s ease",
                },
                "&:hover": {
                  transform: "scale(.98)",
                  cursor: "pointer",
                  "& img, & video": {
                    transform: "scale(1.13)",
                  },
                },
              }}
            >
              {item.type === "video" ? (
                <>
                  <video
                    src={item.src}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                    muted
                    loop
                    playsInline
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      bgcolor: "rgba(226, 85, 23, 0.9)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      pointerEvents: "none",
                      opacity: isMobile ? 1 : (hoveredIndex === index ? 1 : 0),
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    <Box
                      sx={{
                        width: 0,
                        height: 0,
                        borderLeft: "20px solid white",
                        borderTop: "12px solid transparent",
                        borderBottom: "12px solid transparent",
                        ml: 0.5,
                      }}
                    />
                  </Box>
                </>
              ) : (
                <img
                  srcSet={`${item.src}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.src}?w=248&fit=crop&auto=format`}
                  alt={`Gallery item ${index + 1}`}
                  loading="lazy"
                />
              )}
            </ImageListimg>
          ))}
        </ImageList>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xl"
        slotProps={{
          paper: {
            sx: {
              bgcolor: "secondary.main",
              boxShadow: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          },
        }}
        fullScreen={isMobile}
      >
        <Box
          sx={{
            position: "relative",
            width: isMobile ? "100vw" : 900,
            height: isMobile ? "100vh" : 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "primary.main",
              zIndex: 2,
            }}
          >
            <CloseIcon />
          </IconButton>
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              left: 16,
              color: "primary.main",
              zIndex: 2,
            }}
          >
            <ArrowBackIosNewIcon fontSize="large" />
          </IconButton>
          
          {media[current].type === "video" ? (
            <video
              src={media[current].src}
              controls
              autoPlay
              style={{
                maxWidth: isMobile ? "100vw" : 800,
                maxHeight: isMobile ? "100vh" : 540,
                width: "auto",
                height: "auto",
                borderRadius: 8,
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                margin: "auto",
                display: "block",
              }}
              sx={{
                "&::-webkit-media-controls-panel": {
                  background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                },
                "&::-webkit-media-controls-play-button": {
                  backgroundColor: "#E25517",
                  borderRadius: "50%",
                },
              }}
            />
          ) : (
            <img
              src={media[current].src}
              alt={`Gallery item ${current + 1}`}
              style={{
                maxWidth: isMobile ? "100vw" : 800,
                maxHeight: isMobile ? "100vh" : 540,
                width: "auto",
                height: "auto",
                borderRadius: 8,
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                margin: "auto",
                display: "block",
              }}
            />
          )}
          
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: 16,
              color: "primary.main",
              zIndex: 2,
            }}
          >
            <ArrowForwardIosIcon fontSize="large" />
          </IconButton>
        </Box>
      </Dialog>
    </Box>
  );
};

export default NewGallery;
