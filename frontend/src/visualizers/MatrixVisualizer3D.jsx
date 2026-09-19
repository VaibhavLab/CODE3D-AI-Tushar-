import React from 'react';
import { Text } from '@react-three/drei';

export default function MatrixVisualizer3D({ dataStructureState }) {
  const { matrix = [], pointers = {} } = dataStructureState || {};
  const activeRow = pointers?.activeRow ?? -1;
  const activeCol = pointers?.activeCol ?? -1;

  const rows = matrix.length;
  const cols = rows > 0 ? matrix[0].length : 0;
  const spacing = 1.8;

  return (
    <group position={[0, 0.5, 0]}>
      {matrix.map((rowArr, r) => (
        <group key={`r-${r}`} position={[0, 0, (r - (rows - 1) / 2) * spacing]}>
          {rowArr.map((val, c) => {
            const isActive = r === activeRow && c === activeCol;
            const posX = (c - (cols - 1) / 2) * spacing;

            return (
              <group key={`c-${c}`} position={[posX, isActive ? 0.4 : 0, 0]}>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[1.3, 0.6, 1.3]} />
                  <meshStandardMaterial
                    color={isActive ? '#06b6d4' : '#1e293b'}
                    emissive={isActive ? '#0891b2' : '#0f172a'}
                    emissiveIntensity={isActive ? 0.8 : 0.15}
                  />
                </mesh>
                <Text
                  position={[0, 0.35, 0]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  fontSize={0.4}
                  color={isActive ? '#ffffff' : '#94a3b8'}
                  fontWeight="bold"
                >
                  {String(val)}
                </Text>
                <Text
                  position={[0, -0.4, 0]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  fontSize={0.2}
                  color="#64748b"
                >
                  {`[${r}][${c}]`}
                </Text>
              </group>
            );
          })}
        </group>
      ))}
    </group>
  );
}
