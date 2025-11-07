"use client"

import { FC } from "react";
import { BsCodeSlash, BsGlobeEuropeAfrica,  BsMortarboardFill } from "react-icons/bs";
import { MdSettingsSuggest } from "react-icons/md";

const services = [
  {
    id: 1,
    icon: <BsCodeSlash className="text-7xl text-accent" />,
    title: "Développement d'applications",
    description:
      "Je conçois des applications web modernes, performantes et sécurisées avec des technologies comme React, Next.js, TypeScript et Django. Mon objectif : transformer vos idées en solutions efficaces et intuitives qui répondent parfaitement à vos besoins métier.",
    link: "#Contact",
  },
   {
    id: 2,
    icon: <BsGlobeEuropeAfrica className="text-7xl text-accent" />,
    title: "Administration des réseaux informatiques",
    description:
      "Je déploie, sécurise et administre des réseaux fiables et évolutifs. Avec une expertise CCNA, je garantis une connectivité optimale, une gestion efficace des ressources et une réponse rapide aux incidents pour assurer la continuité de vos services.",
    link: "#Contact",
  },
  {
    id: 3,
    icon: <MdSettingsSuggest className="text-7xl text-accent" />,
    title: "Maintenance informatique et Support Technique",
    description:
      "Problèmes techniques ? Je vous accompagne avec des solutions rapides, durables et adaptées. Diagnostic, réparation, optimisation : je veille à la santé de vos équipements et à la satisfaction de vos utilisateurs.",
    link: "#Contact",
  },
  {
    id: 4,
    icon: <BsMortarboardFill className="text-7xl text-accent" />,
    title: "Formations en informatique",
    description:
      "Je propose des formations pratiques et adaptées à tous niveaux : bureautique, réseaux, développement web ou cybersécurité. Avec une pédagogie claire et des résultats concrets, je vous aide à monter en compétence à votre rythme.",
    link: "#Contact",
  },
];

const Services: FC = () => {
  return (
    <section id="Services" className="min-h-screen md:min-h-0 px-6 md:px-16 text-gray-100 md:pb-20 md:pt-0">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 mt-10">
        Mes <span className="text-accent">Services</span>
      </h2>

      <div className="flex flex-wrap justify-center gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex-1 min-w-[280px] max-w-[350px] bg-zinc-900 p-8 rounded-2xl text-center border-2 border-white transition-transform hover:scale-105 hover:border-accent hover:border-4"
          >
            <div className="mb-6 flex justify-center">{service.icon}</div>
            <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
            <p className="text-base mb-6">{service.description}</p>
            <a
              href={service.link}
              className="inline-block border border-white text-white hover:bg-accent hover:border-4 transition-colors duration-200 rounded-full px-6 py-3 text-lg mt-4"
            >
              {service.id === 4 ? "En savoir plus" : "Contactez-moi"}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;

