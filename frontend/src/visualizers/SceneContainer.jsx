import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center, Grid } from '@react-three/drei';
import { Compass, RotateCw, ZoomIn } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/**
 * SceneContainer provides the 3D viewport canvas, lighting, and camera controls.
 * Adapts dynamically between deep dark space and crisp daylight studio lighting.
 */
export default function SceneContainer({ children, statusLabel, activeDetails }) {
  const { isBright } = useTheme();

  return (
    <div className={`relative w-full h-full min-h-[360px] overflow-hidden select-none transition-colors duration-200 ${
      isBright ? 'bg-slate-100' : 'bg-slate-950'
    }`}>
      {/* 3D Viewport Header Overlay */}
      <div className={`absolute top-3 left-3 z-10 flex items-center gap-2 backdrop-blur-md border rounded-lg px-3 py-1.5 shadow-lg transition-colors ${
        isBright
          ? 'bg-white/90 border-slate-200 text-slate-800'
          : 'bg-slate-900/80 border-slate-800/80 text-slate-200'
      }`}>
        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
        <span className="text-xs font-semibold tracking-wide uppercase">3D Execution Engine</span>
        {statusLabel && (
          <>
            <span className={isBright ? 'text-slate-400' : 'text-slate-600'}>|</span>
            <span className={`text-xs font-mono font-medium ${isBright ? 'text-cyan-700' : 'text-cyan-300'}`}>
              {statusLabel}
            </span>
          </>
        )}
      </div>

      {/* Active Element Banner */}
      {activeDetails && (
        <div className={`absolute top-3 right-3 z-10 backdrop-blur-md border rounded-lg px-3 py-1.5 shadow-lg transition-colors ${
          isBright
            ? 'bg-white/95 border-cyan-300 text-cyan-800 shadow-slate-200'
            : 'bg-slate-900/85 border-cyan-500/30 text-cyan-400 shadow-cyan-950/40'
        }`}>
          <span className="text-xs font-mono font-medium">{activeDetails}</span>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 4, 9], fov: 42 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <color attach="background" args={[isBright ? '#f1f5f9' : '#090d16']} />
        <ambientLight intensity={isBright ? 1.25 : 0.8} />
        <directionalLight position={[10, 15, 10]} intensity={isBright ? 1.8 : 1.5} castShadow />
        <pointLight position={[-10, 8, -5]} intensity={0.6} color={isBright ? '#0284c7' : '#00f2fe'} />
        <pointLight position={[10, 6, 5]} intensity={0.4} color={isBright ? '#2563eb' : '#3b82f6'} />

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
            cellColor={isBright ? '#cbd5e1' : '#1e293b'}
            sectionSize={2.1}
            sectionThickness={1.2}
            sectionColor={isBright ? '#94a3b8' : '#334155'}
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
      <div className={`absolute bottom-3 left-3 z-10 flex items-center gap-3 text-[11px] backdrop-blur-sm border rounded px-2.5 py-1 transition-colors ${
        isBright
          ? 'bg-white/80 border-slate-200 text-slate-600'
          : 'bg-slate-900/70 border-slate-800/60 text-slate-500'
      }`}>
        <span className="flex items-center gap-1">
          <RotateCw size={11} className={isBright ? 'text-slate-600' : 'text-slate-400'} /> Rotate: Left-drag
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <ZoomIn size={11} className={isBright ? 'text-slate-600' : 'text-slate-400'} /> Zoom: Scroll
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Compass size={11} className={isBright ? 'text-slate-600' : 'text-slate-400'} /> Pan: Right-drag
        </span>
      </div>
    </div>
  );
}

