interface VideoPlayerProps {
    videoUrl: string
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
    return (
        <div className=" h-64 bg-black rounded-lg overflow-hidden">
            <video
                controls
                className=" object-cover"
                src={videoUrl}
            >
                Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
        </div>
    )
}

export default VideoPlayer