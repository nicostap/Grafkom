import * as glMatrix from 'gl-matrix';
import { Object3D } from '../object';
import { GEO } from '../geometry';

export function createFloor() {
    var floorVertices = [];
    var floorFaces = [];

    let normal: glMatrix.vec3 = [0,0,0];
    let floorColor = [64 / 255, 41 / 255, 5 / 255];
    let heightDist: number[][] = [];
    let floorSide = 600;
    let partition = 60;
    let tileSide = floorSide / partition;

    for (let i = 0; i < partition; i++) {
        heightDist.push([]);
        for (let j = 0; j < partition; j++) {
            heightDist[i].push(1.5 * Math.random());
        }
    }
    for (let i = 0; i < partition; i++) {
        for (let j = 0; j < partition; j++) {
            let currpoint = [
                (i - partition / 2) * tileSide,
                heightDist[i][j],
                (j - partition / 2) * tileSide,
            ];
            let sidepoint = [
                (i - partition / 2) * tileSide,
                heightDist[i][j + 1],
                (j - partition / 2 + 1) * tileSide,
            ];
            if (i != partition - 1) {
                let nextpoint = [
                    (i - partition / 2 + 1) * tileSide,
                    heightDist[i + 1][j],
                    (j - partition / 2) * tileSide,
                ];
                const currIndex = floorVertices.length / 9;
                glMatrix.vec3.cross(
                    normal,
                    [nextpoint[0] - currpoint[0], nextpoint[1] - currpoint[1], nextpoint[2] - currpoint[2]],
                    [sidepoint[0] - currpoint[0], sidepoint[1] - currpoint[1], sidepoint[2] - currpoint[2]],
                );
                glMatrix.vec3.normalize(normal, normal);
                floorVertices.push(...nextpoint, ...normal, ...floorColor);
                floorVertices.push(...currpoint, ...normal, ...floorColor);
                floorVertices.push(...sidepoint, ...normal, ...floorColor);
                floorFaces.push(currIndex, currIndex + 1, currIndex + 2);
            }
            if (i != 0) {
                let nextpoint = [
                    (i - partition / 2 - 1) * tileSide,
                    heightDist[i - 1][j + 1],
                    (j - partition / 2 + 1) * tileSide,
                ];
                const currIndex = floorVertices.length / 9;
                
                glMatrix.vec3.cross(
                    normal,
                    [nextpoint[0] - sidepoint[0], nextpoint[1] - sidepoint[1], nextpoint[2] - sidepoint[2]],
                    [currpoint[0] - sidepoint[0], currpoint[1] - sidepoint[1], currpoint[2] - sidepoint[2]],
                );
                glMatrix.vec3.normalize(normal, normal);
                floorVertices.push(...nextpoint, ...normal, ...floorColor);
                floorVertices.push(...sidepoint, ...normal, ...floorColor);
                floorVertices.push(...currpoint, ...normal, ...floorColor);
                floorFaces.push(currIndex, currIndex + 1, currIndex + 2);
            }
        }
    }
    var floor = new Object3D(floorVertices, floorFaces);

    // Random grass generator
    var grassVertices = [
        -1, 0, 0, 0, -1, 0, 0, 0.3, 0,
        0, 0, 1, 0, -1, 0, 0, 0.3, 0,
        1, 0, 0, 0, -1, 0, 0, 0.3, 0,

        -1, 0, 0, -1, 1, 1, 0, 0.3, 0,
        0, 0, 1, -1, 1, 1, 0, 0.3, 0,
        0, 1, 0, -1, 1, 1, 0, 0.5, 0,

        0, 0, 1, 1, 1, 1, 0, 0.3, 0,
        1, 0, 0, 1, 1, 1, 0, 0.3, 0,
        0, 1, 0, 1, 1, 1, 0, 0.5, 0,

        -1, 0, 0, 0, 0, -1, 0, 0.3, 0,
        1, 0, 0, 0, 0, -1, 0, 0.3, 0,
        0, 1, 0, 0, 0, -1, 0, 0.5, 0,
    ];
    var grassFaces = [
        2, 1, 0,
        3, 4, 5,
        6, 7, 8,
        11, 10, 9
    ]

    // Object instancing
    var grassInstance = instanceRandomiser(grassVertices, grassFaces, 0, 0, 500, 500, 25, 25);
    var grass = new Object3D(grassInstance.vertices, grassInstance.faces);
    grass.translate(0, 0.75, 0);
    grass.scale(1, 3, 1);
    floor.addChild(grass);

    var brownHyperboloid = GEO.createHyperboloidOneSheet(1.0, 3.0, 10, [160 / 255, 82 / 255, 45 / 255]);
    var greenParaboloid = GEO.createEllipticParaboloid(1.0, 1.0, 30, [0.2, 0.7, 0.2]);
    var tree = new Object3D(brownHyperboloid.vertices, brownHyperboloid.faces);
    var leaf = new Object3D(greenParaboloid.vertices, greenParaboloid.faces);
    tree.setLocalTranslation(0, 6.5, 0);
    leaf.setLocalScale(8, 20, 8);
    leaf.setLocalTranslation(0, 40.0, 0);
    tree.addChild(leaf);

    var trees = randomiser(tree, floor, 0, 140, 400, 150, 6, 3);
    trees.push(...randomiser(tree, floor, 0, -140, 400, 150, 6, 3));

    return {main: floor, grass: grass, trees: trees};
}

export function instanceRandomiser(vertices: number[], faces: number[], centerX: number, centerZ: number, length: number, width: number, divisorX: number, divisorZ: number) {
    let vertexCount = vertices.length / 9;
    let faceCount = faces.length / 3;
    for (let i = 0; i < divisorX; i++) {
        for (let j = 0; j < divisorZ; j++) {
            let offsetX = (i + Math.random()) * length / divisorX - length / 2 + centerX;
            let scaleY = 0.5 + Math.random() * 2.0;
            let offsetZ = (j + Math.random()) * width / divisorZ - width / 2 + centerZ;
            for (let k = 0; k < vertexCount; k++) {
                let vertexIndex = k * 9;
                vertices.push(
                    vertices[vertexIndex] + offsetX,
                    vertices[vertexIndex + 1] * scaleY,
                    vertices[vertexIndex + 2] + offsetZ,
                    vertices[vertexIndex + 3],
                    vertices[vertexIndex + 4],
                    vertices[vertexIndex + 5],
                    vertices[vertexIndex + 6],
                    vertices[vertexIndex + 7],
                    vertices[vertexIndex + 8]
                );
            }
            let offsetIndex = ((i * divisorX) + j + 1) * vertexCount;
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

export function randomiser(child: Object3D, parent: Object3D, centerX: number, centerZ: number, length: number, width: number, divisorX: number, divisorZ: number) {
    let objects = [];
    for (let i = 0; i < divisorX; i++) {
        for (let j = 0; j < divisorZ; j++) {
            let offsetX = (i + Math.random()) * length / divisorX - length / 2 + centerX;
            let scaleY = 1.0 + Math.random();
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