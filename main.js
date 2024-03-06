import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import $ from 'jquery'
import { GenerateSpurGear } from './meshgen';

var parentContainer = $("#render-container");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, parentContainer.width() / parentContainer.height(), 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize(parentContainer.width(), parentContainer.height());

$("#render-container").append(renderer.domElement);
renderer.domElement.style.display = "flex";

renderer.setClearColor(new THREE.Color(0xDDDDDD));
camera.position.z = 5;

const grid = new THREE.GridHelper(20, 20);
scene.add(grid);

const orbitControl = new OrbitControls(camera, renderer.domElement);

// SETUP DONE

scene.add(GenerateSpurGear(64).mesh);
scene.add(GenerateSpurGear(64).line);

function ResizeCanvas()
{
	renderer.setSize(0, 0);

	renderer.setSize(parentContainer.width(), parentContainer.height());
	camera.aspect = parentContainer.width() / parentContainer.height();
	camera.updateProjectionMatrix();
}

function animate() {
	requestAnimationFrame( animate );
	ResizeCanvas();
	
	orbitControl.update();
	renderer.render(scene, camera );
}

animate();