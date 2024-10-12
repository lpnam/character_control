import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useRef } from "react";

const WIDTH_GROUND = 45;
const HEIGHT_GROUND = 45;

export function Ground() {
    // const [ref] = usePlane(() => ({
    //     type: 'Staic',
    //     rotation: [-Math.PI/2, 0, 0]
    // }), useRef(null))

    return (
        <RigidBody type="fixed" colliders={false}>
   
            <mesh rotation={[-Math.PI/2,0,0]} receiveShadow>
                <planeGeometry args={[WIDTH_GROUND,HEIGHT_GROUND]}/>
            </mesh>
            <CuboidCollider args={[WIDTH_GROUND/2, 0.01, HEIGHT_GROUND/2]} />
        </RigidBody>
    )
}