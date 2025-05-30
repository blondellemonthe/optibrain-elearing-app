import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendEmailVerification,
    signOut,
    User,
} from 'firebase/auth'
import {createUser, getUser, updateUser} from '../Services/FirestoreService'
import {auth} from "@/app/lib/firebaseConfig";

export const registerUser = async (
    email: string,
    password: string,
    nom: string
): Promise<User> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user
        // Sauvegarder les données utilisateur dans Firestore
        await createUser(user.uid, {
            email,
            nom,
            formationsInscrites: [],
            formationsAbandonnees: [],
        })
        // Envoyer un e-mail de vérification pour le 2FA
        await sendEmailVerification(user)
        return user
    } catch (error) {
        throw new Error(`Erreur lors de l'enregistrement: ${(error as Error).message}`)
    }
}

export const loginUser = async (email: string, password: string): Promise<User> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user
        if (!user.emailVerified) {
            throw new Error('Veuillez vérifier votre e-mail avant de vous connecter.')
        }
        return user
    } catch (error) {
        throw new Error(`Erreur lors de la connexion: ${(error as Error).message}`)
    }
}

export const loginWithGoogle = async (): Promise<User> => {
    try {
        const provider = new GoogleAuthProvider()
        const userCredential = await signInWithPopup(auth, provider)
        const user = userCredential.user
        const bd_user = await getUser(user.uid)
        // Créer ou mettre à jour l'utilisateur dans Firestore
        if (!bd_user) {
            await createUser(user.uid, {
                email: user.email || '',
                nom: user.displayName || 'Utilisateur Google',
                formationsInscrites: [],
                formationsAbandonnees: [],
            })
        }
        return user
    } catch (error) {
        throw new Error(`Erreur lors de la connexion avec Google: ${(error as Error).message}`)
    }
}

export const updateUserProfile = async (uid: string, nom: string): Promise<void> => {
    try {
        await updateUser(uid, {nom})
    } catch (error) {
        throw new Error(`Erreur lors de la mise à jour du profil: ${(error as Error).message}`)
    }
}

export const logoutUser = async (): Promise<void> => {
    try {
        await signOut(auth)
    } catch (error) {
        throw new Error(`Erreur lors de la déconnexion: ${(error as Error).message}`)
    }
}