import React, { Suspense, lazy } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";

import Loader from "./components/Loader.jsx";
import VideoPreloader from "./components/VideoPreloader.jsx";

import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import EventGalleryPage from "./pages/EventGalleryPage.jsx";
const EventsPage = lazy(() => import("./pages/EventsPage.jsx"));
const EventDetailsPage = lazy(() => import("./pages/EventDetailsPage.jsx"));
const GalleryPage = lazy(() => import("./pages/GalleryPage.jsx"));
const ClubDetailsPage = lazy(() => import("./pages/ClubDetailsPage.jsx"));
const PaymentSuccessPage = lazy(() => import("./pages/PaymentSuccessPage.jsx"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage.jsx"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

const LegacyEventGalleryRedirect = () => {
  const { slug } = useParams();
  return <Navigate to={`/events/${slug}/gallery`} replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/event/:slug" element={<EventDetailsPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/events/:slug/gallery" element={<EventGalleryPage />} />
      <Route path="/gallery/event/:slug" element={<LegacyEventGalleryRedirect />} />
      <Route path="/club/:slug" element={<ClubDetailsPage />} />
      <Route path="/payment-success" element={<PaymentSuccessPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="*" element={<NotFound />} />
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
