"use client"
import { motion } from 'framer-motion'
import Image from 'next/image'

export const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay } },
})

const Hero: React.FC = () => {
    return (
        <section className="py-20 bg-gray-50">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <motion.div
            initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className="space-y-6"
    >
    <h1 className="text-4xl md:text-5xl font-bold leading-tight">
        Apprenez à maîtriser l&apos;ERP Brainopx
    </h1>
    <p className="text-lg text-gray-600">
        Rejoignez Optibrain pour une formation complète et interactive sur
    l&apos;utilisation de l&apos;ERP Brainopx.
    </p>
    <a
    href="https://chat.whatsapp.com/FQSKgJ5f1eIAhlyF5sVym0"
    className="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition"
        >
        Commencer maintenant
    </a>
    </motion.div>
    <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className="flex justify-center"
    >
    <Image
        src="/images/education.png"
    alt="Hero Image"
    width={500}
    height={500}
    className="w-[350px] md:max-w-[500px] object-cover"
        />
        </motion.div>
        </div>
        </section>
)
}

export default Hero