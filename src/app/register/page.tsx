"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {registerUser} from "@/app/component/Auth/AuthService";

const Register: React.FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const router = useRouter()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.')
            return
        }
        try {
            await registerUser(email, password, '')
            setSuccess('Inscription réussie ! Veuillez vérifier votre e-mail pour activer votre compte.')
            setEmail('')
            setPassword('')
            setConfirmPassword('')
            setTimeout(() => router.push('/login'), 3000)
        } catch (err) {
            setError((err as Error).message)
        }
    }

    return (
        <section className="py-14 md:py-24 bg-[#f4f4f4]">
            <div className="container mx-auto max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-center">
                        Inscription
                    </h1>
                    {error && (
                        <p className="text-red-500 text-center">{error}</p>
                    )}
                    {success && (
                        <p className="text-green-500 text-center">{success}</p>
                    )}
                    <div className="flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-2xl">
                        <div className="space-y-4">
                            <input
                                type="email"
                                placeholder="Votre e-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="p-3 rounded-xl bg-gray-100 w-full focus:ring-0 focus:outline-none placeholder:text-dark2"
                            />
                            <input
                                type="password"
                                placeholder="Votre mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="p-3 rounded-xl bg-gray-100 w-full focus:ring-0 focus:outline-none placeholder:text-dark2"
                            />
                            <input
                                type="password"
                                placeholder="Confirmez votre mot de passe"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="p-3 rounded-xl bg-gray-100 w-full focus:ring-0 focus:outline-none placeholder:text-dark2"
                            />
                            <button
                                onClick={handleRegister}
                                className="bg-primary text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 transition"
                            >
                                S&apos;inscrire
                            </button>
                        </div>
                        <p className="text-center text-dark2">
                            Déjà un compte ?{' '}
                            <Link href="/login" className="text-primary hover:text-secondary">
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default Register