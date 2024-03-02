import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import $ from 'jquery'

var parentContainer = $("#render-container");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, parentContainer.width() / parentContainer.height(), 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize(parentContainer.width(), parentContainer.height());

$("#render-container").append(renderer.domElement);
renderer.domElement.style.display = "flex";

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

renderer.setClearColor(new THREE.Color(0xDDDDDD));
camera.position.z = 5;

const grid = new THREE.GridHelper(20, 20);
scene.add(grid);

const orbitControl = new OrbitControls(camera, renderer.domElement);

function ResizeCanvas()
{
	var paramWidth = $("#parameters").outerWidth();
	var workspaceWidth = $("#workspace").outerWidth();
	renderer.setSize(0, 0);

	renderer.setSize(parentContainer.width(), parentContainer.height());
	camera.aspect = parentContainer.width() / parentContainer.height();
	camera.updateProjectionMatrix();
}

function animate() {
	requestAnimationFrame( animate );

	ResizeCanvas();
	
	orbitControl.update();

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render(scene, camera );
}

animate();