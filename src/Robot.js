import React, { useRef, useEffect } from 'react';

import * as THREE from "three";
import GLTFLoader from 'three-gltf-loader'

// import Stats from 'three/examples/jsm/libs/stats.module.js';
// import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
// import FontType from 'three/examples/fonts/gentilis_bold.typeface.json';
// import RobotGlb from 'RobotExpressive.glb'

// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { cube, createCube } from './Square'
import { RandomCube, checkCollide, UP, DOWN, LEFT, RIGHT, WALK_SPEED, RUN_SPEED } from './randomCube';

const dcubes = [createCube(), createCube(), createCube(), createCube(), createCube(), createCube(), createCube(), createCube()]
var dpr = window.devicePixelRatio;
const textureSize = 512 * dpr;
console.log(textureSize)

const Robot = ({ point, setAlive }) => {
    // var gui, mixer, actions, activeAction, previousAction, i;
    // var face, pointView, geometry, centerOffset, font, point = 1;
    // var api = { state: 'Walking' };
    RandomCube(cube)
    let mixer, actions, activeAction, previousAction, i, pointView, geometry, centerOffset, font, requestID;
    // let texture, sprite, controls;
    var currKey = UP
    var state = { direction: 'z', value: 1 };

    const mount = useRef()
    const model = useRef()

    // const topScene = new THREE.Scene();
    // topScene.background = THREE.transparent();

    // const topCamera = new THREE.PerspectiveCamera(-75, window.innerWidth / window.innerHeight, 0.25, 300);
    // topCamera.position.y = 100
    // topCamera.lookAt(new THREE.Vector3(0, 0, 0))

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 20000);
    camera.position.set(0, 10, -30);
    // camera.lookAt(new THREE.Vector3(2, 2, 0));

    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xe0e0e0);
    // scene.fog = new THREE.Fog(0xe0e0e0, 100, 1000);

    const clock = new THREE.Clock();
    // const stats = new Stats();

    dcubes.forEach(cube => {
        scene.add(cube)
    });
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

    var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0xffffff, depthWrite: false }));
    mesh.rotation.x = - Math.PI / 2;
    scene.add(mesh);

    var grid = new THREE.GridHelper(200, 40, 0x00000, 0x00000);

    grid.material.opacity = 0.2;
    grid.material.transparent = false;
    scene.add(grid);

    scene.add(cube)

    // model

    var loader = new GLTFLoader();

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    const loadText = () => {
        geometry = new THREE.TextGeometry(`Point ${point.current}`, {
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

    var marsGeo = new THREE.CubeGeometry(1000, 1000, 1000);
    var marsMaterials = [
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('mars/mandaris_ft.png'), side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('mars/mandaris_bk.png'), side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('mars/mandaris_up.png'), side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('mars/mandaris_dn.png'), side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('mars/mandaris_rt.png'), side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('mars/mandaris_lf.png'), side: THREE.DoubleSide })
    ]

    var marsMaterial = new THREE.MeshFaceMaterial(marsMaterials)

    var mars = new THREE.Mesh(marsGeo, marsMaterial)
    scene.add(mars)

    // var ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.3);
    // scene.add(ambientLight)

    useEffect(() => {
        loader.load('RobotExpressive.glb', function (gltf) {

            model.current = gltf.scene;
            scene.add(model.current);

            createGUI(model.current, gltf.animations);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth - 10, window.innerHeight - 10);
            renderer.autoClear = false;
            renderer.gammaOutput = true;
            renderer.gammaFactor = 2.2;
            mount.current.appendChild(renderer.domElement);

            scene.add(arrowHelper);

            // stats
            camera.lookAt(model.current.position)
            addDangerCube()

            // mount.current.appendChild(stats.dom);
            animate()

        }, undefined, function (e) {

            console.error(e);

        });

        // controls = new OrbitControls(camera, renderer.domElement)

        const keypress = onKeyPress
        window.addEventListener('keydown', keypress)
        window.addEventListener('resize', onWindowResize, false);
        // const setint = setInterval(() => {
        // }, 10000);
        return () => {
            window.removeEventListener('keydown', keypress)
            window.removeEventListener('resize', onWindowResize, false);

            // clearInterval(setint)
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

        requestID = requestAnimationFrame(animate);

        renderer.render(scene, camera);

        // stats.update();
        update()
    }
    const update = () => {
        // controls.update();
        // console.log('Danger Cubes :  ', dcubes.length)
        cube.rotation.y += 0.01;
        cube.rotation.x += 0.01;
        cube.rotation.z += 0.01;
        if (activeAction._clip.name === 'Death')
            return

        let i = WALK_SPEED + (point.current * 0.02)
        if (activeAction._clip.name === 'Running')
            i = RUN_SPEED + (point.current * 0.02)
        if (activeAction._clip.name === 'Walking' || activeAction._clip.name === 'Running') {

            model.current.position[state.direction] += i * state.value;
            camera.position[state.direction] += i * state.value;

            if (checkCollide(model.current.position, cube.position, 2)) {
                const state = activeAction._clip.name
                success(state)
            }

            // Set Vector
            arrowHelper.position.z = model.current.position.z - 5
            arrowHelper.position.x = model.current.position.x
            pointView.position.x = model.current.position.x - centerOffset
            pointView.position.z = model.current.position.z + 1
            arrowHelper.setDirection(new THREE.Vector3(cube.position.x - model.current.position.x, 0, cube.position.z - model.current.position.z))
        }
        if (model.current.position.x > 100 || model.current.position.x < -100 || model.current.position.z > 100 || model.current.position.z < -100 || deathCubesColide() > 0) {
            fadeToAction('Death', 0.5, () => {
                setAlive(false)
                window.cancelAnimationFrame(requestID);
            })
        }
    }

    const onKeyPress = (e) => {
        if (e.key === currKey && activeAction._clip.name !== 'Running') {
            fadeToAction('Running', 0.5)
            return
        } else if (e.key === currKey && activeAction._clip.name === 'Running')
            return
        else
            fadeToAction('Walking', 0.5)
        if (e.key === LEFT || e.keyCode === 37) {
            state = { direction: 'x', value: 1 }
            rotate(1);
        } else if (e.key === UP || e.keyCode === 38) {
            state = { direction: 'z', value: 1 }
            rotate(0);
        } else if (e.key === RIGHT || e.keyCode === 39) {
            state = { direction: 'x', value: -1 }
            rotate(-1);
        } else if (e.key === DOWN || e.keyCode === 40) {
            state = { direction: 'z', value: -1 }
            rotate(2);
        }
        currKey = e.key
    }
    const rotate = (dir) => {
        model.current.rotation.y = 1.6 * dir;
    }

    const success = (state) => {
        fadeToAction('Jump', 0.2, () => fadeToAction(state, 0.2))
        point.current = point.current + 1
        scene.remove(pointView)
        loadText();
        const newCube = createCube()
        dcubes.push(newCube)
        scene.add(newCube)
        RandomCube(cube, null, null, model.current.position)
        addDangerCube()
        document.getElementsByClassName('score')[0].innerHTML = `Score ${point.current * 1000}`
    }

    const addDangerCube = () => {
        for (let i = 0; i < dcubes.length; i++) {
            RandomCube(dcubes[i], cube.position, dcubes.slice(0, i), model.current.position)
            // const element = array[i];
        }
    }
    const deathCubesColide = () => {
        return dcubes.filter(cube => checkCollide(model.current.position, cube.position, 3)).length;
    }
    return (
        <div>
            <div ref={mount} />
            <button style={{ bottom: '10vw', right: '10vw', }} onClick={(e) => onKeyPress({ ...e, key: UP })}>{UP}</button>
            <button style={{ bottom: 0, right: '10vw', }} onClick={(e) => onKeyPress({ ...e, key: DOWN })}>{DOWN}</button>
            <button style={{ bottom: 0, right: 0, }} onClick={(e) => onKeyPress({ ...e, key: RIGHT })}>{RIGHT}</button>
            <button style={{ bottom: 0, right: '20vw', }} onClick={(e) => onKeyPress({ ...e, key: LEFT })}>{LEFT}</button>
        </div>
    );

}

export default Robot;
