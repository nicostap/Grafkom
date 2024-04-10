function createFloor() {
    var greenCube = GEO.createCylinder(1.0, 1.0, 20, [0.3, 0.6, 0.3]);

    var floor = new Object3D(greenCube.vertices, greenCube.faces);
    floor.setLocalScale(1000.0, 0.1, 1000.0);
    floor.setLocalTranslation(0, 0, 0);

    // Random grass generator
    var grassVertices = [
        -1, 0, 0, 0, 0.3, 0,
        0, 0, 1, 0, 0.3, 0,
        1, 0, 0, 0, 0.3, 0,
        0, 1, 0, 0, 0.5, 0
    ];
    var grassFaces = [
        0, 1, 2,
        0, 1, 3,
        0, 2, 3,
        1, 2, 3
    ]

    // Object instancing
    var grassInstance = instanceRandomiser(grassVertices, grassFaces, 0, 0, 100, 300, 10, 10);
    var grass = new Object3D(grassInstance.vertices, grassInstance.faces);
    grass.translate(0, 0.2, 0);
    grass.scale(1, 3, 1);
    floor.addChild(grass);

    // For repeating grasses
    var grass = new Object3D(grassInstance.vertices, grassInstance.faces);
    grass.translate(-100, 0.2, 0);
    grass.scale(1, 3, 1);
    floor.addChild(grass);
    var grass = new Object3D(grassInstance.vertices, grassInstance.faces);
    grass.translate(100, 0.2, 0);
    grass.scale(1, 3, 1);
    floor.addChild(grass);

    var brownHyperboloid = GEO.createHyperboloidOneSheet(1.0, 3.0, 20, [160 / 255, 82 / 255, 45 / 255]);
    var greenParaboloid = GEO.createEllipticParaboloid(1.4, 5.0, 30, [0.1, 0.6, 0.1]);
    var tree = new Object3D(brownHyperboloid.vertices, brownHyperboloid.faces);
    var leaf = new Object3D(greenParaboloid.vertices, greenParaboloid.faces);
    tree.setLocalTranslation(0, 6.5, 0);
    leaf.setLocalTranslation(0, 50.0, 0);
    leaf.setLocalScale(5, 5, 5);
    tree.addChild(leaf);

    var treeSide1 = randomiser(tree, floor, 0, 120, 100, 150, 1, 4);
    var treeSide2 = randomiser(tree, floor, 0, -120, 100, 150, 1, 4);

    for(let i = 0; i < treeSide1.length; i++) {
        var newTree = treeSide1[i].clone();
        newTree.translate(100, 0, 0);
        floor.addChild(newTree);
        var newTree = treeSide1[i].clone();
        newTree.translate(-100, 0, 0);
        floor.addChild(newTree);
    }
    for(let i = 0; i < treeSide2.length; i++) {
        var newTree = treeSide2[i].clone();
        newTree.translate(100, 0, 0);
        floor.addChild(newTree);
        var newTree = treeSide2[i].clone();
        newTree.translate(-100, 0, 0);
        floor.addChild(newTree);
    }

    return floor;
}

function instanceRandomiser(vertices, faces, centerX, centerZ, length, width, divisorX, divisorZ) {
    let vertexCount = vertices.length / 6;
    let faceCount = faces.length / 3;
    for (let i = 0; i < divisorX; i++) {
        for (let j = 0; j < divisorZ; j++) {
            let offsetX = (i + Math.random()) * length / divisorX - length / 2 + centerX;
            let scaleY = 0.5 + Math.random() * 2.0;
            let offsetZ = (j + Math.random()) * width / divisorZ - width / 2 + centerZ;
            for (let k = 0; k < vertexCount; k++) {
                let vertexIndex = k * 6;
                vertices.push(
                    vertices[vertexIndex] + offsetX,
                    vertices[vertexIndex + 1] * scaleY,
                    vertices[vertexIndex + 2] + offsetZ,
                    vertices[vertexIndex + 3],
                    vertices[vertexIndex + 4],
                    vertices[vertexIndex + 5]
                );
            }
            let offsetIndex = ((i * 10) + j + 1) * vertexCount;
            for (let k = 0; k < faceCount; k++) {
                let faceIndex = k * 3;
                faces.push(
                    offsetIndex + faces[faceIndex],
                    offsetIndex + faces[faceIndex + 1],
                    offsetIndex + faces[faceIndex + 2]
                );
            }
        }
    }
    return { vertices: vertices, faces: faces };
}

function randomiser(child, parent, centerX, centerZ, length, width, divisorX, divisorZ) {
    let objects = [];
    for (let i = 0; i < divisorX; i++) {
        for (let j = 0; j < divisorZ; j++) {
            let offsetX = (i + Math.random()) * length / divisorX - length / 2 + centerX;
            let scaleY = 0.8 + Math.random();
            let offsetZ = (j + Math.random()) * width / divisorZ - width / 2 + centerZ;
            
            let newChild = child.clone();
            parent.addChild(newChild);
            newChild.scale(1, scaleY, 1);
            newChild.translate(offsetX, 0, offsetZ);

            objects.push(newChild);
        }
    }
    return objects;
}