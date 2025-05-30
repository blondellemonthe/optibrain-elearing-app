"use client"
import { motion } from 'framer-motion'

const specs = [
    { characteristic: 'Système d\'exploitation', value: 'Windows 10 (64 bits, préférable ; compatible Windows 7 ou 11)' },
    { characteristic: 'Processeur', value: 'Intel Core i5 (5e génération), 4 ou 8 cœurs, 2.5 GHz minimum' },
    { characteristic: 'Mémoire RAM', value: '8 Go minimum (sur une barrette, extensible à 16 Go)' },
    { characteristic: 'Stockage', value: 'SSD de 256 Go minimum (au moins 10 Go libres)' },
    { characteristic: 'Type de système', value: 'Bluetooth, Wi-Fi (connexion stable, 10 Mbps minimum)' },
    { characteristic: 'Connexion réseau', value: 'Intégrée (pas de carte dédiée nécessaire)' },
    { characteristic: 'Carte graphique', value: 'Intégrée (ex. Intel HD Graphics)' },
    { characteristic: 'Écran', value: '15 pouces minimum, 1920x1080 (Full HD)' },
]

const MachineSpecs: React.FC = () => {
    return (
        <section className="py-20 bg-white">
        <div className="container mx-auto">
        <motion.h2
            initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
        Spécifications recommandées pour l&apos;ERP Brainopx
    </motion.h2>
    <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="overflow-x-auto"
    >
    <table className="min-w-full bg-gray-100 rounded-lg">
    <thead>
        <tr>
            <th className="px-6 py-3 text-left text-lg font-semibold text-gray-900">Caractéristique</th>
        <th className="px-6 py-3 text-left text-lg font-semibold text-gray-900">Valeur recommandée</th>
    </tr>
    </thead>
    <tbody>
    {specs.map((spec, index) => (
            <tr key={index} className="border-t">
        <td className="px-6 py-4 text-gray-600">{spec.characteristic}</td>
            <td className="px-6 py-4 text-gray-600">{spec.value}</td>
        </tr>
))}
    </tbody>
    </table>
    </motion.div>
    <motion.p
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.4 }}
    className="mt-8 text-gray-600 text-center"
        >
        Ces spécifications sont recommandées pour exécuter le logiciel de gestion technique et financière des AEP gérés par l&apos;AMGEEA, basé sur une application PHP sous WAMP et utilisant Microsoft Office.
    </motion.p>
    </div>
    </section>
)
}

export default MachineSpecs