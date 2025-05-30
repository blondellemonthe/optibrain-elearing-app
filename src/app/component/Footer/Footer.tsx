"use client"
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaInstagram, FaWhatsapp, FaYoutube } from 'react-icons/fa'
import { TbWorldWww } from 'react-icons/tb'

const Footer: React.FC = () => {
    return (
        <footer className="py-28 bg-gray-100">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="container mx-auto"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 md:gap-4">
                    {/* First section */}
                    <div className="space-y-4 max-w-[300px]">
                        <h1 className="text-2xl font-bold">Optibrain</h1>
                        <p className="text-gray-600">
                            Optibrain est une plateforme conçue pour vous former à
                            l&apos;utilisation complète de l&apos;ERP Brainopx. De la prise en
                            main des fonctionnalités de base à la maîtrise des modules avancés,
                            nous vous offrons une expérience d’apprentissage structurée et
                            accessible.
                        </p>
                    </div>
                    {/* Second section */}
                    <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <h1 className="text-2xl font-bold">Cours</h1>
                            <ul className="space-y-2 text-lg text-gray-600">
                                <li className="cursor-pointer hover:text-blue-600 transition">
                                    Gestion Commerciale
                                </li>
                                <li className="cursor-pointer hover:text-blue-600 transition">
                                    Comptabilité et finance
                                </li>
                                <li className="cursor-pointer hover:text-blue-600 transition">
                                    Activités opérationnelles
                                </li>
                                <li className="cursor-pointer hover:text-blue-600 transition">
                                    Paramétrages et maintenance
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-2xl font-bold">Liens</h1>
                            <ul className="space-y-2 text-lg text-gray-600">
                                <li className="cursor-pointer hover:text-blue-600 transition">
                                    Accueil
                                </li>
                                <li className="cursor-pointer hover:text-blue-600 transition">
                                    Cours
                                </li>
                                <li className="cursor-pointer hover:text-blue-600 transition">
                                    Certifications
                                </li>
                                <li className="cursor-pointer hover:text-blue-600 transition">
                                    Suivi
                                </li>
                                <li className="cursor-pointer hover:text-blue-600 transition">
                                    Contactez-nous
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/* Third section */}
                    <div className="space-y-4 max-w-[300px]">
                        <h1 className="text-2xl font-bold">Contactez-nous</h1>
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="Entrez votre email"
                                className="p-3 rounded-l-xl bg-white w-full py-4 focus:ring-0 focus:outline-none placeholder:text-gray-600"
                            />
                            <button className="bg-blue-600 text-white font-semibold py-4 px-6 rounded-r-xl">
                                Go
                            </button>
                        </div>
                        {/* Social icons */}
                        <div className="flex space-x-6 py-3">
                            <Link href="https://chat.whatsapp.com/FQSKgJ5f1eIAhlyF5sVym0">
                                <FaWhatsapp className="cursor-pointer hover:text-blue-600 hover:scale-105 transition" />
                            </Link>
                            <Link href="https://www.instagram.com/the.coding.journey/">
                                <FaInstagram className="cursor-pointer hover:text-blue-600 hover:scale-105 transition" />
                            </Link>
                            <Link href="https://thecodingjourney.com/">
                                <TbWorldWww className="cursor-pointer hover:text-blue-600 hover:scale-105 transition" />
                            </Link>
                            <Link href="https://www.youtube.com/@TheCodingJourney">
                                <FaYoutube className="cursor-pointer hover:text-blue-600 hover:scale-105 transition" />
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </footer>
    )
}

export default Footer