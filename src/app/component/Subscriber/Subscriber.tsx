"use client"
import { motion } from 'framer-motion'

const Subscribe: React.FC = () => {
    return (
        <section className="py-20 bg-blue-50">
            <div className="container mx-auto text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl md:text-4xl font-bold mb-8"
                >
                    Inscrivez-vous à notre newsletter
                </motion.h2>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex justify-center"
                >
                    <div className="flex items-center max-w-md w-full">
                        <input
                            type="email"
                            placeholder="Entrez votre email"
                            className="p-3 rounded-l-xl bg-white w-full py-4 focus:ring-0 focus:outline-none placeholder:text-gray-600"
                        />
                        <button className="bg-blue-600 text-white font-semibold py-4 px-6 rounded-r-xl">
                            S&apos;inscrire
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default Subscribe