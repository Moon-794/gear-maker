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

function GetVertexFromIndex(index, vertices)
{
    var x1 = vertices[index * 3];
    var y1 = vertices[(index * 3) + 1];
    var z1 = 0;

    var obj = 
    {
        x: x1,
        y: y1,
        z: z1
    };

    return obj;
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

    //Order of operations:
    //Loop through a number of circular segments, each will draw 2 tooth halves
    var module = 0.5;
    var numTeeth = 32;
    var topWidth = 0.2;
    var pitchCircleRadius = (module * numTeeth) / 2;
    var addendum = pitchCircleRadius + module;

    var toothSegAngle = (2 * 3.14159) / numTeeth;
    var singleToothAngle = toothSegAngle / 3;

    for (let g = 0; g < numTeeth; g++) 
    {
        //First bit of top land
        var start = toothSegAngle * g;
        //Create initial midpoint
        var x = Math.sin(start) * addendum;
        var y = Math.cos(start) * addendum;
        var z = 0;
        AddVertexPosition(vertices, x, y, z);

        //Second bit
        //Slope of current tangent line of the root radius
        var m = -x/y;
        var sign = 1;
        if(y < 0)
        {
            sign = -1;
        }

        var x2 = x + sign * topWidth/Math.sqrt(1+Math.pow(m, 2));
        var y2 = y + sign * m * (topWidth/Math.sqrt(1+Math.pow(m, 2)));
        var z2 = 0;

        AddVertexPosition(vertices, x2, y2, z2);
        var i1 = (vertices.length / 3) - 1;
        indices.push(0);
        indices.push(i1 - 1);
        indices.push(i1);

        var x3 = Math.sin(start + singleToothAngle) * pitchCircleRadius;
        var y3 = Math.cos(start + singleToothAngle) * pitchCircleRadius;
        var z3 = 0;

        AddVertexPosition(vertices, x3, y3, z3);
        var i = (vertices.length / 3) - 1;
        indices.push(0);
        indices.push(i - 1);
        indices.push(i);

        var base = 3;
        for (let q = 0; q < 3; q++) 
        {
            var phi = singleToothAngle / 3;
            var x = Math.sin(start + singleToothAngle + ((q + 1) * phi)) * pitchCircleRadius;
            var y = Math.cos(start + singleToothAngle + ((q + 1) * phi)) * pitchCircleRadius;
            var z = 0;
            
            AddVertexPosition(vertices, x, y, z);
            
            var i = (vertices.length / 3) - 1;
            indices.push(0);
            indices.push(i - 1);
            indices.push(i);
        }

        var x4 = Math.sin(start + toothSegAngle) * addendum;
        var y4 = Math.cos(start + toothSegAngle) * addendum;
        var z4 = 0;

        var mFT = -x4/y4;
        var sign = 1;
        if(y4 < 0)
        {
            sign = -1;
        }

        var x5 = x4 - sign * topWidth/Math.sqrt(1+Math.pow(mFT, 2));
        var y5 = y4 - sign * mFT * (topWidth/Math.sqrt(1+Math.pow(mFT, 2)));
        var z5 = 0; 
        
        AddVertexPosition(vertices, x5, y5, z5);
        var i = (vertices.length / 3) - 1;
        indices.push(0);
        indices.push(i - 1);
        indices.push(i);

        AddVertexPosition(vertices, x4, y4, z4);
        var i = (vertices.length / 3) - 1;
        indices.push(0);
        indices.push(i - 1);
        indices.push(i);
    }

    var extrudeCounter = vertices.length / 3;
    for(var p = 1; p < extrudeCounter; p ++)
    {
        //Create the other side to add thickness
        var vert = GetVertexFromIndex(p, vertices)
        AddVertexPosition(vertices, vert.x, vert.y, 2);
        var vert2 = GetVertexFromIndex(p + 1, vertices)
        AddVertexPosition(vertices, vert2.x, vert2.y, 2);

        var i = (vertices.length / 3) - 1;
        indices.push(p);
        indices.push(i - 1);
        indices.push(i);

        indices.push(p);
        indices.push(i);
        indices.push(p + 1);
    }

    /*
    for (let toothNo = 0; toothNo < numTeeth; toothNo++) 
    {
        //First, draw half of the top land of the tooth
        var phi = toothNo * toothSegAngle;
        var tlX = Math.sin(phi);
        var tlY = Mathf.cos(phi);

        AddVertexPosition(vertices, tlX, tlY, 0);

        indices.push(0);
        indices.push(i);
        indices.push(i + 1);
    }

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
    */
    
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

