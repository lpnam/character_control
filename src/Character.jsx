import { useEffect, useState } from "react"
import { useGLTF, useAnimations } from "@react-three/drei"

export function Character(props){
    const { nodes, materials, animations, scene } = useGLTF("/models/Soldier.glb");
    console.log(animations.length)
    const { ref, actions, names } = useAnimations(animations);
    const [index, setIndex] = useState();

    useEffect(() => {
        // Reset and fade in animation after an index has been changed
        actions[names[index]].reset().fadeIn(0.5).play()
        // In the clean-up phase, fade it out
        return () => actions[names[index]].fadeOut(0.5)
      }, [index, actions, names])

    useEffect(() => {
        const KeyDownCheck = (e) => {
            if (e.key === "q"){
                setIndex(1)
            } else if (e.key === "w") {
                setIndex(3)
            } else {
                setIndex(0)
            }
        }

        window.addEventListener('keydown',KeyDownCheck);
        return () => window.removeEventListener('keydown',KeyDownCheck);
    }, [])

    return (
        <group ref={ref} {...props} castShadow>
            <primitive object={scene} />
        </group>
    )
}