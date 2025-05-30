import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    Timestamp,
} from 'firebase/firestore'
import {db} from "@/app/lib/firebaseConfig";

export interface User {
    // isAdmin: any;
    isAdmin?: boolean;
    email: string
    nom: string
    formationsInscrites: { formationId: string; dateInscription: Timestamp }[]
    formationsAbandonnees: { formationId: string; dateAbandon: Timestamp }[]
}

export interface Formation {
    id: string
    titre: string
    description: string
    image: string
    imageFond: string
    duree: string
    niveau: 'Débutant' | 'Intermédiaire' | 'Avancé'
    chapitres: string[]
    dateCreation: Timestamp
}

export interface Chapitre {
    id: string
    titre: string
    description: string
    videoUrl: string
    imageFond: string
    ordre: number
    duree: string
    formationId: string
}

export interface Progression {
    id: string
    utilisateurId: string
    formationId: string
    chapitresVus: string[]
    dateInscription: Timestamp
    dateDerniereMiseAJour: Timestamp
    estTerminee: boolean
}

export interface Attestation {
    id: string
    utilisateurId: string
    formationId: string
    dateEmission: Timestamp
    pdfUrl: string
}

// Utilisateur
export const createUser = async (uid: string, data: Partial<User>): Promise<void> => {
    try {
        await setDoc(doc(db, 'users', uid), {
            email: data.email || '',
            nom: data.nom || '',
            formationsInscrites: data.formationsInscrites || [],
            formationsAbandonnees: data.formationsAbandonnees || [],
        })
    } catch (error) {
        throw new Error(`Erreur lors de la création de l'utilisateur: ${(error as Error).message}`)
    }
}

export const getUser = async (uid: string): Promise<User | null> => {
    try {
        const docSnap = await getDoc(doc(db, 'users', uid))
        if (docSnap.exists()) {
            return {...docSnap.data(), id: docSnap.id, isAdmin:true} as unknown as User
        }
        return null
    } catch (error) {
        throw new Error(`Erreur lors de la récupération de l'utilisateur: ${(error as Error).message}`)
    }
}

export const updateUser = async (uid: string, data: Partial<User>): Promise<void> => {
    try {
        await updateDoc(doc(db, 'users', uid), data)
    } catch (error) {
        throw new Error(`Erreur lors de la mise à jour de l'utilisateur: ${(error as Error).message}`)
    }
}

// Formation
export const createFormation = async (data: Omit<Formation, 'id'>): Promise<string> => {
    try {
        const docRef = doc(collection(db, 'formations'))
        await setDoc(docRef, { ...data, id: docRef.id })
        return docRef.id
    } catch (error) {
        throw new Error(`Erreur lors de la création de la formation: ${(error as Error).message}`)
    }
}

export const getFormation = async (id: string): Promise<Formation | null> => {
    try {
        const docSnap = await getDoc(doc(db, 'formations', id))
        if (docSnap.exists()) {
            return { ...docSnap.data(), id: docSnap.id } as Formation
        }
        return null
    } catch (error) {
        throw new Error(`Erreur lors de la récupération de la formation: ${(error as Error).message}`)
    }
}

export const getAllFormations = async (): Promise<Formation[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, 'formations'))
        return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Formation))
    } catch (error) {
        throw new Error(`Erreur lors de la récupération des formations: ${(error as Error).message}`)
    }
}

export const updateFormation = async (id: string, data: Partial<Formation>): Promise<void> => {
    try {
        await updateDoc(doc(db, 'formations', id), data)
    } catch (error) {
        throw new Error(`Erreur lors de la mise à jour de la formation: ${(error as Error).message}`)
    }
}

export const deleteFormation = async (id: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, 'formations', id))
    } catch (error) {
        throw new Error(`Erreur lors de la suppression de la formation: ${(error as Error).message}`)
    }
}

// Chapitre
export const createChapitre = async (data: Omit<Chapitre, 'id'>): Promise<string> => {
    try {
        const docRef = doc(collection(db, 'chapitres'))
        await setDoc(docRef, { ...data, id: docRef.id })
        return docRef.id
    } catch (error) {
        throw new Error(`Erreur lors de la création du chapitre: ${(error as Error).message}`)
    }
}

export const getChapitre = async (id: string): Promise<Chapitre | null> => {
    try {
        const docSnap = await getDoc(doc(db, 'chapitres', id))
        if (docSnap.exists()) {
            return { ...docSnap.data(), id: docSnap.id } as Chapitre
        }
        return null
    } catch (error) {
        throw new Error(`Erreur lors de la récupération du chapitre: ${(error as Error).message}`)
    }
}

export const getChapitresByFormation = async (formationId: string): Promise<Chapitre[]> => {
    try {
        const q = query(collection(db, 'chapitres'), where('formationId', '==', formationId))
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs
            .map((doc) => ({ ...doc.data(), id: doc.id } as Chapitre))
            .sort((a, b) => a.ordre - b.ordre)
    } catch (error) {
        throw new Error(`Erreur lors de la récupération des chapitres: ${(error as Error).message}`)
    }
}

export const updateChapitre = async (id: string, data: Partial<Chapitre>): Promise<void> => {
    try {
        await updateDoc(doc(db, 'chapitres', id), data)
    } catch (error) {
        throw new Error(`Erreur lors de la mise à jour du chapitre: ${(error as Error).message}`)
    }
}

export const deleteChapitre = async (id: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, 'chapitres', id))
    } catch (error) {
        throw new Error(`Erreur lors de la suppression du chapitre: ${(error as Error).message}`)
    }
}

// Progression
export const createProgression = async (data: Omit<Progression, 'id'>): Promise<string> => {
    try {
        const progressionId = `${data.utilisateurId}_${data.formationId}`
        await setDoc(doc(db, 'progressions', progressionId), { ...data, id: progressionId })
        return progressionId
    } catch (error) {
        throw new Error(`Erreur lors de la création de la progression: ${(error as Error).message}`)
    }
}

export const getProgression = async (utilisateurId: string, formationId: string): Promise<Progression | null> => {
    try {
        const progressionId = `${utilisateurId}_${formationId}`
        const docSnap = await getDoc(doc(db, 'progressions', progressionId))
        if (docSnap.exists()) {
            return { ...docSnap.data(), id: docSnap.id } as Progression
        }
        return null
    } catch (error) {
        throw new Error(`Erreur lors de la récupération de la progression: ${(error as Error).message}`)
    }
}

export const updateProgression = async (utilisateurId: string, formationId: string, data: Partial<Progression>): Promise<void> => {
    try {
        const progressionId = `${utilisateurId}_${formationId}`
        await updateDoc(doc(db, 'progressions', progressionId), data)
    } catch (error) {
        throw new Error(`Erreur lors de la mise à jour de la progression: ${(error as Error).message}`)
    }
}

export const deleteProgression = async (utilisateurId: string, formationId: string): Promise<void> => {
    try {
        const progressionId = `${utilisateurId}_${formationId}`
        await deleteDoc(doc(db, 'progressions', progressionId))
    } catch (error) {
        throw new Error(`Erreur lors de la suppression de la progression: ${(error as Error).message}`)
    }
}

// Attestation
export const createAttestation = async (data: Omit<Attestation, 'id'>): Promise<string> => {
    try {
        const docRef = doc(collection(db, 'attestations'))
        await setDoc(docRef, { ...data, id: docRef.id })
        return docRef.id
    } catch (error) {
        throw new Error(`Erreur lors de la création de l'attestation: ${(error as Error).message}`)
    }
}

export const getAttestation = async (id: string): Promise<Attestation | null> => {
    try {
        const docSnap = await getDoc(doc(db, 'attestations', id))
        if (docSnap.exists()) {
            return { ...docSnap.data(), id: docSnap.id } as Attestation
        }
        return null
    } catch (error) {
        throw new Error(`Erreur lors de la récupération de l'attestation: ${(error as Error).message}`)
    }
}

export const getAttestationsByUser = async (utilisateurId: string): Promise<Attestation[]> => {
    try {
        const q = query(collection(db, 'attestations'), where('utilisateurId', '==', utilisateurId))
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Attestation))
    } catch (error) {
        throw new Error(`Erreur lors de la récupération des attestations: ${(error as Error).message}`)
    }
}