import React, { useEffect, useRef, useCallback } from "react";
import { Scene, PerspectiveCamera, WebGLRenderer, OctahedronGeometry, MeshBasicMaterial, Mesh, IcosahedronBufferGeometry, MeshLambertMaterial, MeshStandardMaterial } from "three";

var diamondGeometry = new OctahedronGeometry(2, 0);
var bubbleGeometry = new IcosahedronBufferGeometry(4, 1)
var diamondMaterial = new MeshStandardMaterial({ color: 0xd4af37, roughness: 0.5, metalness: 1.0 })
var bubbleMaterial = new MeshLambertMaterial({ color: 0xffffff, opacity: 0.6, transparent: true})

export const cube = new Mesh(diamondGeometry, diamondMaterial);
export const dangerCube = new Mesh(diamondGeometry, new MeshBasicMaterial({ color: 0xaaaaaa }));
export const createCube = () => new Mesh(bubbleGeometry, bubbleMaterial)

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

        // cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
    }, [camera, renderer, scene]);


    useEffect(() => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        mount.current.appendChild(renderer.domElement);

        scene.add(cube);
        animate();
    }, [animate, renderer, scene])
    return <div ref={ref => (mount.current = ref)} />;

}
export default Square;