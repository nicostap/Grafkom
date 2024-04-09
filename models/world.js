function createFloor() {
    var greenCylinder = GEO.createCylinder(1.0, 1.0, 20, [0.3, 1.0, 0.3]);
    var floor = new Object3D(greenCylinder.vertices, greenCylinder.faces);
    floor.setLocalScale(200.0, 0.1, 200.0);
    floor.setLocalTranslation(0, 0, 0);
    return floor;
}