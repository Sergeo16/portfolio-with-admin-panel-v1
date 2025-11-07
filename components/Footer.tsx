"use client"

import {  Gem, Facebook, Twitter, Youtube } from "lucide-react"

const Footer = () => {
    return (
        <footer className="footer footer-center bg-stone-950 p-10">
            <aside>

                <Gem className="w-10 h-10" />
                <p className="font-bold">
                    SS
                    <span className="text-accent">DevApp</span>
                </p>
                <p>Copyright © {new Date().getFullYear()} -  Tous droits réservés</p>
            </aside>
            <nav>
                <div className="grid grid-flow-col gap-4">
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        <Twitter className="w-6 h-6 text-current" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        <Youtube className="w-6 h-6 text-current" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        <Facebook className="w-6 h-6 text-current" />
                    </a>
                </div>
            </nav>
        </footer>
    )
}

export default Footer

