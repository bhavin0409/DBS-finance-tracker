import Feature from "@/components/landingPageComponent/Feature";
import Footer from "@/components/landingPageComponent/Footer";
import Hero from "@/components/landingPageComponent/Hero";
import HowItsWorkSection from "@/components/landingPageComponent/HowItWorkSection";

export default function Home() {
  return (
    <div className="mt-40">
        <Hero />
        <Feature /> 
        <HowItsWorkSection />
        <Footer />
    </div>
  );
}
