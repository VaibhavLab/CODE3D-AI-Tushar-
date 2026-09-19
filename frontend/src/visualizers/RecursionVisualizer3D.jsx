import React from 'react';
import { Text } from '@react-three/drei';

export default function RecursionVisualizer3D({ dataStructureState }) {
  const { callStack = [] } = dataStructureState || {};
  const spacingY = 1.3;

  return (
    <group position={[0, -1.2, 0]}>
      {/* Base platform */}
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[5.5, 0.2, 3]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* 3D Call Stack Frames */}
      {callStack.map((frame, idx) => {
        const posY = idx * spacingY + 0.6;
        const isLatest = idx === callStack.length - 1;
        const isReturn = frame.state === 'RETURN' || frame.state === 'BASE_CASE';

        return (
          <group key={`frame-${idx}`} position={[0, posY, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[4.5, 1.0, 2.2]} />
              <meshStandardMaterial
                color={isReturn ? '#10b981' : isLatest ? '#06b6d4' : '#1e293b'}
                emissive={isReturn ? '#059669' : isLatest ? '#0891b2' : '#0f172a'}
                emissiveIntensity={isLatest || isReturn ? 0.8 : 0.2}
                metalness={0.2}
                roughness={0.3}
              />
            </mesh>

            {/* Frame method signature */}
            <Text
              position={[0, 0, 1.15]}
              fontSize={0.35}
              color="#ffffff"
              fontWeight="bold"
            >
              {String(frame.func || 'frame()')}
            </Text>

            {/* Frame State */}
            <group position={[2.6, 0, 0]}>
              <Text
                fontSize={0.25}
                color={isReturn ? '#34d399' : '#38bdf8'}
                fontWeight="bold"
              >
                {frame.state || 'CALL'}
              </Text>
            </group>
          </group>
        );
      })}
    </group>
  );
}
