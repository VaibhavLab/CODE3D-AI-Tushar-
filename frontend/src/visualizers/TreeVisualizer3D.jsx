import React from 'react';
import { Text } from '@react-three/drei';

export default function TreeVisualizer3D({ dataStructureState }) {
  const { activeIndex = null } = dataStructureState || {};

  const treeNodes = [
    { id: 0, val: 50, pos: [0, 2.4, 0], parentPos: null },
    { id: 1, val: 30, pos: [-2.5, 0.8, 0], parentPos: [0, 2.4, 0] },
    { id: 2, val: 70, pos: [2.5, 0.8, 0], parentPos: [0, 2.4, 0] },
    { id: 3, val: 20, pos: [-3.8, -0.8, 0], parentPos: [-2.5, 0.8, 0] },
    { id: 4, val: 40, pos: [-1.2, -0.8, 0], parentPos: [-2.5, 0.8, 0] },
    { id: 5, val: 60, pos: [1.2, -0.8, 0], parentPos: [2.5, 0.8, 0] },
    { id: 6, val: 80, pos: [3.8, -0.8, 0], parentPos: [2.5, 0.8, 0] },
  ];

  return (
    <group position={[0, 0.2, 0]}>
      {/* Node Spheres & connecting branches */}
      {treeNodes.map((node) => {
        const isActive = activeIndex === node.id;

        return (
          <group key={`tree-node-${node.id}`} position={node.pos}>
            <mesh castShadow>
              <sphereGeometry args={[0.55, 32, 32]} />
              <meshStandardMaterial
                color={isActive ? '#06b6d4' : '#1e293b'}
                emissive={isActive ? '#0891b2' : '#0f172a'}
                emissiveIntensity={isActive ? 0.9 : 0.2}
                metalness={0.3}
                roughness={0.2}
              />
            </mesh>
            <Text position={[0, 0, 0.6]} fontSize={0.36} color="#ffffff" fontWeight="bold">
              {String(node.val)}
            </Text>

            {isActive && (
              <group position={[0, 0.9, 0]}>
                <Text fontSize={0.25} color="#22d3ee" fontWeight="bold">
                  Active Node
                </Text>
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}
