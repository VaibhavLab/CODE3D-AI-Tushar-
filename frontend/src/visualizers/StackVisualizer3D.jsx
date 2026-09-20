import React from 'react';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

export default function StackVisualizer3D({ dataStructureState }) {
  const { values = [], pointers = {} } = dataStructureState || {};
  const spacingY = 1.35;
  const maxHeight = Math.max(values.length * spacingY + 1.5, 6);

  return (
    <group position={[0, -1.8, 0]}>
      {/* Sci-fi Base Container Plate */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[2.2, 2.4, 0.3, 32]} />
        <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Base Glowing Ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.9, 2.1, 32]} />
        <meshBasicMaterial color="#06b6d4" />
      </mesh>

      {/* Futuristic Stack Glass Guide Rails */}
      <mesh position={[-1.5, maxHeight / 2, 0]}>
        <cylinderGeometry args={[0.06, 0.06, maxHeight, 16]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[1.5, maxHeight / 2, 0]}>
        <cylinderGeometry args={[0.06, 0.06, maxHeight, 16]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
      </mesh>

      {/* Transparent Glass Backing */}
      <mesh position={[0, maxHeight / 2, -1.1]}>
        <boxGeometry args={[2.9, maxHeight, 0.04]} />
        <meshStandardMaterial color="#0284c7" transparent opacity={0.12} roughness={0.1} />
      </mesh>

      {/* Stack Empty Message */}
      {values.length === 0 && (
        <group position={[0, 1.5, 0]}>
          <Text fontSize={0.35} color="#94a3b8" fontWeight="bold">
            [STACK EMPTY (Size: 0)]
          </Text>
        </group>
      )}

      {/* Stack Elements (LIFO: Bottom to Top) */}
      {values.map((val, idx) => {
        const posY = idx * spacingY + 0.7;
        const isTop = idx === values.length - 1;

        return (
          <group key={`stack-${idx}`} position={[0, posY, 0]}>
            {/* 3D Stack Element Box */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[2.5, 1.1, 1.8]} />
              <meshStandardMaterial
                color={isTop ? '#06b6d4' : '#1e293b'}
                emissive={isTop ? '#0891b2' : '#0f172a'}
                emissiveIntensity={isTop ? 0.9 : 0.2}
                metalness={0.4}
                roughness={0.2}
              />
            </mesh>

            {/* Glowing Wireframe Border */}
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(2.51, 1.11, 1.81)]} />
              <lineBasicMaterial color={isTop ? '#67e8f9' : '#334155'} />
            </lineSegments>

            {/* Element Value */}
            <Text
              position={[0, 0, 0.95]}
              fontSize={0.46}
              color="#ffffff"
              fontWeight="bold"
            >
              {String(val)}
            </Text>

            {/* Index label on side */}
            <Text
              position={[-1.75, 0, 0]}
              fontSize={0.24}
              color="#64748b"
              fontWeight="bold"
            >
              {`[${idx}]`}
            </Text>

            {/* TOP Indicator */}
            {isTop && (
              <Float speed={4} rotationIntensity={0.1} floatIntensity={0.2}>
                <group position={[2.0, 0, 0]}>
                  <Text fontSize={0.3} color="#22d3ee" fontWeight="bold">
                    ← TOP
                  </Text>
                </group>
              </Float>
            )}
          </group>
        );
      })}
    </group>
  );
}
