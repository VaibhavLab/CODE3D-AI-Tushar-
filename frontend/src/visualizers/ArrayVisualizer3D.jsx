import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Single 3D Array Cell Box with smooth elevation and lighting
 */
function ArrayCell({ value, index, isActive, isPrevious, positionX }) {
  const meshRef = useRef();
  const pointerRef = useRef();

  // Target Y position (elevated if active)
  const targetY = isActive ? 0.65 : 0;
  const targetScale = isActive ? 1.08 : 1.0;

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Smooth lerp elevation
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        targetY,
        delta * 10
      );
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        delta * 10
      );
    }

    if (pointerRef.current && isActive) {
      pointerRef.current.rotation.y += delta * 2;
    }
  });

  return (
    <group position={[positionX, 0, 0]}>
      {/* 3D Cell Box */}
      <group ref={meshRef} position={[0, targetY, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.5, 1.4, 1.5]} />
          <meshStandardMaterial
            color={isActive ? '#06b6d4' : isPrevious ? '#334155' : '#1e293b'}
            metalness={0.4}
            roughness={0.25}
            emissive={isActive ? '#0891b2' : isPrevious ? '#1e293b' : '#0f172a'}
            emissiveIntensity={isActive ? 0.75 : 0.15}
          />
        </mesh>

        {/* Outer glowing wireframe border for high-tech aesthetic */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(1.51, 1.41, 1.51)]} />
          <lineBasicMaterial
            color={isActive ? '#67e8f9' : isPrevious ? '#64748b' : '#334155'}
            linewidth={2}
          />
        </lineSegments>

        {/* 3D Value Text inside/front face of the box */}
        <Text
          position={[0, 0, 0.78]}
          fontSize={0.55}
          color={isActive ? '#ffffff' : '#e2e8f0'}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {String(value)}
        </Text>

        {/* Floating Arrow Pointer above active cell */}
        {isActive && (
          <group position={[0, 1.4, 0]}>
            <Float speed={5} rotationIntensity={0.2} floatIntensity={0.3}>
              <group ref={pointerRef}>
                {/* Downward cone pointer */}
                <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
                  <coneGeometry args={[0.3, 0.6, 16]} />
                  <meshStandardMaterial
                    color="#22d3ee"
                    emissive="#06b6d4"
                    emissiveIntensity={0.9}
                  />
                </mesh>
                {/* Pointer glow beacon */}
                <pointLight color="#22d3ee" intensity={1.2} distance={3} />
              </group>
            </Float>
            <Text
              position={[0, 0.7, 0]}
              fontSize={0.28}
              color="#38bdf8"
              anchorX="center"
              anchorY="bottom"
              fontWeight="bold"
            >
              arr[{index}]
            </Text>
          </group>
        )}
      </group>

      {/* Index Label beneath each cell */}
      <group position={[0, -1.0, 0]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.32}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          {`[${index}]`}
        </Text>
        <Text
          position={[0, -0.38, 0]}
          fontSize={0.22}
          color="#64748b"
          anchorX="center"
          anchorY="middle"
        >
          INDEX
        </Text>
      </group>
    </group>
  );
}

/**
 * ArrayVisualizer3D renders a linear 3D array in the scene.
 */
export default function ArrayVisualizer3D({ dataStructureState }) {
  const { values = [], activeIndex = null, previousIndex = null } = dataStructureState || {};
  const spacing = 2.1;
  const totalWidth = (values.length - 1) * spacing;
  const startX = -totalWidth / 2;

  return (
    <group position={[0, 0.8, 0]}>
      {/* Base Foundation Rail */}
      {values.length > 0 && (
        <mesh position={[0, -0.75, 0]} receiveShadow>
          <boxGeometry args={[totalWidth + 2.5, 0.12, 1.8]} />
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.6}
            metalness={0.3}
          />
        </mesh>
      )}

      {/* Array Elements */}
      {values.map((val, idx) => {
        const posX = startX + idx * spacing;
        const isActive = activeIndex === idx;
        const isPrevious = previousIndex === idx;

        return (
          <ArrayCell
            key={`cell-${idx}`}
            index={idx}
            value={val}
            isActive={isActive}
            isPrevious={isPrevious}
            positionX={posX}
          />
        );
      })}
    </group>
  );
}
