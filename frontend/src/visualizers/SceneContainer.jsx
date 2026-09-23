import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Center, Grid, Bounds, useBounds } from '@react-three/drei';
import { Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function CameraView({ view, controlsRef }) {
  const { camera } = useThree();
  const bounds = useBounds();
  useEffect(() => {
    const positions = { iso: [4, 3.5, 6], front: [0, 2.5, 12], top: [0, 16, 0.01] };
    camera.position.set(...positions[view.name]);
    controlsRef.current?.target.set(0, 0, 0);
    camera.lookAt(0, 0, 0);
    controlsRef.current?.update();
    bounds.refresh().reset().fit();
  }, [view, camera, controlsRef, bounds]);
  return null;
}

export default function SceneContainer({ children, currentStep, statusLabel, isFull3DView, onToggleFull3D }) {
  const { isBright } = useTheme();
  const [view, setView] = useState({ name: 'iso' });
  const controlsRef = useRef(null);
  return (
    <div className="scene-shell">
      <div className="scene-toolbar">
        <span className="scene-title">3D view</span>
        <div className="scene-camera" aria-label="Camera views">
          {[['iso', 'Orbit'], ['front', 'Front'], ['top', 'Top']].map(([name, label]) =>
            <button key={name} aria-pressed={view.name === name} onClick={() => setView({ name })}>{label}</button>)}
        </div>
        <button className="studio-icon-button" aria-label="Reset camera" onClick={() => setView({ name: 'iso' })}><RotateCcw size={14} /></button>
        <button className="studio-icon-button" aria-label={isFull3DView ? 'Exit focus view' : 'Focus on scene'} onClick={onToggleFull3D}>
          {isFull3DView ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </button>
      </div>
      <div className="scene-canvas">
        <Canvas dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: 'high-performance' }} camera={{ position: [4, 3.5, 6], fov: 42 }}>
          <color attach="background" args={[isBright ? '#f1f5f9' : '#0b1220']} />
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 12, 8]} intensity={2} />
          <pointLight position={[-5, 5, -3]} intensity={0.6} color="#7dd3fc" />
          <Suspense fallback={null}>
            <Bounds fit clip observe margin={1.25} maxDuration={0.2}>
              <Center top position={[0, -0.3, 0]}>{children}</Center>
              <CameraView view={view} controlsRef={controlsRef} />
            </Bounds>
            <Grid position={[0, -0.32, 0]} args={[30, 30]} cellSize={1} cellThickness={0.5}
              cellColor={isBright ? '#cbd5e1' : '#1c2a3d'} sectionSize={5} sectionThickness={0.7}
              sectionColor={isBright ? '#94a3b8' : '#2b3d54'} fadeDistance={22} fadeStrength={2} />
          </Suspense>
          <OrbitControls ref={controlsRef} makeDefault enableDamping dampingFactor={0.1} minDistance={3} maxDistance={40} maxPolarAngle={Math.PI / 2 - 0.02} />
        </Canvas>
      </div>
      <div className="scene-caption" title={statusLabel || ''}><span className="scene-line">L{currentStep?.lineNumber || 1}</span><span>{statusLabel || 'Ready to explore'}</span></div>
    </div>
  );
}
