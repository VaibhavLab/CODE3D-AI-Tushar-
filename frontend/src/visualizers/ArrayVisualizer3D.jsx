import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

const POINTER_COLORS = {
  i: '#38bdf8',
  j: '#f59e0b',
  left: '#10b981',
  right: '#ef4444',
  start: '#a855f7',
  end: '#ec4899',
  maxStart: '#facc15',
  maxEnd: '#f59e0b',
  curr: '#06b6d4',
  pivot: '#eab308'
};

/**
 * Rotating Holographic Ring around the Active Array Cell
 */
function CellHoloRing({ color = '#00f2fe' }) {
  const ringRef = useRef();

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * 2;
      ringRef.current.rotation.x += delta * 0.8;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={ringRef}>
        <torusGeometry args={[1.15, 0.03, 16, 40]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.8}
          wireframe
        />
      </mesh>
    </group>
  );
}

/**
 * 3D Holographic Water Volume Mesh for "Container With Most Water"
 */
function WaterVolumeMesh({ startX, spacing, leftIdx, rightIdx, leftHeight, rightHeight, currentArea, maxArea }) {
  if (leftIdx === null || rightIdx === null || leftIdx >= rightIdx) return null;

  const leftX = startX + leftIdx * spacing;
  const rightX = startX + rightIdx * spacing;
  const width = rightX - leftX;
  const centerX = (leftX + rightX) / 2;
  const waterHeight = Math.max(0.4, Math.min(leftHeight, rightHeight) * 0.38);

  return (
    <group position={[centerX, waterHeight / 2 - 0.2, 0]}>
      {/* 3D Water Box */}
      <mesh>
        <boxGeometry args={[width, waterHeight, 1.4]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#0891b2"
          emissiveIntensity={0.6}
          transparent
          opacity={0.55}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>

      {/* Surface Water Line Glow */}
      <mesh position={[0, waterHeight / 2, 0]}>
        <boxGeometry args={[width, 0.05, 1.42]} />
        <meshBasicMaterial color="#67e8f9" />
      </mesh>

      {/* Floating Area Metric Tag */}
      <Float speed={2} floatIntensity={0.15}>
        <group position={[0, waterHeight / 2 + 0.6, 0]}>
          <Text
            fontSize={0.26}
            color="#22d3ee"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            {`Water Area: ${currentArea} (Max: ${maxArea || currentArea})`}
          </Text>
          <Text
            position={[0, -0.26, 0]}
            fontSize={0.18}
            color="#94a3b8"
            anchorX="center"
            anchorY="middle"
          >
            {`width (${rightIdx - leftIdx}) × height (${Math.min(leftHeight, rightHeight)})`}
          </Text>
        </group>
      </Float>
    </group>
  );
}

/**
 * Single 3D Array Cell Box with negative value styling, custom height for container pillars, and smooth elevation
 */
function ArrayCell({ value, index, isActive, isPrevious, isInWindow, positionX, pointerNames = [], customHeight = null }) {
  const meshRef = useRef();
  const isNegative = typeof value === 'number' && value < 0;

  // If customHeight is provided (e.g. for Container With Most Water), scale box height
  const baseHeight = customHeight ? Math.max(0.8, Math.min(customHeight * 0.4, 4.5)) : 1.4;
  const targetY = isActive ? 0.75 : isInWindow ? 0.25 : 0;
  const targetScale = isActive ? 1.08 : isInWindow ? 1.02 : 1.0;

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY + baseHeight / 2 - 0.7, delta * 10);
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 10);
    }
  });

  // Dynamic colors based on active, negative, or subarray state
  let boxColor = '#1e293b';
  let emissiveColor = '#0f172a';
  let wireColor = '#334155';

  if (isActive) {
    boxColor = isNegative ? '#9f1239' : '#06b6d4';
    emissiveColor = isNegative ? '#e11d48' : '#0891b2';
    wireColor = isNegative ? '#fda4af' : '#67e8f9';
  } else if (isInWindow) {
    boxColor = isNegative ? '#4c0519' : '#164e63';
    emissiveColor = isNegative ? '#881337' : '#0e7490';
    wireColor = isNegative ? '#f43f5e' : '#22d3ee';
  } else if (isPrevious) {
    boxColor = '#334155';
    emissiveColor = '#1e293b';
    wireColor = '#64748b';
  } else if (isNegative) {
    boxColor = '#271217';
    emissiveColor = '#3f121d';
    wireColor = '#881337';
  }

  return (
    <group position={[positionX, 0, 0]}>
      {/* 3D Cell Box */}
      <group ref={meshRef} position={[0, targetY + baseHeight / 2 - 0.7, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.45, baseHeight, 1.45]} />
          <meshStandardMaterial
            color={boxColor}
            metalness={0.4}
            roughness={0.25}
            emissive={emissiveColor}
            emissiveIntensity={isActive ? 0.95 : isInWindow ? 0.5 : 0.2}
          />
        </mesh>

        {/* Outer glowing wireframe border */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(1.46, baseHeight + 0.01, 1.46)]} />
          <lineBasicMaterial color={wireColor} linewidth={2} />
        </lineSegments>

        {/* Active Holo Ring around active cell */}
        {isActive && <CellHoloRing color={isNegative ? '#f43f5e' : '#00f2fe'} />}

        {/* 3D Value Text */}
        <Text
          position={[0, 0, 0.76]}
          fontSize={0.48}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {String(value)}
        </Text>

        {/* Negative Sign Accent Tag */}
        {isNegative && (
          <mesh position={[0, -baseHeight / 2 + 0.04, 0]}>
            <boxGeometry args={[1.4, 0.08, 1.4]} />
            <meshBasicMaterial color="#f43f5e" />
          </mesh>
        )}

        {/* Floating Multi-Pointer Tags above cell */}
        {pointerNames.length > 0 && (
          <group position={[0, baseHeight / 2 + 0.7, 0]}>
            <Float speed={4} rotationIntensity={0.1} floatIntensity={0.25}>
              <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.22, 0.45, 16]} />
                <meshStandardMaterial
                  color={POINTER_COLORS[pointerNames[0]] || '#38bdf8'}
                  emissive={POINTER_COLORS[pointerNames[0]] || '#0284c7'}
                  emissiveIntensity={0.9}
                />
              </mesh>
              <Text
                position={[0, 0.55, 0]}
                fontSize={0.24}
                color={POINTER_COLORS[pointerNames[0]] || '#38bdf8'}
                anchorX="center"
                anchorY="bottom"
                fontWeight="bold"
              >
                {pointerNames.join(', ')}
              </Text>
            </Float>
          </group>
        )}
      </group>

      {/* Index Label beneath each cell */}
      <group position={[0, -1.0, 0]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.3}
          color={isNegative ? '#f87171' : '#94a3b8'}
          anchorX="center"
          anchorY="middle"
        >
          {`[${index}]`}
        </Text>
        <Text
          position={[0, -0.34, 0]}
          fontSize={0.2}
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
 * Holographic 3D Subarray Bounding Frame (for Kadane's and Sliding Window)
 */
function SubarrayBoundingFrame({ startX, spacing, startIdx, endIdx, isMaxWindow }) {
  if (startIdx === null || endIdx === null || startIdx > endIdx) return null;

  const leftX = startX + startIdx * spacing - 0.9;
  const rightX = startX + endIdx * spacing + 0.9;
  const width = rightX - leftX;
  const centerX = (leftX + rightX) / 2;
  const frameColor = isMaxWindow ? '#facc15' : '#22d3ee';

  return (
    <group position={[centerX, 0.8, 0]}>
      {/* Surrounding Holographic Frame Rails */}
      <mesh position={[0, -0.72, 0]}>
        <boxGeometry args={[width, 0.08, 1.8]} />
        <meshStandardMaterial
          color={frameColor}
          emissive={frameColor}
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Floating Subarray Title HUD */}
      <Float speed={3} floatIntensity={0.15}>
        <Text
          position={[0, 1.6, 0]}
          fontSize={0.26}
          color={frameColor}
          fontWeight="bold"
        >
          {isMaxWindow ? `★ OPTIMAL SUBARRAY [${startIdx}..${endIdx}] ★` : `ACTIVE WINDOW [${startIdx}..${endIdx}]`}
        </Text>
      </Float>
    </group>
  );
}

/**
 * ArrayVisualizer3D renders linear, subarray, and Container With Most Water structures in 3D WebGL space.
 */
export default function ArrayVisualizer3D({ dataStructureState }) {
  const {
    values = [],
    activeIndex = null,
    previousIndex = null,
    pointers = {},
    window = null,
    type = 'array',
    waterVolume = null,
  } = dataStructureState || {};

  const isContainerWater = type === 'container-water' || type === 'most-water' || !!waterVolume;
  const spacing = 2.1;
  const totalWidth = (values.length - 1) * spacing;
  const startX = -totalWidth / 2;

  // Compute pointers per index
  const pointersByIndex = {};
  if (pointers) {
    Object.entries(pointers).forEach(([name, idx]) => {
      if (typeof idx === 'number' && idx >= 0 && idx < values.length) {
        if (!pointersByIndex[idx]) pointersByIndex[idx] = [];
        pointersByIndex[idx].push(name);
      }
    });
  }

  // Active or optimal subarray window
  const windowStart = window?.start ?? null;
  const windowEnd = window?.end ?? null;
  const maxStart = window?.maxStart ?? pointers?.maxStart ?? null;
  const maxEnd = window?.maxEnd ?? pointers?.maxEnd ?? null;

  // Container With Most Water pointers & calculations
  const leftPointer = waterVolume?.left ?? pointers?.left ?? (pointers?.start ?? null);
  const rightPointer = waterVolume?.right ?? pointers?.right ?? (pointers?.end ?? null);
  const currentArea = waterVolume?.area ?? ((leftPointer !== null && rightPointer !== null && values[leftPointer] !== undefined && values[rightPointer] !== undefined)
    ? Math.min(values[leftPointer], values[rightPointer]) * (rightPointer - leftPointer)
    : 0);
  const maxArea = waterVolume?.maxArea ?? pointers?.maxArea ?? null;

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

      {/* Subarray Window Highlights */}
      {!isContainerWater && windowStart !== null && windowEnd !== null && (
        <SubarrayBoundingFrame
          startX={startX}
          spacing={spacing}
          startIdx={windowStart}
          endIdx={windowEnd}
          isMaxWindow={false}
        />
      )}
      {!isContainerWater && maxStart !== null && maxEnd !== null && (
        <SubarrayBoundingFrame
          startX={startX}
          spacing={spacing}
          startIdx={maxStart}
          endIdx={maxEnd}
          isMaxWindow={true}
        />
      )}

      {/* 3D Volumetric Water Rendering for Container With Most Water */}
      {isContainerWater && leftPointer !== null && rightPointer !== null && (
        <WaterVolumeMesh
          startX={startX}
          spacing={spacing}
          leftIdx={leftPointer}
          rightIdx={rightPointer}
          leftHeight={values[leftPointer] || 0}
          rightHeight={values[rightPointer] || 0}
          currentArea={currentArea}
          maxArea={maxArea}
        />
      )}

      {/* Array Elements / Pillars */}
      {values.map((val, idx) => {
        const posX = startX + idx * spacing;
        const isActive = activeIndex === idx || idx === leftPointer || idx === rightPointer;
        const isPrevious = previousIndex === idx;
        const isInWindow = windowStart !== null && windowEnd !== null && idx >= windowStart && idx <= windowEnd;
        const cellPointers = pointersByIndex[idx] || [];

        return (
          <ArrayCell
            key={`cell-${idx}`}
            index={idx}
            value={val}
            isActive={isActive}
            isPrevious={isPrevious}
            isInWindow={isInWindow}
            positionX={posX}
            pointerNames={cellPointers}
            customHeight={isContainerWater ? val : null}
          />
        );
      })}
    </group>
  );
}
