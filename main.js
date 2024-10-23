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
camera.position.set(0, 0, 10);

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

const geometry = new THREE.PlaneGeometry(10, 10, 100, 100);
const material = new THREE.ShaderMaterial({
    vertexShader: `
    uniform float uTime;

    void main() {
      vec3 pos = position;
      pos.z = sin(pos.x * 2.0 + uTime) * 0.5;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
    fragmentShader: `

    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
  `,
    uniforms: {
        uTime: { value: 0.0 },
    },
    wireframe: true,
});
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

function animate(time) {
    material.uniforms.uTime.value = time * 0.001;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();
