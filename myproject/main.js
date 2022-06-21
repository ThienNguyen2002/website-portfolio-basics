import "./style.css";

import * as THREE from "three";
import { PointLightHelper, Scene } from "three";
//makes the webpage interactive
//https://threejs.org/docs/index.html?q=orbit#examples/en/controls/OrbitControls
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// It needs a scene, a camera, and a renderer

//container that holds the camera, objects, and lights
const scene = new THREE.Scene();

//camera. Perspective camera is the most common because that's what the human eye can see
//https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera
/* PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
fov — Camera frustum vertical field of view.
aspect — Camera frustum aspect ratio/based on the user's browser's window.
near — Camera frustum near plane.
far — Camera frustum far plane.*/
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
//render out the graphics
//needs to know which DOM element to use. Inm this case, it's the canvas with the background
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

//renderer.render(scene, camera);

//set of vectors that define the object itself
//e.g.: https://threejs.org/docs/index.html#api/en/geometries/TorusGeometry
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
//Like a wrapping for the object
//e.g.: https://threejs.org/docs/index.html#api/en/materials/MeshBasicMaterial
const material = new THREE.MeshStandardMaterial({
  color: 0xff6347,
});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

//emit lights in all directions
//https://threejs.org/docs/index.html#api/en/lights/PointLight
const pointLight = new THREE.PointLight(0xffffff);

pointLight.position.set(20, 20, 20);

//lights across the entire scene
//https://threejs.org/docs/index.html#api/en/lights/AmbientLight
const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

//shows where is the light
//https://threejs.org/docs/index.html#api/en/helpers/PointLightHelper
const lightHelper = new THREE.PointLightHelper(pointLight);

//shows a grid
//https://threejs.org/docs/index.html?q=grid#api/en/helpers/GridHelper
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);
//when selected by a mouse, the camera changes positions
const controls = new OrbitControls(camera, renderer.domElement);

//generate a star to the scene
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  //an array with three values with a range of -100 to 100 (random)
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load("../images/space.jpg");
scene.background = spaceTexture;

//thien texture
const thienTexture = new THREE.TextureLoader().load("../images/thien.jpg");
const thien = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: thienTexture })
);

scene.add(thien);

//jupiter texture and normal texture
const jupiterTexture = new THREE.TextureLoader().load("../images/jupiter.jpg");
const normalTexture = new THREE.TextureLoader().load("../images/normal.jpg");
const jupiter = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshBasicMaterial({ map: jupiterTexture, normalMap: normalTexture })
);

jupiter.position.z = 30;
jupiter.position.setX(-10);

function moveCamera() {
  //know's where the user is at in the document
  const t = document.body.getBoundingClientRect().top;
  jupiter.rotation.x += 0.05;
  jupiter.rotation.y += 0.075;
  jupiter.rotation.z += 0.05;

  thien.rotation.y += 0.01;
  thien.rotation.z += 0.01;

  //changing the position of the actual camera
  //the t gets a negative number, and it changes positions by a negative number
  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}
//fire function whenever the user scrolls
document.body.onscroll = moveCamera;

scene.add(jupiter);

//recursive function that calls the renderer automatically (infinite loop)
function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  //makes sure the changes are reflected in the UI
  controls.update();

  renderer.render(scene, camera);
}

animate();
