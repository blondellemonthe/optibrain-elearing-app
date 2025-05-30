import { Timestamp } from 'firebase/firestore'
import {
    createFormation,
    getFormation,
    getAllFormations,
    updateFormation,
    deleteFormation,
    createChapitre,
    getChapitre,
    getChapitresByFormation,
    updateChapitre,
    deleteChapitre,
    updateUser, getUser, createProgression,
} from './FirestoreService'

interface InscriptionData {
    formationId: string
    utilisateurId: string
}

export const sInscrireFormation = async ({ formationId, utilisateurId }: InscriptionData): Promise<void> => {
    try {
        const user = await getUser(utilisateurId)
        if (!user) throw new Error('Utilisateur non trouvé')

        // Vérifier si déjà inscrit
        if (user.formationsInscrites.some(f => f.formationId === formationId)) {
            throw new Error('Déjà inscrit à cette formation')
        }

        // Ajouter à formationsInscrites
        const updatedInscriptions = [
            ...user.formationsInscrites,
            { formationId, dateInscription: Timestamp.now() }
        ]

        // Retirer de formationsAbandonnées si présent
        const updatedAbandonnees = user.formationsAbandonnees.filter(
            f => f.formationId !== formationId
        )

        await updateUser(utilisateurId, {
            formationsInscrites: updatedInscriptions,
            formationsAbandonnees: updatedAbandonnees
        })

        // Créer une progression initiale
        await createProgression({
            utilisateurId,
            formationId,
            chapitresVus: [],
            dateInscription: Timestamp.now(),
            dateDerniereMiseAJour: Timestamp.now(),
            estTerminee: false
        })
    } catch (error) {
        throw new Error(`Erreur lors de l'inscription: ${(error as Error).message}`)
    }
}

export const abandonnerFormation = async ({ formationId, utilisateurId }: InscriptionData): Promise<void> => {
    try {
        const user = await getUser(utilisateurId)
        if (!user) throw new Error('Utilisateur non trouvé')

        // Vérifier si inscrit
        if (!user.formationsInscrites.some(f => f.formationId === formationId)) {
            throw new Error('Non inscrit à cette formation')
        }

        // Retirer de formationsInscrites
        const updatedInscriptions = user.formationsInscrites.filter(
            f => f.formationId !== formationId
        )

        // Ajouter à formationsAbandonnées
        const updatedAbandonnees = [
            ...user.formationsAbandonnees,
            { formationId, dateAbandon: Timestamp.now() }
        ]

        await updateUser(utilisateurId, {
            formationsInscrites: updatedInscriptions,
            formationsAbandonnees: updatedAbandonnees
        })
    } catch (error) {
        throw new Error(`Erreur lors de l'abandon: ${(error as Error).message}`)
    }
}

export const reprendreFormation = async ({ formationId, utilisateurId }: InscriptionData): Promise<void> => {
    try {
        const user = await getUser(utilisateurId)
        if (!user) throw new Error('Utilisateur non trouvé')

        // Vérifier si abandonnée
        if (!user.formationsAbandonnees.some(f => f.formationId === formationId)) {
            throw new Error('Formation non abandonnée')
        }

        // Ajouter à formationsInscrites
        const updatedInscriptions = [
            ...user.formationsInscrites,
            { formationId, dateInscription: Timestamp.now() }
        ]

        // Retirer de formationsAbandonnées
        const updatedAbandonnees = user.formationsAbandonnees.filter(
            f => f.formationId !== formationId
        )

        await updateUser(utilisateurId, {
            formationsInscrites: updatedInscriptions,
            formationsAbandonnees: updatedAbandonnees
        })
    } catch (error) {
        throw new Error(`Erreur lors de la reprise: ${(error as Error).message}`)
    }
}

// Réexporter les fonctions de FirestoreService pour commodité
export {
    createFormation,
    getFormation,
    getAllFormations,
    updateFormation,
    deleteFormation,
    createChapitre,
    getChapitre,
    getChapitresByFormation,
    updateChapitre,
    deleteChapitre,
}