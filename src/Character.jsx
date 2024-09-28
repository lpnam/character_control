import { useEffect, useState, useRef } from "react"
import { useGLTF, useAnimations } from "@react-three/drei"
import { useFrame } from "@react-three/fiber";
import { Quaternion, Vector3 } from "three";
import { useBox } from "@react-three/cannon";

const CharacterState = Object.freeze({
    Idle: 0,
    Run: 1,
    Walk: 3,
});

export function Character(props){
    const position = [-1.5, 0, 3];
    const width = 3;
    const height = 6;

    const [characterBody, characterApi] = useBox(
        () => ({
          allowSleep: false,
          args: [width, height, 5],
          mass: 0,
          position,
        }),
        useRef(null),
      );

    const { nodes, materials, animations, scene } = useGLTF("/models/Soldier.glb");
    // console.log(animations.length)
    const { ref, actions, names } = useAnimations(animations);
    const [index, setIndex] = useState(CharacterState.Idle);
    const previousIndexAction = useRef(null);
    const [controls, setControls] = useState({})
    const [anglex, setAnglex] = useState(0)

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

    useEffect(() => {
        const KeyDownCheck = (e) => {
            setControls((controls) => ({ ...controls, [e.key.toLowerCase()]: true}))
        }

        const KeyUpCheck = (e) => {
            setControls((controls) => ({ ...controls, [e.key.toLowerCase()]: false}))
        }

        window.addEventListener('keydown',KeyDownCheck);
        window.addEventListener('keyup',KeyUpCheck);
        return () => {
            window.removeEventListener('keydown',KeyDownCheck);
            window.removeEventListener('keyup',KeyUpCheck);
        }
    }, []);
// ### 3rd Camera version 2
    useFrame((state, delta) => {
        if(!props.thirdPersonControl) return;
        const t = 1.0 - Math.pow(0.001, delta);
        let velocity = 0;
        const walkVelocity = 2;
        const runVelocity = 5;
        let angleYCameraDirection = Math.atan2(
            (state.camera.position.x - scene.position.x), 
            (state.camera.position.z - scene.position.z));

        switch (index) {
            case 3:
                velocity = walkVelocity;
                break;
            case 1:
                velocity = runVelocity
                break;        
            default:
                velocity = 0;
                break;
        }

        const rotateAngle = new Vector3(0,1,0);
        rotateAngle.normalize();
        
        const rotateQuarternion = new Quaternion(0,0,0,0);
        rotateQuarternion.setFromAxisAngle(rotateAngle, angleYCameraDirection + anglex);
        scene.quaternion.rotateTowards(rotateQuarternion, 0.2);

        const wDir = new Vector3(); // Set direction base on current position of character (object)
        state.camera.getWorldDirection(wDir);
        wDir.y = 0;
        wDir.normalize();
        wDir.applyAxisAngle(rotateAngle, anglex);

        let dirMoveX = wDir.x * velocity * delta;
        let dirMoveZ = wDir.z * velocity * delta;

        scene.position.x += dirMoveX;
        scene.position.z += dirMoveZ;

        let cameraTarget = new Vector3();

        // move camera
        state.camera.position.x += dirMoveX;
        state.camera.position.z += dirMoveZ;
        // update camera target
        cameraTarget.x = scene.position.x;
        cameraTarget.y = scene.position.y + 1;
        cameraTarget.z = scene.position.z;

        props.orbitControl.current.target = cameraTarget;
    });
    
    // ### Character control version 1
    // useFrame((state, delta) => {

    //     const t = 1.0 - Math.pow(0.001, delta);
    //     const runVelocity = 5;
    //     const walkVelocity = 2;
    //     let velocity;

    //     const rotateVector = new Vector3(0,1,0);
    //     rotateVector.normalize();

    //     const position = new Vector3();
    //     position.setFromMatrixPosition(characterBody.current.matrixWorld);

    //     let angleYCameraDirection = Math.atan2(
    //         (state.camera.position.x - scene.position.x), 
    //         (state.camera.position.z - scene.position.z))

    //     const quaternion = new Quaternion(0,0,0,0);
    //     quaternion.setFromAxisAngle(rotateVector, angleYCameraDirection + anglex);        

    //     const wDir = new Vector3(0,0,-1); // Set direction base on current position of character (object)
    //     wDir.applyQuaternion(quaternion);
    //     wDir.normalize();

    //     switch (index) {
    //         case 3:
    //             velocity = walkVelocity;
    //             break;
    //         case 1:
    //             velocity = runVelocity
    //             break;        
    //         default:
    //             velocity = 0;
    //             break;
    //     }
        
    //     // Update the camera's target for the next frame
    //     scene.quaternion.slerp(quaternion, t);

    //     let dirMoveX = wDir.x * velocity * delta;
    //     let dirMoveZ = wDir.z * velocity * delta;

    //     scene.position.x += dirMoveX;
    //     scene.position.z += dirMoveZ;
    // });


    // ### 3rd Camera version 1
    // useFrame((state, delta) => {
    //     if(!props.thirdPersonControl) return;

    //     const t = 1.0 - Math.pow(0.001, delta);

    //     const position = new Vector3();
    //     position.setFromMatrixPosition(characterBody.current.matrixWorld);

    //     const quaternion = new Quaternion(0,0,0,0);
    //     quaternion.setFromRotationMatrix(characterBody.current.matrixWorld);      

    //     const wDir = new Vector3(0,0,1);
    //     wDir.applyQuaternion(quaternion);
    //     wDir.normalize();
        
    //     const cameraOffset = wDir.multiplyScalar(8).add(new Vector3(0, 3, -2));
    //     const cameraPosition = state.camera.position.lerp(
    //       position.clone().add(cameraOffset), 
    //       t
    //     );

    //     const currentLookAt = state.camera.target || position.clone();
    //     currentLookAt.lerp(position, t);

    //     state.camera.position.copy(cameraPosition);
    //     state.camera.lookAt(currentLookAt);

    //     // Update the camera's target for the next frame
    //     state.camera.target = currentLookAt.clone();
    // });

    useEffect(() => {
        // console.log(controls)
        if ((controls.w && controls.s) || (controls.a && controls.d)) {
            setIndex(CharacterState.Idle);
        }
        else if (controls.w || controls.s || controls.d || controls.a) {
            setIndex(controls.shift ? CharacterState.Run : CharacterState.Walk);
        }
        else {
            setIndex(CharacterState.Idle);
        }
        
        if      (controls.w && controls.d)  setAnglex(-Math.PI/4)
        else if (controls.s && controls.d)  setAnglex(-3*Math.PI/4)
        else if (controls.s && controls.a)  setAnglex(3*Math.PI/4)
        else if (controls.w && controls.a)  setAnglex(Math.PI/4)
        else if (controls.w)                setAnglex(0)
        else if (controls.d)                setAnglex(-Math.PI/2)     
        else if (controls.s)                setAnglex(Math.PI)  
        else if (controls.a)                setAnglex(Math.PI/2)
        // else                                setAnglex(0)
      
    }, [controls]);

    return (
        <group ref={characterBody} castShadow receiveShadow>
            <group ref={ref}>
                <primitive object={scene} />
            </group>
            {/* <mesh ref={ref} >
                <meshLambertMaterial color={'red'}/>
                <boxGeometry args={[width, height, 3]} />
            </mesh>  */}
        </group>

    )
}