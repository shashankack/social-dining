import React from "react";
import {
  Box,
  Dialog,
  IconButton,
  ImageList,
  ImageListItem,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const srcset = (image, width, height, rows = 1, cols = 1) => ({
  src: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
  srcSet: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format&dpr=2 2x`,
});

const masonrySrcset = (image) => ({
  src: `${image}?w=248&fit=crop&auto=format`,
  srcSet: `${image}?w=248&fit=crop&auto=format&dpr=2 2x`,
});

/**
 * @typedef {"grid" | "masonry"} GalleryLayout
 */

/**
 * @typedef {Object} GalleryItem
 * @property {string} src n
 * @property {"image" | "video"} [type]
 */

/**
 * @param {{ media: GalleryItem[]; layout?: GalleryLayout }} props
 */
const NewGallery = ({ media, layout = "grid" }) => {
  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState(0);
  const [hoveredIndex, setHoveredIndex] = React.useState(null);
  const isMobile = useMediaQuery("(max-width:600px)");
  const resolvedLayout = layout === "masonry" ? "masonry" : "grid";
  const isMasonryLayout = resolvedLayout === "masonry";

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

  const activeMedia = media[current];

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
  }, [open, media.length]);

  if (!Array.isArray(media) || media.length === 0) {
    return null;
  }

  return (
    <Box sx={{ width: "100%", height: "100%", overflowY: "auto" }}>
      <Box
        maxWidth={1240}
        mx="auto"
        px={{ xs: 1, md: 2 }}
        sx={{ transform: "translateZ(0)" }}
      >
        <ImageList
          sx={{
            width: "100%",
            py: { xs: 0.5, md: 1 },
          }}
          variant={isMasonryLayout ? "masonry" : "quilted"}
          cols={isMasonryLayout ? (isMobile ? 2 : 3) : isMobile ? 2 : 4}
          rowHeight={isMasonryLayout ? undefined : isMobile ? 130 : 180}
          gap={8}
        >
          {media.map((item, index) => {
            const featured = !isMasonryLayout && index % 9 === 0;
            const cols = featured ? (isMobile ? 2 : 2) : 1;
            const rows = featured ? 2 : 1;

            return (
              <ImageListItem
                key={index}
                cols={isMasonryLayout ? 1 : cols}
                rows={isMasonryLayout ? 1 : rows}
                onClick={() => handleOpen(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: { xs: 2, md: 2.5 },
                  cursor: "pointer",
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  backgroundColor: "#ddd",
                  transition: "transform 0.22s ease, box-shadow 0.22s ease",
                  "& img, & video": {
                    width: "100%",
                    height: isMasonryLayout ? "auto" : "100%",
                    objectFit: "cover",
                    display: "block",
                    transform: "scale(1)",
                    transition: "transform 0.3s ease, filter 0.3s ease",
                  },
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 14px 32px rgba(0,0,0,0.14)",
                  },
                  "&:hover img, &:hover video": {
                    transform: "scale(1.03)",
                    filter: "saturate(1.05)",
                  },
                }}
              >
                {item.type === "video" ? (
                  <>
                    <video src={item.src} muted loop autoPlay playsInline />
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: { xs: 46, md: 58 },
                        height: { xs: 46, md: 58 },
                        borderRadius: "50%",
                        bgcolor: "rgba(181, 87, 37, 0.9)",
                        border: "2px solid rgba(255,255,255,0.9)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        pointerEvents: "none",
                        opacity: isMobile
                          ? 1
                          : hoveredIndex === index
                            ? 1
                            : 0.4,
                        transition: "opacity 0.25s ease",
                      }}
                    >
                      <Box
                        sx={{
                          width: 0,
                          height: 0,
                          borderLeft: "15px solid white",
                          borderTop: "9px solid transparent",
                          borderBottom: "9px solid transparent",
                          ml: "4px",
                        }}
                      />
                    </Box>
                  </>
                ) : (
                  <img
                    {...(isMasonryLayout
                      ? masonrySrcset(item.src)
                      : srcset(item.src, 260, isMobile ? 130 : 180, rows, cols))}
                    alt={`Gallery item ${index + 1}`}
                    loading="lazy"
                  />
                )}
              </ImageListItem>
            );
          })}
        </ImageList>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={false}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "#070707",
              boxShadow: 0,
              width: "100vw",
              height: "100vh",
              maxWidth: "100vw",
              maxHeight: "100vh",
              borderRadius: 0,
              backgroundImage:
                "radial-gradient(circle at 20% 10%, rgba(181, 87, 37, 0.2), transparent 45%), radial-gradient(circle at 80% 95%, rgba(144, 189, 245, 0.16), transparent 45%)",
            },
          },
        }}
        fullScreen
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "grid",
            gridTemplateRows: "auto 1fr auto",
            px: { xs: 1, md: 3 },
            py: { xs: 1, md: 2 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: { xs: 1, md: 2 },
              py: 1,
              borderRadius: 2,
              bgcolor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Box display="flex" alignItems="center" gap={1.25}>
              <Typography
                sx={{
                  color: "#FFFFF5",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  fontSize: { xs: "0.8rem", md: "0.9rem" },
                  textTransform: "uppercase",
                }}
              >
                Event Gallery
              </Typography>
              <Box
                sx={{
                  px: 1,
                  py: 0.2,
                  borderRadius: 99,
                  bgcolor: "rgba(144, 189, 245, 0.26)",
                  color: "#FFFFF5",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                }}
              >
                {activeMedia?.type === "video" ? "Video" : "Photo"}
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography
                sx={{
                  color: "#FFFFF5",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  fontWeight: 700,
                }}
              >
                {current + 1} / {media.length}
              </Typography>
              <IconButton
                onClick={handleClose}
                sx={{
                  color: "#FFFFF5",
                  bgcolor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.16)",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 0,
              py: { xs: 1, md: 2 },
            }}
          >
            {!isMobile && (
              <IconButton
                onClick={handlePrev}
                sx={{
                  position: "absolute",
                  left: { md: 8, lg: 18 },
                  color: "#FFFFF5",
                  bgcolor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  zIndex: 2,
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.16)",
                  },
                }}
              >
                <ArrowBackIosNewIcon fontSize="medium" />
              </IconButton>
            )}

            <Box
              sx={{
                width: "100%",
                maxWidth: { xs: "100%", md: 1200 },
                height: "100%",
                maxHeight: {
                  xs: "calc(100vh - 210px)",
                  md: "calc(100vh - 225px)",
                },
                borderRadius: { xs: 1.5, md: 3 },
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.16)",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(0,0,0,0.65)",
              }}
            >
              {activeMedia?.type === "video" ? (
                <video
                  src={activeMedia.src}
                  controls
                  autoPlay
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                    backgroundColor: "#000",
                  }}
                />
              ) : (
                <img
                  src={activeMedia?.src}
                  alt={`Gallery item ${current + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                    backgroundColor: "#000",
                  }}
                />
              )}
            </Box>

            {!isMobile && (
              <IconButton
                onClick={handleNext}
                sx={{
                  position: "absolute",
                  right: { md: 8, lg: 18 },
                  color: "#FFFFF5",
                  bgcolor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  zIndex: 2,
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.16)",
                  },
                }}
              >
                <ArrowForwardIosIcon fontSize="medium" />
              </IconButton>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: { xs: 0.5, md: 1.5 },
              pb: { xs: 0.4, md: 0.6 },
              overflowX: "auto",
              "&::-webkit-scrollbar": {
                height: 6,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(255,255,255,0.25)",
                borderRadius: 999,
              },
            }}
          >
            {isMobile && (
              <IconButton
                onClick={handlePrev}
                sx={{
                  color: "#FFFFF5",
                  bgcolor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  flex: "0 0 auto",
                }}
              >
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>
            )}
            {media.map((item, index) => (
              <Box
                key={`thumb-${index}`}
                onClick={() => setCurrent(index)}
                sx={{
                  position: "relative",
                  width: { xs: 66, md: 86 },
                  height: { xs: 66, md: 86 },
                  borderRadius: 1.5,
                  overflow: "hidden",
                  flex: "0 0 auto",
                  cursor: "pointer",
                  border:
                    index === current
                      ? "2px solid #90BDF5"
                      : "1px solid rgba(255,255,255,0.25)",
                  opacity: index === current ? 1 : 0.68,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    opacity: 1,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {item.type === "video" ? (
                  <>
                    <Box
                      component="video"
                      src={item.src}
                      muted
                      playsInline
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        pointerEvents: "none",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        bgcolor: "rgba(226, 85, 23, 0.95)",
                      }}
                    >
                      <Box
                        sx={{
                          width: 0,
                          height: 0,
                          borderLeft: "7px solid white",
                          borderTop: "4px solid transparent",
                          borderBottom: "4px solid transparent",
                          ml: "7px",
                          mt: "6px",
                        }}
                      />
                    </Box>
                  </>
                ) : (
                  <Box
                    component="img"
                    src={item.src}
                    alt={`Thumbnail ${index + 1}`}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      pointerEvents: "none",
                    }}
                  />
                )}
              </Box>
            ))}
            {isMobile && (
              <IconButton
                onClick={handleNext}
                sx={{
                  color: "#FFFFF5",
                  bgcolor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  flex: "0 0 auto",
                }}
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default NewGallery;
