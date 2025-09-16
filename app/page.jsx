import Feature from "@/components/Feature";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItsWorkSection from "@/components/HowItWorkSection";

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
