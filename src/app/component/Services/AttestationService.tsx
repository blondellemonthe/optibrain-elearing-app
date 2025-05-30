import {Timestamp} from 'firebase/firestore'
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage'
import {storage} from '@/app/lib/firebaseConfig';
import {createAttestation, getFormation, getProgression, getUser} from './FirestoreService'
import {renderToBuffer} from '@react-pdf/renderer'
import AttestationPDF from "@/app/component/Formation/AttestationPDF";


export const genererAttestation = async (
    utilisateurId: string,
    formationId: string
): Promise<string> => {
    try {
        // Vérifier l'éligibilité
        const progression = await getProgression(utilisateurId, formationId)
        if (!progression || !progression.estTerminee) {
            throw new Error('Formation non terminée')
        }

        const user = await getUser(utilisateurId)
        const formation = await getFormation(formationId)
        if (!user || !formation) {
            throw new Error('Utilisateur ou formation non trouvé')
        }

        // Générer le PDF

        const pdfDoc = (
            <AttestationPDF
                nomUtilisateur={user.nom}
                titreFormation={formation.titre}
                dateEmission={new Date().toLocaleDateString('fr-FR')}
                // logoUrl="https://votre-logo-url" // Décommentez et ajoutez l'URL si nécessaire
            />)
        const pdfBuffer = await renderToBuffer(pdfDoc)

        // Uploader dans Firebase Storage
        const storageRef = ref(storage, `attestations/${utilisateurId}_${formationId}.pdf`)
        await uploadBytes(storageRef, pdfBuffer)
        const pdfUrl = await getDownloadURL(storageRef)

        // Enregistrer dans Firestore
        return await createAttestation({
            utilisateurId,
            formationId,
            dateEmission: Timestamp.now(),
            pdfUrl
        })
    } catch (error) {
        throw new Error(`Erreur lors de la génération de l'attestation: ${(error as Error).message}`)
    }
}