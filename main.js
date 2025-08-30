// SCENE, CAMERA, RENDERER
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// LIGHTS
const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
light.position.set(0,200,0);
scene.add(light);

// FLOOR
const floorGeo = new THREE.PlaneGeometry(200,200);
const floorMat = new THREE.MeshStandardMaterial({color:0x222222});
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI/2;
scene.add(floor);

// CONTROLS (FPS)
const controls = new THREE.PointerLockControls(camera, document.body);
document.body.addEventListener('click', () => controls.lock());

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

camera.position.set(0,2,5); // starting position

// LOAD MODELS
const loader = new THREE.GLTFLoader();

// Load first room
loader.load('models/room1.glb', (gltf) => {
  gltf.scene.position.set(0,0,0); // center
  scene.add(gltf.scene);
});

// Load second room further away
loader.load('models/room2.glb', (gltf) => {
  gltf.scene.position.set(0,0,-50); // 50 units behind the first
  scene.add(gltf.scene);
});

// Load alien figure
loader.load('models/alien.glb', (gltf) => {
  gltf.scene.position.set(2,0,-10); // place inside first room
  scene.add(gltf.scene);
});

// ANIMATE LOOP
const clock = new THREE.Clock();
function animate(){
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

// HANDLE RESIZE
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
