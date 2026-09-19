import React from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export default function LinkedListVisualizer3D({ dataStructureState }) {
  const { nodes = [], activeIndex = null } = dataStructureState || {};
  const spacing = 3.2;
  const startX = -((nodes.length - 1) * spacing) / 2;

  return (
    <group position={[0, 0.8, 0]}>
      {nodes.map((node, idx) => {
        const posX = startX + idx * spacing;
        const isActive = activeIndex === idx;

        return (
          <group key={`node-${idx}`} position={[posX, isActive ? 0.5 : 0, 0]}>
            {/* 3D Node Mesh (Capsule / Rounded Box) */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.8, 1.2, 1.2]} />
              <meshStandardMaterial
                color={isActive ? '#06b6d4' : '#1e293b'}
                emissive={isActive ? '#0891b2' : '#0f172a'}
                emissiveIntensity={isActive ? 0.75 : 0.15}
              />
            </mesh>

            {/* Wireframe border */}
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(1.81, 1.21, 1.21)]} />
              <lineBasicMaterial color={isActive ? '#67e8f9' : '#334155'} />
            </lineSegments>

            {/* Value Label */}
            <Text
              position={[-0.3, 0, 0.62]}
              fontSize={0.45}
              color={isActive ? '#ffffff' : '#e2e8f0'}
              fontWeight="bold"
            >
              {String(node.value)}
            </Text>

            {/* Pointer section divider inside node */}
            <mesh position={[0.3, 0, 0]}>
              <boxGeometry args={[0.04, 1.15, 1.15]} />
              <meshBasicMaterial color="#334155" />
            </mesh>
            <Text
              position={[0.55, 0, 0.62]}
              fontSize={0.22}
              color="#38bdf8"
              fontWeight="bold"
            >
              next
            </Text>

            {/* Pointer Arrow connecting to next node */}
            {idx < nodes.length - 1 && (
              <group position={[1.0, 0, 0]}>
                {/* Horizontal pointer rod */}
                <mesh position={[0.65, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                  <cylinderGeometry args={[0.05, 0.05, 1.3]} />
                  <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
                </mesh>
                {/* Pointer cone tip */}
                <mesh position={[1.3, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                  <coneGeometry args={[0.15, 0.35, 16]} />
                  <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
                </mesh>
              </group>
            )}

            {/* Null terminator for last node */}
            {idx === nodes.length - 1 && (
              <group position={[1.4, 0, 0]}>
                <Text position={[0.4, 0, 0]} fontSize={0.28} color="#ef4444" fontWeight="bold">
                  NULL
                </Text>
              </group>
            )}

            {/* Pointer tag */}
            {isActive && (
              <group position={[0, 1.3, 0]}>
                <Text fontSize={0.3} color="#22d3ee" fontWeight="bold">
                  curr
                </Text>
                <mesh position={[0, -0.4, 0]} rotation={[Math.PI, 0, 0]}>
                  <coneGeometry args={[0.18, 0.35, 12]} />
                  <meshStandardMaterial color="#22d3ee" emissive="#06b6d4" />
                </mesh>
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}
