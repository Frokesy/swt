import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";
// import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Three = () => {
  const angleToRadians = (angle: number) => {
    return (angle * Math.PI) / 180;
  };

  // useFrame((state) => {
  //   state.mouse
  // } )
  const ballRef = useRef<THREE.Mesh>(null);
  useEffect(() => {
    if (ballRef.current) {
      console.log(ballRef.current);

      const tl = gsap.timeline();
      //x-axis motion
      tl.to(ballRef.current.position, {
        duration: 1,
        x: 0,
        ease: "power2.out",
      });
      //y-axis motion
      tl.to(ballRef.current.position, {
        duration: 2,
        y: 0.5,
        ease: "bounce.out",
      }, "=");
    }
  }, [ballRef.current]);


  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1, 5]} />
      <OrbitControls />
      <mesh position={[-2, 1.75, 0]} castShadow ref={ballRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#ffffff" metalness={0.7} roughness={0.3} />
      </mesh>

      <mesh rotation={[-angleToRadians(90), 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#dc8341"  side={THREE.DoubleSide} />
      </mesh>
      <ambientLight args={["#ffffff", 0.25]} />
      <pointLight position={[-2, 1, 0]} args={["#ffffff", 7]} castShadow />

      <Environment background>
        <mesh>
          <sphereGeometry args={[50, 100, 100]} />
          <meshBasicMaterial color="#dc8341" side={THREE.BackSide} />
        </mesh>
      </Environment>
    </>
  );
};

export default Three;
