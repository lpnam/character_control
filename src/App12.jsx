import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { OrbitControls, Stats } from '@react-three/drei';

function Scene() {
  const { scene, camera } = useThree();
  const modelRef = useRef();
  const mixerRef = useRef();
  const [actions, setActions] = useState([]);

  useEffect(() => {
    scene.background = new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

    camera.position.set(1, 2, -3);
    camera.lookAt(0, 1, 0);
  }, [scene, camera]);

  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  const gltf = useLoader(GLTFLoader, 'models/Soldier.glb');

  useEffect(() => {
    if (gltf) {
      const model = gltf.scene;
      modelRef.current = model;

      model.traverse((object) => {
        if (object.isMesh) object.castShadow = true;
      });

      const skeleton = new THREE.SkeletonHelper(model);
      skeleton.visible = false;
      scene.add(skeleton);

      const mixer = new THREE.AnimationMixer(model);
      mixerRef.current = mixer;

      const idleAction = mixer.clipAction(gltf.animations[0]);
      const walkAction = mixer.clipAction(gltf.animations[3]);
      const runAction = mixer.clipAction(gltf.animations[1]);

      setActions([idleAction, walkAction, runAction]);

      // Activate all actions
      [idleAction, walkAction, runAction].forEach((action) => {
        action.play();
      });
    }
  }, [gltf, scene]);

  return (
    <>
      <hemisphereLight intensity={3} position={[0, 20, 0]} />
      <directionalLight
        intensity={3}
        position={[-3, 10, -10]}
        castShadow
        shadow-camera-top={2}
        shadow-camera-bottom={-2}
        shadow-camera-left={-2}
        shadow-camera-right={2}
        shadow-camera-near={0.1}
        shadow-camera-far={40}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshPhongMaterial color={0xcbcbcb} depthWrite={false} />
      </mesh>
      <primitive object={gltf.scene} />
    </>
  );
}

function App() {
  return (
    <>
        <Scene />
        <OrbitControls />
        <Stats />
    </>
  );
}

export default App;