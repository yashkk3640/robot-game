import React, { useRef, useEffect } from 'react';

import * as THREE from "three";
import GLTFLoader from 'three-gltf-loader'

// import Stats from 'three/examples/jsm/libs/stats.module.js';
// import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
// import FontType from 'three/examples/fonts/gentilis_bold.typeface.json';
// import RobotGlb from 'RobotExpressive.glb'

import { cube } from './Square'
import { RandomCube, checkCollide } from './randomCube';

const Robot = () => {
    // var gui, mixer, actions, activeAction, previousAction, i;
    // var face, pointView, geometry, centerOffset, font, point = 1;
    // var api = { state: 'Walking' };
    RandomCube(cube)
    let mixer, actions, activeAction, previousAction, i, pointView, geometry, centerOffset, font, point = 1;
    var currKey = 'w'
    var state = { direction: 'z', value: 1 };

    const mount = useRef()
    const model = useRef()

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 300);
    camera.position.set(0, 10, -30);
    camera.lookAt(new THREE.Vector3(2, 2, 0));

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe0e0e0);
    scene.fog = new THREE.Fog(0xe0e0e0, 50, 300);

    const clock = new THREE.Clock();
    // const stats = new Stats();

    // arrow
    var dir = new THREE.Vector3(1, 0, 0);

    //normalize the direction vector (convert to vector of length 1)
    dir.normalize();

    var origin = new THREE.Vector3(0, 0.1, -5);
    var length = 5;
    var hex = 0xff0000;

    var arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex, 3);

    // lights

    var light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 20, 0);
    scene.add(light);

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 20, 10);
    scene.add(light);

    // ground

    var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
    mesh.rotation.x = - Math.PI / 2;
    scene.add(mesh);

    var grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000);

    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add(grid);

    scene.add(cube)

    // model

    var loader = new GLTFLoader();

    const renderer = new THREE.WebGLRenderer({ antialias: true });

    const loadText = () => {
        geometry = new THREE.TextGeometry(`Point ${point}`, {
            font: font,
            size: 2,
            height: 1,
            curveSegments: 1,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.01,
            weight: "normal",
            bevelOffset: 0,
            bevelSegments: 1
        });
        geometry.computeBoundingBox();
        geometry.computeVertexNormals();

        centerOffset =
            -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

        pointView = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 0x2233aa }))
        pointView.rotation.y = 3.2
        pointView.position.y = 5
        pointView.position.x = centerOffset
        pointView.castShadow = true;
        scene.add(pointView)
    }

    // Text

    var load = new THREE.FontLoader();
    load.load('helvetiker_regular.typeface.js', function (res) {
        font = res
        loadText()
    }, null, e => console.log(e));


    useEffect(() => {



        loader.load('RobotExpressive.glb', function (gltf) {

            model.current = gltf.scene;
            scene.add(model.current);

            createGUI(model.current, gltf.animations);
            // renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth - 10, window.innerHeight - 10);
            renderer.gammaOutput = true;
            renderer.gammaFactor = 2.2;
            mount.current.appendChild(renderer.domElement);

            scene.add(arrowHelper);

            // stats

            // mount.current.appendChild(stats.dom);
            animate()

        }, undefined, function (e) {

            console.error(e);

        });

        const keypress = onKeyPress
        window.addEventListener('keypress', keypress)
        window.addEventListener('resize', onWindowResize, false);

        return () => {
            window.removeEventListener('keypress', keypress)
            window.removeEventListener('resize', onWindowResize, false);
        }
        // only execute when component initilize
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const createGUI = (model, animations) => {

        var states = ['Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing'];
        var emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'];

        // gui = new GUI();

        mixer = new THREE.AnimationMixer(model);

        actions = {};

        for (i = 0; i < animations.length; i++) {

            var clip = animations[i];
            var action = mixer.clipAction(clip);
            actions[clip.name] = action;

            if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {

                action.clampWhenFinished = true;
                action.loop = THREE.LoopOnce;

            }

        }

        // states

        // var statesFolder = gui.addFolder('States');

        // var clipCtrl = statesFolder.add(api, 'state').options(states);

        // clipCtrl.onChange(function () {

        //     fadeToAction(api.state, 0.5);

        // });

        // statesFolder.open();

        // emotes

        // var emoteFolder = gui.addFolder('Emotes');



        // for (i = 0; i < emotes.length; i++) {

        //     createEmoteCallback(emotes[i]);

        // }

        // emoteFolder.open();

        // expressions

        // face = model.getObjectByName('Head_2');

        // var expressions = Object.keys(face.morphTargetDictionary);
        // var expressionFolder = gui.addFolder('Expressions');

        // for (i = 0; i < expressions.length; i++) {

        //     expressionFolder.add(face.morphTargetInfluences, i, 0, 1, 0.01).name(expressions[i]);

        // }

        activeAction = actions['Walking'];
        activeAction.play();

        // expressionFolder.open();

    }

    const fadeToAction = (name, duration, callback) => {

        previousAction = activeAction;
        activeAction = actions[name];

        if (previousAction !== activeAction) {

            previousAction.fadeOut(duration);

        }


        if (callback)
            setTimeout(() => callback(), 3000 * duration)

        activeAction
            .reset()
            .setEffectiveTimeScale(1)
            .setEffectiveWeight(1)
            .fadeIn(duration)
            .play();

    }

    const onWindowResize = () => {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }

    //

    const animate = () => {

        var dt = clock.getDelta();

        if (mixer) mixer.update(dt);

        requestAnimationFrame(animate);

        renderer.render(scene, camera);

        // stats.update();
        update()
    }
    const update = () => {

        if (activeAction._clip.name === 'Death')
            return
        let i = 0.1
        if (activeAction._clip.name === 'Running')
            i = 0.2
        if (activeAction._clip.name === 'Walking' || activeAction._clip.name === 'Running') {

            model.current.position[state.direction] += i * state.value;
            camera.position[state.direction] += i * state.value;

            if (checkCollide(model.current.position, cube.position, 2)) {
                const state = activeAction._clip.name
                fadeToAction('Jump', 0.2, () => fadeToAction(state, 0.2))
                point += 1
                // pointView.geometry.parameters.text = `Point ${point}`
                scene.remove(pointView)
                loadText();
                pointView.updateMorphTargets();
                // geometry. = `Point ${point}`
                console.log(pointView.geometry.parameters.text)
                RandomCube(cube)
            }

            // Set Vector
            arrowHelper.position.z = model.current.position.z - 5
            arrowHelper.position.x = model.current.position.x
            pointView.position.x = model.current.position.x - centerOffset
            pointView.position.z = model.current.position.z + 1
            arrowHelper.setDirection(new THREE.Vector3(cube.position.x - model.current.position.x, 0, cube.position.z - model.current.position.z))
        }
        if (model.current.position.x > 100 || model.current.position.x < -100 || model.current.position.z > 100 || model.current.position.z < -100)
            fadeToAction('Death', 0.5)
    }

    const onKeyPress = (e) => {
        if (e.key === currKey && activeAction._clip.name !== 'Running') {
            fadeToAction('Running', 0.5)
            return
        } else
            fadeToAction('Walking', 0.5)
        if (e.key === 'a') {
            state = { direction: 'x', value: 1 }
            rotate(1);
        } else if (e.key === 'w') {
            state = { direction: 'z', value: 1 }
            rotate(0);
        } else if (e.key === 's') {
            state = { direction: 'z', value: -1 }
            rotate(2);
        } else if (e.key === 'd') {
            state = { direction: 'x', value: -1 }
            rotate(-1);
        }
        currKey = e.onKeyPress
    }
    const rotate = (dir) => {
        model.current.rotation.y = 1.6 * dir;
    }

    return (
        <div>
            <div ref={ref => (mount.current = ref)} />
            <button style={{ bottom: '10vw', right: '10vw', }} onClick={(e) => onKeyPress({ ...e, key: 'w' })}>W</button>
            <button style={{ bottom: 0, right: '10vw', }} onClick={(e) => onKeyPress({ ...e, key: 's' })}>S</button>
            <button style={{ bottom: 0, right: 0, }} onClick={(e) => onKeyPress({ ...e, key: 'd' })}>D</button>
            <button style={{ bottom: 0, right: '20vw', }} onClick={(e) => onKeyPress({ ...e, key: 'a' })}>A</button>
        </div>
    );

}

export default Robot;
