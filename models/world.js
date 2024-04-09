function createFloor() {
    var greenCylinder = GEO.createCylinder(1.0, 1.0, 20, [0.5, 1.0, 0.5]);
    var redBox = GEO.createBox(1.0, 1.0, 1.0, [1, 0, 0]);
    var blackBox = GEO.createBox(1.0, 1.0, 1.0, [0, 0, 0]);
    var yellowPrism = GEO.createCylinder(1.0, 1.0, 3, [1, 1, 0]);
    var greenPrism = GEO.createCylinder(1.0, 1.0, 3, [0, 0.4, 0]);

    var floor = new Object3D(greenCylinder.vertices, greenCylinder.faces);
    floor.setLocalScale(500.0, 0.1, 500.0);
    floor.setLocalTranslation(0, 0, 0);

    var barn = new Object3D(redBox.vertices, redBox.faces);
    barn.setLocalScale(50.0, 80.0, 80.0);
    barn.setLocalTranslation(150.0, 25.0, 0);
    floor.addChild(barn);
    var door = new Object3D(blackBox.vertices, blackBox.faces);
    door.setLocalScale(0.1, 40.0, 30.0);
    door.setLocalTranslation(125, 17.5, 0);
    barn.addChild(door);
    var window = new Object3D(blackBox.vertices, blackBox.faces);
    window.setLocalScale(0.1, 30.0, 8.0);
    window.setLocalTranslation(125, 30, 27.5);
    barn.addChild(window);
    var window = new Object3D(blackBox.vertices, blackBox.faces);
    window.setLocalScale(0.1, 30.0, 8.0);
    window.setLocalTranslation(125, 30, -27.5);
    barn.addChild(window);
    var roof = new Object3D(yellowPrism.vertices, yellowPrism.faces);
    roof.setLocalScale(60, 80, 60);
    roof.setLocalRotation(0, 0, GEO.rad(90));
    roof.setLocalTranslation(150, 80, 0);
    barn.addChild(roof);

    // Help arsitek
    var barn = new Object3D(redBox.vertices, redBox.faces);
    barn.setLocalScale(50.0, 80.0, 80.0);
    barn.setLocalTranslation(-150.0, 25.0, 0);
    floor.addChild(barn);
    var door = new Object3D(blackBox.vertices, blackBox.faces);
    door.setLocalScale(0.1, 40.0, 30.0);
    door.setLocalTranslation(-125, 17.5, 0);
    barn.addChild(door);
    var window = new Object3D(blackBox.vertices, blackBox.faces);
    window.setLocalScale(0.1, 30.0, 8.0);
    window.setLocalTranslation(-125, 30, 27.5);
    barn.addChild(window);
    var window = new Object3D(blackBox.vertices, blackBox.faces);
    window.setLocalScale(0.1, 30.0, 8.0);
    window.setLocalTranslation(-125, 30, -27.5);
    barn.addChild(window);
    var roof = new Object3D(yellowPrism.vertices, yellowPrism.faces);
    roof.setLocalScale(60, 80, 60);
    roof.setLocalRotation(0, 0, GEO.rad(90));
    roof.setLocalTranslation(-150, 80, 0);
    barn.addChild(roof);

    // Random grass generator (Model perlu diganti)
    // To do pakai instaced rendering biar bisa banyak
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            var grass = new Object3D(greenPrism.vertices, greenPrism.faces);
            grass.setLocalScale(5 * Math.random() + 3, 0.1, 2);
            grass.setLocalRotation(GEO.rad(90), GEO.rad(90), 0);
            grass.setLocalTranslation((i + Math.random()) * 60 - 150, 2.5, (j + Math.random()) * 60 - 150);
            floor.addChild(grass);
        }
    }

    return floor;
}