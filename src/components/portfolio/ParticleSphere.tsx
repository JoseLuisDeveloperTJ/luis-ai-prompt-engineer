import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function Sphere() {
  const pointsRef = useRef<THREE.Points>(null);
  const { mouse } = useThree();

  const { positions, basePositions } = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2.2, 32);
    const pos = geo.attributes.position.array as Float32Array;
    return {
      positions: new Float32Array(pos),
      basePositions: new Float32Array(pos),
    };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < basePositions.length; i += 3) {
      const x = basePositions[i];
      const y = basePositions[i + 1];
      const z = basePositions[i + 2];

      const noise =
        Math.sin(x * 2.5 + t * 0.8) *
        Math.sin(y * 3.1 + t * 0.6) *
        Math.sin(z * 2.8 + t * 0.7) * 0.15;

      const len = Math.sqrt(x * x + y * y + z * z);
      const nx = x / len, ny = y / len, nz = z / len;

      arr[i] = x + nx * noise;
      arr[i + 1] = y + ny * noise;
      arr[i + 2] = z + nz * noise;
    }
    posAttr.needsUpdate = true;

    pointsRef.current.rotation.y = t * 0.08 + mouse.x * 0.3;
    pointsRef.current.rotation.x = -0.2 + mouse.y * 0.2;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#012516"
        transparent
        opacity={0.1}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

export default function ParticleSphere() {
  return (
    <div className="absolute inset-0 -z-[1]">
      <Canvas 
      camera={{ position: [0, 0, 5], fov: 55 }} 
      dpr={[1, 1.5]}
      gl={{ 
        toneMapping: THREE.NoToneMapping, // Esto evita que procese el color y lo deje puro
        outputColorSpace: THREE.SRGBColorSpace 
      }}
      >
        <Sphere />
      </Canvas>
    </div>
  );
}
