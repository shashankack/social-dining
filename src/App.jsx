import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

import Loader from "./components/Loader.jsx";
import VideoPreloader from "./components/VideoPreloader.jsx";

import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

const VIDEO_URLS = [
  "https://res.cloudinary.com/dzc8qttib/video/upload/v1759734369/FITNESSCLUB_jz1emd.mp4",
  "https://res.cloudinary.com/dzc8qttib/video/upload/v1759734407/FOUNDERS_CLUB_l87wbf.mp4",
  "https://res.cloudinary.com/dzc8qttib/video/upload/v1757321419/hot_moms_mmkcjx.mp4",
  "https://res.cloudinary.com/dzc8qttib/video/upload/v1759734491/VEGE_OMAKASE_a0cpvl.mp4",
  "https://res.cloudinary.com/dzc8qttib/video/upload/v1759734609/WOMENS_CLUB_neoakt.mp4",
];

const App = () => {
  return (
    <Suspense fallback={<Loader />}>
      {/* <VideoPreloader urls={VIDEO_URLS} /> */}
      <Navbar />
      <AppRoutes />
      <Footer />
    </Suspense>
  );
};

export default App;
