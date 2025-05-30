"use client"
import { motion } from 'framer-motion'

const Services: React.FC = () => {
    return (
        <section className="py-20">
            <div className="container mx-auto text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl md:text-4xl font-bold mb-12"
                >
                    Nos Services
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="p-6 bg-gray-100 rounded-2xl hover:bg-white hover:shadow-2xl transition"
                    >
                        <h3 className="text-xl font-semibold mb-4">Cours interactifs</h3>
                        <p className="text-gray-600">
                            Apprenez à votre rythme avec des cours interactifs et structurés.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="p-6 bg-gray-100 rounded-2xl hover:bg-white hover:shadow-2xl transition"
                    >
                        <h3 className="text-xl font-semibold mb-4">Support expert</h3>
                        <p className="text-gray-600">
                            Bénéficiez de l&apos;accompagnement de nos instructeurs experts.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="p-6 bg-gray-100 rounded-2xl hover:bg-white hover:shadow-2xl transition"
                    >
                        <h3 className="text-xl font-semibold mb-4">Certifications</h3>
                        <p className="text-gray-600">
                            Obtenez des certifications reconnues pour valider vos compétences.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Services