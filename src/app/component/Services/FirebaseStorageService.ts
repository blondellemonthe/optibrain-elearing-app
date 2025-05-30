import { storage } from '@/app/lib/firebaseConfig'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

/**
 * Uploads a file to Firebase Storage and returns its download URL.
 * @param file The file to upload (image or video).
 * @param path The storage path (e.g., 'formations/{id}/image.jpg').
 * @returns Promise<string> The download URL of the uploaded file.
 * @throws Error if the file type or size is invalid, or if the upload fails.
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
    try {
        // Validate file size and type
        const maxImageSize = 10 * 1024 * 1024; // 10 MB
        const maxVideoSize = 100 * 1024 * 1024; // 100 MB
        const allowedImageTypes = ['image/jpeg', 'image/png'];
        const allowedVideoTypes = ['video/mp4', 'video/webm'];

        if (file.type.includes('image') && file.size > maxImageSize) {
            throw new Error('L\'image ne doit pas dépasser 10 Mo.');
        }
        if (file.type.includes('video') && file.size > maxVideoSize) {
            throw new Error('La vidéo ne doit pas dépasser 100 Mo.');
        }
        if (!allowedImageTypes.includes(file.type) && !allowedVideoTypes.includes(file.type)) {
            throw new Error('Type de fichier non pris en charge. Utilisez JPEG, PNG pour les images ou MP4, WEBM pour les vidéos.');
        }

        // Create storage reference
        const storageRef = ref(storage, path);

        // Upload file
        await uploadBytes(storageRef, file);

        // Get download URL
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error) {
        throw new Error(`Erreur lors de l'upload du fichier : ${(error as Error).message}`);
    }
}