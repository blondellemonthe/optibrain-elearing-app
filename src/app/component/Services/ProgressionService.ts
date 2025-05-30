import { Timestamp } from 'firebase/firestore'
import { getFormation, getChapitresByFormation, getProgression, updateProgression } from './FirestoreService'

export const marquerChapitreVu = async (
    utilisateurId: string,
    formationId: string,
    chapitreId: string
): Promise<void> => {
    try {
        const progression = await getProgression(utilisateurId, formationId)
        if (!progression) throw new Error('Progression non trouvée')

        // Vérifier si le chapitre est déjà marqué comme vu
        if (progression.chapitresVus.includes(chapitreId)) {
            return
        }

        // Ajouter le chapitre aux chapitres vus
        const updatedChapitresVus = [...progression.chapitresVus, chapitreId]

        // Vérifier si la formation est terminée
        const formation = await getFormation(formationId)
        if (!formation) throw new Error('Formation non trouvée')
        const chapitres = await getChapitresByFormation(formationId)
        const estTerminee = updatedChapitresVus.length === chapitres.length

        await updateProgression(utilisateurId, formationId, {
            chapitresVus: updatedChapitresVus,
            dateDerniereMiseAJour: Timestamp.now(),
            estTerminee
        })
    } catch (error) {
        throw new Error(`Erreur lors du marquage du chapitre: ${(error as Error).message}`)
    }
}

export const getProgressionPourcentage = async (
    utilisateurId: string,
    formationId: string
): Promise<number> => {
    try {
        const progression = await getProgression(utilisateurId, formationId)
        if (!progression) return 0

        const chapitres = await getChapitresByFormation(formationId)
        if (chapitres.length === 0) return 0

        return (progression.chapitresVus.length / chapitres.length) * 100
    } catch (error) {
        throw new Error(`Erreur lors du calcul de la progression: ${(error as Error).message}`)
    }
}