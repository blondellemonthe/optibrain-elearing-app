import { db } from '@/app/lib/firebaseConfig'
import {
    collection,
    doc,
    setDoc,
    updateDoc,
    deleteDoc
} from 'firebase/firestore'
import { uploadFile } from './FirebaseStorageService'
// import {Chapitre, Formation} from "@/app/component/Services/FirestoreService";
// import {Ch} from "@/app/component/Services/FirestoreService";

/**
 * Creates a new formation in Firestore with uploaded images.
 * @param formation The formation data including image and imageFond files.
 * @returns The ID of the created formation.
 */
export const createFormation = async (formation): Promise<string> => {
    try {
        const formationRef = doc(collection(db, 'formations'))
        let imageUrl = '';
        let imageFondUrl = '';

        // Upload image if provided
        if (formation.imageFile) {
            imageUrl = await uploadFile(formation.imageFile, `formations/${formationRef.id}/image.${formation.imageFile.name.split('.').pop()}`);
        }

        // Upload imageFond if provided
        if (formation.imageFondFile) {
            imageFondUrl = await uploadFile(formation.imageFondFile, `formations/${formationRef.id}/imageFond.${formation.imageFondFile.name.split('.').pop()}`);
        }

        const formationData = {
            titre: formation.titre,
            description: formation.description,
            image: imageUrl,
            imageFond: imageFondUrl,
            duree: formation.duree,
            niveau: formation.niveau,
            chapitres: formation.chapitres || [],
            dateCreation: formation.dateCreation || new Date()
        };

        await setDoc(formationRef, formationData);
        return formationRef.id;
    } catch (error) {
        throw new Error(`Erreur lors de la création de la formation: ${(error as Error).message}`);
    }
}

/**
 * Updates an existing formation in Firestore with optional new images.
 * @param formationId The ID of the formation to update.
 * @param data The updated data including optional image and imageFond files.
 */
export const updateFormation = async (formationId: string, data): Promise<void> => {
    try {
        const formationRef = doc(db, 'formations', formationId);
        let updateData = {
            titre: data.titre,
            image: null,
            imageFond: null,
            description: data.description,
            duree: data.duree,
            niveau: data.niveau
        };

        // Upload new image if provided
        if (data.imageFile) {
            const imageUrl = await uploadFile(data.imageFile, `formations/${formationId}/image.${data.imageFile.name.split('.').pop()}`);
            updateData = { ...updateData, image: imageUrl };
        }

        // Upload new imageFond if provided
        if (data.imageFondFile) {
            const imageFondUrl = await uploadFile(data.imageFondFile, `formations/${formationId}/imageFond.${data.imageFondFile.name.split('.').pop()}`);
            updateData = { ...updateData, imageFond: imageFondUrl };
        }

        await updateDoc(formationRef, updateData);
    } catch (error) {
        throw new Error(`Erreur lors de la mise à jour de la formation: ${(error as Error).message}`);
    }
}

/**
 * Deletes a formation from Firestore.
 * @param formationId The ID of the formation to delete.
 */
export const deleteFormation = async (formationId: string): Promise<void> => {
    try {
        const formationRef = doc(db, 'formations', formationId);
        await deleteDoc(formationRef);
    } catch (error) {
        throw new Error(`Erreur lors de la suppression de la formation: ${(error as Error).message}`);
    }
}

/**
 * Creates a new chapitre in Firestore with uploaded image and video.
 * @param chapitre The chapitre data including imageFond and video files.
 * @returns The ID of the created chapitre.
 */
export const createChapitre = async (chapitre): Promise<string> => {
    try {
        const chapitreRef = doc(collection(db, 'chapitres'));
        let imageFondUrl = '';
        let videoUrl = '';

        // Upload imageFond if provided
        if (chapitre.imageFondFile) {
            imageFondUrl = await uploadFile(chapitre.imageFondFile, `chapitres/${chapitreRef.id}/imageFond.${chapitre.imageFondFile.name.split('.').pop()}`);
        }

        // Upload video if provided
        if (chapitre.videoFile) {
            videoUrl = await uploadFile(chapitre.videoFile, `chapitres/${chapitreRef.id}/video.${chapitre.videoFile.name.split('.').pop()}`);
        }

        const chapitreData = {
            titre: chapitre.titre,
            description: chapitre.description,
            videoUrl: videoUrl,
            imageFond: imageFondUrl,
            ordre: chapitre.ordre,
            duree: chapitre.duree,
            formationId: chapitre.formationId
        };

        await setDoc(chapitreRef, chapitreData);
        return chapitreRef.id;
    } catch (error) {
        throw new Error(`Erreur lors de la création du chapitre: ${(error as Error).message}`);
    }
}

/**
 * Updates an existing chapitre in Firestore with optional new image and video.
 * @param chapitreId The ID of the chapitre to update.
 * @param data The updated data including optional imageFond and video files.
 */
export const updateChapitre = async (chapitreId: string, data): Promise<void> => {
    try {
        const chapitreRef = doc(db, 'chapitres', chapitreId);
        let updateData = {
            titre: data.titre,
            imageFond: null,
            image: null,
            videoUrl: null,
            description: data.description,
            ordre: data.ordre,
            duree: data.duree
        };

        // Upload new imageFond if provided
        if (data.imageFondFile) {
            const imageFondUrl = await uploadFile(data.imageFondFile, `chapitres/${chapitreId}/imageFond.${data.imageFondFile.name.split('.').pop()}`);
            updateData = { ...updateData, imageFond: imageFondUrl };
        }

        // Upload new video if provided
        if (data.videoFile) {
            const videoUrl = await uploadFile(data.videoFile, `chapitres/${chapitreId}/video.${data.videoFile.name.split('.').pop()}`);
            updateData = { ...updateData, videoUrl: videoUrl };
        }

        await updateDoc(chapitreRef, updateData);
    } catch (error) {
        throw new Error(`Erreur lors de la mise à jour du chapitre: ${(error as Error).message}`);
    }
}

/**
 * Deletes a chapitre from Firestore.
 * @param chapitreId The ID of the chapitre to delete.
 */
export const deleteChapitre = async (chapitreId: string): Promise<void> => {
    try {
        const chapitreRef = doc(db, 'chapitres', chapitreId);
        await deleteDoc(chapitreRef);
    } catch (error) {
        throw new Error(`Erreur lors de la suppression du chapitre: ${(error as Error).message}`);
    }
}