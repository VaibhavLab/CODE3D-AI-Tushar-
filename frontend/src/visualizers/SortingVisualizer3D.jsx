import React, { useState } from 'react';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 3D Laser Arch connecting two compared pillars
 */
function ComparisonLaserArch({ startX, startHeight, endX, endHeight }) {
  const p1 = new THREE.Vector3(startX, startHeight + 0.4, 0);
  const p2 = new THREE.Vector3(endX, endHeight + 0.4, 0);
  const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
  mid.y += 0.6; // arch apex

  const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
  const points = curve.getPoints(24);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <group>
      <line geometry={geometry}>
        <lineBasicMaterial color="#f59e0b" linewidth={3} />
      </line>
      <Float speed={4} floatIntensity={0.2}>
        <Text position={[mid.x, mid.y + 0.35, mid.z]} fontSize={0.26} color="#facc15" fontWeight="bold">
          COMPARING
        </Text>
      </Float>
    </group>
  );
}

export default function SortingVisualizer3D({ dataStructureState }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const {
    values = [],
    comparedIndices = [],
    swappedIndices = [],
    sortedIndices = [],
    activeIndex = null,
    pointers = {},
  } = dataStructureState || {};

  const spacing = 1.8;
  const startX = -((values.length - 1) * spacing) / 2;

  const low = pointers?.low;
  const mid = pointers?.mid;
  const high = pointers?.high;
  const pivot = pointers?.pivot;

  // Find heights of compared indices for laser arch
  let comparedArch = null;
  if (comparedIndices && comparedIndices.length >= 2) {
    const idxA = comparedIndices[0];
    const idxB = comparedIndices[1];
    if (idxA < values.length && idxB < values.length) {
      const hA = Math.max(0.6, (values[idxA] / 50) * 3.5);
      const hB = Math.max(0.6, (values[idxB] / 50) * 3.5);
      comparedArch = {
        startX: startX + idxA * spacing,
        startHeight: hA,
        endX: startX + idxB * spacing,
        endHeight: hB,
      };
    }
  }

  return (
    <group position={[0, -1, 0]}>
      {/* Ground Foundation Pedestal */}
      <mesh position={[0, -0.12, 0]} receiveShadow>
        <boxGeometry args={[values.length * spacing + 2.5, 0.16, 2.4]} />
        <meshStandardMaterial color="#090d16" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Laser Arch between compared pillars */}
      {comparedArch && (
        <ComparisonLaserArch
          startX={comparedArch.startX}
          startHeight={comparedArch.startHeight}
          endX={comparedArch.endX}
          endHeight={comparedArch.endHeight}
        />
      )}

      {/* 3D Value Bars / Pillars */}
      {values.map((val, idx) => {
        const height = Math.max(0.6, (val / 50) * 3.5);
        const posX = startX + idx * spacing;
        const isCompared = comparedIndices && comparedIndices.includes(idx);
        const isSwapped = swappedIndices && swappedIndices.includes(idx);
        const isSorted = sortedIndices && sortedIndices.includes(idx);
        const isActive = activeIndex === idx || mid === idx;
        const isPivot = pivot === idx;

        let color = '#1e293b';
        let emissive = '#0f172a';
        let wireColor = '#334155';

        if (isSwapped) {
          color = '#10b981';
          emissive = '#059669';
          wireColor = '#6ee7b7';
        } else if (isCompared) {
          color = '#f59e0b';
          emissive = '#d97706';
          wireColor = '#fde68a';
        } else if (isPivot) {
          color = '#8b5cf6';
          emissive = '#7c3aed';
          wireColor = '#c4b5fd';
        } else if (isActive) {
          color = '#06b6d4';
          emissive = '#0891b2';
          wireColor = '#67e8f9';
        } else if (isSorted) {
          color = '#047857';
          emissive = '#059669';
          wireColor = '#34d399';
        }

        const isHovered = hoveredIdx === idx;
        const hoverScale = isHovered ? 1.3 : 1.0;
        const hoverElevation = isHovered ? 0.35 : 0;

        return (
          <group
            key={`sort-${idx}`}
            position={[posX, height / 2 + hoverElevation, 0]}
            scale={[hoverScale, hoverScale, hoverScale]}
          >
            {/* 3D Pillar Box */}
            <mesh
              castShadow
              receiveShadow
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredIdx(idx);
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                setHoveredIdx(null);
                document.body.style.cursor = 'default';
              }}
            >
              <boxGeometry args={[1.3, height, 1.2]} />
              <meshStandardMaterial
                color={isHovered ? '#0284c7' : color}
                emissive={isHovered ? '#38bdf8' : emissive}
                emissiveIntensity={isHovered ? 1.8 : (isCompared || isSwapped || isActive || isPivot ? 0.9 : 0.25)}
                metalness={0.4}
                roughness={0.2}
              />
            </mesh>

            {/* Glowing Wireframe Border */}
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(1.31, height + 0.01, 1.21)]} />
              <lineBasicMaterial color={isHovered ? '#38bdf8' : wireColor} linewidth={2} />
            </lineSegments>

            {/* Interactive Mouse Hover 3D Inspection Tooltip */}
            {isHovered && (
              <Float speed={5} floatIntensity={0.15}>
                <group position={[0, height / 2 + 1.25, 0]}>
                  <mesh position={[0, 0, -0.02]}>
                    <planeGeometry args={[2.7, 1.0]} />
                    <meshBasicMaterial color="#080e1e" transparent opacity={0.94} />
                  </mesh>
                  <lineSegments position={[0, 0, -0.01]}>
                    <edgesGeometry args={[new THREE.BoxGeometry(2.72, 1.02, 0.01)]} />
                    <lineBasicMaterial color="#38bdf8" />
                  </lineSegments>
                  <Text position={[0, 0.3, 0.05]} fontSize={0.21} color="#38bdf8" fontWeight="bold">
                    {`Pillar [${idx}] = ${val}`}
                  </Text>
                  <Text position={[0, 0.04, 0.05]} fontSize={0.14} color="#94a3b8">
                    {`Size: 1.30 × ${height.toFixed(2)} × 1.20`}
                  </Text>
                  <Text position={[0, -0.22, 0.05]} fontSize={0.13} color="#22c55e" fontStyle="italic">
                    {`⚡ Scaled 130% on Mouse Over`}
                  </Text>
                </group>
              </Float>
            )}

            {/* Value above bar */}
            <Text
              position={[0, height / 2 + 0.38, 0]}
              fontSize={0.34}
              color="#ffffff"
              fontWeight="bold"
            >
              {String(val)}
            </Text>

            {/* Pointer Badges */}
            {isPivot && (
              <Float speed={5} floatIntensity={0.2}>
                <group position={[0, height / 2 + 0.8, 0]}>
                  <Text fontSize={0.24} color="#c4b5fd" fontWeight="bold">
                    PIVOT
                  </Text>
                </group>
              </Float>
            )}
            {mid === idx && (
              <group position={[0, height / 2 + 0.8, 0]}>
                <Text fontSize={0.24} color="#22d3ee" fontWeight="bold">
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
              fontSize={0.24}
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
