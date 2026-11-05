import Nav from "@/components/Nav";
import SmoothScroll from "@/components/SmoothScroll";
import Hero from "@/components/Hero";
import Chaos from "@/components/Chaos";
import Adjuster from "@/components/Adjuster";
import Workspace from "@/components/Workspace";
import Journey from "@/components/Journey";
import People from "@/components/People";
import Finale from "@/components/Finale";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Nav />
      <main id="main">
        <Hero />
        <Chaos />
        <Adjuster />
        <Workspace />
        <Journey />
        <People />
        <Finale />
      </main>
      <Footer />
    </>
  );
}
