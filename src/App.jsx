import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { Environment, PerspectiveCamera, OrbitControls } from '@react-three/drei'
import { Character } from './Character'

function App() {

  return (
    <>
      <PerspectiveCamera makeDefault fov={60} position={[-3, 5, 6]}/>
      <Environment 
        files={"/textures/envmap.hdr"}
        resolution={1024}
        ground={{
          height: 15, // Height of the camera that was used to create the env map (Default: 15)
          radius: 60, // Radius of the world. (Default 60)
          scale: 1000, // Scale of the backside projected sphere that holds the env texture (Default: 1000)
        }}
      />
      {/* <mesh>
        <boxGeometry />
        <meshLambertMaterial color="red"/>
      </mesh> */}
      <mesh rotation={[-Math.PI/2,0,0]} receiveShadow>
        <planeGeometry args={[45,45]}/>
      </mesh>
      <directionalLight intensity={0.5} position={[3,3,1]} castShadow/>
      <ambientLight />
      <OrbitControls enableDamping/>
      <Character />
    </>
  )
}

export default App
