"use client"
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const Banner2: React.FC = () => {
    return (
        <section>
            <div className="container mx-auto py-14 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-8 space-y-6 md:space-y-0">
                {/* Banner Text */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="flex flex-col justify-center"
                >
                    <div className="text-center md:text-left space-y-4 lg:max-w-[450px]">
                        <h1 className="text-4xl font-bold leading-snug">
                            Rejoignez notre communauté pour commencer votre aventure
                        </h1>
                        <p className="text-gray-600">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae
                            iusto minima ad ut id eos accusantium aut, aperiam quis incidunt!
                        </p>
                        <Link
                            href="https://chat.whatsapp.com/FQSKgJ5f1eIAhlyF5sVym0"
                            className="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg mt-8 hover:bg-blue-700 transition"
                        >
                            Rejoindre maintenant
                        </Link>
                    </div>
                </motion.div>
                {/* Banner Image */}
                <div className="flex justify-center items-center">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                    >
                        <Image
                            src="/images/banner.png"
                            alt="Banner"
                            width={450}
                            height={450}
                            className="w-[350px] md:max-w-[450px] object-cover drop-shadow"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Banner2