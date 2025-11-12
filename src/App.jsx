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

<div>
  <p>
    <strong>Where every gathering feels like a girls’ night done right.</strong>
    <br />
    The Women’s Club is a space to connect, share stories, and grow alongside
    like-minded women. It’s about inspiration, encouragement, and building a
    circle where every woman belongs.
  </p>
  <h6>What we offer</h6>
  <ul>
    <li>
      <b>Inspiring Gatherings</b>: Events that stir new ideas and meaningful
      connections.
    </li>
    <li>
      <b>Real Talk Sessions</b>:Open circles to share journeys, challenges, and
      wins.
    </li>
    <li>
      <b>Ladies’ Nights</b>: Relaxed evenings with food, drinks, and laughter.
    </li>
    <li>
      <b>Celebrating Women</b>: Experiences that encourage creativity,
      leadership, and individuality.
    </li>
    <li>
      <b>Supportive Community</b>: A circle of women who uplift and grow
      together.
    </li>
  </ul>
  <p>
    The Women’s Club is your space to feel seen, supported, and celebrated,
    because together, we’re unstoppable.
  </p>
</div>
