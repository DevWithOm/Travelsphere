import { useTilt3D } from '../hooks/use3DEffects';

export default function TiltCard3D({ children, className = '', maxTilt = 20, glare = true }) {
    const tiltRef = useTilt3D({ maxTilt, scale: 1.04, speed: 300, glare });

    return (
        <div ref={tiltRef} className={`tilt-card-3d relative overflow-hidden ${className}`}>
            {children}
            {glare && (
                <div
                    className="tilt-glare absolute top-0 left-0 w-[200%] h-[200%] pointer-events-none"
                    style={{
                        background: 'linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.25) 100%)',
                        transformOrigin: '0% 0%',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                    }}
                />
            )}
        </div>
    );
}
