import { createFormation, Formation } from '../component/Services/FirestoreService'
import { Timestamp } from 'firebase/firestore'

const formations: Formation[]= [
    {
        id:'',
        titre: 'Introduction au Développement Web',
        description: 'Apprenez les bases du développement web avec HTML, CSS, et JavaScript. Créez vos premières pages web interactives et découvrez les outils essentiels pour devenir un développeur front-end.',
        image: 'https://firebasestorage.googleapis.com/v0/b/votre-projet.appspot.com/o/formations/web_dev.jpg',
        imageFond: 'https://firebasestorage.googleapis.com/v0/b/votre-projet.appspot.com/o/formations/web_dev_bg.jpg',
        duree: '12 heures',
        niveau: 'Débutant',
        chapitres: ['chapitre1_web', 'chapitre2_web', 'chapitre3_web'],
        dateCreation: Timestamp.now(),
    },
    {
        id:'',
        titre: 'Python pour la Data Science',
        description: 'Maîtrisez Python pour analyser des données, créer des visualisations, et appliquer des techniques de machine learning. Idéal pour les débutants en data science.',
        image: 'https://firebasestorage.googleapis.com/v0/b/votre-projet.appspot.com/o/formations/python_data.jpg',
        imageFond: 'https://firebasestorage.googleapis.com/v0/b/votre-projet.appspot.com/o/formations/python_data_bg.jpg',
        duree: '15 heures',
        niveau: 'Intermédiaire',
        chapitres: ['chapitre1_python', 'chapitre2_python', 'chapitre3_python', 'chapitre4_python'],
        dateCreation: Timestamp.now(),
    },
    {
        id:'',
        titre: 'Conception d\'Applications Mobiles avec Flutter',
        description: 'Découvrez Flutter pour développer des applications mobiles multiplateformes performantes. Apprenez à créer des interfaces modernes et à déployer vos apps.',
        image: 'https://firebasestorage.googleapis.com/v0/b/votre-projet.appspot.com/o/formations/flutter.jpg',
        imageFond: 'https://firebasestorage.googleapis.com/v0/b/votre-projet.appspot.com/o/formations/flutter_bg.jpg',
        duree: '10 heures',
        niveau: 'Intermédiaire',
        chapitres: ['chapitre1_flutter', 'chapitre2_flutter', 'chapitre3_flutter'],
        dateCreation: Timestamp.now(),
    },
    {
        id:'',
        titre: 'Initiation à la Cybersécurité',
        description: 'Comprenez les fondamentaux de la cybersécurité, incluant la protection des données, la gestion des menaces, et les bonnes pratiques pour sécuriser les systèmes.',
        image: 'https://firebasestorage.googleapis.com/v0/b/votre-projet.appspot.com/o/formations/cybersec.jpg',
        imageFond: 'https://firebasestorage.googleapis.com/v0/b/votre-projet.appspot.com/o/formations/cybersec_bg.jpg',
        duree: '8 heures',
        niveau: 'Débutant',
        chapitres: ['chapitre1_cyber', 'chapitre2_cyber'],
        dateCreation: Timestamp.now(),
    },
    {
        id:'',
        titre: 'Marketing Digital Avancé',
        description: 'Approfondissez vos compétences en marketing digital avec des stratégies avancées pour le SEO, les réseaux sociaux, et la publicité en ligne.',
        image: 'https://firebasestorage.googleapis.com/v0/b/votre-projet.appspot.com/o/formations/marketing.jpg',
        imageFond: 'https://firebasestorage.googleapis.com/v0/b/votre-projet.appspot.com/o/formations/marketing_bg.jpg',
        duree: '14 heures',
        niveau: 'Avancé',
        chapitres: ['chapitre1_marketing', 'chapitre2_marketing', 'chapitre3_marketing', 'chapitre4_marketing'],
        dateCreation: Timestamp.now(),
    },
]

export const addFormations = async () => {
    try {
        for (const formation of formations) {
            const formationId = await createFormation(formation)
            console.log(`Formation ajoutée: ${formation.titre} (ID: ${formationId})`)
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout des formations:', error)
    }
}

// addFormations()