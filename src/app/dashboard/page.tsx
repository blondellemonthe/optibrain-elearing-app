'use client'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/app/lib/firebaseConfig'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaCertificate, FaRedo } from 'react-icons/fa'
import {
    Attestation,
    getAllFormations,
    getAttestationsByUser,
    getUser,
} from "@/app/component/Services/FirestoreService";
import {getProgressionPourcentage} from "@/app/component/Services/ProgressionService";
import {abandonnerFormation, reprendreFormation} from "@/app/component/Services/FormationService";
import FormationCard from "@/app/component/Formation/FormationCard";
// import Footer from "@/app/component/Footer/Footer";
import {Timestamp} from "firebase/firestore";
// import NavBar from "@/app/component/NavBar/NavBar";

const Dashboard = () => {
    const [user, loading] = useAuthState(auth)
    const [userData, setUserData] = useState(null)
    const [formations, setFormations] = useState([])
    const [progressions, setProgressions] = useState<{ [key: string]: number }>({})
    const [attestations, setAttestations] = useState<Attestation[]>([])
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
            return
        }
        if (user) {
            const fetchData = async () => {
                try {
                    const userDoc = await getUser(user.uid)
                    setUserData(userDoc)

                    const allFormations = await getAllFormations()
                    setFormations(allFormations)

                    const progressionData: { [key: string]: number } = {}
                    for (const f of userDoc?.formationsInscrites || []) {
                        const percentage = await getProgressionPourcentage(user.uid, f.formationId)
                        progressionData[f.formationId] = percentage
                    }
                    setProgressions(progressionData)

                    const userAttestations = await getAttestationsByUser(user.uid)
                    setAttestations(userAttestations)
                } catch (error) {
                    console.error('Erreur:', error)
                }
            }
            fetchData()
        }
    }, [user, loading, router])

    const handleReprendre = async (formationId: string) => {
        try {
            await reprendreFormation({ utilisateurId: user!.uid, formationId })
            setUserData({
                ...userData,
                formationsInscrites: [...userData.formationsInscrites, { formationId, dateInscription: new Date() }],
                formationsAbandonnees: userData.formationsAbandonnees.filter((f: {formationId: string}) => f.formationId !== formationId)
            })
        } catch (error) {
            console.error('Erreur lors de la reprise:', error)
        }
    }

    const handleAbandonner = async (formationId: string) => {
        try {
            await abandonnerFormation({ utilisateurId: user!.uid, formationId })
            setUserData({
                ...userData,
                formationsInscrites: userData.formationsInscrites.filter((f:{formationId: string}) => f.formationId !== formationId),
                formationsAbandonnees: [...userData.formationsAbandonnees, { formationId, dateAbandon: new Date() }]
            })
        } catch (error) {
            console.error('Erreur lors de l\'abandon:', error)
        }
    }

    if (loading || !userData) return <div className="text-center mt-10">Chargement...</div>

    return (
        <div className="min-h-screen bg-gray-100">
            {/*<NavBar />*/}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto p-6"
            >
                <h1 className="text-3xl font-bold text-primary mb-6">Tableau de bord</h1>

                {/* Formations inscrites */}
                <h2 className="text-2xl font-semibold text-dark2 mb-4">Formations en cours</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {userData.formationsInscrites.length === 0 && (
                        <p className="text-gray-600">Aucune formation en cours.</p>
                    )}
                    {userData.formationsInscrites.map((f: { formationId: string; dateInscription: Timestamp }) => {
                        const formation = formations.find(form => form.id === f.formationId)
                        if (!formation) return null
                        return (
                            <FormationCard
                                key={f.formationId}
                                formation={formation}
                                progression={progressions[f.formationId] || 0}
                                onAction={() => handleAbandonner(f.formationId)}
                                actionLabel="Abandonner"
                                actionIcon={<FaRedo />}
                            />
                        )
                    })}
                </div>

                {/* Formations abandonnées */}
                <h2 className="text-2xl font-semibold text-dark2 mb-4">Formations abandonnées</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {userData.formationsAbandonnees.length === 0 && (
                        <p className="text-gray-600">Aucune formation abandonnée.</p>
                    )}
                    {userData.formationsAbandonnees.map((f: { formationId: string; dateAbandon: Timestamp }) => {
                        const formation = formations.find(form => form.id === f.formationId)
                        if (!formation) return null
                        return (
                            <FormationCard
                                key={f.formationId}
                                formation={formation}
                                progression={progressions[f.formationId] || 0}
                                onAction={() => handleReprendre(f.formationId)}
                                actionLabel="Reprendre"
                                actionIcon={<FaRedo />}
                            />
                        )
                    })}
                </div>

                {/* Attestations */}
                <h2 className="text-2xl font-semibold text-dark2 mb-4">Attestations</h2>
                {attestations.length === 0 && (
                    <p className="text-gray-600">Aucune attestation disponible.</p>
                )}
                <div className="space-y-4">
                    {attestations.map((attestation) => (
                        <div key={attestation.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                            <div className="flex items-center">
                                <FaCertificate className="text-primary text-xl mr-2" />
                                <span>{formations.find(f => f.id === attestation.formationId)?.titre || 'Formation inconnue'}</span>
                            </div>
                            <a
                                href={attestation.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-secondary hover:underline"
                            >
                                Télécharger
                            </a>
                        </div>
                    ))}
                </div>
            </motion.div>
            {/*<Footer />*/}
        </div>
    )
}

export default Dashboard