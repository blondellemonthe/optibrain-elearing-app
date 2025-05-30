"use client"
import { motion } from 'framer-motion'
import Image from 'next/image'
import { FaBookReader } from 'react-icons/fa'
import { GrUserExpert } from 'react-icons/gr'
import { MdOutlineAccessTime } from 'react-icons/md'

const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay } },
})

const Banner: React.FC = () => {
    return (
        <section>
            <div className="container mx-auto py-14 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-8 space-y-6 md:space-y-0">
                {/* Banner Image */}
                <div className="flex justify-center items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                    >
                        <Image
                            src="/images/education.png"
                            alt="Education Banner"
                            width={450}
                            height={450}
                            className="w-[350px] md:max-w-[450px] object-cover drop-shadow"
                        />
                    </motion.div>
                </div>
                {/* Banner Text */}
                <div className="flex flex-col justify-center">
                    <div className="text-center md:text-left space-y-12">
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="text-3xl md:text-4xl font-bold leading-snug"
                        >
                            La plateforme d&apos;apprentissage en ligne leader mondial
                        </motion.h1>
                        <div className="flex flex-col gap-6">
                            <motion.div
                                variants={fadeUp(0.2)}
                                initial="initial"
                                whileInView="animate"
                                viewport={{ once: true }}
                                className="flex items-center gap-4 p-6 bg-gray-100 rounded-2xl hover:bg-white transition duration-300 hover:shadow-2xl"
                            >
                                <FaBookReader className="text-2xl" />
                                <p className="text-lg">Plus de 10 000 cours</p>
                            </motion.div>
                            <motion.div
                                variants={fadeUp(0.4)}
                                initial="initial"
                                whileInView="animate"
                                viewport={{ once: true }}
                                className="flex items-center gap-4 p-6 bg-gray-100 rounded-2xl hover:bg-white transition duration-300 hover:shadow-2xl"
                            >
                                <GrUserExpert className="text-2xl" />
                                <p className="text-lg">Instruction experte</p>
                            </motion.div>
                            <motion.div
                                variants={fadeUp(0.6)}
                                initial="initial"
                                whileInView="animate"
                                viewport={{ once: true }}
                                className="flex items-center gap-4 p-6 bg-gray-100 rounded-2xl hover:bg-white transition duration-300 hover:shadow-2xl"
                            >
                                <MdOutlineAccessTime className="text-2xl" />
                                <p className="text-lg">Accès à vie</p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Banner