import { Plane, MapPin, Compass, Camera, Ship, Mountain, Palmtree, Sunrise } from 'lucide-react';

const floatingItems = [
    { Icon: Plane, delay: '0s', duration: '18s', x: '8%', y: '15%', size: 28, rotate: -45, depth: 2 },
    { Icon: MapPin, delay: '2s', duration: '22s', x: '85%', y: '20%', size: 24, rotate: 10, depth: 1.5 },
    { Icon: Compass, delay: '4s', duration: '20s', x: '12%', y: '75%', size: 32, rotate: 25, depth: 3 },
    { Icon: Camera, delay: '1s', duration: '25s', x: '78%', y: '70%', size: 22, rotate: -15, depth: 1 },
    { Icon: Ship, delay: '3s', duration: '19s', x: '92%', y: '45%', size: 26, rotate: 5, depth: 2.5 },
    { Icon: Mountain, delay: '5s', duration: '23s', x: '5%', y: '48%', size: 30, rotate: -8, depth: 1.8 },
    { Icon: Palmtree, delay: '2.5s', duration: '21s', x: '70%', y: '85%', size: 26, rotate: 12, depth: 2.2 },
    { Icon: Sunrise, delay: '3.5s', duration: '24s', x: '25%', y: '88%', size: 20, rotate: 0, depth: 1.3 },
];

export default function FloatingIcons3D() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {floatingItems.map(({ Icon, delay, duration, x, y, size, rotate, depth }, i) => (
                <div
                    key={i}
                    className="absolute floating-3d-icon"
                    data-parallax-depth={depth}
                    style={{
                        left: x,
                        top: y,
                        animationDelay: delay,
                        animationDuration: duration,
                    }}
                >
                    <div
                        className="relative"
                        style={{
                            transform: `rotate(${rotate}deg)`,
                        }}
                    >
                        <Icon
                            className="text-vintage-leather/[0.12] drop-shadow-sm"
                            style={{ width: size, height: size }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
