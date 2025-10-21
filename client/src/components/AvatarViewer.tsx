import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Avatar } from "../lib/avatarTypes";

interface AvatarViewerProps {
  avatar: Avatar | null;
  animationState?: 'idle' | 'talking' | 'waving' | 'nodding';
  isTalking?: boolean;
}

// Simple humanoid avatar component with full animations
function HumanoidAvatar({ 
  avatar, 
  animationState = 'idle',
  isTalking = false 
}: { 
  avatar: Avatar; 
  animationState?: 'idle' | 'talking' | 'waving' | 'nodding';
  isTalking?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Mesh>(null);

  // Body proportions based on avatar settings
  const bodyScale = avatar.appearance.bodyType === 'slim' ? 0.8 : 
                   avatar.appearance.bodyType === 'athletic' ? 1.0 : 1.2;
  const heightScale = avatar.appearance.height || 1.0;
  const muscleScale = 1 + (avatar.appearance.muscleDefinition || 0) / 200; // 1.0 to 1.5

  // Colors based on avatar settings
  const skinColor = new THREE.Color(avatar.appearance.skinTone);
  const hairColor = new THREE.Color(avatar.appearance.hairColor);
  const eyeColor = new THREE.Color(avatar.appearance.eyeColor);
  const clothingColor = new THREE.Color(avatar.appearance.clothing.color);

  // Animation state
  const [currentAnimation, setCurrentAnimation] = useState(animationState);
  const animationTimeRef = useRef(0);
  const mouthRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    setCurrentAnimation(isTalking ? 'talking' : animationState);
  }, [isTalking, animationState]);

  // Complex animation system
  useFrame((state, delta) => {
    animationTimeRef.current += delta;
    const t = state.clock.elapsedTime;

    if (!groupRef.current) return;

    // Lip-sync animation when talking
    if (mouthRef.current && isTalking) {
      // Create natural mouth movements during speech
      const mouthOpenAmount = Math.abs(Math.sin(t * 15)) * 0.4 + 0.2; // 0.2 to 0.6
      mouthRef.current.scale.y = mouthOpenAmount;
      mouthRef.current.scale.x = 1 + (1 - mouthOpenAmount) * 0.3;
    } else if (mouthRef.current) {
      // Close mouth when not talking
      mouthRef.current.scale.y = 0.1;
      mouthRef.current.scale.x = 1;
    }

    switch (currentAnimation) {
      case 'idle':
        // Gentle breathing and swaying
        if (groupRef.current) {
          groupRef.current.position.y = Math.sin(t * 1.5) * 0.03;
        }
        if (bodyRef.current) {
          bodyRef.current.rotation.z = Math.sin(t * 0.5) * 0.02;
        }
        if (headRef.current) {
          headRef.current.rotation.y = Math.sin(t * 0.3) * 0.05;
        }
        // Arms hanging naturally with slight sway
        if (leftArmRef.current) {
          leftArmRef.current.rotation.z = Math.sin(t * 1.2) * 0.05;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.z = -Math.sin(t * 1.2) * 0.05;
        }
        break;

      case 'talking':
        // More active head movement while talking
        if (headRef.current) {
          headRef.current.rotation.y = Math.sin(t * 2) * 0.08;
          headRef.current.rotation.x = Math.sin(t * 3) * 0.03;
        }
        // Slight body movement
        if (groupRef.current) {
          groupRef.current.position.y = Math.sin(t * 2) * 0.04;
        }
        if (bodyRef.current) {
          bodyRef.current.rotation.z = Math.sin(t * 1.5) * 0.03;
        }
        // Gesturing arms
        if (leftArmRef.current) {
          leftArmRef.current.rotation.z = Math.sin(t * 2.5) * 0.1 + 0.1;
          leftArmRef.current.rotation.x = Math.sin(t * 1.8) * 0.05;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.z = -Math.sin(t * 2.3) * 0.1 - 0.1;
          rightArmRef.current.rotation.x = Math.sin(t * 2.1) * 0.05;
        }
        break;

      case 'waving':
        // Waving animation
        if (rightArmRef.current) {
          const waveProgress = (Math.sin(t * 4) + 1) / 2;
          rightArmRef.current.rotation.z = -0.8 - waveProgress * 0.4;
          rightArmRef.current.rotation.x = Math.sin(t * 8) * 0.3;
        }
        if (headRef.current) {
          headRef.current.rotation.y = 0.2;
        }
        // Keep left arm normal
        if (leftArmRef.current) {
          leftArmRef.current.rotation.z = 0;
        }
        if (groupRef.current) {
          groupRef.current.position.y = Math.sin(t * 2) * 0.02;
        }
        break;

      case 'nodding':
        // Nodding animation
        if (headRef.current) {
          headRef.current.rotation.x = Math.sin(t * 3) * 0.15;
        }
        if (groupRef.current) {
          groupRef.current.position.y = Math.sin(t * 1.5) * 0.02;
        }
        // Reset arms
        if (leftArmRef.current) {
          leftArmRef.current.rotation.z = 0;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.z = 0;
        }
        break;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[1, heightScale, 1]}>
      {/* Head Group */}
      <group ref={headRef} position={[0, 1.7, 0]}>
        {/* Head */}
        <mesh castShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshLambertMaterial color={skinColor} />
        </mesh>

        {/* Hair */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshLambertMaterial color={hairColor} />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.05, 0.05, 0.13]} castShadow>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshLambertMaterial color={eyeColor} />
        </mesh>
        <mesh position={[0.05, 0.05, 0.13]} castShadow>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshLambertMaterial color={eyeColor} />
        </mesh>

        {/* Mouth (with lip-sync) */}
        <mesh ref={mouthRef} position={[0, -0.05, 0.14]} castShadow>
          <sphereGeometry args={[0.03, 8, 8, 0, Math.PI]} />
          <meshLambertMaterial color={isTalking ? "#ff6b6b" : "#8B4513"} />
        </mesh>
      </group>

      {/* Body */}
      <mesh ref={bodyRef} position={[0, 1.2, 0]} scale={[bodyScale * muscleScale, 1, bodyScale * muscleScale]} castShadow>
        <boxGeometry args={[0.3, 0.6, 0.2]} />
        <meshLambertMaterial color={clothingColor} />
      </mesh>

      {/* Left Arm */}
      <group position={[-0.25 * bodyScale * muscleScale, 1.4, 0]}>
        <mesh ref={leftArmRef} scale={[muscleScale, 1, muscleScale]} castShadow>
          <boxGeometry args={[0.1, 0.5, 0.1]} />
          <meshLambertMaterial color={skinColor} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.25 * bodyScale * muscleScale, 1.4, 0]}>
        <mesh ref={rightArmRef} scale={[muscleScale, 1, muscleScale]} castShadow>
          <boxGeometry args={[0.1, 0.5, 0.1]} />
          <meshLambertMaterial color={skinColor} />
        </mesh>
      </group>

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

export default function AvatarViewer({ avatar, animationState, isTalking }: AvatarViewerProps) {
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
        <HumanoidAvatar 
          avatar={avatar} 
          animationState={animationState}
          isTalking={isTalking}
        />
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
