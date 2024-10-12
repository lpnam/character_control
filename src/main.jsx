import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Canvas } from '@react-three/fiber'
// import { Physics } from '@react-three/cannon'
import { Physics } from '@react-three/rapier'
import { KeyboardControls } from '@react-three/drei'

const keyboardMap = [
  {name: "forward", keys: ["ArrowUp", "KeyW"]},
  {name: "backward", keys: ["ArrowDown", "KeyS"]},
  {name: "left", keys: ["ArrowLeft", "KeyA"]},
  {name: "right", keys: ["ArrowRight", "KeyD"]},
  {name: "run", keys: ["Shift"]},
  {name: "stop", keys: ["Space"]},
]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <KeyboardControls map={keyboardMap}>
      <Canvas shadows camera={{ position: [-6, 10, 12], near: 0.1, fov: 40 }}>
        {/* <Suspense> */}
          {/* <Physics debug> */}
            <App />
          {/* </Physics> */}
        {/* </Suspense> */}
      </Canvas>
    </KeyboardControls>
  </StrictMode>,
)
