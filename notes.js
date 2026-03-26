
Three.js is a high-level JS library built on top of WebGL. // It simplifies rendering 3D objects in the browser. // Without Three.js, WebGL is very low-level and complex.

// Key Use Cases: // - 3D websites // - Games // - Data visualization // - AR/VR apps

// ------------------------------------------------------------ // 2. INSTALLATION // ------------------------------------------------------------ // npm install three

// OR CDN // <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

// ------------------------------------------------------------ // 3. BASIC STRUCTURE (VERY IMPORTANT) // ------------------------------------------------------------ // Every Three.js app has 3 core things: // 1. Scene // 2. Camera // 3. Renderer

import * as THREE from 'three';

// SCENE → container for everything const scene = new THREE.Scene();

// CAMERA → viewpoint of user const camera = new THREE.PerspectiveCamera( 75, // field of view (how wide we see) window.innerWidth / window.innerHeight, // aspect ratio 0.1, // near clipping 1000 // far clipping );

// RENDERER → draws everything on screen const renderer = new THREE.WebGLRenderer({ antialias: true }); renderer.setSize(window.innerWidth, window.innerHeight); document.body.appendChild(renderer.domElement);

// ------------------------------------------------------------ // 4. OBJECT CREATION (GEOMETRY + MATERIAL + MESH) // ------------------------------------------------------------

// Geometry → shape const geometry = new THREE.BoxGeometry(1, 1, 1);

// Material → appearance const material = new THREE.MeshStandardMaterial({ color: 0x00ff00, roughness: 0.4, // lower = shiny metalness: 0.8 // higher = metallic });

// Mesh → combines geometry + material const cube = new THREE.Mesh(geometry, material); scene.add(cube);

// ------------------------------------------------------------ // 5. CAMERA POSITION // ------------------------------------------------------------ camera.position.set(0, 0, 5);

// ------------------------------------------------------------ // 6. LIGHTING (CRITICAL FOR REALISM) // ------------------------------------------------------------

// Ambient Light → global light const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); scene.add(ambientLight);

// Directional Light → like sunlight const dirLight = new THREE.DirectionalLight(0xffffff, 1); dirLight.position.set(5, 10, 5); scene.add(dirLight);

// Tip: // Without light → MeshStandardMaterial will appear black

// ------------------------------------------------------------ // 7. ANIMATION LOOP (GAME LOOP) // ------------------------------------------------------------ function animate() { requestAnimationFrame(animate); // runs ~60fps

// rotate cube cube.rotation.x += 0.01; cube.rotation.y += 0.01;

renderer.render(scene, camera); } animate();

// ------------------------------------------------------------ // 8. TRANSFORMATIONS // ------------------------------------------------------------ // Position cube.position.set(2, 1, 0);

// Rotation cube.rotation.y = Math.PI / 2;

// Scale cube.scale.set(2, 2, 2);

// ------------------------------------------------------------ // 9. HELPERS (DEBUGGING TOOLS) // ------------------------------------------------------------

// AxesHelper → shows X,Y,Z const axes = new THREE.AxesHelper(5); scene.add(axes);

// GridHelper → ground grid const grid = new THREE.GridHelper(10, 10); scene.add(grid);

// ------------------------------------------------------------ // 10. DIFFERENT GEOMETRIES // ------------------------------------------------------------

const sphere = new THREE.Mesh( new THREE.SphereGeometry(1, 32, 32), material );

const plane = new THREE.Mesh( new THREE.PlaneGeometry(5, 5), material );

// ------------------------------------------------------------ // 11. TEXTURES (ADDING IMAGES) // ------------------------------------------------------------

const textureLoader = new THREE.TextureLoader(); const texture = textureLoader.load('texture.jpg');

const texMaterial = new THREE.MeshBasicMaterial({ map: texture });

// Tip: // MeshBasicMaterial ignores lighting → always visible

// ------------------------------------------------------------ // 12. CONTROLS (USER INTERACTION) // ------------------------------------------------------------

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const controls = new OrbitControls(camera, renderer.domElement); controls.enableDamping = true; // smooth movement

// IMPORTANT: must call controls.update() in loop

// ------------------------------------------------------------ // 13. RESPONSIVENESS // ------------------------------------------------------------

window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });

// ------------------------------------------------------------ // 14. SHADOWS // ------------------------------------------------------------

renderer.shadowMap.enabled = true;

dirLight.castShadow = true;

cube.castShadow = true;   // object casts shadow cube.receiveShadow = true; // object receives shadow

// ------------------------------------------------------------ // 15. GROUPS (ORGANIZATION) // ------------------------------------------------------------

const group = new THREE.Group(); group.add(cube); scene.add(group);

// Useful for moving multiple objects together

// ------------------------------------------------------------ // 16. RAYCASTING (CLICK DETECTION) // ------------------------------------------------------------

const raycaster = new THREE.Raycaster(); const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => { mouse.x = (event.clientX / window.innerWidth) * 2 - 1; mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

raycaster.setFromCamera(mouse, camera); const intersects = raycaster.intersectObjects(scene.children);

if (intersects.length > 0) { console.log('Clicked:', intersects[0].object); } });

// ------------------------------------------------------------ // 17. LOADING 3D MODELS // ------------------------------------------------------------

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();

gltfLoader.load('model.glb', (gltf) => { scene.add(gltf.scene); });

// Tip: // .glb/.gltf → most efficient format

// ------------------------------------------------------------ // 18. SKYBOX (ENVIRONMENT) // ------------------------------------------------------------

const cubeLoader = new THREE.CubeTextureLoader();

const skybox = cubeLoader.load([ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ]);

scene.background = skybox;

// ------------------------------------------------------------ // 19. FOG (DEPTH EFFECT) // ------------------------------------------------------------

scene.fog = new THREE.Fog(0xffffff, 1, 100);

// ------------------------------------------------------------ // 20. CLOCK (TIME MANAGEMENT) // ------------------------------------------------------------

const clock = new THREE.Clock();

function animateAdvanced() { const delta = clock.getDelta(); // time since last frame

controls.update(); renderer.render(scene, camera); }

// ------------------------------------------------------------ // 21. GUI (DEBUGGING UI) // ------------------------------------------------------------

import GUI from 'lil-gui'; const gui = new GUI();

const obj = { speed: 0.01 };

gui.add(obj, 'speed', 0, 0.1);

// ------------------------------------------------------------ // 22. PERFORMANCE OPTIMIZATION // ------------------------------------------------------------

// Use BufferGeometry instead of Geometry // Reduce number of lights // Use InstancedMesh for repeated objects // Avoid heavy textures

// Example Instancing const count = 1000; const instanced = new THREE.InstancedMesh(geometry, material, count); scene.add(instanced);

// ------------------------------------------------------------ // 23. IMPORTANT INTERVIEW POINTS // ------------------------------------------------------------

// Q: Why Three.js? // → Simplifies WebGL

// Q: Scene vs Camera? // → Scene = objects, Camera = viewpoint

// Q: Mesh? // → Geometry + Material

// Q: Why requestAnimationFrame? // → smooth animation synced with browser

...more questions will be added here.