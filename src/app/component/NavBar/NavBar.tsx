"use client"
import React, { useState } from "react";
import { IoMdMenu } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {IoClose} from "react-icons/io5";
import Link from "next/link";

const NavbarMenu = [
    { id: 1, title: "Accueil", path: "/" },
    { id: 2, title: "Formations", path: "/formations" },
    { id: 3, title: "Administration", path: "/admin/formations" },
    { id: 4, title: "Dashboard", path: "/dashboard" }, // Corrigé "Dashbord" en "Dashboard" et ajouté un chemin correct
    { id: 5, title: "Contactez-nous", path: "/contact" }, // Remplacé "#" par un chemin plus approprié
];

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="relative z-20 bg-white shadow-md">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center"
            >
                {/* Logo section */}
                <div>
                    <Link href="/">
                        <Image src="/images/logo-optibrain.png" alt="OptiBrain Logo" width={40} height={40} className="w-10 h-10" />
                    </Link>
                </div>
                {/* Menu section */}
                <div className="hidden lg:flex items-center gap-6">
                    <ul className="flex items-center gap-4">
                        {NavbarMenu.map((menu) => (
                            <li key={menu.id}>
                                <a
                                    href={menu.path}
                                    className="inline-block py-2 px-3 text-gray-700 hover:text-blue-600 text-sm font-medium relative group"
                                >
                                    {menu.title}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                                </a>
                            </li>
                        ))}
                    </ul>
                    <a
                        href="/login"
                        className="py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium"
                    >
                        Se connecter
                    </a>
                </div>
                {/* Mobile Hamburger menu section */}
                <div className="lg:hidden">
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Ouvrir le menu"
                    >
                        <IoMdMenu className="w-8 h-8" />
                    </button>
                </div>
            </motion.div>

            {/* Mobile Menu Modal */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 lg:hidden"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="bg-white p-6 sm:p-8 shadow-lg w-full max-w-4xl mx-4 border border-gray-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Menu</h2>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-gray-600 hover:text-gray-800 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-label="Fermer le menu"
                                >
                                    <IoClose className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="space-y-6">
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    {NavbarMenu.map((menu) => (
                                        <li key={menu.id}>
                                            <a
                                                href={menu.path}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="block py-2 px-4 text-gray-700 hover:bg-gray-100 hover:text-blue-600 text-base sm:text-lg font-medium"
                                            >
                                                {menu.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                                <a
                                    href="/login"
                                    className="block w-full text-center py-3 px-4 bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Se connecter
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;