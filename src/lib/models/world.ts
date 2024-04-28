import * as glMatrix from 'gl-matrix';
import { Object3D } from '../object';
import { GEO } from '../geometry';

export function createFloor() {
    var floorVertices = [];
    var floorFaces = [];

    let normal: glMatrix.vec3 = [0, 0, 0];
    let floorColor = [64 / 255, 41 / 255, 5 / 255];
    let heightDist: number[][] = [];
    let floorSide = 1200;
    let partition = 100;
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
    var grassGeometry = GEO.combineLines(
        [0, 0.5, 0],
        GEO.createCurve([0.4, 0, 0.4, 0.4, 3, 0.4, 0, 5, -1], 5, 2),
        GEO.createCurve([-0.4, 0, 0.4, -0.4, 3, 0.4, 0, 5, -1], 5, 2),
        GEO.createCurve([0, 0, -0.4, 0, 3, -0.4, 0, 5, -1], 5, 2),
    );

    // Object instancing
    let grassInstance = instanceRandomiser(grassGeometry.vertices, grassGeometry.faces, 0, 0, 100, 100, 7, 7);
    let grass = new Object3D(grassInstance.vertices, grassInstance.faces);
    grass.translate(0, 0.75, 0);
    randomiser(grass, floor, 0, 220, 700, 150, 7, 4);
    randomiser(grass, floor, 0, -220, 700, 150, 7, 4);
    randomiser(grass, floor, 250, 0, 200, 60, 4, 1);
    randomiser(grass, floor, -250, 0, 200, 60, 4, 1);

    var brownHyperboloid = GEO.createHyperboloidOneSheet(1.0, 3.0, 7, [160 / 255, 82 / 255, 45 / 255]);
    var greenParaboloid = GEO.createEllipticParaboloid(1.0, 1.0, 30, [0.2, 0.7, 0.2]);
    var tree = new Object3D(brownHyperboloid.vertices, brownHyperboloid.faces);
    var leaf = new Object3D(greenParaboloid.vertices, greenParaboloid.faces);
    tree.setLocalTranslation(0, 6.5, 0);
    leaf.setLocalScale(8, 20, 8);
    leaf.setLocalTranslation(0, 40.0, 0);
    tree.addChild(leaf);

    var trees = [];//randomiser(tree, floor, 0, 180, 400, 150, 6, 3);
    trees.push(...randomiser(tree, floor, 0, -180, 400, 150, 6, 3));
    trees.push(...randomiser(tree, floor, 220, 100, 200, 500, 3, 9));
    trees.push(...randomiser(tree, floor, -220, 100, 200, 500, 3, 9));

    // Rock
    var greySphere = GEO.createSphere(1.0, 10, [0.3, 0.3, 0.3]);
    var rockInstance = instanceRandomiser(greySphere.vertices, greySphere.faces, 0, 0, 100, 100, 3, 3);
    var rock = new Object3D(rockInstance.vertices, rockInstance.faces);
    rock.setLocalTranslation(0, 0.75, 0);
    randomiser(rock, floor, 0, 180, 400, 150, 4, 4);
    randomiser(rock, floor, 0, -180, 400, 150, 4, 4);
    randomiser(rock, floor, 200, 0, 100, 150, 2, 2);
    randomiser(rock, floor, -200, 0, 100, 150, 2, 2);

    // House
    var whiteBox = GEO.createBox(1.0, 1.0, 1.0, [0.8, 0.8, 0.8]);
    var brownBox = GEO.createBox(1.0, 1.0, 1.0, [139 / 265, 105 / 265, 20 / 265]);
    var whiteCylinder = GEO.createCylinder(1.0, 1.0, 10, [0.8, 0.8, 0.8]);
    var whitePrism = GEO.createCylinder(1.0, 1.0, 3, [0.8, 0.8, 0.8]);
    var redBox = GEO.createBox(1.0, 1.0, 1.0, [0.3, 0, 0]);
    var blackBox = GEO.createBox(1.0, 1.0, 1.0, [0, 0, 0]);
    var greenCylinder = GEO.createCylinder(1.0, 1.0, 15, [0, 0.2, 0]);
    var greenSphere = GEO.createSphere(1.0, 15, [0, 0.2, 0]);

    var houseMain = new Object3D(whiteBox.vertices, whiteBox.faces);
    houseMain.setLocalScale(100, 55, 60);
    var terrace = new Object3D(brownBox.vertices, brownBox.faces);
    terrace.setLocalScale(100, 5.0, 40);
    terrace.setLocalTranslation(0, -25, 50);
    houseMain.addChild(terrace);
    var terrace = new Object3D(whiteBox.vertices, whiteBox.faces);
    terrace.setLocalScale(100, 2.0, 40);
    terrace.setLocalTranslation(0, 20, 50);
    houseMain.addChild(terrace);
    var pillar = new Object3D(whiteCylinder.vertices, whiteCylinder.faces);
    pillar.setLocalScale(2.0, 42.5, 2.0);
    pillar.setLocalTranslation(-47.5, -2.5, 67.5);
    houseMain.addChild(pillar);
    var pillar = new Object3D(whiteCylinder.vertices, whiteCylinder.faces);
    pillar.setLocalScale(2.0, 42.5, 2.0);
    pillar.setLocalTranslation(47.5, -2.5, 67.5);
    houseMain.addChild(pillar);
    var pillar = new Object3D(whiteCylinder.vertices, whiteCylinder.faces);
    pillar.setLocalScale(2.0, 42.5, 2.0);
    pillar.setLocalTranslation(17.5, -2.5, 67.5);
    houseMain.addChild(pillar);
    var pillar = new Object3D(whiteCylinder.vertices, whiteCylinder.faces);
    pillar.setLocalScale(2.0, 42.5, 2.0);
    pillar.setLocalTranslation(-17.5, -2.5, 67.5);
    houseMain.addChild(pillar);
    var rail = new Object3D(whiteCylinder.vertices, whiteCylinder.faces);
    rail.setLocalScale(1.0, 40, 1.0);
    rail.setLocalRotation(GEO.rad(90), 0, 0);
    rail.setLocalTranslation(47.5, -7.5, 47.5);
    houseMain.addChild(rail);
    var rail = new Object3D(whiteCylinder.vertices, whiteCylinder.faces);
    rail.setLocalScale(1.0, 40, 1.0);
    rail.setLocalRotation(GEO.rad(90), 0, 0);
    rail.setLocalTranslation(-47.5, -7.5, 47.5);
    houseMain.addChild(rail);
    var rail = new Object3D(whiteCylinder.vertices, whiteCylinder.faces);
    rail.setLocalScale(1.0, 27.5, 1.0);
    rail.setLocalRotation(0, 0, GEO.rad(90));
    rail.setLocalTranslation(32.5, -7.5, 67.5);
    houseMain.addChild(rail);
    var rail = new Object3D(whiteCylinder.vertices, whiteCylinder.faces);
    rail.setLocalScale(1.0, 27.5, 1.0);
    rail.setLocalRotation(0, 0, GEO.rad(90));
    rail.setLocalTranslation(-32.5, -7.5, 67.5);
    houseMain.addChild(rail);
    var pillar = new Object3D(whiteCylinder.vertices, whiteCylinder.faces);
    pillar.setLocalScale(1.0, 17.5, 1.0);
    pillar.setLocalTranslation(-47.5 + 30 * 0.25, -16.5, 67.5);
    houseMain.addChild(pillar);
    var pillar = new Object3D(whiteCylinder.vertices, whiteCylinder.faces);
    pillar.setLocalScale(1.0, 17.5, 1.0);
    pillar.setLocalTranslation(-47.5 + 30 * 0.5, -16.5, 67.5);
    houseMain.addChild(pillar);
    var pillar = new Object3D(whiteCylinder.vertices, whiteCylinder.faces);
    pillar.setLocalScale(1.0, 17.5, 1.0);
    pillar.setLocalTranslation(-47.5 + 30 * 0.75, -16.5, 67.5);
    houseMain.addChild(pillar);
    var pillar = new Object3D(whiteCylinder.vertices, whiteCylinder.faces);
    pillar.setLocalScale(1.0, 17.5, 1.0);
    pillar.setLocalTranslation(47.5 - 30 * 0.25, -16.5, 67.5);
    houseMain.addChild(pillar);
    var pillar = new Object3D(whiteCylinder.vertices, whiteCylinder.faces);
    pillar.setLocalScale(1.0, 17.5, 1.0);
    pillar.setLocalTranslation(47.5 - 30 * 0.5, -16.5, 67.5);
    houseMain.addChild(pillar);
    var pillar = new Object3D(whiteCylinder.vertices, whiteCylinder.faces);
    pillar.setLocalScale(1.0, 17.5, 1.0);
    pillar.setLocalTranslation(47.5 - 30 * 0.75, -16.5, 67.5);
    houseMain.addChild(pillar);
    var pillar = new Object3D(whiteCylinder.vertices, whiteCylinder.faces);
    pillar.setLocalScale(1.0, 17.5, 1.0);
    pillar.setLocalTranslation(-47.5, -16.5, 67.5 - 37.5 * 0.25);
    houseMain.addChild(pillar);
    var pillar = new Object3D(whiteCylinder.vertices, whiteCylinder.faces);
    pillar.setLocalScale(1.0, 17.5, 1.0);
    pillar.setLocalTranslation(-47.5, -16.5, 67.5 - 37.5 * 0.5);
    houseMain.addChild(pillar);
    var pillar = new Object3D(whiteCylinder.vertices, whiteCylinder.faces);
    pillar.setLocalScale(1.0, 17.5, 1.0);
    pillar.setLocalTranslation(-47.5, -16.5, 67.5 - 37.5 * 0.75);
    houseMain.addChild(pillar);
    var pillar = new Object3D(whiteCylinder.vertices, whiteCylinder.faces);
    pillar.setLocalScale(1.0, 17.5, 1.0);
    pillar.setLocalTranslation(47.5, -16.5, 67.5 - 37.5 * 0.25);
    houseMain.addChild(pillar);
    var pillar = new Object3D(whiteCylinder.vertices, whiteCylinder.faces);
    pillar.setLocalScale(1.0, 17.5, 1.0);
    pillar.setLocalTranslation(47.5, -16.5, 67.5 - 37.5 * 0.5);
    houseMain.addChild(pillar);
    var pillar = new Object3D(whiteCylinder.vertices, whiteCylinder.faces);
    pillar.setLocalScale(1.0, 17.5, 1.0);
    pillar.setLocalTranslation(47.5, -16.5, 67.5 - 37.5 * 0.75);
    houseMain.addChild(pillar);
    var roof = new Object3D(whitePrism.vertices, whitePrism.faces);
    roof.setLocalScale(20, 100, 34.75);
    roof.setLocalRotation(0, 0, GEO.rad(90));
    roof.setLocalTranslation(0, 37.5, 0);
    houseMain.addChild(roof);
    var roof = new Object3D(redBox.vertices, redBox.faces);
    roof.setLocalScale(110, 5, 51.5);
    roof.setLocalRotation(GEO.rad(45), 0, 0);
    roof.setLocalTranslation(0, 45.5, 16.5);
    houseMain.addChild(roof);
    var roof = new Object3D(redBox.vertices, redBox.faces);
    roof.setLocalScale(110, 5, 51.5);
    roof.setLocalRotation(GEO.rad(-45), 0, 0);
    roof.setLocalTranslation(0, 45.5, -16.5);
    houseMain.addChild(roof);
    var window = new Object3D(blackBox.vertices, blackBox.faces);
    window.setLocalScale(15, 30, 0.1);
    window.setLocalTranslation(-30, -2.5, 30.01);
    houseMain.addChild(window);
    var window = new Object3D(blackBox.vertices, blackBox.faces);
    window.setLocalScale(15, 30, 0.1);
    window.setLocalTranslation(30, -2.5, 30.01);
    houseMain.addChild(window);
    var window = new Object3D(whiteBox.vertices, whiteBox.faces);
    window.setLocalScale(1.0, 30, 0.1);
    window.setLocalTranslation(30, -2.5, 30.02);
    houseMain.addChild(window);
    var window = new Object3D(whiteBox.vertices, whiteBox.faces);
    window.setLocalScale(1.0, 30, 0.1);
    window.setLocalTranslation(-30, -2.5, 30.02);
    houseMain.addChild(window);
    var window = new Object3D(whiteBox.vertices, whiteBox.faces);
    window.setLocalScale(1.0, 15, 0.1);
    window.setLocalRotation(0, 0, GEO.rad(90));
    window.setLocalTranslation(-30, 0, 30.02);
    houseMain.addChild(window);
    var window = new Object3D(whiteBox.vertices, whiteBox.faces);
    window.setLocalScale(1.0, 15, 0.1);
    window.setLocalRotation(0, 0, GEO.rad(90));
    window.setLocalTranslation(30, 0, 30.02);
    houseMain.addChild(window);
    var door = new Object3D(blackBox.vertices, blackBox.faces);
    door.setLocalScale(15.0, 35, 0.1);
    door.setLocalTranslation(0, -5, 30.01);
    houseMain.addChild(door);
    var chimney = new Object3D(whiteBox.vertices, whiteBox.faces);
    chimney.setLocalScale(17, 23, 17);
    chimney.setLocalTranslation(-20, 70, 0);
    houseMain.addChild(chimney);
    var chimney = new Object3D(blackBox.vertices, blackBox.faces);
    chimney.setLocalScale(12, 0.1, 12);
    chimney.setLocalTranslation(-20, 81.5, 0);
    houseMain.addChild(chimney);

    var smokes = [];
    var smoke = new Object3D(greySphere.vertices, greySphere.faces);
    smoke.setLocalScale(4.0, 3.0, 4.0);
    smoke.setLocalTranslation(-20, 78.5, 0);
    houseMain.addChild(smoke, -20, 80, 0);
    smokes.push(smoke);
    var smoke = new Object3D(greySphere.vertices, greySphere.faces);
    smoke.setLocalScale(4.0, 3.0, 4.0);
    smoke.setLocalTranslation(-20, 78.5, 0);
    houseMain.addChild(smoke, -20, 80, 0);
    smokes.push(smoke);
    var smoke = new Object3D(greySphere.vertices, greySphere.faces);
    smoke.setLocalScale(4.0, 3.0, 4.0);
    smoke.setLocalTranslation(-20, 78.5, 0);
    houseMain.addChild(smoke, -20, 80, 0);
    smokes.push(smoke);

    var terrace = new Object3D(brownBox.vertices, brownBox.faces);
    terrace.setLocalScale(30, 12.0, 4);
    terrace.setLocalTranslation(0, -33, 72);
    houseMain.addChild(terrace);
    var terrace = new Object3D(brownBox.vertices, brownBox.faces);
    terrace.setLocalScale(30, 6.0, 4);
    terrace.setLocalTranslation(0, -36, 76);
    houseMain.addChild(terrace);
    var bush = new Object3D(greenSphere.vertices, greenSphere.faces);
    bush.setLocalScale(12, 19, 12);
    bush.setLocalTranslation(-57, -35, 78);
    houseMain.addChild(bush);
    var bush = new Object3D(greenSphere.vertices, greenSphere.faces);
    bush.setLocalScale(12, 19, 12);
    bush.setLocalTranslation(-40, -35, 78);
    houseMain.addChild(bush);
    var bush = new Object3D(greenSphere.vertices, greenSphere.faces);
    bush.setLocalScale(12, 19, 12);
    bush.setLocalTranslation(-23, -35, 78);
    houseMain.addChild(bush);
    var bush = new Object3D(greenSphere.vertices, greenSphere.faces);
    bush.setLocalScale(12, 19, 12);
    bush.setLocalTranslation(57, -35, 78);
    houseMain.addChild(bush);
    var bush = new Object3D(greenSphere.vertices, greenSphere.faces);
    bush.setLocalScale(12, 19, 12);
    bush.setLocalTranslation(40, -35, 78);
    houseMain.addChild(bush);
    var bush = new Object3D(greenSphere.vertices, greenSphere.faces);
    bush.setLocalScale(12, 19, 12);
    bush.setLocalTranslation(23, -35, 78);
    houseMain.addChild(bush);
    var bush = new Object3D(greenSphere.vertices, greenSphere.faces);
    bush.setLocalScale(12, 19, 12);
    bush.setLocalTranslation(57, -35, 59);
    houseMain.addChild(bush);
    var bush = new Object3D(greenSphere.vertices, greenSphere.faces);
    bush.setLocalScale(12, 19, 12);
    bush.setLocalTranslation(57, -35, 42);
    houseMain.addChild(bush);
    var bush = new Object3D(greenSphere.vertices, greenSphere.faces);
    bush.setLocalScale(12, 19, 12);
    bush.setLocalTranslation(57, -35, 25);
    houseMain.addChild(bush);
    var bush = new Object3D(greenSphere.vertices, greenSphere.faces);
    bush.setLocalScale(12, 19, 12);
    bush.setLocalTranslation(57, -35, 8);
    houseMain.addChild(bush);
    var bush = new Object3D(greenSphere.vertices, greenSphere.faces);
    bush.setLocalScale(12, 19, 12);
    bush.setLocalTranslation(57, -35, -9);
    houseMain.addChild(bush);
    var bush = new Object3D(greenSphere.vertices, greenSphere.faces);
    bush.setLocalScale(12, 19, 12);
    bush.setLocalTranslation(57, -35, -26);
    houseMain.addChild(bush);
    var bush = new Object3D(greenSphere.vertices, greenSphere.faces);
    bush.setLocalScale(12, 19, 12);
    bush.setLocalTranslation(57, -35, -40);
    houseMain.addChild(bush);
    var bush = new Object3D(greenSphere.vertices, greenSphere.faces);
    bush.setLocalScale(12, 19, 12);
    bush.setLocalTranslation(-57, -35, 59);
    houseMain.addChild(bush);
    var bush = new Object3D(greenSphere.vertices, greenSphere.faces);
    bush.setLocalScale(12, 19, 12);
    bush.setLocalTranslation(-57, -35, 42);
    houseMain.addChild(bush);
    var bush = new Object3D(greenSphere.vertices, greenSphere.faces);
    bush.setLocalScale(12, 19, 12);
    bush.setLocalTranslation(-57, -35, 25);
    houseMain.addChild(bush);
    var bush = new Object3D(greenSphere.vertices, greenSphere.faces);
    bush.setLocalScale(12, 19, 12);
    bush.setLocalTranslation(-57, -35, 8);
    houseMain.addChild(bush);
    var bush = new Object3D(greenSphere.vertices, greenSphere.faces);
    bush.setLocalScale(12, 19, 12);
    bush.setLocalTranslation(-57, -35, -9);
    houseMain.addChild(bush);
    var bush = new Object3D(greenSphere.vertices, greenSphere.faces);
    bush.setLocalScale(12, 19, 12);
    bush.setLocalTranslation(-57, -35, -26);
    houseMain.addChild(bush);
    var bush = new Object3D(greenSphere.vertices, greenSphere.faces);
    bush.setLocalScale(12, 19, 12);
    bush.setLocalTranslation(-57, -35, -40);
    houseMain.addChild(bush);
    var bush = new Object3D(greenSphere.vertices, greenSphere.faces);
    bush.setLocalScale(12, 19, 12);
    bush.setLocalTranslation(-57, -35, -40);
    houseMain.addChild(bush);
    var bush = new Object3D(greenSphere.vertices, greenSphere.faces);
    bush.setLocalScale(12, 19, 12);
    bush.setLocalTranslation(-40, -35, -40);
    houseMain.addChild(bush);
    var bush = new Object3D(greenSphere.vertices, greenSphere.faces);
    bush.setLocalScale(12, 19, 12);
    bush.setLocalTranslation(-23, -35, -40);
    houseMain.addChild(bush);
    var bush = new Object3D(greenSphere.vertices, greenSphere.faces);
    bush.setLocalScale(12, 19, 12);
    bush.setLocalTranslation(57, -35, -40);
    houseMain.addChild(bush);
    var bush = new Object3D(greenSphere.vertices, greenSphere.faces);
    bush.setLocalScale(12, 19, 12);
    bush.setLocalTranslation(40, -35, -40);
    houseMain.addChild(bush);
    var bush = new Object3D(greenSphere.vertices, greenSphere.faces);
    bush.setLocalScale(12, 19, 12);
    bush.setLocalTranslation(23, -35, -40);
    houseMain.addChild(bush);
    var bush = new Object3D(greenSphere.vertices, greenSphere.faces);
    bush.setLocalScale(12, 19, 12);
    bush.setLocalTranslation(6, -35, -40);
    houseMain.addChild(bush);
    var bush = new Object3D(greenSphere.vertices, greenSphere.faces);
    bush.setLocalScale(12, 19, 12);
    bush.setLocalTranslation(-6, -35, -40);
    houseMain.addChild(bush);

    floor.addChild(houseMain);
    houseMain.translate(0, 30, 0);
    houseMain.scale(0.85, 0.8, 0.8);

    var whiteSphere = GEO.createSphere(50.0, 15, [1, 1, 1]);
    var cloudInstance = instanceRandomiser(whiteSphere.vertices, whiteSphere.faces, 0, 0, 1000, 1000, 6, 6);
    var cloud = new Object3D(cloudInstance.vertices, cloudInstance.faces);
    cloud.setLocalTranslation(0, 250, 0);
    cloud.setLocalScale(1.0, 0.6, 0.8);
    floor.addChild(cloud);

    var clouds = [cloud];
    let newChild = cloud.clone();
    newChild.translate(0, 0, 1000);
    floor.addChild(newChild);
    clouds.push(newChild);
    newChild = cloud.clone();
    newChild.translate(0, 0, -1000);
    floor.addChild(newChild);
    clouds.push(newChild);

    var redParaboloid = GEO.createEllipticParaboloid(1.0, 1.0, 30, [1, 0, 0]);
    var whiteCurve = GEO.combineLines(
        [0.9, 0.9, 0.9],
        GEO.createCurve([0.3, 0, 0.3, 1.2, 3, 1.2, 0.3, 5, 0.3], 7, 2),
        GEO.createCurve([-0.3, 0, 0.3, 0.6, 3, 1.2, -0.3, 5, 0.3], 7, 2),
        GEO.createCurve([0, 0, -0.3, 0.9, 3, 0.6, 0, 5, -0.3], 7, 2),
    );
    var stalk = new Object3D(whiteCurve.vertices, whiteCurve.faces);
    var cap = new Object3D(redParaboloid.vertices, redParaboloid.faces);
    cap.setLocalScale(1.5, 0.75, 1.5);
    cap.setLocalTranslation(0.4, 5, 0);
    stalk.addChild(cap);
    var cap = new Object3D(whiteSphere.vertices, whiteSphere.faces);
    cap.setLocalScale(0.01, 0.01, 0.01);
    cap.setLocalTranslation(1.2, 4.4, 0);
    stalk.addChild(cap);
    var cap = new Object3D(whiteSphere.vertices, whiteSphere.faces);
    cap.setLocalScale(0.01, 0.01, 0.01);
    cap.setLocalTranslation(0.3, 4.4, 0.7);
    stalk.addChild(cap);
    var cap = new Object3D(whiteSphere.vertices, whiteSphere.faces);
    cap.setLocalScale(0.01, 0.01, 0.01);
    cap.setLocalTranslation(-0.3, 4.4, -0.4);
    stalk.addChild(cap);
    randomiser(stalk, floor, 0, 0, 500, 500, 7, 7);

    var blackSphere = GEO.createSphere(1.0, 10, [0, 0, 0]);
    var purpleCylinder = GEO.createSphere(1.0, 10, [0.5, 0, 0.5]);
    var butterfly = new Object3D(blackSphere.vertices, blackSphere.faces);
    butterfly.setLocalScale(0.7, 0.3, 0.3);
    butterfly.setLocalTranslation(0, 20, 0);
    var head = new Object3D(blackSphere.vertices, blackSphere.faces);
    head.setLocalScale(0.3, 0.3, 0.3);
    head.setLocalTranslation(-0.8, 20, 0);
    butterfly.addChild(head);
    var leftWing = new Object3D(purpleCylinder.vertices, purpleCylinder.faces);
    leftWing.setLocalScale(0.8, 0.1, 1.5);
    leftWing.setLocalRotation(GEO.rad(45), 0, 0);
    leftWing.setLocalTranslation(0, 21, -1);
    butterfly.addChild(leftWing,0, 20, 0);
    var rightWing = new Object3D(purpleCylinder.vertices, purpleCylinder.faces);
    rightWing.setLocalScale(0.8, 0.1, 1.5);
    rightWing.setLocalRotation(GEO.rad(-45), 0, 0);
    rightWing.setLocalTranslation(0, 21, 1);
    butterfly.addChild(rightWing, 0, 20, 0);

    var butterflies = randomiser(butterfly, floor, 0, 200, 200, 150, 3, 3);
    for(let i = 0; i < butterflies.length; i++) {
        butterflies[i].origin = [0, 20, 10];
    }

    let test = GEO.createPipe(
        GEO.createCurve([0, 0, 0, 6, 6, 6, 8, 30, 8, 0, 30, 20], 20, 2),
        3,
        10,
        [1, 0, 0]
    );
    let pipe = new Object3D(test.vertices, test.faces);
    floor.addChild(pipe);
    pipe.translate(0, 20, 270);


    return { main: floor, trees: trees, smokes: smokes, clouds: clouds, butterflies: butterflies };
}

export function instanceRandomiser(vertices: number[], faces: number[], centerX: number, centerZ: number, length: number, width: number, divisorX: number, divisorZ: number) {
    let verticesOut = [];
    let facesOut = [];
    let vertexCount = vertices.length / 9;
    let faceCount = faces.length / 3;
    for (let i = 0; i < divisorX; i++) {
        for (let j = 0; j < divisorZ; j++) {
            let scaleY = 0.5 + Math.random() * 2.0;
            let rotateY = Math.random() * 360;
            let offsetX = (i + Math.random()) * length / divisorX - length / 2 + centerX;
            let offsetZ = (j + Math.random()) * width / divisorZ - width / 2 + centerZ;
            for (let k = 0; k < vertexCount; k++) {
                let vertexIndex = k * 9;
                let position = glMatrix.vec3.fromValues(vertices[vertexIndex], vertices[vertexIndex + 1], vertices[vertexIndex + 2]);
                position[1] * scaleY;
                glMatrix.vec3.rotateY(position, position, [0, 0, 0], GEO.rad(rotateY));
                glMatrix.vec3.add(position, position, [offsetX, 0, offsetZ]);
                let normal = glMatrix.vec3.fromValues(vertices[vertexIndex + 3], vertices[vertexIndex + 4], vertices[vertexIndex + 5]);
                glMatrix.vec3.rotateY(normal, normal, [0, 0, 0], GEO.rad(rotateY));
                verticesOut.push(
                    ...position,
                    ...normal,
                    vertices[vertexIndex + 6],
                    vertices[vertexIndex + 7],
                    vertices[vertexIndex + 8]
                );
            }
            let offsetIndex = ((i * divisorZ) + j + 1) * vertexCount;
            for (let k = 0; k < faceCount; k++) {
                let faceIndex = k * 3;
                facesOut.push(
                    offsetIndex + faces[faceIndex],
                    offsetIndex + faces[faceIndex + 1],
                    offsetIndex + faces[faceIndex + 2]
                );
            }
        }
    }
    return { vertices: verticesOut, faces: facesOut };
}

export function randomiser(child: Object3D, parent: Object3D, centerX: number, centerZ: number, length: number, width: number, divisorX: number, divisorZ: number) {
    let objects = [];
    for (let i = 0; i < divisorX; i++) {
        for (let j = 0; j < divisorZ; j++) {
            let scaleY = 1.2 + Math.random();
            let scaleXZ = 1.0 + Math.random() * 0.2;
            let rotationY = Math.random() * GEO.rad(360);
            let offsetX = (i + Math.random()) * length / divisorX - length / 2 + centerX;
            let offsetZ = (j + Math.random()) * width / divisorZ - width / 2 + centerZ;

            let newChild = child.clone();
            parent.addChild(newChild);
            newChild.scale(scaleXZ, scaleY, scaleXZ);
            newChild.rotate(0, rotationY, 0);
            newChild.translate(offsetX, 0, offsetZ);

            objects.push(newChild);
        }
    }
    return objects;
}