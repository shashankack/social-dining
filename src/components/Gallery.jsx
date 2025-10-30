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
  // Group images into rows of 2
  const rows = [];
  for (let i = 0; i < images.length; i += 2) {
    rows.push(images.slice(i, i + 2));
  }

  return (
    <Grid container spacing={{ xs: 1, md: 2 }}>
      {rows.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          {row.map((src, colIndex) => {
            const isEvenRow = rowIndex % 2 === 0;
            const size =
              colIndex === 0 ? (isEvenRow ? 7 : 5) : isEvenRow ? 5 : 7;
            return (
              <Grid size={size}>
                <Box
                  height={{ xs: 150, sm: 250, md: 300, lg: 350, xl: 400 }}
                  borderRadius={{ xs: 2, md: 4 }}
                  overflow="hidden"
                  sx={{
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(.98)",

                      "& img": {
                        transform: "scale(1.02)",
                      },
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={src}
                    alt={`Gallery Image ${rowIndex * 2 + colIndex + 1}`}
                    sx={{
                      transition: "all 0.3s ease",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </Grid>
            );
          })}
        </React.Fragment>
      ))}
    </Grid>
  );
};

export default Gallery;
