'use client'
import { useEffect, useState, useRef } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/app/lib/firebaseConfig'
import { useRouter } from 'next/navigation'
import {
    getProgression,
    getAttestation,
} from '@/app/component/Services/FirestoreService'
import { marquerChapitreVu } from '@/app/component/Services/ProgressionService'
import { abandonnerFormation } from '@/app/component/Services/FormationService'
import { genererAttestation } from '@/app/component/Services/AttestationService'
import { setLoginTimestamp, checkSessionTimeout, clearSession } from '@/app/lib/sessionTimeout'
import { useUser } from '@/app/context/UserContext'
import { FaBars, FaTimes, FaCheckCircle, FaPlayCircle, FaLock, FaCertificate, FaCheck, FaClock, FaBookOpen, FaUndo, FaTimesCircle } from 'react-icons/fa'

const FormationDetailsClient = ({ formation, chapitres, id, error: initialError }) => {
    const [user] = useAuthState(auth)
    const { userData, loading: userLoading } = useUser()
    const [progression, setProgression] = useState(null)
    const [attestation, setAttestation] = useState(null)
    const [selectedChapitre, setSelectedChapitre] = useState(chapitres[0] || null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(initialError)
    const [modalOpen, setModalOpen] = useState(false)
    const router = useRouter()
    const sidebarRef = useRef<HTMLDivElement>(null)
    const chatRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleAuth = async () => {
            const isSessionExpired = await checkSessionTimeout()
            if (isSessionExpired || !user) {
                router.push('/login')
                return
            }

            if (user && !localStorage.getItem('loginTimestamp')) {
                setLoginTimestamp()
            }

            if (userData?.uid && !progression) {
                try {
                    setLoading(true)
                    const progressionData = await getProgression(userData.uid, id)
                    setProgression(progressionData)

                    const attestationData = await getAttestation(`${userData.uid}_${id}`)
                    setAttestation(attestationData)
                } catch (err) {
                    setError('Erreur lors du chargement des données utilisateur.')
                    console.error(err)
                } finally {
                    setLoading(false)
                }
            }
        }

        handleAuth()
    }, [user, id, router, userData?.uid, progression])

    useEffect(() => {
        if (selectedChapitre && sidebarRef.current) {
            const selectedElement = sidebarRef.current.querySelector(`[data-chapter-id="${selectedChapitre.id}"]`)
            if (selectedElement) {
                selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
            }
        }
    }, [selectedChapitre])

    const handleMarquerVu = async (chapitreId: string) => {
        try {
            if (userData?.uid) {
                await marquerChapitreVu(userData.uid, id, chapitreId)
                setProgression({
                    ...progression,
                    chapitresVus: [...(progression?.chapitresVus || []), chapitreId]
                })
                const currentIndex = chapitres.findIndex(c => c.id === chapitreId)
                if (currentIndex < chapitres.length - 1) {
                    setSelectedChapitre(chapitres[currentIndex + 1])
                    setIsMenuOpen(false)
                }
            }
        } catch (err) {
            setError('Erreur lors de la mise à jour de la progression.')
            console.log(err)
        }
    }

    const handleAbandonner = async () => {
        try {
            if (userData?.uid) {
                await abandonnerFormation({ utilisateurId: userData.uid, formationId: id })
                clearSession()
                router.push('/dashboard')
            }
        } catch (err) {
            console.log(err)
            setError('Erreur lors de l’abandon.')
        }
    }

    const handleGenererAttestation = async () => {
        try {
            if (userData?.uid) {
                const attestationId = await genererAttestation(userData.uid, id)
                const newAttestation = await getAttestation(attestationId)
                setAttestation(newAttestation)
                setModalOpen(false)
            }
        } catch (err) {
            setError('Erreur lors de la génération du certificat.')
            console.log(err)
        }
    }

    const handleResetProgress = async () => {
        try {
            setProgression({ ...progression, chapitresVus: [] })
            setSelectedChapitre(chapitres[0])
            setAttestation(null)
        } catch (err) {
            setError('Erreur lors de la réinitialisation.')
            console.log(err)
        }
    }

    if (loading || userLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="flex items-center space-x-2 text-gray-600 text-lg font-medium">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-500">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
                    </svg>
                    <span>Chargement...</span>
                </div>
            </div>
        )
    }

    if (error || !formation) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-6 text-center">
                    <p className="text-red-500 mb-4">{error || 'Formation non trouvée.'}</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600"
                    >
                        Retour
                    </button>
                </div>
            </div>
        )
    }

    const completionPercentage = progression?.chapitresVus
        ? (progression.chapitresVus.length / chapitres.length) * 100
        : 0

    const formationDuration = formation.dureeTotale || 'N/A'
    const instructor = formation.instructeur || 'Instructeur inconnu'
    const startDate = formation.dateDebut || 'N/A'

    return (
        <div
            className="min-h-screen bg-gray-100 text-gray-800 flex flex-col font-sans"
            style={{
                backgroundImage: formation.imageFond ? `url(${formation.imageFond})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="absolute inset-0 bg-white bg-opacity-80"></div>

            <header className="relative bg-transparent p-4">
                <div className="container mx-auto px-6">
                    <h1 className="text-2xl font-bold text-blue-600 mb-2">{formation.titre}</h1>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Progression : {Math.round(completionPercentage)}% complété</p>
                            <p className="text-sm text-gray-600">Durée totale : {formationDuration}</p>
                            <p className="text-sm text-gray-600">Instructeur : {instructor}</p>
                            <p className="text-sm text-gray-600">Date de début : {startDate}</p>
                            {userData && (
                                <p className="text-sm text-gray-600">Utilisateur : {userData.displayName || userData.email}</p>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative flex-grow container mx-auto px-6 py-8 flex flex-col lg:flex-row gap-6">
                <aside
                    ref={sidebarRef}
                    className={`w-72 lg:w-64 p-6 bg-white shadow-sm z-30 ${isMenuOpen ? 'block' : 'hidden lg:block'}`}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-blue-600">Chapitres</h2>
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="lg:hidden p-2 hover:bg-gray-100 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Close menu"
                        >
                            <FaTimes className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="mb-6">
                        <div className="relative w-full bg-gray-200 h-2 overflow-hidden">
                            <div
                                className="bg-blue-400 h-full"
                                style={{ width: `${completionPercentage}%` }}
                            />
                        </div>
                        <p className="text-sm text-gray-600 mt-2 font-medium text-center">
                            {Math.round(completionPercentage)}% complété
                        </p>
                    </div>
                    <ul className="space-y-2 flex-1">
                        {chapitres.map((chapitre) => {
                            const isVu = progression?.chapitresVus?.includes(chapitre.id)
                            const isSelected = selectedChapitre?.id === chapitre.id
                            return (
                                <li
                                    key={chapitre.id}
                                    data-chapter-id={chapitre.id}
                                    className={`p-3 ${isSelected ? 'bg-blue-50 text-blue-800' : 'hover:bg-gray-100'}`}
                                >
                                    <button
                                        onClick={() => {
                                            setSelectedChapitre(chapitre)
                                            setIsMenuOpen(false)
                                        }}
                                        className="w-full flex items-center text-left focus:outline-none font-medium"
                                        aria-current={isSelected ? 'true' : 'false'}
                                        aria-label={`Chapitre: ${chapitre.titre}`}
                                    >
                                        <span className="mr-3 flex-shrink-0">
                                            {isVu ? (
                                                <FaCheckCircle className="text-green-500 w-5 h-5" />
                                            ) : isSelected ? (
                                                <FaPlayCircle className="text-blue-500 w-5 h-5" />
                                            ) : (
                                                <FaLock className="text-gray-400 w-5 h-5" />
                                            )}
                                        </span>
                                        <span className="flex-1 text-sm truncate">{chapitre.titre}</span>
                                        <span className="text-xs text-gray-600">{chapitre.duree}</span>
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                    <button
                        onClick={() => setModalOpen(true)}
                        disabled={!progression?.estTerminee}
                        className={`mt-6 flex items-center w-full py-3 px-4 text-sm font-medium ${
                            progression?.estTerminee
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                        aria-label={progression?.estTerminee ? 'Obtenir le certificat' : 'Certificat verrouillé'}
                    >
                        <FaCertificate className="mr-2 w-5 h-5" />
                        {progression?.estTerminee ? 'Obtenir le certificat' : 'Certificat verrouillé'}
                    </button>
                </aside>

                {isMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                        onClick={() => setIsMenuOpen(false)}
                        aria-hidden="true"
                    />
                )}

                <section className={`flex-1 bg-white shadow-sm p-6 ${isChatOpen ? 'lg:w-1/2' : 'lg:w-3/4'}`}>
                    {selectedChapitre ? (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-blue-600">{selectedChapitre.titre}</h2>
                            <div className="relative w-full aspect-video bg-gray-50">
                                {selectedChapitre.videoUrl ? (
                                    <video
                                        src={selectedChapitre.videoUrl}
                                        controls
                                        className="w-full h-full object-contain"
                                        poster={selectedChapitre.thumbnailUrl || ''}
                                        preload="metadata"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                                        <FaBookOpen className="w-10 h-10 mb-2" />
                                        <p className="text-base font-medium">Aucun média disponible</p>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-3 text-gray-700">
                                {selectedChapitre.description.split('\n').map((paragraph: string, i: number) => (
                                    <p key={i} className="text-base leading-relaxed">{paragraph}</p>
                                ))}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <FaClock className="mr-2 w-4 h-4" />
                                <span>Durée : {selectedChapitre.duree}</span>
                            </div>
                            {!progression?.chapitresVus?.includes(selectedChapitre.id) && (
                                <button
                                    onClick={() => handleMarquerVu(selectedChapitre.id)}
                                    className="flex items-center w-full sm:w-auto bg-blue-500 text-white py-2 px-4 hover:bg-blue-600 text-sm font-medium"
                                    aria-label="Marquer comme terminé"
                                >
                                    <FaCheck className="mr-2 w-4 h-4" />
                                    <span>Marquer comme terminé</span>
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-gray-600 text-lg font-medium">
                                Choisissez un chapitre pour commencer.
                            </p>
                            <button
                                onClick={() => setIsMenuOpen(true)}
                                className="mt-4 flex items-center mx-auto bg-blue-500 text-white py-2 px-4 hover:bg-blue-600 text-sm font-medium lg:hidden"
                                aria-label="Ouvrir la liste des chapitres"
                            >
                                <FaBars className="mr-2 w-4 h-4" />
                                <span>Voir les chapitres</span>
                            </button>
                        </div>
                    )}
                </section>

                <aside
                    ref={chatRef}
                    className={`w-72 lg:w-64 p-6 bg-white shadow-sm z-30 ${isChatOpen ? 'block' : 'hidden lg:block'}`}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-blue-600">Chat</h2>
                        <button
                            onClick={() => setIsChatOpen(false)}
                            className="p-2 hover:bg-gray-100 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Close chat"
                        >
                            <FaTimes className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <p className="text-gray-700">Bienvenue dans le chat !</p>
                        <p className="text-gray-700">Posez vos questions ici.</p>
                        <textarea
                            className="w-full p-3 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500"
                            rows={4}
                            placeholder="Tapez votre message..."
                        />
                        <button className="w-full bg-blue-500 text-white py-2 px-4 hover:bg-blue-600 text-sm font-medium">
                            Envoyer
                        </button>
                    </div>
                </aside>
            </main>

            <footer className="relative bg-gray-50 p-4 text-center text-gray-600">
                <div className="container mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p>© 2025 Plateforme de Formations. Tous droits réservés.</p>
                    <div className="flex gap-3">
                        <button
                            onClick={handleResetProgress}
                            className="flex items-center bg-gray-200 text-gray-700 py-2 px-3 hover:bg-gray-300 text-sm font-medium"
                            aria-label="Réinitialiser la progression"
                        >
                            <FaUndo className="mr-2 w-4 h-4" /> Réinitialiser
                        </button>
                        <button
                            onClick={handleAbandonner}
                            className="flex items-center bg-red-500 text-white py-2 px-3 hover:bg-red-600 text-sm font-medium"
                            aria-label="Abandonner la formation"
                        >
                            <FaTimesCircle className="mr-2 w-4 h-4" /> Abandonner
                        </button>
                    </div>
                </div>
            </footer>

            {modalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
                    onClick={() => setModalOpen(false)}
                >
                    <div
                        className="bg-white p-8 w-full max-w-lg mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-blue-600">Obtenir le Certificat</h2>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-gray-600 hover:text-gray-800 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="Close modal"
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-5">
                            <p className="text-gray-700">
                                Félicitations pour avoir terminé la formation ! Voulez-vous générer votre certificat ?
                            </p>
                            {attestation ? (
                                <a
                                    href={attestation.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-center bg-blue-500 text-white py-2 px-4 hover:bg-blue-600 text-sm font-medium"
                                    aria-label="Télécharger le certificat"
                                >
                                    Télécharger le certificat
                                </a>
                            ) : (
                                <button
                                    onClick={handleGenererAttestation}
                                    className="w-full bg-blue-500 text-white py-2 px-4 hover:bg-blue-600 text-sm font-medium flex items-center justify-center"
                                    aria-label="Générer le certificat"
                                >
                                    <FaCertificate className="mr-2 w-4 h-4" />
                                    Générer le certificat
                                </button>
                            )}
                            {error && (
                                <p className="text-sm text-red-500 flex items-center">
                                    {error}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FormationDetailsClient