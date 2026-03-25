import { useEffect, useRef } from 'react';

// Simplified continent outlines as lat/lng coordinate paths
const CONTINENTS = [
    // North America
    { points: [[50,-130],[55,-125],[60,-140],[70,-160],[70,-140],[60,-110],[50,-100],[48,-90],[45,-80],[40,-75],[30,-80],[25,-80],[25,-90],[20,-100],[18,-105],[30,-115],[35,-120],[40,-125],[48,-125],[50,-130]], color: 0.7 },
    // South America
    { points: [[12,-75],[10,-70],[5,-75],[0,-78],[-5,-80],[-10,-78],[-15,-75],[-20,-70],[-25,-65],[-30,-60],[-35,-58],[-40,-62],[-45,-68],[-50,-70],[-55,-68],[-50,-65],[-40,-55],[-35,-50],[-30,-48],[-25,-45],[-20,-40],[-15,-40],[-10,-37],[-5,-35],[0,-50],[5,-60],[10,-72],[12,-75]], color: 0.65 },
    // Europe
    { points: [[38,-10],[36,0],[38,5],[42,3],[44,8],[46,14],[48,16],[50,20],[52,22],[55,25],[58,28],[60,30],[62,28],[65,25],[70,28],[72,30],[70,20],[65,15],[60,10],[58,8],[55,10],[52,5],[50,2],[48,-5],[45,-8],[40,-8],[38,-10]], color: 0.75 },
    // Africa
    { points: [[35,-5],[36,10],[33,12],[30,32],[25,35],[20,38],[15,42],[10,45],[5,42],[0,42],[-5,40],[-10,38],[-15,35],[-20,32],[-25,35],[-28,32],[-32,28],[-35,20],[-34,18],[-30,15],[-25,15],[-20,12],[-15,12],[-10,8],[-5,5],[0,5],[5,0],[10,-5],[15,-15],[20,-15],[25,-15],[30,-10],[33,-5],[35,-5]], color: 0.6 },
    // Asia
    { points: [[30,30],[35,35],[40,40],[45,50],[50,55],[55,60],[60,70],[65,80],[70,90],[72,100],[70,130],[65,140],[60,145],[55,140],[50,135],[45,130],[40,120],[35,110],[30,105],[25,100],[20,105],[15,100],[10,98],[5,103],[0,105],[-5,105],[-8,115],[5,115],[10,120],[15,120],[20,110],[25,105],[30,100],[35,90],[40,70],[45,60],[40,50],[35,45],[30,30]], color: 0.72 },
    // Australia
    { points: [[-15,130],[-12,135],[-15,140],[-20,148],[-25,153],[-30,153],[-35,150],[-38,148],[-38,140],[-35,135],[-32,130],[-28,115],[-25,113],[-22,114],[-18,122],[-15,130]], color: 0.68 },
];

// Convert lat/lng to 3D coordinates
function latLngTo3D(lat, lng, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return {
        x: -radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.cos(phi),
        z: radius * Math.sin(phi) * Math.sin(theta),
    };
}

// Rotate a 3D point
function rotatePoint(p, rotY, rotX) {
    // Rotate around Y-axis
    let x1 = p.x * Math.cos(rotY) - p.z * Math.sin(rotY);
    let z1 = p.x * Math.sin(rotY) + p.z * Math.cos(rotY);
    let y1 = p.y;
    // Rotate around X-axis
    let y2 = y1 * Math.cos(rotX) - z1 * Math.sin(rotX);
    let z2 = y1 * Math.sin(rotX) + z1 * Math.cos(rotX);
    return { x: x1, y: y2, z: z2 };
}

export default function Globe3D({ size = 300 }) {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
    const frameRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        ctx.scale(dpr, dpr);

        let rotation = 0;
        const radius = size * 0.36;
        const cx = size / 2;
        const cy = size / 2;

        // Stars background
        const stars = Array.from({ length: 200 }, () => ({
            x: Math.random() * size,
            y: Math.random() * size,
            r: Math.random() * 1.2 + 0.3,
            twinkle: Math.random() * Math.PI * 2,
            speed: 0.02 + Math.random() * 0.04,
        }));

        // Grid dots on the sphere
        const gridDots = [];
        for (let lat = -80; lat <= 80; lat += 8) {
            const latRad = lat * (Math.PI / 180);
            const circumference = Math.cos(latRad);
            const count = Math.max(4, Math.floor(circumference * 45));
            for (let i = 0; i < count; i++) {
                const lng = (i / count) * 360 - 180;
                gridDots.push(latLngTo3D(lat, lng, radius));
            }
        }

        // Flight arcs
        const flightRoutes = [
            { from: [40, -74], to: [51, 0] },      // NYC to London
            { from: [35, 139], to: [-34, 151] },    // Tokyo to Sydney
            { from: [48, 2], to: [28, 77] },        // Paris to Delhi
            { from: [1, 104], to: [37, -122] },     // Singapore to SF
            { from: [-23, -43], to: [30, 31] },     // Rio to Cairo
        ];

        const arcs = flightRoutes.map(route => ({
            ...route,
            progress: Math.random(),
            speed: 0.003 + Math.random() * 0.003,
        }));

        // Cloud particles
        const clouds = Array.from({ length: 30 }, () => ({
            lat: (Math.random() - 0.5) * 120,
            lng: Math.random() * 360 - 180,
            size: 3 + Math.random() * 5,
            alpha: 0.15 + Math.random() * 0.15,
        }));

        // Live Traveler Pulses
        const travelerPulses = Array.from({ length: 15 }, () => ({
            lat: (Math.random() - 0.5) * 120,
            lng: Math.random() * 360 - 180,
            pulse: Math.random() * Math.PI * 2,
            speed: 0.02 + Math.random() * 0.03,
            color: Math.random() > 0.5 ? 'sky' : 'brass'
        }));

        function getRGB(varName) {
            const style = getComputedStyle(document.documentElement);
            return style.getPropertyValue(varName).trim().replace(/\s+/g, ', ');
        }

        const draw = () => {
            ctx.clearRect(0, 0, size, size);

            const leatherRGB = getRGB('--vintage-leather');
            const accentRGB = getRGB('--vintage-accent');
            const brassRGB = getRGB('--vintage-brass');
            const skyRGB = getRGB('--vintage-sky');
            const inkRGB = getRGB('--vintage-ink');

            // Smooth mouse following
            mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
            mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

            const rotY = rotation + mouseRef.current.x * 0.5;
            const rotX = mouseRef.current.y * 0.3;

            // Draw stars
            stars.forEach(star => {
                star.twinkle += star.speed;
                const alpha = 0.3 + Math.sin(star.twinkle) * 0.3;
                const dist = Math.sqrt((star.x - cx) ** 2 + (star.y - cy) ** 2);
                if (dist > radius * 1.15) {
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${inkRGB}, ${alpha.toFixed(2)})`;
                    ctx.fill();
                }
            });

            // Atmospheric glow (outer glow)
            const atmoGrad = ctx.createRadialGradient(cx, cy, radius * 0.95, cx, cy, radius * 1.4);
            atmoGrad.addColorStop(0, `rgba(${skyRGB}, 0.15)`);
            atmoGrad.addColorStop(0.3, `rgba(${brassRGB}, 0.08)`);
            atmoGrad.addColorStop(0.6, `rgba(${skyRGB}, 0.03)`);
            atmoGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = atmoGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, radius * 1.4, 0, Math.PI * 2);
            ctx.fill();

            // Globe shadow (3D depth)
            const shadowGrad = ctx.createRadialGradient(
                cx + radius * 0.3, cy + radius * 0.2, 0,
                cx, cy, radius
            );
            shadowGrad.addColorStop(0, `rgba(0, 0, 0, 0)`);
            shadowGrad.addColorStop(0.7, `rgba(0, 0, 0, 0.05)`);
            shadowGrad.addColorStop(1, `rgba(0, 0, 0, 0.25)`);
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.fillStyle = shadowGrad;
            ctx.fill();

            // Globe base (ocean)
            const oceanGrad = ctx.createRadialGradient(
                cx - radius * 0.35, cy - radius * 0.35, 0,
                cx, cy, radius
            );
            oceanGrad.addColorStop(0, `rgba(${skyRGB}, 0.2)`);
            oceanGrad.addColorStop(0.5, `rgba(${skyRGB}, 0.12)`);
            oceanGrad.addColorStop(1, `rgba(${skyRGB}, 0.05)`);
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.fillStyle = oceanGrad;
            ctx.fill();

            // Globe border
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${skyRGB}, 0.25)`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Clip to globe
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, radius - 1, 0, Math.PI * 2);
            ctx.clip();

            // Grid dots
            gridDots.forEach(dot => {
                const p = rotatePoint(dot, rotY, rotX);
                if (p.z > 0) {
                    const alpha = (p.z / radius) * 0.15 + 0.02;
                    const dotSize = (p.z / radius) * 0.8 + 0.3;
                    ctx.beginPath();
                    ctx.arc(cx + p.x, cy + p.y, dotSize, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${brassRGB}, ${alpha.toFixed(3)})`;
                    ctx.fill();
                }
            });

            // Draw continents
            CONTINENTS.forEach(continent => {
                const projected = continent.points.map(([lat, lng]) => {
                    const p3d = latLngTo3D(lat, lng, radius);
                    return rotatePoint(p3d, rotY, rotX);
                });

                // Check if centroid is visible
                const avgZ = projected.reduce((s, p) => s + p.z, 0) / projected.length;
                if (avgZ < -radius * 0.1) return;

                // Draw filled continent
                ctx.beginPath();
                let started = false;
                projected.forEach((p, i) => {
                    if (p.z > -radius * 0.05) {
                        if (!started) {
                            ctx.moveTo(cx + p.x, cy + p.y);
                            started = true;
                        } else {
                            ctx.lineTo(cx + p.x, cy + p.y);
                        }
                    }
                });
                ctx.closePath();

                const depth = Math.max(0, Math.min(1, (avgZ + radius) / (2 * radius)));
                const fillAlpha = (0.15 + depth * 0.35) * continent.color;
                ctx.fillStyle = `rgba(${leatherRGB}, ${fillAlpha.toFixed(3)})`;
                ctx.fill();

                // Continent border
                ctx.strokeStyle = `rgba(${leatherRGB}, ${(fillAlpha * 0.7).toFixed(3)})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            });

            // Latitude/longitude grid lines
            for (let lat = -60; lat <= 60; lat += 30) {
                ctx.beginPath();
                let hasVisible = false;
                for (let lng = -180; lng <= 180; lng += 3) {
                    const p3d = latLngTo3D(lat, lng, radius);
                    const p = rotatePoint(p3d, rotY, rotX);
                    if (p.z > 0) {
                        if (!hasVisible) { ctx.moveTo(cx + p.x, cy + p.y); hasVisible = true; }
                        else ctx.lineTo(cx + p.x, cy + p.y);
                    } else {
                        hasVisible = false;
                    }
                }
                ctx.strokeStyle = `rgba(${brassRGB}, 0.06)`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }

            for (let lng = -180; lng < 180; lng += 30) {
                ctx.beginPath();
                let hasVisible = false;
                for (let lat = -90; lat <= 90; lat += 3) {
                    const p3d = latLngTo3D(lat, lng, radius);
                    const p = rotatePoint(p3d, rotY, rotX);
                    if (p.z > 0) {
                        if (!hasVisible) { ctx.moveTo(cx + p.x, cy + p.y); hasVisible = true; }
                        else ctx.lineTo(cx + p.x, cy + p.y);
                    } else {
                        hasVisible = false;
                    }
                }
                ctx.strokeStyle = `rgba(${brassRGB}, 0.06)`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }

            // Cloud layer
            clouds.forEach(cloud => {
                cloud.lng += 0.02;
                if (cloud.lng > 180) cloud.lng -= 360;
                const p3d = latLngTo3D(cloud.lat, cloud.lng, radius * 1.02);
                const p = rotatePoint(p3d, rotY, rotX);
                if (p.z > 0) {
                    const a = (p.z / radius) * cloud.alpha;
                    ctx.beginPath();
                    ctx.arc(cx + p.x, cy + p.y, cloud.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, ${a.toFixed(3)})`;
                    ctx.fill();
                }
            });

            // Live traveler pulses
            travelerPulses.forEach(tp => {
                tp.pulse += tp.speed;
                const p3d = latLngTo3D(tp.lat, tp.lng, radius * 1.01);
                const p = rotatePoint(p3d, rotY, rotX);
                if (p.z > 0) {
                    const colorRGB = tp.color === 'sky' ? skyRGB : brassRGB;
                    const r = 2 + (Math.sin(tp.pulse) + 1) * 3; // pulse radius 2 to 8
                    const alpha = 0.8 - (r / 8) * 0.8; // fades as it expands
                    
                    // Center dot
                    ctx.beginPath();
                    ctx.arc(cx + p.x, cy + p.y, 1.5, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${colorRGB}, 0.9)`;
                    ctx.fill();

                    // Expanding ring
                    ctx.beginPath();
                    ctx.arc(cx + p.x, cy + p.y, r, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(${colorRGB}, ${alpha.toFixed(2)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });

            // Flight arcs
            arcs.forEach(arc => {
                arc.progress += arc.speed;
                if (arc.progress > 1) arc.progress = 0;

                const steps = 50;
                const trailLen = 15;
                const headIdx = Math.floor(arc.progress * steps);
                const tailIdx = Math.max(0, headIdx - trailLen);

                ctx.beginPath();
                let started = false;
                for (let s = tailIdx; s <= headIdx && s < steps; s++) {
                    const t = s / steps;
                    const lat = arc.from[0] + (arc.to[0] - arc.from[0]) * t;
                    const lng = arc.from[1] + (arc.to[1] - arc.from[1]) * t;
                    const altitude = 1 + 0.12 * Math.sin(t * Math.PI);
                    const p3d = latLngTo3D(lat, lng, radius * altitude);
                    const p = rotatePoint(p3d, rotY, rotX);
                    if (p.z > 0) {
                        if (!started) { ctx.moveTo(cx + p.x, cy + p.y); started = true; }
                        else ctx.lineTo(cx + p.x, cy + p.y);
                    }
                }
                ctx.strokeStyle = `rgba(${accentRGB}, 0.7)`;
                ctx.lineWidth = 1.5;
                ctx.lineCap = 'round';
                ctx.stroke();

                // Head dot with glow
                const headT = arc.progress;
                const headLat = arc.from[0] + (arc.to[0] - arc.from[0]) * headT;
                const headLng = arc.from[1] + (arc.to[1] - arc.from[1]) * headT;
                const headAlt = 1 + 0.12 * Math.sin(headT * Math.PI);
                const hp = rotatePoint(latLngTo3D(headLat, headLng, radius * headAlt), rotY, rotX);
                if (hp.z > 0) {
                    // Outer glow
                    const headGlow = ctx.createRadialGradient(cx + hp.x, cy + hp.y, 0, cx + hp.x, cy + hp.y, 12);
                    headGlow.addColorStop(0, `rgba(${accentRGB}, 0.5)`);
                    headGlow.addColorStop(1, `rgba(${accentRGB}, 0)`);
                    ctx.fillStyle = headGlow;
                    ctx.beginPath();
                    ctx.arc(cx + hp.x, cy + hp.y, 12, 0, Math.PI * 2);
                    ctx.fill();
                    // Inner dot
                    ctx.beginPath();
                    ctx.arc(cx + hp.x, cy + hp.y, 2.5, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${accentRGB}, 1)`;
                    ctx.fill();
                }

                // City markers (origin and destination)
                [arc.from, arc.to].forEach(([lat, lng]) => {
                    const cp = rotatePoint(latLngTo3D(lat, lng, radius), rotY, rotX);
                    if (cp.z > 0) {
                        ctx.beginPath();
                        ctx.arc(cx + cp.x, cy + cp.y, 2, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(${accentRGB}, 0.8)`;
                        ctx.fill();
                        // Pulse ring
                        const pulseAlpha = 0.3 + Math.sin(rotation * 3) * 0.15;
                        ctx.beginPath();
                        ctx.arc(cx + cp.x, cy + cp.y, 5 + Math.sin(rotation * 2) * 2, 0, Math.PI * 2);
                        ctx.strokeStyle = `rgba(${accentRGB}, ${pulseAlpha.toFixed(2)})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                });
            });

            ctx.restore(); // un-clip

            // Specular highlight (top-left light reflection)
            const specGrad = ctx.createRadialGradient(
                cx - radius * 0.35, cy - radius * 0.35, 0,
                cx - radius * 0.2, cy - radius * 0.2, radius * 0.8
            );
            specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
            specGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.04)');
            specGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.fillStyle = specGrad;
            ctx.fill();

            rotation += 0.004;
            frameRef.current = requestAnimationFrame(draw);
        };

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current.targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            mouseRef.current.targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        };

        const handleMouseLeave = () => {
            mouseRef.current.targetX = 0;
            mouseRef.current.targetY = 0;
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        draw();

        return () => {
            cancelAnimationFrame(frameRef.current);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [size]);

    return (
        <div className="relative group" style={{ width: size, height: size }}>
            {/* Orbital ring 1 */}
            <div
                className="absolute rounded-full border border-vintage-brass/10"
                style={{
                    inset: '-16px',
                    animation: 'spin 50s linear infinite reverse',
                }}
            />
            {/* Orbital ring 2 */}
            <div
                className="absolute rounded-full border border-dashed border-vintage-sky/10"
                style={{
                    inset: '-30px',
                    animation: 'spin 80s linear infinite',
                }}
            />
            {/* Orbital dot */}
            <div
                className="absolute w-2 h-2 rounded-full bg-vintage-accent/60 shadow-[0_0_8px_rgba(200,75,49,0.6)]"
                style={{
                    top: '-20px',
                    left: '50%',
                    animation: 'orbit 50s linear infinite reverse',
                    transformOrigin: `0 ${size / 2 + 20}px`,
                }}
            />
            <canvas
                ref={canvasRef}
                style={{ width: size, height: size }}
                className="cursor-grab active:cursor-grabbing"
            />
        </div>
    );
}
