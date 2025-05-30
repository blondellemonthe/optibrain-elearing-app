import {Document, Page, Text, View, StyleSheet, Image, Font} from '@react-pdf/renderer'

// Enregistrer une police (optionnel, ici Helvetica par défaut)
Font.register({
    family: 'Helvetica',
    fonts: [
        {src: 'https://cdn.jsdelivr.net/npm/@react-pdf/renderer/fonts/Helvetica.ttf'},
        {src: 'https://cdn.jsdelivr.net/npm/@react-pdf/renderer/fonts/Helvetica-Bold.ttf', fontWeight: 'bold'},
    ],
})

// Définir les styles pour le PDF
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 40,
    },
    header: {
        marginBottom: 20,
        textAlign: 'center',
        borderBottom: '2px solid #1E40AF', // Couleur primary
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 10,
        alignSelf: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1E40AF', // Couleur primary
        marginBottom: 10,
        fontFamily: 'Helvetica',
    },
    subtitle: {
        fontSize: 18,
        color: '#4B5563', // Couleur dark2
        marginBottom: 20,
    },
    section: {
        margin: 20,
        padding: 20,
        flexGrow: 1,
        border: '1px solid #E5E7EB',
        borderRadius: 5,
        textAlign: 'center',
    },
    text: {
        fontSize: 14,
        color: '#374151',
        marginBottom: 15,
        fontFamily: 'Helvetica',
    },
    signature: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 30,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 10,
        color: '#9CA3AF',
    },
})

interface AttestationPDFProps {
    nomUtilisateur: string
    titreFormation: string
    dateEmission: string
    logoUrl?: string // URL du logo (optionnel)
}

const AttestationPDF: React.FC<AttestationPDFProps> = ({
                                                           nomUtilisateur,
                                                           titreFormation,
                                                           dateEmission,
                                                           logoUrl,
                                                       }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                {logoUrl && <Image style={styles.logo} src={logoUrl} />}
                <Text style={styles.title}>Attestation de Formation</Text>
                <Text style={styles.subtitle}>Certificat d&apos;Achèvement</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.text}>
                    Nous certifions que
                </Text>
                <Text style={[styles.text, {fontSize: 16, fontWeight: 'bold'}]}>
                    {nomUtilisateur}
                </Text>
                <Text style={styles.text}>
                    a complété avec succès la formation intitulée :
                </Text>
                <Text style={[styles.text, {fontSize: 16, fontWeight: 'bold'}]}>
                    {titreFormation}
                </Text>
                <Text style={styles.text}>
                    Date d&apos;émission : {dateEmission}
                </Text>
                <Text style={styles.signature}>
                    Signature de l&apos;autorité de certification
                </Text>
            </View>
            <Text style={styles.footer}>
                Plateforme de E-Learning - Généré le {dateEmission}
            </Text>
        </Page>
    </Document>
)

export default AttestationPDF