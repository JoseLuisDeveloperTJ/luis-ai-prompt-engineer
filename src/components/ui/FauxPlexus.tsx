import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function PlexusNetwork({ count = 70 }) {
  const { viewport } = useThree();
  const linesRef = useRef<THREE.LineSegments>(null);
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const rangeX = viewport.width * 1.5;
    const rangeY = viewport.height * 1.5;

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * rangeX;     // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * rangeY; // y
      pos[i * 3 + 2] = 0;                              // z (plano 2D)

      vel[i * 3] = (Math.random() - 0.5) * 0.005;      // vx
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.005;  // vy
      vel[i * 3 + 2] = 0;
    }
    return { positions: pos, velocities: vel };
  }, [count, viewport]);

  useFrame(() => {
    if (!pointsRef.current || !linesRef.current) return;

    const pointsAttr = pointsRef.current.geometry.attributes.position;
    const pointsArr = pointsAttr.array as Float32Array;
    const lineGeo = linesRef.current.geometry;
    
    // Movemos los puntos y rebotamos en los bordes
    const limitX = viewport.width * 0.8;
    const limitY = viewport.height * 0.8;

    for (let i = 0; i < count; i++) {
      pointsArr[i * 3] += velocities[i * 3];
      pointsArr[i * 3 + 1] += velocities[i * 3 + 1];

      if (Math.abs(pointsArr[i * 3]) > limitX) velocities[i * 3] *= -1;
      if (Math.abs(pointsArr[i * 3 + 1]) > limitY) velocities[i * 3 + 1] *= -1;
    }
    pointsAttr.needsUpdate = true;

    const linePositions = [];
    const maxDistance = 1.5;

    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = pointsArr[i * 3] - pointsArr[j * 3];
        const dy = pointsArr[i * 3 + 1] - pointsArr[j * 3 + 1];
        const distSq = dx * dx + dy * dy;

        if (distSq < maxDistance * maxDistance) {
          linePositions.push(pointsArr[i * 3], pointsArr[i * 3 + 1], pointsArr[i * 3 + 2]);
          linePositions.push(pointsArr[j * 3], pointsArr[j * 3 + 1], pointsArr[j * 3 + 2]);
        }
      }
    }

    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.06} color="#10b981" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#064e3b" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

export default function FauxPlexusBackground() {
  return (
    <div className="absolute inset-0 -z-10 bg-[#080A0C]">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ toneMapping: THREE.NoToneMapping }}>
        <PlexusNetwork />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#080A0C_95%)] pointer-events-none" />
    </div>
  );
}