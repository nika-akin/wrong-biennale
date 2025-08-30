import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { PointerLockControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light
scene.add(new THREE.AmbientLight(0xffffff, 2));

// Controls
const controls = new PointerLockControls(camera, document.body);
document.body.addEventListener('click', () => controls.lock());

// Load your astronaut GLB from Google Drive
const loader = new GLTFLoader();
loader.load(
  'https://drive.google.com/uc?export=download&id=1o498y-UYiB7O3rOJaD2fOOILG-mSBXcT',
  (gltf) => {
    scene.add(gltf.scene);
    gltf.scene.position.set(0,0,0);
    gltf.scene.scale.set(1,1,1); // adjust scale if astronaut too big/small
  },
  (xhr) => {
    console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
  },
  (error) => {
    console.error('Error loading model:', error);
  }
);

camera.position.set(0,2,5);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
