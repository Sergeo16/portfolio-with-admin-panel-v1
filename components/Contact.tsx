"use client"

import { Mail, Phone } from "lucide-react";
import { IoLogoWhatsapp } from "react-icons/io5";

const Contact = () => {
  return (
    <section id="Contact" className="py-5 pb-20 text-base-content">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 mt-10">
            Me <span className="text-accent">Contacter</span>
        </h2>
        <p className="mb-14 font-bold md:text-2xl">Joignez-moi via l'un des canaux suivants en un clic :</p>
        <div className="grid gap-6 md:grid-cols-3">

          <a
            href="https://wa.me/22996958207"
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 hover:border-4  hover:border-accent hover:font-bold rounded-2xl shadow p-6 hover:text-white transition-transform md:hover:scale-110 hover:scale-105"
          >
            <IoLogoWhatsapp className="mx-auto mb-2 text-accent" size={32} />
            <h3 className="font-semibold">WhatsApp</h3>
            <p className="text-sm">+22996958207</p>
          </a>

          <a
            href="tel:+2290196958207"
            className="border-2 hover:border-4  hover:border-accent hover:font-bold rounded-2xl shadow p-6 hover:text-white transition-transform md:hover:scale-110 hover:scale-105"
          >
            <Phone className="mx-auto mb-2 text-accent" size={32} />
            <h3 className="font-semibold">Appel</h3>
            <p className="text-sm">+2290196958207</p>
          </a>

          <a
            href="mailto:sergeo1616@gmail.com"
            className="border-2 hover:border-4  hover:border-accent hover:font-bold rounded-2xl shadow p-6 hover:text-white transition-transform hover:scale-110md:hover:scale-110 hover:scale-105"
          >
            <Mail className="mx-auto mb-2 text-accent" size={32} />
            <h3 className="font-semibold">Email</h3>
            <p className="text-sm">sergeo1616@gmail.com</p>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;

