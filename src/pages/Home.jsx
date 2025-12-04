import React, { useState } from "react";
import IntroSection from "../sections/IntroSection";
import HeroSection from "../sections/HeroSection";
import UpcomingSection from "../sections/UpcomingSection";
import AboutSection from "../sections/AboutSection";
import ClubsSection from "../sections/ClubsSection";
import BrandCollaborationSection from "../sections/BrandCollaborationSection";

const Home = () => {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <>
      <IntroSection onComplete={() => setIntroComplete(true)} />
      {/* Load content in background, but hide until intro completes */}
      <div style={{ opacity: introComplete ? 1 : 0, transition: 'opacity 0.3s ease' }}>
        <HeroSection />
        <UpcomingSection />
        <AboutSection />
        <ClubsSection />
        <BrandCollaborationSection />
      </div>
    </>
  );
};

export default Home;
