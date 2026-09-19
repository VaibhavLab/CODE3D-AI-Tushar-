import React from 'react';
import { Text } from '@react-three/drei';

export default function QueueVisualizer3D({ dataStructureState }) {
  const { values = [] } = dataStructureState || {};
  const spacingX = 2.2;
  const startX = -((values.length - 1) * spacingX) / 2;

  return (
    <group position={[0, 0.5, 0]}>
      {/* Conveyor base */}
      <mesh position={[0, -0.7, 0]}>
        <boxGeometry args={[Math.max(values.length * spacingX + 2, 8), 0.15, 2]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Queue items */}
      {values.map((val, idx) => {
        const posX = startX + idx * spacingX;
        const isFront = idx === 0;
        const isRear = idx === values.length - 1;

        return (
          <group key={`q-${idx}`} position={[posX, 0, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.7, 1.2, 1.4]} />
              <meshStandardMaterial
                color={isFront ? '#10b981' : isRear ? '#3b82f6' : '#1e293b'}
                emissive={isFront ? '#047857' : isRear ? '#1d4ed8' : '#0f172a'}
                emissiveIntensity={0.6}
              />
            </mesh>
            <Text position={[0, 0, 0.75]} fontSize={0.45} color="#ffffff" fontWeight="bold">
              {String(val)}
            </Text>

            {/* FRONT Pointer */}
            {isFront && (
              <group position={[0, 1.3, 0]}>
                <Text fontSize={0.26} color="#34d399" fontWeight="bold">
                  FRONT (Exit)
                </Text>
              </group>
            )}

            {/* REAR Pointer */}
            {isRear && (
              <group position={[0, -1.2, 0]}>
                <Text fontSize={0.26} color="#60a5fa" fontWeight="bold">
                  REAR (Entry)
                </Text>
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}
