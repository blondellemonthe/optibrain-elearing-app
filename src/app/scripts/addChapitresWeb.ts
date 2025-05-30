import { createChapitre } from '../component/Services/FirestoreService'

const chapitres = [
    {
        id: 'chapitre1_web',
        titre: 'Introduction à HTML',
        description: 'Apprenez les bases de HTML pour structurer des pages web.',
        videoUrl: 'https://firebasestorage.googleapis.com/v0/b/votre-projet.appspot.com/o/videos/html_intro.mp4',
        imageFond: 'https://firebasestorage.googleapis.com/v0/b/votre-projet.appspot.com/o/chapitres/html_bg.jpg',
        ordre: 1,
        duree: '2 heures',
        formationId: 'id_de_la_formation_web', // Remplacez par l'ID réel
    },
    {
        id: 'chapitre2_web',
        titre: 'Stylisation avec CSS',
        description: 'Découvrez CSS pour styliser et mettre en forme vos pages.',
        videoUrl: 'https://firebasestorage.googleapis.com/v0/b/votre-projet.appspot.com/o/videos/css_styling.mp4',
        imageFond: 'https://firebasestorage.googleapis.com/v0/b/votre-projet.appspot.com/o/chapitres/css_bg.jpg',
        ordre: 2,
        duree: '3 heures',
        formationId: 'id_de_la_formation_web',
    },
    {
        id: 'chapitre3_web',
        titre: 'Interactivité avec JavaScript',
        description: 'Ajoutez des fonctionnalités interactives avec JavaScript.',
        videoUrl: 'https://firebasestorage.googleapis.com/v0/b/votre-projet.appspot.com/o/videos/js_interactivity.mp4',
        imageFond: 'https://firebasestorage.googleapis.com/v0/b/votre-projet.appspot.com/o/chapitres/js_bg.jpg',
        ordre: 3,
        duree: '4 heures',
        formationId: 'id_de_la_formation_web',
    },
]

export const addChapitres = async () => {
    try {
        for (const chapitre of chapitres) {
            const chapitreId = await createChapitre(chapitre)
            console.log(`Chapitre ajouté: ${chapitre.titre} (ID: ${chapitreId})`)
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout des chapitres:', error)
    }
}

// addChapitres()