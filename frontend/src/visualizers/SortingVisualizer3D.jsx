import React from 'react';
import { Text } from '@react-three/drei';

export default function SortingVisualizer3D({ dataStructureState }) {
  const {
    values = [],
    comparedIndices = [],
    swappedIndices = [],
    activeIndex = null,
    pointers = {},
  } = dataStructureState || {};

  const spacing = 1.8;
  const startX = -((values.length - 1) * spacing) / 2;

  const low = pointers?.low;
  const mid = pointers?.mid;
  const high = pointers?.high;

  return (
    <group position={[0, -1, 0]}>
      {/* Ground Foundation */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[values.length * spacing + 2, 0.15, 2]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* 3D Value Bars */}
      {values.map((val, idx) => {
        const height = Math.max(0.6, (val / 50) * 3.5);
        const posX = startX + idx * spacing;
        const isCompared = comparedIndices && comparedIndices.includes(idx);
        const isSwapped = swappedIndices && swappedIndices.includes(idx);
        const isActive = activeIndex === idx || mid === idx;

        let color = '#1e293b';
        let emissive = '#0f172a';

        if (isSwapped) {
          color = '#10b981';
          emissive = '#059669';
        } else if (isCompared) {
          color = '#f59e0b';
          emissive = '#d97706';
        } else if (isActive) {
          color = '#06b6d4';
          emissive = '#0891b2';
        }

        return (
          <group key={`sort-${idx}`} position={[posX, height / 2, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.3, height, 1.2]} />
              <meshStandardMaterial
                color={color}
                emissive={emissive}
                emissiveIntensity={isCompared || isSwapped || isActive ? 0.8 : 0.2}
                metalness={0.2}
                roughness={0.3}
              />
            </mesh>

            {/* Value above bar */}
            <Text
              position={[0, height / 2 + 0.35, 0]}
              fontSize={0.35}
              color="#ffffff"
              fontWeight="bold"
            >
              {String(val)}
            </Text>

            {/* Binary Search Pointers */}
            {mid === idx && (
              <group position={[0, height / 2 + 0.8, 0]}>
                <Text fontSize={0.25} color="#22d3ee" fontWeight="bold">
                  MID
                </Text>
              </group>
            )}
            {low === idx && (
              <group position={[0, height / 2 + 1.1, 0]}>
                <Text fontSize={0.22} color="#34d399" fontWeight="bold">
                  LOW
                </Text>
              </group>
            )}
            {high === idx && (
              <group position={[0, height / 2 + 1.4, 0]}>
                <Text fontSize={0.22} color="#f87171" fontWeight="bold">
                  HIGH
                </Text>
              </group>
            )}

            {/* Index label underneath */}
            <Text
              position={[0, -height / 2 - 0.35, 0]}
              fontSize={0.25}
              color="#64748b"
            >
              {`[${idx}]`}
            </Text>
          </group>
        );
      })}
    </group>
  );
}
