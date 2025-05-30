import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import Events from "./pages/Events";
import EventsInternal from "./components/EventsInternal";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";

import { eventsData } from "./assets/data";

const AppContent = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      {currentPath !== "/" && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/events" element={<Events data={eventsData} />} />
        <Route path="/events/:id" element={<EventsInternal />} />
      </Routes>
      <Footer />
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
