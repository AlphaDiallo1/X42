"use client";

import { type ReactNode, Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Edges, Float, Grid, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { type SuitPart, useSuitStore } from "@/lib/suit-store";

type ArmorMeshProps = {
  part: SuitPart;
  children: ReactNode;
  position?: THREE.Vector3Tuple;
  rotation?: THREE.Vector3Tuple;
  scale?: THREE.Vector3Tuple;
};

export function RobotSuitCanvas() {
  const controls = useRef<any>(null);

  useEffect(() => {
    const handleReset = () => controls.current?.reset();
    window.addEventListener("x42-reset-view", handleReset);
    return () => window.removeEventListener("x42-reset-view", handleReset);
  }, []);

  return (
    <Canvas shadows dpr={[1, 1.8]} camera={{ position: [0, 0.7, 6.2], fov: 38 }} gl={{ antialias: true, alpha: true }}>
      <color attach="background" args={["#030706"]} />
      <fog attach="fog" args={["#030706", 6.5, 14]} />
      <ambientLight intensity={0.42} />
      <spotLight castShadow position={[3.5, 5, 4]} angle={0.36} penumbra={0.6} intensity={3.2} color="#c7fff7" />
      <pointLight position={[-3, 1.5, 2.2]} intensity={1.2} color="#ffc857" />
      <pointLight position={[3, 0.6, -1.2]} intensity={1.2} color="#55f0dd" />
      <Suspense fallback={null}>
        <LabScaffold />
        <RobotRig />
        <ContactShadows position={[0, -2.18, 0]} opacity={0.42} scale={6} blur={2.2} far={4} />
        <Grid
          args={[10, 10]}
          position={[0, -2.2, 0]}
          cellSize={0.45}
          cellThickness={0.45}
          cellColor="#2dd4bf"
          sectionSize={1.8}
          sectionThickness={1}
          sectionColor="#facc15"
          fadeDistance={8}
          fadeStrength={1.5}
          infiniteGrid
        />
      </Suspense>
      <OrbitControls ref={controls} enablePan={false} minDistance={4.2} maxDistance={8} minPolarAngle={Math.PI * 0.18} maxPolarAngle={Math.PI * 0.68} />
    </Canvas>
  );
}

function RobotRig() {
  const group = useRef<THREE.Group>(null);
  const colors = useSuitStore((state) => state.colors);
  const rotationEnabled = useSuitStore((state) => state.rotationEnabled);
  const upgrade = useSuitStore((state) => state.upgrade);

  useFrame((state, delta) => {
    if (!group.current) return;
    if (rotationEnabled) group.current.rotation.y += delta * 0.22;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.15) * 0.035;
  });

  return (
    <Float speed={1.3} rotationIntensity={0.04} floatIntensity={0.12}>
      <group ref={group} position={[0, 0.04, 0]}>
        <pointLight position={[0, 0.55, 0.45]} intensity={1.8} distance={4.5} color={colors.reactor} />

        <ArmorMesh part="legs" position={[-0.46, -1.45, 0]}><boxGeometry args={[0.36, 0.92, 0.38]} /></ArmorMesh>
        <ArmorMesh part="legs" position={[0.46, -1.45, 0]}><boxGeometry args={[0.36, 0.92, 0.38]} /></ArmorMesh>
        <ArmorMesh part="legs" position={[-0.46, -2.02, 0.08]}><boxGeometry args={[0.5, 0.22, 0.72]} /></ArmorMesh>
        <ArmorMesh part="legs" position={[0.46, -2.02, 0.08]}><boxGeometry args={[0.5, 0.22, 0.72]} /></ArmorMesh>

        <ArmorMesh part="chest" position={[0, -0.62, 0]}><boxGeometry args={[0.92, 0.48, 0.52]} /></ArmorMesh>
        <ArmorMesh part="chest" position={[0, 0.08, 0]}><boxGeometry args={[1.18, 1.1, 0.6]} /></ArmorMesh>
        <ArmorMesh part="chest" position={[0, -1.02, 0]}><boxGeometry args={[1.0, 0.28, 0.56]} /></ArmorMesh>

        <ArmorMesh part="shoulders" position={[-0.92, 0.56, 0]} rotation={[0, 0, -0.14]}><boxGeometry args={[0.62, 0.28, 0.58]} /></ArmorMesh>
        <ArmorMesh part="shoulders" position={[0.92, 0.56, 0]} rotation={[0, 0, 0.14]}><boxGeometry args={[0.62, 0.28, 0.58]} /></ArmorMesh>

        <ArmorMesh part="arms" position={[-1.2, -0.04, 0]} rotation={[0, 0, -0.16]}><cylinderGeometry args={[0.18, 0.2, 0.82, 20]} /></ArmorMesh>
        <ArmorMesh part="arms" position={[1.2, -0.04, 0]} rotation={[0, 0, 0.16]}><cylinderGeometry args={[0.18, 0.2, 0.82, 20]} /></ArmorMesh>
        <ArmorMesh part="arms" position={[-1.34, -0.62, 0.02]} rotation={[0, 0, -0.08]}><boxGeometry args={[0.3, 0.58, 0.34]} /></ArmorMesh>
        <ArmorMesh part="arms" position={[1.34, -0.62, 0.02]} rotation={[0, 0, 0.08]}><boxGeometry args={[0.3, 0.58, 0.34]} /></ArmorMesh>

        <ArmorMesh part="helmet" position={[0, 1.08, 0]}><boxGeometry args={[0.68, 0.58, 0.56]} /></ArmorMesh>
        <mesh castShadow position={[0, 1.1, 0.3]}>
          <boxGeometry args={[0.48, 0.12, 0.04]} />
          <meshStandardMaterial color="#021110" emissive={colors.reactor} emissiveIntensity={0.7} metalness={0.5} roughness={0.18} />
        </mesh>

        <ArmorMesh part="reactor" position={[0, 0.2, 0.34]}><torusGeometry args={[0.24, 0.035, 18, 72]} /></ArmorMesh>
        <mesh castShadow position={[0, 0.2, 0.35]}>
          <sphereGeometry args={[0.11, 32, 32]} />
          <meshStandardMaterial color={colors.reactor} emissive={colors.reactor} emissiveIntensity={1.5} metalness={0.25} roughness={0.16} />
        </mesh>

        <WeaponModule />
        <UpgradeModule upgrade={upgrade} />
      </group>
    </Float>
  );
}

function ArmorMesh({ part, children, position, rotation, scale }: ArmorMeshProps) {
  const selectedPart = useSuitStore((state) => state.selectedPart);
  const setSelectedPart = useSuitStore((state) => state.setSelectedPart);
  const colors = useSuitStore((state) => state.colors);
  const active = selectedPart === part;
  const color = colors[part];

  return (
    <mesh castShadow receiveShadow position={position} rotation={rotation} scale={scale} onPointerDown={(event) => { event.stopPropagation(); setSelectedPart(part); }}>
      {children}
      <meshStandardMaterial color={color} emissive={active ? color : "#020605"} emissiveIntensity={active ? 0.36 : 0.04} metalness={0.88} roughness={0.22} />
      <Edges color={active ? "#e9fffb" : "#163936"} threshold={20} />
    </mesh>
  );
}

function WeaponModule() {
  const weapon = useSuitStore((state) => state.weapon);
  const colors = useSuitStore((state) => state.colors);

  if (weapon === "rail") {
    return <group position={[1.63, -0.58, 0.12]} rotation={[0, 0, -0.05]}><mesh castShadow><boxGeometry args={[0.18, 0.96, 0.18]} /><meshStandardMaterial color="#d8e3e1" emissive={colors.reactor} emissiveIntensity={0.18} metalness={0.92} roughness={0.2} /><Edges color="#67e8f9" /></mesh></group>;
  }

  if (weapon === "micro") {
    return <group position={[1.55, -0.48, 0.23]} rotation={[Math.PI / 2, 0, 0]}>{[-0.16, 0, 0.16].map((x) => <mesh castShadow key={x} position={[x, 0, 0]}><cylinderGeometry args={[0.045, 0.045, 0.46, 18]} /><meshStandardMaterial color="#cbd5e1" emissive="#f97316" emissiveIntensity={0.25} metalness={0.8} roughness={0.24} /></mesh>)}</group>;
  }

  if (weapon === "arc") {
    return <group position={[1.52, -0.58, 0.25]} rotation={[0, Math.PI / 2, 0]}><mesh castShadow><torusGeometry args={[0.18, 0.025, 16, 54]} /><meshStandardMaterial color={colors.reactor} emissive={colors.reactor} emissiveIntensity={1.1} metalness={0.45} roughness={0.16} /></mesh><pointLight color={colors.reactor} intensity={0.8} distance={1.8} /></group>;
  }

  return <group position={[1.52, -0.72, 0.2]} rotation={[Math.PI / 2, 0, 0]}><mesh castShadow><cylinderGeometry args={[0.13, 0.16, 0.36, 24]} /><meshStandardMaterial color={colors.reactor} emissive={colors.reactor} emissiveIntensity={0.85} metalness={0.6} roughness={0.18} /></mesh></group>;
}

function UpgradeModule({ upgrade }: { upgrade: string }) {
  const colors = useSuitStore((state) => state.colors);

  if (upgrade === "kinetic") {
    return <group>{[-0.72, 0.72].map((x) => <mesh key={x} castShadow position={[x, 0, 0.38]} rotation={[0, 0, x > 0 ? -0.2 : 0.2]}><boxGeometry args={[0.26, 0.82, 0.06]} /><meshStandardMaterial color="#d8e3e1" emissive={colors.reactor} emissiveIntensity={0.1} metalness={0.9} roughness={0.2} /></mesh>)}</group>;
  }

  if (upgrade === "stealth") {
    return <group>{[-0.56, 0.56].map((x) => <mesh key={x} castShadow position={[x, 0.38, -0.18]} rotation={[0, x > 0 ? 0.28 : -0.28, 0]}><coneGeometry args={[0.22, 0.78, 4]} /><meshStandardMaterial color="#111827" emissive="#22c55e" emissiveIntensity={0.08} metalness={0.82} roughness={0.28} /></mesh>)}</group>;
  }

  if (upgrade === "nanoweave") {
    return <group>{[-0.36, 0, 0.36].map((x) => <mesh key={x} position={[x, -0.08, 0.37]}><boxGeometry args={[0.035, 1.14, 0.035]} /><meshStandardMaterial color={colors.reactor} emissive={colors.reactor} emissiveIntensity={0.95} metalness={0.35} roughness={0.2} /></mesh>)}</group>;
  }

  return <group>{[-0.34, 0.34].map((x) => <mesh key={x} castShadow position={[x, -0.06, -0.42]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.12, 0.16, 0.62, 24]} /><meshStandardMaterial color="#475569" emissive="#f97316" emissiveIntensity={0.35} metalness={0.9} roughness={0.22} /></mesh>)}</group>;
}

function LabScaffold() {
  return (
    <group position={[0, 0, -1.2]}>
      <mesh position={[0, 0.2, -0.44]}><boxGeometry args={[3.9, 3.25, 0.04]} /><meshBasicMaterial color="#0a1f1d" transparent opacity={0.38} /></mesh>
      {[-2.1, 2.1].map((x) => <mesh key={x} position={[x, -0.18, -0.3]}><boxGeometry args={[0.08, 3.3, 0.08]} /><meshStandardMaterial color="#123633" emissive="#55f0dd" emissiveIntensity={0.25} metalness={0.4} roughness={0.25} /></mesh>)}
      {[-1.4, 0, 1.4].map((x) => <mesh key={x} position={[x, 1.82, -0.18]}><boxGeometry args={[0.68, 0.04, 0.06]} /><meshBasicMaterial color="#55f0dd" transparent opacity={0.52} /></mesh>)}
    </group>
  );
}
