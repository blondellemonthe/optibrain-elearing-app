'use client'
import { useEffect, useState, useRef } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/app/lib/firebaseConfig'
import { useRouter } from 'next/navigation'
import {
    getAllFormations,
    getChapitresByFormation,
    getUser
} from '@/app/component/Services/FirestoreService'
import {
    createFormation,
    updateFormation,
    deleteFormation,
    createChapitre,
    updateChapitre,
    deleteChapitre
} from '@/app/component/Services/FirestoreAdminService'
import { motion, AnimatePresence } from 'framer-motion'
import {FaPlus, FaEdit, FaTrash, FaTimes, FaCheck, FaSpinner, FaBars} from 'react-icons/fa'
import Image from 'next/image'
// import Footer from "@/app/component/Footer/Footer";

const AdminFormations = () => {
    const [user, loading] = useAuthState(auth)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(true)
    const [formations, setFormations] = useState([])
    const [selectedFormation, setSelectedFormation] = useState(null)
    const [chapitres, setChapitres] = useState([])
    const [modalType, setModalType] = useState<'formation' | 'chapitre' | 'delete' | null>(null)
    const [modalData, setModalData] = useState<any>({})
    const [uploadStatus, setUploadStatus] = useState<string | null>(null)
    const router = useRouter()
    const sidebarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
            return
        }
        if (user) {
            const checkAdmin = async () => {
                const userData = await getUser(user.uid)
                if (!userData?.isAdmin) {
                    router.push('/')
                    return
                }
                setIsAdmin(true)
                const allFormations = await getAllFormations()
                setFormations(allFormations)
            }
            checkAdmin()
        }
    }, [user, loading, router])

    useEffect(() => {
        if (selectedFormation) {
            const fetchChapitres = async () => {
                const chapitresData = await getChapitresByFormation(selectedFormation.id)
                setChapitres(chapitresData.sort((a: {ordre:number}, b: {ordre:number}) => a.ordre - b.ordre))
            }
            fetchChapitres()
        }
    }, [selectedFormation])

    const openModal = (type: 'formation' | 'chapitre' | 'delete', data = {}) => {
        setModalType(type)
        setModalData(data)
        setUploadStatus(null)
    }

    const closeModal = () => {
        setModalType(null)
        setModalData({})
        setUploadStatus(null)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = e.target.files?.[0]
        if (file) {
            setModalData((prev: object) => ({ ...prev, [field]: file }))
            if (field === 'imageFile' || field === 'imageFondFile' || field === 'videoFile') {
                const previewUrl = URL.createObjectURL(file)
                setModalData((prev: object) => ({ ...prev, [`${field}Preview`]: previewUrl }))
            }
        }
    }

    const handleCreateFormation = async (e: React.FormEvent) => {
        e.preventDefault()
        setUploadStatus('Upload en cours...')
        try {
            const formationData = {
                titre: modalData.titre,
                description: modalData.description,
                imageFile: modalData.imageFile,
                imageFondFile: modalData.imageFondFile,
                duree: modalData.duree,
                niveau: modalData.niveau,
                dateCreation: new Date()
            }
            const formationId = await createFormation(formationData)
            setFormations([...formations, { id: formationId, ...formationData }])
            setUploadStatus('Formation créée avec succès')
            closeModal()
        } catch (error) {
            setUploadStatus(`Erreur: ${(error as Error).message}`)
        }
    }

    const handleUpdateFormation = async (e: React.FormEvent) => {
        e.preventDefault()
        setUploadStatus('Upload en cours...')
        try {
            const updateData = {
                titre: modalData.titre,
                description: modalData.description,
                imageFile: modalData.imageFile,
                imageFondFile: modalData.imageFondFile,
                duree: modalData.duree,
                niveau: modalData.niveau
            }
            await updateFormation(selectedFormation.id, updateData)
            setFormations(formations.map(f => f.id === selectedFormation.id ? { ...f, ...updateData } : f))
            setSelectedFormation({ ...selectedFormation, ...updateData })
            setUploadStatus('Formation mise à jour avec succès')
            closeModal()
        } catch (error) {
            setUploadStatus(`Erreur: ${(error as Error).message}`)
        }
    }

    const handleDeleteFormation = async () => {
        setUploadStatus('Suppression en cours...')
        try {
            await deleteFormation(selectedFormation.id)
            setFormations(formations.filter(f => f.id !== selectedFormation.id))
            setSelectedFormation(null)
            setChapitres([])
            setUploadStatus('Formation supprimée avec succès')
            closeModal()
        } catch (error) {
            setUploadStatus(`Erreur: ${(error as Error).message}`)
        }
    }

    const handleCreateChapitre = async (e: React.FormEvent) => {
        e.preventDefault()
        setUploadStatus('Upload en cours...')
        try {
            const chapitreData = {
                titre: modalData.titre,
                description: modalData.description,
                videoFile: modalData.videoFile,
                imageFondFile: modalData.imageFondFile,
                ordre: chapitres.length + 1,
                duree: modalData.duree,
                formationId: selectedFormation.id
            }
            const chapitreId = await createChapitre(chapitreData)
            setChapitres([...chapitres, { id: chapitreId, ...chapitreData }])
            setUploadStatus('Chapitre créé avec succès')
            closeModal()
        } catch (error) {
            setUploadStatus(`Erreur: ${(error as Error).message}`)
        }
    }

    const handleUpdateChapitre = async (e: React.FormEvent) => {
        e.preventDefault()
        setUploadStatus('Upload en cours...')
        try {
            const updateData = {
                titre: modalData.titre,
                description: modalData.description,
                videoFile: modalData.videoFile,
                imageFondFile: modalData.imageFondFile,
                ordre: modalData.ordre,
                duree: modalData.duree
            }
            await updateChapitre(modalData.id, updateData)
            setChapitres(chapitres.map(c => c.id === modalData.id ? { ...c, ...updateData } : c))
            setUploadStatus('Chapitre mis à jour avec succès')
            closeModal()
        } catch (error) {
            setUploadStatus(`Erreur: ${(error as Error).message}`)
        }
    }

    const handleDeleteChapitre = async () => {
        setUploadStatus('Suppression en cours...')
        try {
            await deleteChapitre(modalData.id)
            setChapitres(chapitres.filter(c => c.id !== modalData.id))
            setUploadStatus('Chapitre supprimé avec succès')
            closeModal()
        } catch (error) {
            setUploadStatus(`Erreur: ${(error as Error).message}`)
        }
    }

    if (loading || !isAdmin) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <p className="text-neutral text-lg">Chargement...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white shadow-md sticky top-0 z-20">
                <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 sm:gap-6">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Toggle menu"
                        >
                            <FaBars className="w-6 h-6 text-blue-600" />
                        </motion.button>
                        <h1 className="text-xl sm:text-2xl font-semibold text-blue-600">Plateforme de Formations</h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col lg:flex-row gap-6 sm:gap-8">
                {/* Sidebar */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.aside
                            ref={sidebarRef}
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                            className="fixed top-0 left-0 h-full w-64 sm:w-72 bg-white shadow-md z-30 lg:static lg:w-80 p-4 sm:p-6 overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Formations</h2>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 hover:bg-gray-100 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-label="Close menu"
                                >
                                    <FaTimes className="w-5 sm:w-6 h-5 sm:h-6" />
                                </button>
                            </div>
                            <button
                                onClick={() => openModal('formation', { titre: '', description: '', duree: '', niveau: '' })}
                                className="flex items-center w-full bg-blue-600 text-white py-2 sm:py-3 px-4 hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium"
                            >
                                <FaPlus className="mr-2 w-4 h-4" /> Nouvelle Formation
                            </button>
                            <ul className="space-y-3 mt-6">
                                {formations.map((formation) => (
                                    <motion.li
                                        key={formation.id}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className={`p-3 transition-colors ${
                                            selectedFormation?.id === formation.id
                                                ? 'bg-blue-600 text-white'
                                                : 'hover:bg-gray-100'
                                        }`}
                                    >
                                        <button
                                            onClick={() => setSelectedFormation(formation)}
                                            className="w-full text-left focus:outline-none font-medium"
                                            aria-label={`Sélectionner ${formation.titre}`}
                                        >
                                            {formation.titre}
                                        </button>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* Overlay */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black z-20 lg:hidden"
                        onClick={() => setIsMenuOpen(false)}
                        aria-hidden="true"
                    />
                )}

                {/* Content */}
                <section className="flex-1 bg-white shadow-md p-4 sm:p-6 lg:p-8">
                    {!selectedFormation ? (
                        <div className="text-center py-12 sm:py-16">
                            <p className="text-gray-600 text-base sm:text-lg font-medium">
                                Choisissez une formation pour voir les détails.
                            </p>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-6 sm:space-y-8"
                        >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{selectedFormation.titre}</h2>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => openModal('formation', selectedFormation)}
                                        className="flex items-center bg-blue-600 text-white py-2 px-4 hover:bg-blue-700 text-sm font-medium"
                                        aria-label="Modifier la formation"
                                    >
                                        <FaEdit className="mr-2 w-4 h-4" /> Modifier
                                    </button>
                                    <button
                                        onClick={() => openModal('delete', { type: 'formation', id: selectedFormation.id })}
                                        className="flex items-center bg-red-600 text-white py-2 px-4 hover:bg-blue-700 text-sm font-medium"
                                        aria-label="Supprimer la formation"
                                    >
                                        <FaTrash className="mr-2 w-4 h-4" /> Supprimer
                                    </button>
                                </div>
                            </div>
                            <div className="bg-gray-100 p-4 sm:p-6">
                                <p className="text-gray-700 mb-3"><strong>Description :</strong> {selectedFormation.description}</p>
                                <p className="text-gray-700 mb-3"><strong>Durée :</strong> {selectedFormation.duree}</p>
                                <p className="text-gray-700 mb-3"><strong>Niveau :</strong> {selectedFormation.niveau}</p>
                                {selectedFormation.imageFond && (
                                    <Image
                                        src={selectedFormation.imageFond}
                                        alt="Image de fond"
                                        width={600}
                                        height={250}
                                        className="w-full h-48 sm:h-56 object-cover mt-4"
                                    />
                                )}
                            </div>

                            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">Chapitres</h3>
                            {chapitres.length === 0 ? (
                                <p className="text-gray-600">Aucun chapitre disponible.</p>
                            ) : (
                                <div className="space-y-4">
                                    {chapitres.map((chapitre) => (
                                        <div
                                            key={chapitre.id}
                                            className="bg-gray-100 p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center transition-transform hover:scale-[1.01]"
                                        >
                                            <div>
                                                <h4 className="text-base sm:text-lg font-medium text-gray-800">{chapitre.titre}</h4>
                                                <p className="text-gray-600 text-sm mt-1">{chapitre.description}</p>
                                                <p className="text-gray-600 text-sm">Ordre: {chapitre.ordre} | Durée: {chapitre.duree}</p>
                                            </div>
                                            <div className="flex gap-3 mt-3 sm:mt-0">
                                                <button
                                                    onClick={() => openModal('chapitre', chapitre)}
                                                    className="text-blue-600 hover:text-blue-500"
                                                    aria-label={`Modifier ${chapitre.titre}`}
                                                >
                                                    <FaEdit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => openModal('delete', { type: 'chapitre', id: chapitre.id })}
                                                    className="text-red-600 hover:text-red-500"
                                                    aria-label={`Supprimer ${chapitre.titre}`}
                                                >
                                                    <FaTrash className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <button
                                onClick={() =>
                                    openModal('chapitre', {
                                        titre: '',
                                        description: '',
                                        duree: '',
                                        formationId: selectedFormation.id,
                                    })
                                }
                                className="flex items-center bg-blue-600 text-white py-2 px-4 hover:bg-blue-700 text-sm font-medium"
                                aria-label="Ajouter un chapitre"
                            >
                                <FaPlus className="mr-2 w-4 h-4" /> Ajouter un chapitre
                            </button>
                        </motion.div>
                    )}
                </section>
            </main>

            {/* Modals */}
            <AnimatePresence>
                {modalType && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            className="bg-white p-6 sm:p-8 shadow-lg w-full max-w-4xl mx-4 border border-gray-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                                    {modalType === 'formation' && (modalData.id ? 'Modifier Formation' : 'Ajouter Formation')}
                                    {modalType === 'chapitre' && (modalData.id ? 'Modifier Chapitre' : 'Ajouter Chapitre')}
                                    {modalType === 'delete' && 'Confirmer Suppression'}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-600 hover:text-gray-800 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-label="Close modal"
                                >
                                    <FaTimes className="w-5 h-5" />
                                </button>
                            </div>
                            {modalType === 'formation' && (
                                <form onSubmit={modalData.id ? handleUpdateFormation : handleCreateFormation} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                                            <input
                                                type="text"
                                                value={modalData.titre || ''}
                                                onChange={(e) => setModalData({ ...modalData, titre: e.target.value })}
                                                className="w-full p-3 bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Durée</label>
                                            <input
                                                type="text"
                                                value={modalData.duree || ''}
                                                onChange={(e) => setModalData({ ...modalData, duree: e.target.value })}
                                                className="w-full p-3 bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                                            <select
                                                value={modalData.niveau || ''}
                                                onChange={(e) => setModalData({ ...modalData, niveau: e.target.value })}
                                                className="w-full p-3 bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                                required
                                            >
                                                <option value="">Sélectionner</option>
                                                <option value="Débutant">Débutant</option>
                                                <option value="Intermédiaire">Intermédiaire</option>
                                                <option value="Avancé">Avancé</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png"
                                                onChange={(e) => handleFileChange(e, 'imageFile')}
                                                className="w-full p-3 bg-gray-50 border border-gray-300 text-gray-900"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Image de Fond</label>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png"
                                                onChange={(e) => handleFileChange(e, 'imageFondFile')}
                                                className="w-four p-3 bg-gray-50 border border-gray-300 text-gray-900"
                                            />
                                        </div>
                                        {(modalData.imageFilePreview || modalData.image) && (
                                            <div className="sm:col-span-1">
                                                <Image
                                                    src={modalData.imageFilePreview || modalData.image}
                                                    alt="Preview"
                                                    width={120}
                                                    height={120}
                                                    className="mt-3"
                                                />
                                            </div>
                                        )}
                                        {(modalData.imageFondFilePreview || modalData.imageFond) && (
                                            <div className="sm:col-span-1">
                                                <Image
                                                    src={modalData.imageFondFilePreview || modalData.imageFond}
                                                    alt="Preview"
                                                    width={120}
                                                    height={120}
                                                    className="mt-3"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            value={modalData.description || ''}
                                            onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
                                            className="w-full p-3 bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                            rows={3}
                                            required
                                        />
                                    </div>
                                    {uploadStatus && (
                                        <p
                                            className={`text-sm ${
                                                uploadStatus.includes('Erreur') ? 'text-red-600' : 'text-green-600'
                                            } flex items-center`}
                                        >
                                            {uploadStatus.includes('cours') && <FaSpinner className="animate-spin mr-2" />}
                                            {uploadStatus}
                                        </p>
                                    )}
                                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            className="py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 flex items-center font-medium"
                                        >
                                            <FaCheck className="mr-2" /> {modalData.id ? 'Mettre à jour' : 'Créer'}
                                        </button>
                                    </div>
                                </form>
                            )}
                            {modalType === 'chapitre' && (
                                <form onSubmit={modalData.id ? handleUpdateChapitre : handleCreateChapitre} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                                            <input
                                                type="text"
                                                value={modalData.titre || ''}
                                                onChange={(e) => setModalData({ ...modalData, titre: e.target.value })}
                                                className="w-full p-3 bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Durée</label>
                                            <input
                                                type="text"
                                                value={modalData.duree || ''}
                                                onChange={(e) => setModalData({ ...modalData, duree: e.target.value })}
                                                className="w-full p-3 bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Vidéo</label>
                                            <input
                                                type="file"
                                                accept="video/mp4,video/webm"
                                                onChange={(e) => handleFileChange(e, 'videoFile')}
                                                className="w-full p-3 bg-gray-50 border border-gray-300 text-gray-900"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Image de Fond</label>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png"
                                                onChange={(e) => handleFileChange(e, 'imageFondFile')}
                                                className="w-full p-3 bg-gray-50 border border-gray-300 text-gray-900"
                                            />
                                        </div>
                                        {(modalData.videoFilePreview || modalData.videoUrl) && (
                                            <div className="sm:col-span-1">
                                                <video
                                                    src={modalData.videoFilePreview || modalData.videoUrl}
                                                    controls
                                                    className="mt-3 w-32 h-32 object-cover"
                                                />
                                            </div>
                                        )}
                                        {(modalData.imageFondFilePreview || modalData.imageFond) && (
                                            <div className="sm:col-span-1">
                                                <Image
                                                    src={modalData.imageFondFilePreview || modalData.imageFond}
                                                    alt="Preview"
                                                    width={120}
                                                    height={120}
                                                    className="mt-3"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            value={modalData.description || ''}
                                            onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
                                            className="w-full p-3 bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                            rows={4}
                                            required
                                        />
                                    </div>
                                    {uploadStatus && (
                                        <p
                                            className={`text-sm ${
                                                uploadStatus.includes('Erreur') ? 'text-red-600' : 'text-green-600'
                                            } flex items-center`}
                                        >
                                            {uploadStatus.includes('cours') && <FaSpinner className="animate-spin mr-2" />}
                                            {uploadStatus}
                                        </p>
                                    )}
                                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            className="py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 flex items-center font-medium"
                                        >
                                            <FaCheck className="mr-2" /> {modalData.id ? 'Mettre à jour' : 'Créer'}
                                        </button>
                                    </div>
                                </form>
                            )}
                            {modalType === 'delete' && (
                                <div className="space-y-6">
                                    <p className="text-gray-700 text-base">
                                        Voulez-vous vraiment supprimer {modalData.type === 'formation' ? 'cette formation' : 'ce chapitre'} ?
                                    </p>
                                    {uploadStatus && (
                                        <p
                                            className={`text-sm ${
                                                uploadStatus.includes('Erreur') ? 'text-red-600' : 'text-green-600'
                                            } flex items-center`}
                                        >
                                            {uploadStatus.includes('cours') && <FaSpinner className="animate-spin mr-2" />}
                                            {uploadStatus}
                                        </p>
                                    )}
                                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                        <button
                                            onClick={closeModal}
                                            className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            onClick={modalData.type === 'formation' ? handleDeleteFormation : handleDeleteChapitre}
                                            className="py-2 px-4 bg-red-600 text-white hover:bg-red-700 flex items-center font-medium"
                                        >
                                            <FaTrash className="mr-2" /> Supprimer
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <footer className="bg-white py-4 text-center text-gray-600 border-t border-gray-200">
                <p>© 2025 Plateforme de Formations. Tous droits réservés.</p>
            </footer>
        </div>
    )
}

export default AdminFormations