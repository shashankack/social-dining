import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

import Loader from "./components/Loader.jsx";
import VideoPreloader from "./components/VideoPreloader.jsx";

import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

const EventsPage = lazy(() => import("./pages/EventsPage.jsx"));
const EventDetailsPage = lazy(() => import("./pages/EventDetailsPage.jsx"));
const GalleryPage = lazy(() => import("./pages/GalleryPage.jsx"));
const ClubDetailsPage = lazy(() => import("./pages/ClubDetailsPage.jsx"));
const EventGalleryPage = lazy(() => import("./pages/EventGalleryPage.jsx"));

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/event/:slug" element={<EventDetailsPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/gallery/event/:slug" element={<EventGalleryPage />} />
      <Route path="/club/:slug" element={<ClubDetailsPage />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Navbar />
      <AppRoutes />
      <Footer />
    </Suspense>
  );
};

export default App;
