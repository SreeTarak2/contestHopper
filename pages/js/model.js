import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Ensure the container exists before running
const container = document.getElementById("threejs-container");
if (container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        50,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.set(2, 2, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.1;

    controls.addEventListener("start", () => { controls.autoRotate = false; });
    controls.addEventListener("end", () => { controls.autoRotate = true; });

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(2, 40, 15);
    scene.add(ambientLight, directionalLight);

    const loader = new GLTFLoader();
    loader.load(
        "../assets/models/scene.gltf",
        (gltf) => {
            const model = gltf.scene;
            model.scale.set(2.4, 2.4, 2.4);
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);
            model.rotation.y = THREE.MathUtils.degToRad(80);
            scene.add(model);
        },
        undefined,
        (error) => console.error("An error occurred loading the model:", error)
    );

    window.addEventListener("resize", () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}