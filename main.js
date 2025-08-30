// ES Module imports from CDN
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { PointerLockControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

// Scene, camera, renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 2));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// FPS Controls
const controls = new PointerLockControls(camera, document.body);
document.body.addEventListener('click', () => controls.lock());

// Movement variables
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const move = { forward:false, backward:false, left:false, right:false };

document.addEventListener('keydown', e => {
  if(e.code === 'KeyW') move.forward = true;
  if(e.code === 'KeyS') move.backward = true;
  if(e.code === 'KeyA') move.left = true;
  if(e.code === 'KeyD') move.right = true;
});

document.addEventListener('keyup', e => {
  if(e.code === 'KeyW') move.forward = false;
  if(e.code === 'KeyS') move.backward = false;
  if(e.code === 'KeyA') move.left = false;
  if(e.code === 'KeyD') move.right = false;
});

// Camera start position
camera.position.set(0, 2, 5);

// Floor
const floorGeo = new THREE.PlaneGeometry(200, 200);
const floorMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI/2;
scene.add(floor);

// Load astronaut GLB from Google Drive
const loader = new GLTFLoader();
loader.load(
  'https://drive.google.com/uc?export=download&id=1o498y-UYiB7O3rOJaD2fOOILG-mSBXcT',
  (gltf) => {
    scene.add(gltf.scene);
    gltf.scene.position.set(0, 0, -10); // place slightly in front
    gltf.scene.scale.set(1,1,1);        // adjust if too small/large
  },
  (xhr) => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
  (error) => console.error('Error loading model:', error)
);

// Animation loop
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  velocity.x -= velocity.x * 10.0 * delta;
  velocity.z -= velocity.z * 10.0 * delta;

  direction.z = Number(move.forward) - Number(move.backward);
  direction.x = Number(move.right) - Number(move.left);
  direction.normalize();

  if (move.forward || move.backward) velocity.z -= direction.z * 50.0 * delta;
  if (move.left || move.right) velocity.x -= direction.x * 50.0 * delta;

  controls.moveRight(-velocity.x * delta);
  controls.moveForward(-velocity.z * delta);

  renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
