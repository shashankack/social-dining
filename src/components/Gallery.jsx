import React from "react";
import { Grid, Box } from "@mui/material";

const Gallery = ({
  images = [
    "/images/gallery/image1.png",
    "/images/gallery/image2.png",
    "/images/gallery/image3.png",
    "/images/gallery/image4.png",
    "/images/gallery/image5.png",
    "/images/gallery/image6.png",
    "/images/gallery/image7.png",
    "/images/gallery/image8.png",
  ],
}) => {
  const tileHeights = [
    { xs: 150, sm: 200, md: 240, lg: 280 },
    { xs: 180, sm: 230, md: 290, lg: 330 },
    { xs: 165, sm: 210, md: 260, lg: 300 },
    { xs: 190, sm: 240, md: 310, lg: 360 },
  ];

  return (
    <Grid container spacing={{ xs: 1, sm: 1.5, md: 2.5 }}>
      {images.map((src, index) => (
        <Grid
          key={src || index}
          size={{ xs: 6, sm: 4, md: index % 5 === 0 ? 8 : 4 }}
        >
          <Box
            height={tileHeights[index % tileHeights.length]}
            borderRadius={{ xs: 2.5, md: 4 }}
            overflow="hidden"
            sx={{
              transition: "transform 0.3s ease",
              bgcolor: "secondary.main",
              "&:hover": {
                transform: "translateY(-4px)",
              },
              "&:hover img": {
                transform: "scale(1.04)",
              },
            }}
          >
            <Box
              component="img"
              src={src}
              alt={`Gallery Image ${index + 1}`}
              sx={{
                transition: "transform 0.35s ease",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default Gallery;
