import { useEffect, useState, useRef } from "react"
import { useGLTF, useAnimations } from "@react-three/drei"
import { useFrame } from "@react-three/fiber";
import { Quaternion, Vector3, MathUtils } from "three";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";

const CharacterState = Object.freeze({
    Idle: 0,
    Run: 1,
    Walk: 3,
});

const normalizeAngle = (angle) => {
    while (angle > Math.PI) angle -= 2 * Math.PI;
    while (angle < -Math.PI) angle += 2 * Math.PI;
    return angle;
};

const lerpAngle = (start, end, t) => {
    start = normalizeAngle(start);
    end = normalizeAngle(end);

    let delta = ((end - start + Math.PI) % (Math.PI * 2)) - Math.PI;
    return start + delta * t;
};

export function CharacterTwo(props){

    const { nodes, materials, animations, scene } = useGLTF("/models/Soldier.glb");
    // ref <=> characterRef
    const { ref, actions, names } = useAnimations(animations);
    const [index, setIndex] = useState(CharacterState.Idle);
    const previousIndexAction = useRef(null);
    const [,get] = useKeyboardControls();

    const rigidBody = useRef();
    const container = useRef();
    const character = useRef();

    const characterRotationTarget = useRef(0);
    const rotationTarget = useRef(0);
    const cameraPosition = useRef();
    const cameraTarget = useRef();
    const cameraWorldPosition = useRef(new Vector3());
    const cameraLookAtWorldPosition = useRef(new Vector3());
    const cameraLookAt = useRef(new Vector3());

    useEffect(() => {
        const handleAnimationTransition = (indexState) => {
            const prevAction = previousIndexAction.current;
            const nextAction = actions[names[indexState]];

            if (prevAction) {
                nextAction.reset();

                const ratio = nextAction.getClip().duration / prevAction.getClip().duration;
                nextAction.time = prevAction.time * ratio;

                nextAction.crossFadeFrom(prevAction, 0.5, true).play();
            }
            else {
                nextAction.reset().play();
            }
                
            previousIndexAction.current = nextAction;
        }

        handleAnimationTransition(index);

        return () => {
            if (previousIndexAction.current)
                previousIndexAction.current.fadeOut(0.5)
        }
        
      }, [index, actions, names])

    useFrame(({ camera }) => {
        const t = 0.1;
        const walkVelocity = 2;
        const runVelocity = 5;
        const rotationSpeed = degToRad(0.5);

        if (rigidBody.current){

            const velocity = rigidBody.current.linvel();

            const movement = {
                x: 0,
                z: 0
            };

            if(get().forward){
                movement.z = 1;
            }
            else if(get().backward){
                movement.z = -1;
            } else {
                movement.z = 0;
            }

            let speed = get().run ? runVelocity : walkVelocity;

            if (get().stop) speed = 0;


            if(get().left){
                movement.x = 1;
            }
            else if(get().right){
                movement.x = -1;
            } else {
                movement.x = 0;
            }

            if (movement.x !==0 || movement.z !==0){
                setIndex(CharacterState.Walk);
                if (get().run) setIndex(CharacterState.Run);
            } else {
                setIndex(CharacterState.Idle);
            }
            

            if (movement.x !== 0) {
                rotationTarget.current += rotationSpeed * movement.x;
            }

            if (movement.x !== 0 || movement.z !== 0) {
                setIndex(CharacterState.Walk);
                characterRotationTarget.current = Math.atan2(movement.x, movement.z)
                velocity.z = Math.cos(rotationTarget.current + characterRotationTarget.current) * speed;  
                velocity.x = Math.sin(rotationTarget.current + characterRotationTarget.current) * speed;  
            } else {
                // Explicitly stop the character when there's no movement
                velocity.x = 0;
                velocity.z = 0;
              }

            character.current.rotation.y = lerpAngle(
                character.current.rotation.y,
                characterRotationTarget.current,
                t
                );

            rigidBody.current.setLinvel(velocity, true);
        }

        container.current.rotation.y = MathUtils.lerp(
            container.current.rotation.y,
            rotationTarget.current,
            t
        );

        cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
        camera.position.lerp(cameraWorldPosition.current, t);

        if (cameraTarget.current){
            cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
            cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, t);

            camera.lookAt(cameraLookAt.current);
        }

    });

    return (
        <RigidBody colliders={false} ref={rigidBody}>
            <group ref={container}>
                <group ref={cameraPosition} position-y={4} position-z={-4}></group>
                <group ref={cameraTarget} position-z={1.5}></group>
                <group ref={character}>
                    <group ref={ref} rotation-y={Math.PI}>
                        <primitive object={scene} />
                    </group>
                </group>
            </group>
            {/* <CapsuleCollider args={[1.08, 0.40]}/> */}
        </RigidBody>
    )
}