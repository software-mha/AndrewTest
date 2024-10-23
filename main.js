import "./style.css";
import * as THREE from "three";

const canvas = document.querySelector("#webgl");
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    1000
);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  wireframe:true,
});
const cube = new THREE.Mesh(geometry, material);
const cubeRotatingSpeed = 0.01;
scene.add(cube);

function animate() {
    cube.rotation.x += cubeRotatingSpeed;
    cube.rotation.y += cubeRotatingSpeed;

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
