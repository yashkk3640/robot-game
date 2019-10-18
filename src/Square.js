import React, { useEffect, useRef ,useCallback} from "react";
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh } from "three";

var geometry = new BoxGeometry(3, 3, 3);
var material = new MeshBasicMaterial({ color: 0x00ff00 });
export const cube = new Mesh(geometry, material);

const Square = () => {
    const mount = useRef()
    const scene = new Scene();
    const camera = new PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    const renderer = new WebGLRenderer();
    camera.position.z = 5;

    const animate = useCallback(() => {
        requestAnimationFrame(animate);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
    },[camera, renderer, scene]);


    useEffect(() => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        mount.current.appendChild(renderer.domElement);

        scene.add(cube);
        animate();
    }, [animate, renderer, scene])
    return <div ref={ref => (mount.current = ref)} />;

}
export default Square;