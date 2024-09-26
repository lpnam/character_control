import { usePlane } from "@react-three/cannon";
import { useRef } from "react";

export function Ground() {
    const [ref] = usePlane(() => ({
        type: 'Staic',
        rotation: [-Math.PI/2, 0, 0]
    }), useRef(null))

    return (
        <mesh rotation={[-Math.PI/2,0,0]} receiveShadow>
        <planeGeometry args={[45,45]}/>
      </mesh>
    )
}