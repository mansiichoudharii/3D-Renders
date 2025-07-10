import * as THREE from "three";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";
import getStarField from "../3D_earth/src/getStarfield.js";
const w = window.innerWidth;
const h = window.innerHeight;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 10);
camera.position.z = 2;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
const loader = new THREE.TextureLoader();

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * (Math.PI / 180); // Earth's axial tilt
scene.add(earthGroup);

const geometry = new THREE.IcosahedronGeometry(1.0, 12);
const material = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/00_earthmap1k.jpg"),
});
const earthMesh = new THREE.Mesh(geometry, material);

const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load("./textures/03_earthlights1k.jpg"),
  blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geometry, lightsMat);

const sunLight = new THREE.DirectionalLight(0xffffff);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

earthGroup.add(earthMesh);
earthGroup.add(lightsMesh);

const stars = getStarField({ numStars: 20000 });
scene.add(stars);

function animate() {
  requestAnimationFrame(animate);
  earthMesh.rotation.y += 0.001;
  lightsMesh.rotation.y += 0.001;
  controls.update();
  renderer.render(scene, camera);
}
animate();
