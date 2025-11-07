"use client"

import { ReactTyped } from "react-typed";
import { MdOutlineContactPhone } from "react-icons/md";
import Image from "next/image";

const Home = () => {
  return (
    <section
      id="Home"
      className="flex flex-col-reverse md:flex-row justify-center items-center mt-20 mb-10 md:mt-36 md:mb-12 px-4"
    >
      <div className="flex flex-col ">
        <h1 className="text-4xl md:text-6xl font-bold text-center md:text-left mt-4 md:mt-0">
          Bonjour, 
          <br /> <br />  
          <span className="text-accent">
            <ReactTyped
              strings={[
                "Je m'appelle Serge SATCHI",
                "Développeur web FullStack",
                "Ingénieur en Réseaux Informatiques",
                "certifié CCNA",
                "avec plus de 10 ans d'expérience"
              ]}
              typeSpeed={100}
              backSpeed={100}
              backDelay={1000}
              loop
            />
          </span>
        </h1>

        <a
            href="#Contact"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full md:text-2xl border-4 border-accent text-accent transition duration-200 ease-in-out hover:bg-accent hover:text-white hover:border-white md:w-fit mt-20"
            >
            <MdOutlineContactPhone className="md:w-10 md:h-10 mr-2" />
            Contactez-moi
        </a>
      </div>

      <div className="md:ml-20 mb-8 md:mb-0">
        <Image 
          src="/assets/img_ss2.jpg"
          alt="Serge SATCHI"
          width={384}
          height={384}
          className="animate-ssPortfolioImg w-72 h-72 md:w-96 md:h-96 border-8 border-accent shadow-xl"
          style={{
            borderRadius: "30% 70% 70% 30%",
          }}
        />
      </div>
    </section>
  );
};

export default Home;

