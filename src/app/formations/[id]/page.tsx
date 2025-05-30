import {
    getFormation,
    getChapitresByFormation,
    getAllFormations,
} from '@/app/component/Services/FirestoreService'
import FormationDetailsClient from "@/app/formations/[id]/FormationDetailClient"
import {Timestamp} from "firebase/firestore";

// Utility function to serialize Firestore data
function serializeFirestoreData(data) {
    if (!data) return data;

    // Handle arrays
    if (Array.isArray(data)) {
        return data.map(item => serializeFirestoreData(item));
    }

    // Handle objects
    if (typeof data === 'object' && data !== null) {
        const serialized = {};
        for (const [key, value] of Object.entries(data as { [key: string]: Timestamp })) {
            // Check for Firestore Timestamp
            if (value && typeof value === 'object' && 'seconds' in value && 'nanoseconds' in value) {
                // Convert Timestamp to ISO string
                const date = value.toDate(); // Assumes value is a Firestore Timestamp with toDate method
                serialized[key] = date.toISOString();
            }
            // Recursively serialize nested objects
            else if (typeof value === 'object' && value !== null) {
                serialized[key] = serializeFirestoreData(value);
            }
            // Handle other types directly
            else {
                serialized[key] = value;
            }
        }
        return serialized;
    }

    // Return primitive values as-is
    return data;
}

export async function generateStaticParams() {
    console.log("Running generateStaticParams...");
    try {
        const formations = await getAllFormations();

        // Validate the format of formations
        if (!Array.isArray(formations)) {
            console.error("getAllFormations did not return an array:", formations);
            return [];
        }

        const params = formations
            .filter(formation => formation.id && typeof formation.id === 'string')
            .map(formation => {
                console.log("Mapping formation ID:", formation.id);
                return { id: formation.id };
            });

        console.log("Generated static params:", params);
        return params;
    } catch (error) {
        console.error('Error in generateStaticParams:', error);
        return [];
    }
}

export default async function FormationDetails({ params }) {
    const { id } = await params;
    console.log("Rendering FormationDetails for ID:", id);

    try {
        const formationData = await getFormation(id);
        const chapitresData = await getChapitresByFormation(id);

        // Serialize Firestore data to ensure all fields are plain values
        const serializedFormation = serializeFirestoreData(formationData);
        const serializedChapitres = serializeFirestoreData(chapitresData);

        const sortedChapitres = serializedChapitres.sort((a, b) => a.ordre - b.ordre);

        return (
            <FormationDetailsClient
                formation={serializedFormation}
                chapitres={sortedChapitres}
                id={id}
                error={null}
            />
        );
    } catch (error) {
        console.error('Error fetching formation data for ID', id, ':', error);
        return (
            <FormationDetailsClient
                formation={null}
                chapitres={[]}
                id={id}
                error="Impossible de charger la formation."
            />
        );
    }
}