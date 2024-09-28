import { useState, useEffect, useRef } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { Environment, PerspectiveCamera, OrbitControls } from '@react-three/drei'
import { Character } from './Character'
import { Ground } from './PlanX';
import { Vector3, Quaternion } from 'three';

function App() {
  const [thirdperson, setThirdPerson] = useState(false);
  const [cameraPosition, setCameraPosition] = useState([-6, 10, 12]);
  const orbitcontrol = useRef(null);

  // For test
  const dir = new Vector3(1,1,0);
  dir.normalize();

  const default_vector = new Vector3(1, 1, 1);
  default_vector.normalize();

  const start_point = new Vector3(0,0,0);
  const length = 5;
  // const hex = 0xffff00;

  const quaternion = new Quaternion();
  quaternion.setFromAxisAngle(default_vector, Math.PI / 2 );
  dir.applyQuaternion(quaternion);
  //Test done

  useEffect(() => {
    const keyDownPressHandle = (e) => {
      if(e.key==="k"){
        setThirdPerson((prev) => !prev);
        if(thirdperson) setCameraPosition([-6, 10, 12])
        else setCameraPosition([-6, 10, 12])
      }
    }
    window.addEventListener('keydown', keyDownPressHandle);
    return () => {
        window.removeEventListener('keydown', keyDownPressHandle);
    }
  }, [thirdperson]);

  return (
    <>
      <PerspectiveCamera makeDefault fov={60} position={cameraPosition}/>
      <Environment 
        files={"/textures/envmap.hdr"}
        resolution={1024}
        ground={{
          height: 15, // Height of the camera that was used to create the env map (Default: 15)
          radius: 60, // Radius of the world. (Default 60)
          scale: 1000, // Scale of the backside projected sphere that holds the env texture (Default: 1000)
        }}
      />
      <Ground />
      
      <directionalLight intensity={0.5} position={[3,3,1]} castShadow/>
      <ambientLight />
      <OrbitControls enableDamping ref={orbitcontrol}/>
      <Character thirdPersonControl={thirdperson} orbitControl={orbitcontrol}/>
      <arrowHelper args={[dir, start_point, length, "red"]} />
      <arrowHelper args={[default_vector, start_point, length, "blue"]} />
      <gridHelper args={[25]}/>
      <axesHelper args={[6]}/>
    </>
  )
}

export default App
