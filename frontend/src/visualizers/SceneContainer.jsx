import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Center, Grid, Sparkles, ContactShadows } from '@react-three/drei';
import { Compass, RotateCw, ZoomIn, Maximize2, Minimize2, Camera, RefreshCw, Trophy, Sparkles as SparklesIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import OutputHologram3D from './OutputHologram3D';
import * as THREE from 'three';

/**
 * Handles smooth dynamic camera transitions to preset viewpoints (Top, Front, Isometric, Reset).
 */
function CameraPresetHandler({ preset, onApplied, controlsRef }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!preset) return;
    if (controlsRef?.current) {
      controlsRef.current.target.set(0, 0, 0);
    }
    if (preset === 'top') {
      camera.position.set(0, 18, 0.01);
    } else if (preset === 'front') {
      camera.position.set(0, 2.5, 12);
    } else if (preset === 'iso') {
      camera.position.set(9, 9, 10);
    } else if (preset === 'reset') {
      camera.position.set(0, 4.5, 11);
      if (controlsRef?.current) {
        controlsRef.current.reset();
        controlsRef.current.target.set(0, 0, 0);
      }
    }
    camera.lookAt(0, 0, 0);
    if (controlsRef?.current) {
      controlsRef.current.update();
    }
    onApplied();
  }, [preset, camera, onApplied, controlsRef]);

  return null;
}

/**
 * SceneContainer provides the 3D viewport canvas, lighting, camera controls,
 * realistic studio cyber-pedestal stage, and 3D verified output hologram.
 */
export default function SceneContainer({
  children,
  statusLabel,
  activeDetails,
  correctOutput = null,
  isAtEnd = false,
  cumulativeOutput = [],
  hoveredBoxInfo = null,
  isFull3DView = false,
  onToggleFull3D
}) {
  const { isBright } = useTheme();
  const [cameraPreset, setCameraPreset] = useState(null);
  const [showHologram, setShowHologram] = useState(true);
  const controlsRef = useRef(null);

  return (
    <div className={`relative w-full h-full min-h-[360px] overflow-hidden select-none transition-colors duration-200 ${
      isBright ? 'bg-slate-100' : 'bg-slate-950'
    }`}>
      {/* 3D Viewport Header Overlay */}
      <div className={`absolute top-3 left-3 z-10 flex items-center gap-2 backdrop-blur-md border rounded-lg px-3 py-1.5 shadow-lg transition-colors ${
        isBright
          ? 'bg-white/90 border-slate-200 text-slate-800 shadow-slate-200'
          : 'bg-slate-900/80 border-slate-800/80 text-slate-200 shadow-black/40'
      }`}>
        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
        <span className="text-xs font-bold tracking-wide uppercase">3D Execution Engine</span>
        {statusLabel && (
          <>
            <span className={isBright ? 'text-slate-400' : 'text-slate-600'}>|</span>
            <span className={`text-xs font-mono font-semibold ${isBright ? 'text-cyan-700' : 'text-cyan-300'}`}>
              {statusLabel}
            </span>
          </>
        )}
      </div>

      {/* Top Center: Prominent Verified Correct Output HUD Banner */}
      {correctOutput && (
        <div className={`absolute top-3 left-1/2 -translate-x-1/2 z-10 hidden sm:flex items-center gap-2 backdrop-blur-md border rounded-xl px-3.5 py-1.5 shadow-xl transition-all ${
          isAtEnd
            ? 'bg-gradient-to-r from-emerald-950/90 via-teal-950/90 to-emerald-950/90 border-emerald-500/60 text-emerald-200 shadow-emerald-950/60 ring-1 ring-emerald-500/30'
            : isBright
              ? 'bg-white/95 border-cyan-300 text-slate-800 shadow-cyan-950/10'
              : 'bg-slate-900/90 border-cyan-500/40 text-cyan-200 shadow-cyan-950/40'
        }`}>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isAtEnd ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400'}`}></span>
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isAtEnd ? 'text-emerald-400' : 'text-cyan-400'}`}>
              {isAtEnd ? '🏆 Correct Output:' : '⚡ Result Stream:'}
            </span>
          </div>
          <span className="text-xs font-mono font-bold tracking-tight">
            {correctOutput}
          </span>
          <button
            onClick={() => setShowHologram((prev) => !prev)}
            className={`ml-1 text-[10px] px-1.5 py-0.5 rounded border transition ${
              showHologram
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle 3D Floating Output Hologram"
          >
            3D HUD: {showHologram ? 'ON' : 'OFF'}
          </button>
        </div>
      )}

      {/* Hovered 3D Box HUD Inspector Details */}
      {hoveredBoxInfo && (
        <div className={`absolute bottom-12 left-3 z-10 flex items-center gap-2 backdrop-blur-md border rounded-lg px-3 py-1.5 shadow-lg transition-all animate-fadeIn ${
          isBright ? 'bg-white/95 border-amber-300 text-amber-900' : 'bg-slate-900/90 border-amber-500/40 text-amber-300'
        }`}>
          <span className="text-xs font-bold">🔍 Box Hover:</span>
          <span className="text-xs font-mono font-semibold">{hoveredBoxInfo}</span>
        </div>
      )}

      {/* Top-Right Control Bar: Camera Presets & Theater Mode */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
        {/* Active Element Banner */}
        {activeDetails && (
          <div className={`backdrop-blur-md border rounded-lg px-2.5 py-1 shadow-lg transition-colors hidden sm:block ${
            isBright
              ? 'bg-white/95 border-cyan-300 text-cyan-800 shadow-slate-200'
              : 'bg-slate-900/85 border-cyan-500/30 text-cyan-400 shadow-cyan-950/40'
          }`}>
            <span className="text-xs font-mono font-medium">{activeDetails}</span>
          </div>
        )}

        {/* Camera Angle Presets */}
        <div className={`flex items-center backdrop-blur-md border rounded-lg p-0.5 shadow-lg transition-colors ${
          isBright ? 'bg-white/90 border-slate-200 text-slate-700' : 'bg-slate-900/85 border-slate-800 text-slate-300'
        }`}>
          <button
            onClick={() => setCameraPreset('iso')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition hover:text-cyan-500 ${
              cameraPreset === 'iso' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : ''
            }`}
            title="Isometric 3D Perspective"
          >
            3D
          </button>
          <button
            onClick={() => setCameraPreset('front')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition hover:text-cyan-500 ${
              cameraPreset === 'front' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : ''
            }`}
            title="Front Direct Elevation"
          >
            Front
          </button>
          <button
            onClick={() => setCameraPreset('top')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition hover:text-cyan-500 ${
              cameraPreset === 'top' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : ''
            }`}
            title="Top-Down Plan View"
          >
            Top
          </button>
          <button
            onClick={() => setCameraPreset('reset')}
            className="p-1 rounded text-[11px] transition hover:text-cyan-500 text-slate-400"
            title="Reset Camera Position"
          >
            <RefreshCw size={11} />
          </button>
        </div>

        {/* Full 3D Theater Mode Button */}
        {onToggleFull3D && (
          <button
            onClick={onToggleFull3D}
            className={`p-1.5 rounded-lg border backdrop-blur-md transition shadow-lg ${
              isFull3DView
                ? 'bg-purple-600 border-purple-400 text-white shadow-purple-600/30'
                : isBright
                  ? 'bg-white/90 border-slate-200 text-slate-700 hover:text-purple-600 hover:bg-purple-50'
                  : 'bg-slate-900/85 border-slate-800 text-slate-300 hover:text-purple-400 hover:bg-purple-950/40'
            }`}
            title={isFull3DView ? 'Exit Full 3D Theater Mode' : 'Enter Full 3D Theater Mode (Max Screen)'}
          >
            {isFull3DView ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        )}
      </div>

      {/* 3D Canvas Viewport */}
      <Canvas
        camera={{ position: [0, 4, 9], fov: 42 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <color attach="background" args={[isBright ? '#f8fafc' : '#070b14']} />
        
        {/* Dynamic Studio Lighting */}
        <ambientLight intensity={isBright ? 1.3 : 0.85} />
        <directionalLight
          position={[12, 18, 12]}
          intensity={isBright ? 2.0 : 1.6}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-12, 10, -6]} intensity={0.7} color={isBright ? '#0284c7' : '#00f2fe'} />
        <pointLight position={[12, 8, 6]} intensity={0.5} color={isBright ? '#6366f1' : '#818cf8'} />

        <Suspense fallback={null}>
          <CameraPresetHandler
            preset={cameraPreset}
            onApplied={() => setCameraPreset(null)}
            controlsRef={controlsRef}
          />

          <Center top>
            {children}
          </Center>

          {/* 3D Correct Output Hologram Banner & Victory Beam */}
          {showHologram && (correctOutput || (cumulativeOutput && cumulativeOutput.length > 0)) && (
            <OutputHologram3D
              correctOutput={correctOutput}
              isAtEnd={isAtEnd}
              totalOutputs={cumulativeOutput?.length || 0}
              recentLine={cumulativeOutput?.[cumulativeOutput.length - 1]}
            />
          )}

          {/* Realistic Cyber Pedestal Stage */}
          <group position={[0, -0.04, 0]}>
            <mesh receiveShadow>
              <cylinderGeometry args={[10.2, 10.8, 0.1, 64]} />
              <meshStandardMaterial
                color={isBright ? '#e2e8f0' : '#080d1a'}
                roughness={0.2}
                metalness={0.85}
              />
            </mesh>
            {/* Primary Glowing Perimeter Ring */}
            <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[10.0, 10.18, 64]} />
              <meshBasicMaterial
                color={isBright ? '#0284c7' : '#00f2fe'}
                transparent
                opacity={0.85}
              />
            </mesh>
            {/* Secondary Inner Cyan Pulsing Ring */}
            <mesh position={[0, 0.061, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[7.2, 7.28, 64]} />
              <meshBasicMaterial
                color={isBright ? '#6366f1' : '#38bdf8'}
                transparent
                opacity={0.4}
              />
            </mesh>
          </group>

          {/* Cinematic Ambient Particle Sparkles */}
          <Sparkles
            count={65}
            scale={18}
            size={3.2}
            speed={0.4}
            opacity={isBright ? 0.3 : 0.7}
            color={isBright ? '#0284c7' : '#38bdf8'}
          />

          {/* Soft Grounding Contact Shadows */}
          <ContactShadows
            position={[0, -0.02, 0]}
            opacity={isBright ? 0.5 : 0.85}
            scale={26}
            blur={2.5}
            far={4.8}
            color={isBright ? '#64748b' : '#000000'}
          />

          {/* Floor Depth Grid */}
          <Grid
            position={[0, -0.01, 0]}
            args={[32, 32]}
            cellSize={0.75}
            cellThickness={0.7}
            cellColor={isBright ? '#cbd5e1' : '#1e293b'}
            sectionSize={2.25}
            sectionThickness={1.2}
            sectionColor={isBright ? '#94a3b8' : '#334155'}
            fadeDistance={20}
            fadeStrength={1.5}
          />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.08}
          minDistance={1.8}
          maxDistance={45}
          maxPolarAngle={Math.PI / 2 - 0.02}
        />
      </Canvas>

      {/* Camera interaction tips */}
      <div className={`absolute bottom-3 left-3 z-10 flex items-center gap-3 text-[11px] backdrop-blur-sm border rounded px-2.5 py-1 transition-colors ${
        isBright
          ? 'bg-white/80 border-slate-200 text-slate-600'
          : 'bg-slate-900/70 border-slate-800/60 text-slate-400'
      }`}>
        <span className="flex items-center gap-1">
          <RotateCw size={11} className={isBright ? 'text-slate-600' : 'text-cyan-400'} /> Rotate: Left-drag
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <ZoomIn size={11} className={isBright ? 'text-slate-600' : 'text-cyan-400'} /> Zoom: Scroll
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Compass size={11} className={isBright ? 'text-slate-600' : 'text-cyan-400'} /> Pan: Right-drag
        </span>
      </div>
    </div>
  );
}
