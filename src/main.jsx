import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/cannon'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Canvas shadows>
      <Physics gravity={[0, -9.81, 0]} broadphase='SAP'>
        <App />
      </Physics>
    </Canvas>
  </StrictMode>,
)
