import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {Formation} from "@/app/component/Services/FirestoreService";

interface FormationCardProps {
    formation: Formation
    progression?: number
    onAction?: () => void
    actionLabel?: string
    actionIcon?: React.ReactNode
}

const FormationCard: React.FC<FormationCardProps> = ({
                                                         formation,
                                                         progression = 0,
                                                         onAction,
                                                         actionLabel,
                                                         actionIcon,
                                                     }) => {
    const router = useRouter()

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
            onClick={() => router.push(`/formations/${formation.id}`)}
        >
            <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${formation.imageFond})` }}
            />
            <div className="p-4">
                <h3 className="text-xl font-semibold text-dark2 mb-2">{formation.titre}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{formation.description}</p>
                {progression > 0 && (
                    <div className="mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-primary h-2.5 rounded-full"
                                style={{ width: `${progression}%` }}
                            />
                        </div>
                        <span className="text-sm text-gray-600">{Math.round(progression)}% complété</span>
                    </div>
                )}
                {onAction && actionLabel && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onAction()
                        }}
                        className="flex items-center justify-center w-full bg-secondary text-white py-2 rounded hover:bg-red-700"
                    >
                        {actionIcon && <span className="mr-2">{actionIcon}</span>}
                        {actionLabel}
                    </button>
                )}
            </div>
        </motion.div>
    )
}

export default FormationCard