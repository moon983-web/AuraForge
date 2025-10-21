import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Avatar } from "../lib/avatarTypes";

interface AvatarViewerProps {
  avatar: Avatar | null;
}

// Simple humanoid avatar component using basic geometries
function HumanoidAvatar({ avatar }: { avatar: Avatar }) {
  const groupRef = useRef<THREE.Group>(null);

  // Body proportions based on avatar settings
  const bodyScale = avatar.appearance.bodyType === 'slim' ? 0.8 : 
                   avatar.appearance.bodyType === 'athletic' ? 1.0 : 1.2;

  // Colors based on avatar settings
  const skinColor = new THREE.Color(avatar.appearance.skinTone);
  const hairColor = new THREE.Color(avatar.appearance.hairColor);
  const eyeColor = new THREE.Color(avatar.appearance.eyeColor);
  const clothingColor = new THREE.Color(avatar.appearance.clothing.color);

  // Simple idle animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Head */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshLambertMaterial color={skinColor} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.85, 0]} castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshLambertMaterial color={hairColor} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.05, 1.75, 0.13]} castShadow>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshLambertMaterial color={eyeColor} />
      </mesh>
      <mesh position={[0.05, 1.75, 0.13]} castShadow>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshLambertMaterial color={eyeColor} />
      </mesh>

      {/* Body */}
      <mesh position={[0, 1.2, 0]} scale={[bodyScale, 1, bodyScale]} castShadow>
        <boxGeometry args={[0.3, 0.6, 0.2]} />
        <meshLambertMaterial color={clothingColor} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.25 * bodyScale, 1.3, 0]} castShadow>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshLambertMaterial color={skinColor} />
      </mesh>
      <mesh position={[0.25 * bodyScale, 1.3, 0]} castShadow>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshLambertMaterial color={skinColor} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.1, 0.5, 0]} castShadow>
        <boxGeometry args={[0.12, 0.8, 0.12]} />
        <meshLambertMaterial color={avatar.appearance.clothing.bottomColor ? 
          new THREE.Color(avatar.appearance.clothing.bottomColor) : clothingColor} />
      </mesh>
      <mesh position={[0.1, 0.5, 0]} castShadow>
        <boxGeometry args={[0.12, 0.8, 0.12]} />
        <meshLambertMaterial color={avatar.appearance.clothing.bottomColor ? 
          new THREE.Color(avatar.appearance.clothing.bottomColor) : clothingColor} />
      </mesh>

      {/* Feet */}
      <mesh position={[-0.1, 0.05, 0.05]} castShadow>
        <boxGeometry args={[0.1, 0.05, 0.2]} />
        <meshLambertMaterial color="#333333" />
      </mesh>
      <mesh position={[0.1, 0.05, 0.05]} castShadow>
        <boxGeometry args={[0.1, 0.05, 0.2]} />
        <meshLambertMaterial color="#333333" />
      </mesh>
    </group>
  );
}

export default function AvatarViewer({ avatar }: AvatarViewerProps) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  // Keyboard controls for camera
  const [, getKeys] = useKeyboardControls();

  useFrame(() => {
    const { rotateLeft, rotateRight, zoomIn, zoomOut } = getKeys();
    
    if (controlsRef.current) {
      if (rotateLeft) controlsRef.current.azimuthAngle -= 0.02;
      if (rotateRight) controlsRef.current.azimuthAngle += 0.02;
      if (zoomIn && controlsRef.current.distance > 1) controlsRef.current.distance -= 0.05;
      if (zoomOut && controlsRef.current.distance < 10) controlsRef.current.distance += 0.05;
    }
  });

  // Ground plane
  const GroundPlane = () => (
    <mesh position={[0, 0, 0]} receiveShadow rotation-x={-Math.PI / 2}>
      <planeGeometry args={[10, 10]} />
      <meshLambertMaterial color="#1a1a1a" />
    </mesh>
  );

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        target={[0, 1, 0]}
        minDistance={1}
        maxDistance={10}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        enablePan={false}
      />
      
      <GroundPlane />
      
      {avatar ? (
        <HumanoidAvatar avatar={avatar} />
      ) : (
        // Placeholder when no avatar is selected
        <mesh position={[0, 1, 0]} castShadow>
          <boxGeometry args={[0.5, 2, 0.3]} />
          <meshLambertMaterial color="#333333" transparent opacity={0.5} />
        </mesh>
      )}
    </>
  );
}
