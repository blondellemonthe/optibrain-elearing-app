import { motion } from 'framer-motion'
import VideoPlayer from './VideoPlayer'
import { FaCheckCircle } from 'react-icons/fa'
import {Chapitre} from "@/app/component/Services/FirestoreService";

interface ChapitreItemProps {
    chapitre: Chapitre
    isVu: boolean
    onMarquerVu: () => void
}

const ChapitreItem: React.FC<ChapitreItemProps> = ({ chapitre, isVu, onMarquerVu }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-4"
        >
            <div
                className="h-32 bg-cover bg-center rounded-t-lg mb-4"
                style={{ backgroundImage: `url(${chapitre.imageFond})` }}
            />
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-dark2">{chapitre.titre}</h3>
                {isVu && <FaCheckCircle className="text-primary text-xl" />}
            </div>
            <p className="text-gray-600 text-sm mb-4">{chapitre.description}</p>
            <VideoPlayer videoUrl={chapitre.videoUrl} />
            {!isVu && (
                <button
                    onClick={onMarquerVu}
                    className="mt-4 w-full bg-primary text-white py-2 rounded hover:bg-blue-700"
                >
                    Marquer comme vu
                </button>
            )}
        </motion.div>
    )
}

export default ChapitreItem