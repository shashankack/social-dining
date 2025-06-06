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

import { eventsData } from "./assets/data";
import Loader from "./components/Loader";

const AppContent = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { loading } = useLoading();

  useAttachLoaderInterceptor();

  return (
    <>
      {!loading && currentPath !== "/" && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/events" element={<Events data={eventsData} />} />
        <Route path="/events/:id" element={<EventsInternal />} />
        <Route path="/club/:id" element={<ClubsInternal />} />
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
      <AppContent />
    </Router>
  );
};

export default App;
