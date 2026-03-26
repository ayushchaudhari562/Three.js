

//   https://threejs.org/docs/
// three.js -> 3D library for browser using WebGL

// 1. IMPORT

import *as THREE from 'three';
// imports entire three.js library
// required in every project

// 2. SCENE

const scene = new THREE.Scene();
// scene -> root container
// holds all objects, lights, cameras
// nothing renders without a scene

// 3. CAMERA

const camera = new THREE.PerspectiveCamera(
    75,                                     // fov -> field of view (higher = zoom out)
    window.innerWidth / window.innerHeight, // aspect ratio -> prevents stretching
    0.1,                                    // near -> closer than this = not rendered
    1000                                    // far -> farther than this = not rendered
);

camera.position.set(0, 0, 5);
// move camera back -> default objects sit at (0,0,0)
// without moving back -> camera is inside the object

// camera types:
// PerspectiveCamera -> realistic depth (most used)
// OrthographicCamera -> flat/2D look (no depth)

// 4. RENDERER

const renderer = new THREE.WebGLRenderer({antialias : true});
// renderer -> converts scene + camera into pixels via GPU
// antialias -> smooths jagged edges

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// handles retina/high-res screens
// capped at 2 -> prevents performance drop

renderer.setSize(window.innerWidth, window.innerHeight);
// canvas fills entire window

document.body.appendChild(renderer.domElement);
// attaches canvas to HTML
// without this -> nothing visible on page

// 5. CREATING A 3D OBJECT

// every object needs 3 things:
// geometry -> shape (vertices, faces)
// material -> skin (color, texture, shininess)
// mesh -> combines both into renderable object

// 5a. geometry
const geometry = new THREE.BoxGeometry(1, 1, 1);
// cube -> width, height, depth

// 5b. material
const material = new THREE.MeshStandardMaterial({
    color : 0x22c55e, // green (hex)
    roughness : 0.4,  // 0 = mirror, 1 = rough
    metalness : 0.7   // 0 = plastic, 1 = metal
});

// 5c. mesh
const cube = new THREE.Mesh(geometry, material);

// 5d. add to scene
scene.add(cube);
// must add -> otherwise won't show

// 6. LIGHTS

// without light -> MeshStandardMaterial appears black

// ambient light -> base/minimum visibility
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
// lights everything equally, no shadows
scene.add(ambient);

// directional light -> like sunlight
const dir = new THREE.DirectionalLight(0xffffff, 1);
// parallel rays, creates shading + shadows
dir.position.set(5, 10, 5);
scene.add(dir);

// light types:
// AmbientLight     -> everywhere equally (no shadows)
// DirectionalLight -> parallel rays like sun
// PointLight       -> radiates from a point like bulb
// SpotLight        -> cone shape like flashlight

// 7. CONTROLS

import{OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

const controls = new OrbitControls(camera, renderer.domElement);
// left click drag -> rotate
// scroll -> zoom
// right click drag -> pan

controls.enableDamping = true;
// smooth deceleration after interaction
// requires controls.update() in animation loop

// 8. ANIMATION LOOP

const clock = new THREE.Clock();
// tracks time between frames
// ensures consistent speed across devices

function animate()
{
    requestAnimationFrame(animate);
    // calls itself ~60 times/sec
    // pauses in inactive tabs automatically

    const dt = clock.getDelta();
    // dt = time since last frame (seconds)
    // use for frame-rate independent animation

    cube.rotation.x += dt;
    cube.rotation.y += dt * 1.2;

    controls.update();
    // required when damping is enabled

    renderer.render(scene, camera);
    // draws the frame -> final output
}

animate();

// 9. TRANSFORMS

// position -> move object
cube.position.set(1, 0, 0); // x, y, z
// cube.position.x = 1;         // single axis

// rotation -> spin object (in radians)
cube.rotation.y = Math.PI / 4; // 45 degrees
// Math.PI = 180, Math.PI/2 = 90, Math.PI*2 = 360

// scale -> resize object
cube.scale.set(1.5, 1.5, 1.5); // uniform scale
// cube.scale.x = 2;            // stretch one axis

// 10. HELPERS

scene.add(new THREE.AxesHelper(5));
// x = red, y = green, z = blue
// 5 = line length
// useful for orientation

scene.add(new THREE.GridHelper(10, 10));
// ground grid -> size 10, 10 divisions
// useful for positioning reference

// remove helpers in production

// 11. OTHER GEOMETRIES

// sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32), // radius, widthSeg, heightSeg
    material);
// higher segments = smoother but heavier
sphere.position.x = -2;
scene.add(sphere);

// plane (ground)
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    material);
plane.rotation.x = -Math.PI / 2; // make horizontal
plane.position.y = -1;
scene.add(plane);

// other shapes:
// CylinderGeometry(topR, bottomR, height, segments)
// ConeGeometry(radius, height, segments)
// TorusGeometry(radius, tube, radialSeg, tubularSeg)
// RingGeometry(innerR, outerR, segments)
// TorusKnotGeometry(radius, tube, tubularSeg, radialSeg)

// 12. TEXTURES

const texLoader = new THREE.TextureLoader();
const texture = texLoader.load('texture.jpg');
// loads image -> wraps on surface via UV mapping

const texMat = new THREE.MeshBasicMaterial({map : texture});
// map -> applies texture as surface color

// material types:
// MeshBasicMaterial    -> no light needed, flat look
// MeshStandardMaterial -> realistic, needs light (most used)
// MeshPhongMaterial    -> shiny surfaces (cheaper)
// MeshLambertMaterial  -> matte surfaces (cheapest)
// MeshNormalMaterial   -> debug (shows face directions)

// 13. RESIZE HANDLING

window.addEventListener('resize', () = > {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  // must call after changing aspect

  renderer.setSize(window.innerWidth, window.innerHeight); });
// without this -> scene stretches on resize

// 14. SHADOWS

// shadows are expensive -> use carefully

// step 1: enable globally
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // softer edges

// step 2: light casts shadow
dir.castShadow = true;

// step 3: object casts shadow
cube.castShadow = true;

// step 4: surface receives shadow
plane.receiveShadow = true;

// checklist:
// renderer.shadowMap.enabled = true
// light.castShadow = true
// object.castShadow = true
// ground.receiveShadow = true
// missing any one = no shadows

// 15. GROUPS

const group = new THREE.Group();
// invisible container for multiple objects

const child = new THREE.Mesh(new THREE.BoxGeometry(), material);
child.position.x = 2;

group.add(child);
scene.add(group);

// why groups:
// transform parent -> all children follow
// example: car body + wheels in one group
// group.position.x = 5 -> moves everything inside

// 16. RAYCASTING (click detection)

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (e) = > {
  // normalize mouse to -1 to +1
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  // cast ray from camera through mouse
  raycaster.setFromCamera(mouse, camera);

  // check intersections
  const hits = raycaster.intersectObjects(scene.children, true);
  // true = check children of groups too

  if (hits.length > 0) {
    hits[0].object.material.color.set(0xff0000);
    // first hit -> turn red
  } });

// use cases -> click selection, hover effects, game interactions

// 17. MODEL LOADING (GLTF/GLB)

import{GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();

gltfLoader.load('model.glb', (gltf) = > {
    const model = gltf.scene;
    scene.add(model);
    // model.scale.set(0.5, 0.5, 0.5);  // resize if needed
    // model.position.set(0, 0, 0);     // reposition if needed
});

// formats:
// .glb  -> compressed binary (smallest, fastest) -> preferred
// .gltf -> JSON (readable but bigger)
// .obj  -> old format (no animations)
// .fbx  -> common in game engines

// free models:
// sketchfab.com
// poly.pizza
// kenney.nl

// 18. SKYBOX

const skybox = new THREE.CubeTextureLoader().load([
    'px.jpg', 'nx.jpg', // right, left
    'py.jpg', 'ny.jpg', // top, bottom
    'pz.jpg', 'nz.jpg'  // front, back
]);

scene.background = skybox;
// 360 degree background

// simple color background:
// scene.background = new THREE.Color(0x87ceeb);

// 19. FOG

scene.fog = new THREE.Fog(0xffffff, 5, 50);
// color, nearStart, farEnd
// objects fade as they get farther

// fog types:
// Fog     -> linear (gradual)
// FogExp2 -> exponential (more realistic)
// scene.fog = new THREE.FogExp2(0xffffff, 0.05);

// 20. PERFORMANCE

// reduce draw calls -> merge meshes or use instancing
// limit lights -> especially shadow-casting (1-2 max)
// compress textures -> smaller images, .webp, power-of-2 sizes
// cap pixel ratio -> already done above
// optimize models -> reduce polygon count

// instanced mesh -> many same objects in one draw call
const instanced = new THREE.InstancedMesh(
    new THREE.BoxGeometry(),
    material,
    500 // 500 cubes, 1 draw call
);
scene.add(instanced);
// without instancing -> 500 cubes = 500 draw calls (slow)
// with instancing -> 500 cubes = 1 draw call (fast)

// 21. COMMON MISTAKES

// object black       -> add lights
// scene stretched    -> add resize listener
// lagging            -> too many objects/lights/shadows
// click not working  -> check mouse normalization
// speed varies       -> use clock.getDelta()
// object not visible -> check: scene.add? camera position? scale? behind camera?
// no shadows         -> check all 4 shadow steps
// texture blurry     -> higher res image or set minFilter/magFilter

// QUICK REFERENCE

// setup:       scene -> camera -> renderer -> append to DOM
// object:      geometry + material = mesh -> scene.add()
// lighting:    ambient + directional (minimum)
// controls:    OrbitControls (separate import)
// animation:   requestAnimationFrame + clock.getDelta()
// transforms:  position, rotation (radians), scale
// textures:    TextureLoader.load() -> material.map
// shadows:     renderer + light + caster + receiver
// interaction: raycaster + mouse normalization
// models:      GLTFLoader -> .glb files
// grouping:    THREE.Group -> parent-child transforms
// environment: CubeTextureLoader -> scene.background
// atmosphere:  scene.fog
