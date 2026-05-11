"use client";

import {
  type ElementRef,
  type ReactNode,
  Suspense,
  useEffect,
  useRef
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Edges,
  Environment,
  Float,
  Grid,
  OrbitControls
} from "@react-three/drei";
import * as THREE from "three";
import { type SuitPart, useSuitStore } from "@/lib/suit-store";

type ArmorMeshProps = {
  part: SuitPart;
  children: ReactNode;
  position?: THREE.Vector3Tuple;
  rotation?: THREE.Vector3Tuple;
  scale?: THREE.Vector3Tuple;
  emissiveBoost?: number;
};

export function RobotSuitCanvas() {
  const controls = useRef<ElementRef<typeof OrbitControls>>(null);

  useEffect(() => {
    const handleReset = () => controls.current?.reset();
    window.addEventListener("x42-reset-view", handleReset);

    return () => window.removeEventListener("x42-reset-view", handleReset);
  }, []);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.7, 6.4], fov: 36 }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={["#030706"]} />
      <fog attach="fog" args={["#030706", 7, 15]} />

      <ambientLight intensity={0.28} />
      <hemisphereLight args={["#c7fff7", "#06110f", 0.75]} />
      <spotLight
        castShadow
        position={[3.4, 5.2, 4.2]}
        angle={0.34}
        penumbra={0.65}
        intensity={4.3}
        color="#d9fff9"
      />
      <spotLight
        position={[-4.2, 2.4, 2.7]}
        angle={0.46}
        penumbra={0.7}
        intensity={1.8}
        color="#ffc857"
      />
      <pointLight position={[0, 1.4, 2.5]} intensity={1.4} color="#55f0dd" />
      <pointLight position={[2.4, -1.2, -1.8]} intensity={1.2} color="#67e8f9" />

      <Suspense fallback={null}>
        <Environment preset="city" environmentIntensity={0.65} />
        <LabScaffold />
        <HologramFloor />
        <RobotRig />
        <ContactShadows
          position={[0, -2.25, 0]}
          opacity={0.5}
          scale={7}
          blur={2.4}
          far={4}
        />
      </Suspense>

      <OrbitControls
        ref={controls}
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        enableZoom
        zoomSpeed={0.85}
        rotateSpeed={0.72}
        minDistance={3.6}
        maxDistance={8.4}
        minPolarAngle={Math.PI * 0.12}
        maxPolarAngle={Math.PI * 0.74}
        target={[0, -0.18, 0]}
      />
    </Canvas>
  );
}

function RobotRig() {
  const group = useRef<THREE.Group>(null);
  const autoRotationSpeed = useRef(0);
  const colors = useSuitStore((state) => state.colors);
  const rotationEnabled = useSuitStore((state) => state.rotationEnabled);
  const upgrade = useSuitStore((state) => state.upgrade);
  const reactorOutput = useSuitStore((state) => state.reactorOutput);

  useFrame((state, delta) => {
    if (!group.current) {
      return;
    }

    autoRotationSpeed.current = THREE.MathUtils.damp(
      autoRotationSpeed.current,
      rotationEnabled ? 0.34 : 0,
      3.2,
      delta
    );
    group.current.rotation.y += autoRotationSpeed.current * delta;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.15) * 0.035;
  });

  return (
    <Float speed={1.1} rotationIntensity={0.025} floatIntensity={0.08}>
      <group ref={group} position={[0, 0.03, 0]}>
        <pointLight
          position={[0, 0.16, 0.72]}
          intensity={1.2 + reactorOutput / 52}
          distance={5}
          color={colors.reactor}
        />
        <pointLight
          position={[0, 1.04, 0.58]}
          intensity={1.2}
          distance={2}
          color={colors.reactor}
        />

        <ChestAssembly />
        <Helmet />
        <Shoulders />
        <Arm side={-1} />
        <Arm side={1} />
        <Leg side={-1} />
        <Leg side={1} />
        <BackReactor />
        <UpgradeModule upgrade={upgrade} />
      </group>
    </Float>
  );
}

function ChestAssembly() {
  const colors = useSuitStore((state) => state.colors);

  return (
    <group>
      <ArmorMesh part="chest" position={[0, 0.15, 0]}>
        <boxGeometry args={[1.16, 1.1, 0.62]} />
      </ArmorMesh>
      <ArmorMesh part="chest" position={[0, -0.56, 0.02]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.9, 0.44, 0.52]} />
      </ArmorMesh>
      <ArmorMesh part="chest" position={[-0.34, 0.27, 0.34]} rotation={[0.06, 0.1, 0.08]}>
        <boxGeometry args={[0.4, 0.72, 0.08]} />
      </ArmorMesh>
      <ArmorMesh part="chest" position={[0.34, 0.27, 0.34]} rotation={[0.06, -0.1, -0.08]}>
        <boxGeometry args={[0.4, 0.72, 0.08]} />
      </ArmorMesh>

      <ArmorMesh part="reactor" position={[0, 0.19, 0.37]} emissiveBoost={0.95}>
        <torusGeometry args={[0.24, 0.035, 18, 80]} />
      </ArmorMesh>
      <mesh castShadow position={[0, 0.19, 0.39]}>
        <sphereGeometry args={[0.12, 36, 36]} />
        <meshStandardMaterial
          color={colors.reactor}
          emissive={colors.reactor}
          emissiveIntensity={1.75}
          metalness={0.22}
          roughness={0.12}
        />
      </mesh>
      <mesh position={[0, 0.19, 0.405]}>
        <torusGeometry args={[0.34, 0.01, 10, 96]} />
        <meshBasicMaterial color={colors.reactor} transparent opacity={0.72} />
      </mesh>
    </group>
  );
}

function Helmet() {
  const colors = useSuitStore((state) => state.colors);

  return (
    <group>
      <ArmorMesh part="helmet" position={[0, 1.07, 0]}>
        <boxGeometry args={[0.66, 0.6, 0.58]} />
      </ArmorMesh>
      <ArmorMesh part="helmet" position={[0, 1.42, -0.03]}>
        <boxGeometry args={[0.48, 0.16, 0.42]} />
      </ArmorMesh>
      <mesh castShadow position={[-0.15, 1.1, 0.32]}>
        <boxGeometry args={[0.19, 0.06, 0.035]} />
        <meshStandardMaterial
          color="#071210"
          emissive={colors.reactor}
          emissiveIntensity={1.55}
          metalness={0.48}
          roughness={0.12}
        />
      </mesh>
      <mesh castShadow position={[0.15, 1.1, 0.32]}>
        <boxGeometry args={[0.19, 0.06, 0.035]} />
        <meshStandardMaterial
          color="#071210"
          emissive={colors.reactor}
          emissiveIntensity={1.55}
          metalness={0.48}
          roughness={0.12}
        />
      </mesh>
    </group>
  );
}

function Shoulders() {
  return (
    <group>
      <ArmorMesh part="shoulders" position={[-0.92, 0.58, 0]} rotation={[0, 0, -0.12]}>
        <boxGeometry args={[0.62, 0.28, 0.64]} />
      </ArmorMesh>
      <ArmorMesh part="shoulders" position={[0.92, 0.58, 0]} rotation={[0, 0, 0.12]}>
        <boxGeometry args={[0.62, 0.28, 0.64]} />
      </ArmorMesh>
      <ArmorMesh part="shoulders" position={[-1.05, 0.45, 0.05]} rotation={[0.18, 0.08, -0.22]}>
        <coneGeometry args={[0.3, 0.45, 4]} />
      </ArmorMesh>
      <ArmorMesh part="shoulders" position={[1.05, 0.45, 0.05]} rotation={[0.18, -0.08, 0.22]}>
        <coneGeometry args={[0.3, 0.45, 4]} />
      </ArmorMesh>
    </group>
  );
}

function Arm({ side }: { side: -1 | 1 }) {
  const colors = useSuitStore((state) => state.colors);

  return (
    <group>
      <ArmorMesh part="arms" position={[side * 1.14, 0.05, 0]} rotation={[0, 0, side * 0.16]}>
        <cylinderGeometry args={[0.18, 0.21, 0.78, 24]} />
      </ArmorMesh>
      <ArmorMesh part="forearms" position={[side * 1.32, -0.58, 0.03]} rotation={[0, 0, side * 0.08]}>
        <boxGeometry args={[0.32, 0.62, 0.38]} />
      </ArmorMesh>
      <ArmorMesh part="forearms" position={[side * 1.46, -0.59, 0.18]} rotation={[0, 0, side * 0.08]} emissiveBoost={0.22}>
        <boxGeometry args={[0.08, 0.48, 0.08]} />
      </ArmorMesh>
      <ArmorMesh part="hands" position={[side * 1.36, -1.02, 0.04]}>
        <sphereGeometry args={[0.18, 22, 22]} />
      </ArmorMesh>
      <mesh position={[side * 1.37, -1.03, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.1, 0.08, 24]} />
        <meshStandardMaterial
          color={colors.reactor}
          emissive={colors.reactor}
          emissiveIntensity={0.72}
          metalness={0.6}
          roughness={0.18}
        />
      </mesh>
    </group>
  );
}

function Leg({ side }: { side: -1 | 1 }) {
  return (
    <group>
      <ArmorMesh part="legs" position={[side * 0.38, -1.18, 0]} rotation={[0, 0, side * -0.03]}>
        <boxGeometry args={[0.34, 0.86, 0.4]} />
      </ArmorMesh>
      <ArmorMesh part="legs" position={[side * 0.44, -1.72, 0.02]} rotation={[0, 0, side * 0.04]}>
        <boxGeometry args={[0.32, 0.72, 0.34]} />
      </ArmorMesh>
      <ArmorMesh part="boots" position={[side * 0.45, -2.16, 0.12]}>
        <boxGeometry args={[0.5, 0.22, 0.76]} />
      </ArmorMesh>
      <ArmorMesh part="boots" position={[side * 0.45, -2.05, -0.18]}>
        <cylinderGeometry args={[0.14, 0.17, 0.22, 24]} />
      </ArmorMesh>
    </group>
  );
}

function BackReactor() {
  const colors = useSuitStore((state) => state.colors);

  return (
    <group position={[0, 0.02, -0.4]}>
      <ArmorMesh part="back" position={[0, 0.1, 0]} emissiveBoost={0.12}>
        <boxGeometry args={[0.58, 0.92, 0.2]} />
      </ArmorMesh>
      <ArmorMesh part="back" position={[-0.36, -0.12, -0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.16, 0.72, 24]} />
      </ArmorMesh>
      <ArmorMesh part="back" position={[0.36, -0.12, -0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.16, 0.72, 24]} />
      </ArmorMesh>
      <mesh position={[0, 0.18, -0.13]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.22, 0.025, 16, 64]} />
        <meshStandardMaterial
          color={colors.reactor}
          emissive={colors.reactor}
          emissiveIntensity={1.1}
          metalness={0.35}
          roughness={0.16}
        />
      </mesh>
      {[-0.36, 0.36].map((x) => (
        <pointLight
          key={x}
          position={[x, -0.48, -0.44]}
          color="#f97316"
          intensity={0.75}
          distance={1.9}
        />
      ))}
    </group>
  );
}

function ArmorMesh({
  part,
  children,
  position,
  rotation,
  scale,
  emissiveBoost = 0
}: ArmorMeshProps) {
  const selectedPart = useSuitStore((state) => state.selectedPart);
  const setSelectedPart = useSuitStore((state) => state.setSelectedPart);
  const colors = useSuitStore((state) => state.colors);
  const active = selectedPart === part;
  const color = colors[part];

  return (
    <mesh
      castShadow
      receiveShadow
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerDown={(event) => {
        event.stopPropagation();
        setSelectedPart(part);
      }}
    >
      {children}
      <meshStandardMaterial
        color={color}
        emissive={active || emissiveBoost ? color : "#020605"}
        emissiveIntensity={(active ? 0.38 : 0.04) + emissiveBoost}
        metalness={0.9}
        roughness={0.2}
        envMapIntensity={1.15}
      />
      <Edges color={active ? "#e9fffb" : "#173936"} threshold={22} />
    </mesh>
  );
}

function UpgradeModule({ upgrade }: { upgrade: string }) {
  const colors = useSuitStore((state) => state.colors);

  if (upgrade === "kinetic") {
    return (
      <group>
        {[-0.72, 0.72].map((x) => (
          <ArmorMesh
            key={x}
            part="chest"
            position={[x, 0.02, 0.42]}
            rotation={[0, 0, x > 0 ? -0.2 : 0.2]}
          >
            <boxGeometry args={[0.24, 0.78, 0.06]} />
          </ArmorMesh>
        ))}
      </group>
    );
  }

  if (upgrade === "stealth") {
    return (
      <group>
        {[-0.58, 0.58].map((x) => (
          <ArmorMesh
            key={x}
            part="back"
            position={[x, 0.36, -0.26]}
            rotation={[0, x > 0 ? 0.28 : -0.28, 0]}
          >
            <coneGeometry args={[0.22, 0.78, 4]} />
          </ArmorMesh>
        ))}
      </group>
    );
  }

  if (upgrade === "nanoweave") {
    return (
      <group>
        {[-0.36, 0, 0.36].map((x) => (
          <mesh key={x} position={[x, -0.08, 0.43]}>
            <boxGeometry args={[0.032, 1.18, 0.032]} />
            <meshStandardMaterial
              color={colors.reactor}
              emissive={colors.reactor}
              emissiveIntensity={1}
              metalness={0.34}
              roughness={0.18}
            />
          </mesh>
        ))}
      </group>
    );
  }

  return null;
}

function HologramFloor() {
  return (
    <group>
      <Grid
        args={[12, 12]}
        position={[0, -2.24, 0]}
        cellSize={0.42}
        cellThickness={0.45}
        cellColor="#2dd4bf"
        sectionSize={1.68}
        sectionThickness={1}
        sectionColor="#facc15"
        fadeDistance={8}
        fadeStrength={1.6}
        infiniteGrid
      />
      <mesh position={[0, -2.23, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.25, 1.31, 96]} />
        <meshBasicMaterial color="#55f0dd" transparent opacity={0.38} />
      </mesh>
      <mesh position={[0, -2.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.15, 2.17, 96]} />
        <meshBasicMaterial color="#ffc857" transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

function LabScaffold() {
  return (
    <group position={[0, 0, -1.35]}>
      <mesh position={[0, 0.22, -0.44]}>
        <boxGeometry args={[4.5, 3.45, 0.04]} />
        <meshBasicMaterial color="#0a1f1d" transparent opacity={0.34} />
      </mesh>
      {[-2.24, 2.24].map((x) => (
        <mesh key={x} position={[x, -0.16, -0.3]}>
          <boxGeometry args={[0.08, 3.42, 0.08]} />
          <meshStandardMaterial
            color="#123633"
            emissive="#55f0dd"
            emissiveIntensity={0.25}
            metalness={0.45}
            roughness={0.24}
          />
        </mesh>
      ))}
      {[-1.46, 0, 1.46].map((x) => (
        <mesh key={x} position={[x, 1.87, -0.18]}>
          <boxGeometry args={[0.72, 0.04, 0.06]} />
          <meshBasicMaterial color="#55f0dd" transparent opacity={0.52} />
        </mesh>
      ))}
    </group>
  );
}
