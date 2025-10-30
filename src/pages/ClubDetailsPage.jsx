import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useClubDetails } from "../hooks/useClubs";
import { useParams } from "react-router-dom";
import CTAButton from "../components/CTAButton";
import RegisterClubDialog from "../components/RegisterClubDialog";
import { parseHtml } from "../lib/htmlParser";
import Gallery from "../components/Gallery";

const ClubDetailsPage = () => {
  const { slug } = useParams();
  // const { club, loading, error } = useClubDetails(slug);

  const loading = false;
  const error = null;
  const club = {
    name: "Vegetarian Omakase Club",
    slug: "vegetarian-omakase-club",
    description:
      '<div>\n  <p class="desc-start">\n    <strong>An experience you won’t taste twice.</strong> <br /> The Vegetarian\n    Omakase Club is an intimate dining circle where chefs create multi-course\n    vegetarian menus that are a surprise and can’t be found anywhere else.\n  </p>\n  <ul class="club-features">\n    <h6>What we offer</h6>\n    <li>\n      <strong>Chef’s Choice Menus:</strong> Multi-course vegetarian experiences\n      that are crafted to surprise and delight.\n    </li>\n    <li>\n      <strong>Thoughtful Pairings:</strong>Mocktails and beverages designed to\n      complement every dish.\n    </li>\n    <li>\n      <strong>Element of Surprise:</strong>Each course is revealed only when it\n      arrives at your table.\n    </li>\n    <li>\n      <strong>Seasonal & Fresh:</strong> Menus inspired by the best local,\n      seasonal ingredients.\n    </li>\n    <li>\n      <strong>Intimate Gatherings</strong>: Limited seats for better connections\n      and memorable conversations.\n    </li>\n    <li>\n      <strong>Exclusive menu:</strong> Each menu is exclusive to its event and\n      is never repeated.\n    </li>\n  </ul>\n  <p class="desc-end">\n    The Vegetarian Omakase Club is about enjoying good food, good company, and a\n    unique dining experience.\n  </p>\n</div>',
    imageUrls: [
      [
        "https://res.cloudinary.com/dzc8qttib/image/upload/v1757562433/voc_xjdiz3.png",
      ],
    ],
    videoUrls: [
      "https://res.cloudinary.com/dzc8qttib/video/upload/v1759734491/VEGE_OMAKASE_a0cpvl.mp4",
    ],
    isActive: true,
    createdAt: "2025-10-24T16:45:08.122Z",
    updatedAt: "2025-10-24T16:45:08.122Z",
    deletedAt: null,
  };

  const [registerDialogOpen, setRegisterDialogOpen] = React.useState(false);

  return (
    <>
      <Box py={{ xs: 6, md: 10 }} px={{ xs: 2, md: 6 }}>
        {loading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && club && (
          <Stack spacing={4}>
            <Box
              height={{ xs: "40vh", md: "70vh" }}
              overflow="hidden"
              borderRadius={{ xs: 6, md: 8 }}
            >
              <Box
                component="video"
                src={club.videoUrls[0]}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                autoPlay
                muted
                loop
                playsInline
              />
            </Box>
            <Typography
              variant="h1"
              sx={{
                textTransform: "uppercase",
                fontSize: { xs: "10vw", sm: "12vw", md: "7vw" },
                lineHeight: 1,
                "& .dot": {
                  display: "inline-block",
                  width: { xs: 12, md: "1.4vw" },
                  height: { xs: 12, md: "1.4vw" },
                  borderRadius: "50%",
                  backgroundColor: "primary.main",
                  marginLeft: { xs: 0.5, md: 1 },
                },
              }}
            >
              {club.name}
              <span>
                <div className="dot" />
              </span>
            </Typography>
            <Box>
              <CTAButton
                text="join now"
                primaryColor="primary.main"
                secondaryColor="secondary.main"
                borderRadius={{ xs: 2, md: 4 }}
                fontSize={{ xs: 20, md: 36 }}
                onClick={() => setRegisterDialogOpen(true)}
              />
            </Box>
            <Box
              bgcolor="secondary.main"
              px={{ xs: 2, md: 4 }}
              py={8}
              borderRadius={{ xs: 2, md: 4 }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: "6vw", md: 40 },
                  color: "background.default",
                  fontWeight: 600,

                  "& span": {
                    fontWeight: 400,
                    textAlign: "justify",
                    fontSize: { xs: 16, md: 24 },

                    "& h6": {
                      fontSize: { xs: 20, md: 40 },
                    },

                    "& li": {
                      marginLeft: { xs: "5%", md: "3%" },
                    },
                  },
                }}
              >
                <span>{parseHtml(club.description, "desc-start")}</span>
                <span>{parseHtml(club.description, "club-features")}</span>
                <span>{parseHtml(club.description, "desc-end")}</span>
              </Typography>
            </Box>

            <Gallery />
          </Stack>
        )}
      </Box>
      <RegisterClubDialog
        open={registerDialogOpen}
        onClose={() => setRegisterDialogOpen(false)}
      />
    </>
  );
};

export default ClubDetailsPage;
