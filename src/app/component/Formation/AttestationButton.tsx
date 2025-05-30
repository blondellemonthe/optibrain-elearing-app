import { FaDownload } from 'react-icons/fa'
import {Attestation} from "@/app/component/Services/FirestoreService";

interface AttestationButtonProps {
    attestation: Attestation,
    onGenerer: () => void
}

const AttestationButton: React.FC<AttestationButtonProps> = ({ attestation, onGenerer }) => {
    if (attestation?.pdfUrl) {
        return (
            <a
                href={attestation.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-secondary text-white py-2 px-4 rounded hover:bg-red-700"
            >
                <FaDownload className="mr-2" /> Télécharger l&apos;attestation
            </a>
        )
    }

    return (
        <button
            onClick={onGenerer}
            className="flex items-center justify-center bg-primary text-white py-2 px-4 rounded hover:bg-blue-700"
        >
            <FaDownload className="mr-2" /> Générer l&apos;attestation
        </button>
    )
}

export default AttestationButton