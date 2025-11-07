import Navbar from "@/components/Navbar"
import Home from "@/components/Home"
import About from "@/components/About"
import Projects from "@/components/Projects"
import Footer from "@/components/Footer"
import Services from "@/components/Services"
import Contact from "@/components/Contact"

export default function HomePage() {
  return (
    <>
      <div className="p-5 md:px-[10%]">
        <Navbar />
        <Home />
      </div>
      <About />
      <Services />
      <Projects />
      <Contact />
      <Footer />
    </>
  )
}

