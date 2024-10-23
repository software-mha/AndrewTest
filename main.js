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

let isDrawing = false;
let startPoint = new THREE.Vector3();
let endPoint = new THREE.Vector3();
let line;

const boxGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const boxMaterial = new THREE.MeshBasicMaterial();
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
boxMesh.visible=false;
scene.add(boxMesh);

const lineMaterial = new THREE.LineBasicMaterial();

function getMousePosition(event) {
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  return mouse;
}

function getWorldPosition(mouse) {
  const vector = new THREE.Vector3(mouse.x, mouse.y, 0);
  vector.unproject(camera);
  return vector;
}

function updateLine(start, end) {
  const points = [start, end];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  if (!line) {
    line = new THREE.Line(geometry, lineMaterial);
    scene.add(line);
    boxMesh.visible=true;
  } else {
    line.geometry.dispose();
    line.geometry = geometry; // Update geometry
  }
}
function moveBox(start, end) {
  let vector = start.clone();
  vector.add(end);
  vector.multiplyScalar(1/2);
  const dir = vector.sub(camera.position).normalize();
  const distance = -camera.position.z / dir.z;
  let newPosition = camera.position.clone().add(dir.multiplyScalar(distance))
  boxMesh.position.copy(newPosition);
}

window.addEventListener('mousedown', (event) => {
  isDrawing = true;
  const mouse = getMousePosition(event);
  startPoint = getWorldPosition(mouse);
});

window.addEventListener('mousemove', (event) => {
  if (!isDrawing) return;

  const mouse = getMousePosition(event);
  endPoint = getWorldPosition(mouse);

  updateLine(startPoint, endPoint);
  moveBox(startPoint, endPoint);
});

window.addEventListener('mouseup', () => {
  isDrawing = false;
});

function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
