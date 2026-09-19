import React from 'react';
import { Text } from '@react-three/drei';

export default function StackVisualizer3D({ dataStructureState }) {
  const { values = [], activeIndex = 0, pointers = {} } = dataStructureState || {};
  const spacingY = 1.3;

  return (
    <group position={[0, -1.5, 0]}>
      {/* Base container plate */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[3, 0.2, 2.5]} />
        <meshStandardMaterial color="#0f172a" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Stack side rails */}
      <mesh position={[-1.4, 2.5, 0]}>
        <boxGeometry args={[0.1, 5, 2.2]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={0.6} />
      </mesh>
      <mesh position={[1.4, 2.5, 0]}>
        <boxGeometry args={[0.1, 5, 2.2]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={0.6} />
      </mesh>

      {/* Stack elements from bottom up */}
      {values.map((val, idx) => {
        const posY = idx * spacingY + 0.6;
        const isTop = idx === values.length - 1;

        return (
          <group key={`stack-${idx}`} position={[0, posY, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[2.4, 1.1, 1.8]} />
              <meshStandardMaterial
                color={isTop ? '#06b6d4' : '#1e293b'}
                emissive={isTop ? '#0891b2' : '#0f172a'}
                emissiveIntensity={isTop ? 0.8 : 0.15}
              />
            </mesh>
            <Text
              position={[0, 0, 0.95]}
              fontSize={0.45}
              color="#ffffff"
              fontWeight="bold"
            >
              {String(val)}
            </Text>

            {/* TOP indicator above latest element */}
            {isTop && (
              <group position={[1.7, 0, 0]}>
                <Text fontSize={0.3} color="#22d3ee" fontWeight="bold">
                  ← TOP
                </Text>
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}
