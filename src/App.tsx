import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import TrustStrip from "./sections/TrustStrip";
import WhoIsItFor from "./sections/WhoIsItFor";
import Services from "./sections/Services";
import Packages from "./sections/Packages";
import WhyAtlas from "./sections/WhyAtlas";
import MeetFidel from "./sections/MeetFidel";
import SafetyTrust from "./sections/SafetyTrust";
import Destinations from "./sections/Destinations";
import Testimonials from "./sections/Testimonials";
import FAQ from "./sections/FAQ";
import CTABand from "./sections/CTABand";
import Footer from "./sections/Footer";

function App() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f4f4f2" }}>
      <Navbar />
      <Hero />
      <TrustStrip />
      <WhoIsItFor />
      <Services />
      <Packages />
      <WhyAtlas />
      <MeetFidel />
      <SafetyTrust />
      <Destinations />
      <Testimonials />
      <FAQ />
      <CTABand />
      <Footer />
    </div>
  );
}

export default App;
