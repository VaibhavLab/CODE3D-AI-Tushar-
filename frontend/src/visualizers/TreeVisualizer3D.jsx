import React from 'react';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 3D Laser Branch connecting parent and child nodes
 */
function TreeBranch({ start, end, isActive }) {
  if (!start || !end) return null;
  const p1 = new THREE.Vector3(...start);
  const p2 = new THREE.Vector3(...end);
  const dir = new THREE.Vector3().subVectors(p2, p1);
  const length = dir.length();
  if (length === 0) return null;
  const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.clone().normalize()
  );

  return (
    <mesh position={mid} quaternion={quat}>
      <cylinderGeometry args={[0.05, 0.05, length, 16]} />
      <meshStandardMaterial
        color={isActive ? '#38bdf8' : '#334155'}
        emissive={isActive ? '#0284c7' : '#0f172a'}
        emissiveIntensity={isActive ? 0.9 : 0.2}
        metalness={0.5}
        roughness={0.2}
      />
    </mesh>
  );
}

/**
 * Premium 3D Tree & BST Visualizer with glowing spheres and laser branches
 */
export default function TreeVisualizer3D({ dataStructureState }) {
  const { activeIndex = null, nodes = [], values = [] } = dataStructureState || {};

  // Standard hierarchical positions for binary trees (up to 7-15 nodes)
  const defaultPositions = [
    [0, 2.6, 0],         // Node 0 (Root)
    [-2.6, 1.1, 0],      // Node 1 (Left child)
    [2.6, 1.1, 0],       // Node 2 (Right child)
    [-3.9, -0.6, 0],     // Node 3 (Left-Left)
    [-1.3, -0.6, 0],     // Node 4 (Left-Right)
    [1.3, -0.6, 0],      // Node 5 (Right-Left)
    [3.9, -0.6, 0],      // Node 6 (Right-Right)
    [-4.7, -2.1, 0],
    [-3.1, -2.1, 0],
    [-2.0, -2.1, 0],
    [-0.7, -2.1, 0],
    [0.7, -2.1, 0],
    [2.0, -2.1, 0],
    [3.1, -2.1, 0],
    [4.7, -2.1, 0],
  ];

  const parentMap = [
    null, // 0 is root
    0,    // 1 -> 0
    0,    // 2 -> 0
    1,    // 3 -> 1
    1,    // 4 -> 1
    2,    // 5 -> 2
    2,    // 6 -> 2
    3, 3, 4, 4, 5, 5, 6, 6
  ];

  let resolvedNodes = [];
  if (nodes && nodes.length > 0) {
    resolvedNodes = nodes.map((n, i) => {
      const pos = defaultPositions[i % defaultPositions.length];
      const pIdx = n.parent !== undefined ? (typeof n.parent === 'number' ? n.parent : null) : parentMap[i];
      const parentPos = (pIdx !== null && pIdx >= 0 && pIdx < defaultPositions.length) ? defaultPositions[pIdx] : null;
      return {
        id: n.id ?? i,
        val: n.val ?? n.value ?? n.id ?? i,
        pos,
        parentPos,
      };
    });
  } else if (values && values.length > 0) {
    resolvedNodes = values.map((val, i) => {
      const pos = defaultPositions[i % defaultPositions.length];
      const pIdx = parentMap[i];
      const parentPos = (pIdx !== null && pIdx >= 0 && pIdx < defaultPositions.length) ? defaultPositions[pIdx] : null;
      return {
        id: i,
        val,
        pos,
        parentPos,
      };
    });
  } else {
    // Default BST
    const defaultVals = [50, 30, 70, 20, 40, 60, 80];
    resolvedNodes = defaultVals.map((val, i) => ({
      id: i,
      val,
      pos: defaultPositions[i],
      parentPos: parentMap[i] !== null ? defaultPositions[parentMap[i]] : null,
    }));
  }

  return (
    <group position={[0, 0.1, 0]}>
      {/* Laser Branches between Parent and Child */}
      {resolvedNodes.map((node) => {
        if (!node.parentPos) return null;
        const isActiveBranch = activeIndex === node.id;
        return (
          <TreeBranch
            key={`branch-${node.id}`}
            start={node.parentPos}
            end={node.pos}
            isActive={isActiveBranch}
          />
        );
      })}

      {/* 3D Glowing Spheres for Nodes */}
      {resolvedNodes.map((node) => {
        const isActive = activeIndex === node.id;

        return (
          <group key={`tree-node-${node.id}`} position={node.pos}>
            {/* Sphere Mesh with cyber glowing material */}
            <mesh castShadow receiveShadow>
              <sphereGeometry args={[0.58, 32, 32]} />
              <meshStandardMaterial
                color={isActive ? '#06b6d4' : '#1e293b'}
                emissive={isActive ? '#0891b2' : '#0f172a'}
                emissiveIntensity={isActive ? 0.95 : 0.25}
                metalness={0.4}
                roughness={0.2}
              />
            </mesh>

            {/* Outer wireframe halo ring */}
            <lineSegments>
              <edgesGeometry args={[new THREE.SphereGeometry(0.59, 16, 16)]} />
              <lineBasicMaterial color={isActive ? '#67e8f9' : '#334155'} />
            </lineSegments>

            {/* Node Value */}
            <Text
              position={[0, 0, 0.65]}
              fontSize={0.36}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
            >
              {String(node.val)}
            </Text>

            {/* Active Pointer Beacon */}
            {isActive && (
              <Float speed={5} rotationIntensity={0.2} floatIntensity={0.2}>
                <group position={[0, 0.95, 0]}>
                  <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
                    <coneGeometry args={[0.2, 0.45, 16]} />
                    <meshStandardMaterial color="#22d3ee" emissive="#06b6d4" emissiveIntensity={0.9} />
                  </mesh>
                  <Text position={[0, 0.4, 0]} fontSize={0.24} color="#38bdf8" fontWeight="bold">
                    ACTIVE
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
