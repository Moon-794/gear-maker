import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import $ from 'jquery'

//To generate a spur, we need the following:
// 1 > Module
// 2 > Number of teeth
// 3 > Mesh Resolution

//Implicit variables as a result:
// 1 > Pitch Diameter
// 2 > 

function AddVertexPosition(array, x, y, z)
{
    array.push(x);
    array.push(y);
    array.push(z);

    console.log("Made a vertex at: " + x + " " + y + " " + z);
}

function GenerateCircle(divisions)
{
    const geometry = new THREE.BufferGeometry();
    var vertices = [];
    var indices = [];

    //The angle between each point on the base circle
    const theta = (2 * 3.14159) / divisions;

    //Center point, index 0
    AddVertexPosition(vertices, 0, 0, 0);

    var x = Math.sin(0);
    var y = Math.cos(0);
    var z = 0;
    AddVertexPosition(vertices, x, y, z);

    for (let i = 1; i < divisions; i++) 
    {
        var l = Math.sin(i * theta);
        var k = Math.cos(i * theta);
        var j = 0;
        AddVertexPosition(vertices, l, k, j);

        indices.push(0);
        indices.push(i);
        indices.push(i + 1);
    }

    indices.push(0);
    indices.push(divisions);
    indices.push(1);
    
    const finalVertexArray = new Float32Array(vertices);
	geometry.setIndex(indices);
	geometry.setAttribute('position', new THREE.BufferAttribute(finalVertexArray, 3));

	const material = new THREE.MeshBasicMaterial({color: 0xff0000});
	const mesh = new THREE.Mesh(geometry, material);

    const wireframe = new THREE.WireframeGeometry(geometry);

    const line = new THREE.LineSegments(wireframe);
    line.material.depthTest = false;
    line.material.opacity = 0.25;
    line.material.transparent = true;
    line.material.color = 0xff0000;

    return {mesh, line};
}

export function GenerateSpurGear(resolution)
{
	return GenerateCircle(resolution);
}

