import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center, Grid } from '@react-three/drei';
import { Compass, RotateCw, ZoomIn } from 'lucide-react';

/**
 * SceneContainer provides the 3D viewport canvas, lighting, and camera controls.
 */
export default function SceneContainer({ children, statusLabel, activeDetails }) {
  return (
    <div className="relative w-full h-full min-h-[360px] bg-slate-950 overflow-hidden select-none">
      {/* 3D Viewport Header Overlay */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-lg px-3 py-1.5 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        <span className="text-xs font-semibold text-slate-200 tracking-wide uppercase">3D Execution Engine</span>
        {statusLabel && (
          <>
            <span className="text-slate-600">|</span>
            <span className="text-xs font-mono text-cyan-300">{statusLabel}</span>
          </>
        )}
      </div>

      {/* Active Element Banner */}
      {activeDetails && (
        <div className="absolute top-3 right-3 z-10 bg-slate-900/85 backdrop-blur-md border border-cyan-500/30 rounded-lg px-3 py-1.5 shadow-lg shadow-cyan-950/40">
          <span className="text-xs font-mono font-medium text-cyan-400">{activeDetails}</span>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 4, 9], fov: 42 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <color attach="background" args={['#090d16']} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 15, 10]} intensity={1.5} castShadow />
        <pointLight position={[-10, 8, -5]} intensity={0.6} color="#00f2fe" />
        <pointLight position={[10, 6, 5]} intensity={0.4} color="#3b82f6" />

        <Suspense fallback={null}>
          <Center top>
            {children}
          </Center>

          {/* Floor Grid for depth perception */}
          <Grid
            position={[0, -0.01, 0]}
            args={[30, 30]}
            cellSize={0.7}
            cellThickness={0.7}
            cellColor="#1e293b"
            sectionSize={2.1}
            sectionThickness={1.2}
            sectionColor="#334155"
            fadeDistance={18}
            fadeStrength={1.5}
          />
        </Suspense>

        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          minDistance={4}
          maxDistance={22}
          maxPolarAngle={Math.PI / 2 - 0.05} // Prevent going below floor
        />
      </Canvas>

      {/* Camera interaction tips */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-3 text-[11px] text-slate-500 bg-slate-900/70 backdrop-blur-sm border border-slate-800/60 rounded px-2.5 py-1">
        <span className="flex items-center gap-1">
          <RotateCw size={11} className="text-slate-400" /> Rotate: Left-drag
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <ZoomIn size={11} className="text-slate-400" /> Zoom: Scroll
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Compass size={11} className="text-slate-400" /> Pan: Right-drag
        </span>
      </div>
    </div>
  );
}
