import React from 'react';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

export default function MatrixVisualizer3D({ dataStructureState }) {
  const { matrix = [], pointers = {} } = dataStructureState || {};
  const activeRow = pointers?.activeRow ?? pointers?.R ?? -1;
  const activeCol = pointers?.activeCol ?? pointers?.C ?? -1;

  const rows = matrix.length;
  const cols = rows > 0 ? matrix[0].length : 0;
  const spacing = 1.8;

  let activeVal = null;
  if (activeRow >= 0 && activeRow < rows && activeCol >= 0 && activeCol < cols) {
    activeVal = matrix[activeRow][activeCol];
  }

  const activePosX = (activeCol - (cols - 1) / 2) * spacing;
  const activePosZ = (activeRow - (rows - 1) / 2) * spacing;

  return (
    <group position={[0, 0.4, 0]}>
      {/* Base Foundation Platform */}
      {rows > 0 && cols > 0 && (
        <mesh position={[0, -0.35, 0]} receiveShadow>
          <boxGeometry args={[cols * spacing + 1.2, 0.15, rows * spacing + 1.2]} />
          <meshStandardMaterial color="#090d16" metalness={0.7} roughness={0.3} />
        </mesh>
      )}

      {/* Active Vertical Laser Column */}
      {activeRow >= 0 && activeCol >= 0 && (
        <group position={[activePosX, 1.2, activePosZ]}>
          <mesh>
            <cylinderGeometry args={[0.04, 0.04, 2.4, 16]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} />
          </mesh>
          <pointLight color="#38bdf8" intensity={1.5} distance={4} />

          <Float speed={4} floatIntensity={0.25}>
            <group position={[0, 1.4, 0]}>
              <Text fontSize={0.28} color="#22d3ee" fontWeight="bold">
                {`[${activeRow}][${activeCol}] = ${activeVal}`}
              </Text>
            </group>
          </Float>
        </group>
      )}

      {/* 3D Matrix Grid Blocks */}
      {matrix.map((rowArr, r) => (
        <group key={`r-${r}`} position={[0, 0, (r - (rows - 1) / 2) * spacing]}>
          {rowArr.map((val, c) => {
            const isActive = r === activeRow && c === activeCol;
            const posX = (c - (cols - 1) / 2) * spacing;
            const numericVal = typeof val === 'number' ? val : 0;
            const blockHeight = Math.max(0.5, Math.min(2.5, 0.5 + (numericVal / 20) * 1.5));

            return (
              <group key={`c-${c}`} position={[posX, isActive ? 0.35 : 0, 0]}>
                {/* 3D Block Box */}
                <mesh castShadow receiveShadow position={[0, blockHeight / 2, 0]}>
                  <boxGeometry args={[1.4, blockHeight, 1.4]} />
                  <meshStandardMaterial
                    color={isActive ? '#06b6d4' : '#1e293b'}
                    emissive={isActive ? '#0891b2' : '#0f172a'}
                    emissiveIntensity={isActive ? 0.95 : 0.2}
                    metalness={0.4}
                    roughness={0.25}
                  />
                </mesh>

                {/* Glowing Wireframe Border */}
                <lineSegments position={[0, blockHeight / 2, 0]}>
                  <edgesGeometry args={[new THREE.BoxGeometry(1.41, blockHeight + 0.01, 1.41)]} />
                  <lineBasicMaterial color={isActive ? '#67e8f9' : '#334155'} />
                </lineSegments>

                {/* Value on Top Face */}
                <Text
                  position={[0, blockHeight + 0.02, 0]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  fontSize={0.42}
                  color="#ffffff"
                  fontWeight="bold"
                >
                  {String(val)}
                </Text>

                {/* Coordinate label beneath */}
                <Text
                  position={[0, 0.02, 0.85]}
                  rotation={[-Math.PI / 3, 0, 0]}
                  fontSize={0.2}
                  color={isActive ? '#38bdf8' : '#64748b'}
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
