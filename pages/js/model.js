import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const container = document.getElementById("threejs-container");

const scene = new THREE.Scene();
// scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(
  50,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);

camera.position.set(2, 2, 5);
// camera.position.set(4 , 4 , 10);
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

// controls.minPolarAngle = Math.PI / 3;
// controls.maxPolarAngle = Math.PI / 3;

controls.addEventListener("start", () => {
  controls.autoRotate = false;
});
controls.addEventListener("end", () => {
  controls.autoRotate = true;
});

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(2, 40, 15);
scene.add(ambientLight);
scene.add(directionalLight);

// const directionLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.5);
// scene.add(directionLightHelper);

const loader = new GLTFLoader();
loader.load(
  "../assets/models/scene.gltf",
  function (gltf) {
    const model = gltf.scene;
    // model.scale.set(1.5, 1.5, 1.5);
    model.scale.set(2.4, 2.4, 2.4);

    // Center the model
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    model.rotation.y = THREE.MathUtils.degToRad(80);
    model.rotation.x = THREE.MathUtils.degToRad(0);

    scene.add(model);

    // Add BoxHelper after model is loaded
    // const helper = new THREE.BoxHelper(model, 0xffff00);
    // scene.add(helper);
  },
  undefined,
  function (error) {
    console.error("An error occurred while loading the model:", error);
  }
);

// Add axes helper
// const axes = new THREE.AxesHelper(2);
// scene.add(axes);

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

// gsap animation
document.addEventListener("DOMContentLoaded", () => {
  // 1. REGISTER GSAP PLUGINS
  gsap.registerPlugin(ScrollTrigger, SplitText);

  // 2. INTEGRATE LENIS (SMOOTH SCROLL) WITH SCROLLTRIGGER
  // This is a crucial step to make ScrollTrigger work correctly with Lenis
  const lenis = new Lenis();

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // 3. DEFINE ANIMATIONS
  function animateHero() {
    const heroTitle = document.querySelector('[data-anim-child="split-chars"]');
    const heroParagraph = document.querySelector(
      '.hero-content p[data-anim-child="fade-up"]'
    );
    const threeContainer = document.querySelector("#threejs-container");

    const split = new SplitText(heroTitle, { type: "chars" });

    const tl = gsap.timeline({
      defaults: { ease: "power3.out", duration: 0.8 },
    });

    tl.from(split.chars, {
      opacity: 0,
      y: 30,
      stagger: 0.03,
      duration: 0.6,
    }).from(
      [heroParagraph, threeContainer],
      {
        opacity: 0,
        y: 40,
        stagger: 0.2,
      },
      "-=0.5"
    );
  }

  function animateOnScroll() {
    const containers = gsap.utils.toArray("[data-anim-container]");

    containers.forEach((container) => {
      const childrenToAnimate = container.querySelectorAll("[data-anim-child]");

      gsap.from(childrenToAnimate, {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });
  }

  function animateCards() {
    const cardContainers = gsap.utils.toArray(".contests-cards-details");

    cardContainers.forEach((container) => {
      const cards = container.querySelectorAll(".anim-card");

      gsap.from(cards, {
        opacity: 0,
        y: 60,
        stagger: 0.15,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          toggleActions: "play none none none",
          // markers: true
        },
      });
    });
  }

  animateHero();
  animateOnScroll();
  animateCards();
});
