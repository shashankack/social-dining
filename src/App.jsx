import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { LoadingProvider, useLoading } from "./context/LoadingContext";
import { useAttachLoaderInterceptor } from "./utils/axiosWithLoader";

import Home from "./pages/Home";
import Events from "./pages/Events";
import EventsInternal from "./components/EventsInternal";
import ClubsInternal from "./components/ClubsInternal";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";

import Policy from "./components/Policy";

import { eventsData } from "./assets/data";
import Loader from "./components/Loader";
import { useEffect } from "react";

const AppContent = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { loading } = useLoading();

  useAttachLoaderInterceptor();

  useEffect(() => {
    localStorage.removeItem("events");
  }, []);

  return (
    <>
      {!loading && currentPath !== "/" && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/events" element={<Events data={eventsData} />} />
        <Route path="/events/:id" element={<EventsInternal />} />
        <Route path="/club/:id" element={<ClubsInternal />} />
        <Route path="/privacy-policy" element={<Policy />} />
        <Route path="/cancellation-policy" element={<Policy />} />
        <Route path="/terms-and-conditions" element={<Policy />} />
        <Route path="/shipping-policy" element={<Policy />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
        <Route path="/test" element={<Loader />} />
      </Routes>
      {!loading && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <LoadingProvider>
        <AppContent />
      </LoadingProvider>
    </Router>
  );
};

export default App;
