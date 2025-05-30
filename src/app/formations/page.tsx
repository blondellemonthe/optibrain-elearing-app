'use client'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/app/lib/firebaseConfig'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaPlus } from 'react-icons/fa'
import { Formation, getAllFormations } from "@/app/component/Services/FirestoreService"
import { sInscrireFormation } from "@/app/component/Services/FormationService"
import Banner from "@/app/component/Banner/Banner"
import FormationCard from "@/app/component/Formation/FormationCard"
import Footer from "@/app/component/Footer/Footer"
import { useUser } from '@/app/context/UserContext'

const Formations = () => {
    const [user] = useAuthState(auth)
    const { userData, loading: userLoading } = useUser()
    const [formations, setFormations] = useState<Formation[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if (!user && !userLoading) {
            router.push('/login')
            return
        }

        const fetchFormations = async () => {
            try {
                const allFormations = await getAllFormations()
                setFormations(allFormations)
                setLoading(false)
            } catch (error) {
                console.error('Erreur:', error)
                setLoading(false)
            }
        }
        fetchFormations()
    }, [user, userLoading, router])

    const handleInscription = async (formationId: string) => {
        if (!user || !userData?.uid) {
            router.push('/login')
            return
        }
        try {
            await sInscrireFormation({ utilisateurId: userData.uid, formationId })
            router.push('/dashboard')
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error)
        }
    }

    if (loading || userLoading) {
        return <div className="text-center mt-10">Chargement...</div>
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* User Info Section */}
            {userData && (
                <div className="mb-6 bg-white shadow-sm p-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Bienvenue, {userData.displayName || userData.email || 'Utilisateur'}
                    </h2>
                    <p className="text-sm text-gray-600">Explorez nos formations ci-dessous.</p>
                </div>
            )}
            <Banner />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto p-6"
            >


                <h1 className="text-3xl font-bold text-primary mb-6">Formations disponibles</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {formations.length === 0 && (
                        <p className="text-gray-600">Aucune formation disponible.</p>
                    )}
                    {formations.map((formation) => (
                        <FormationCard
                            key={formation.id}
                            formation={formation}
                            onAction={() => handleInscription(formation.id)}
                            actionLabel="S'inscrire"
                            actionIcon={<FaPlus />}
                        />
                    ))}
                </div>
            </motion.div>
            <Footer />
        </div>
    )
}

export default Formations