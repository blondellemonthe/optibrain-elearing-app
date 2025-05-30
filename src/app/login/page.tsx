'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/app/lib/firebaseConfig'
import { setLoginTimestamp } from '@/app/lib/sessionTimeout'
import { loginWithGoogle } from '@/app/component/Auth/AuthService'
import { FaGoogle } from 'react-icons/fa'
import Link from 'next/link'
import { useUser } from '@/app/context/UserContext'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const { setUserData } = useUser()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user
            setUserData({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
            })
            setLoginTimestamp() // Set the login timestamp on successful login
            router.push('/dashboard')
        } catch (err) {
            setError('Erreur lors de la connexion. Vérifiez vos identifiants.')
            console.log(err)
        }
    }

    const handleGoogleLogin = async () => {
        try {
            const userCredential = await loginWithGoogle()
            const user = userCredential
            setUserData({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
            })
            setLoginTimestamp()
            router.push('/dashboard')
        } catch (err) {
            setError((err as Error).message)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 shadow-sm w-full max-w-md">
                <h1 className="text-2xl font-bold text-blue-600 mb-6">Connexion</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div className="flex justify-between gap-2">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 hover:bg-blue-600 text-sm font-medium"
                        >
                            Se connecter
                        </button>
                        <Link
                            href="/register"
                            className="w-full bg-green-500 text-white py-2 px-4 hover:bg-green-600 text-sm font-medium text-center"
                        >
                            Créer un compte
                        </Link>
                    </div>
                    <button
                        onClick={handleGoogleLogin}
                        className="flex items-center justify-center gap-2 bg-white text-gray-800 font-semibold py-3 px-6 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
                    >
                        <FaGoogle />
                        Utiliser Google
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login