import { GEO } from "../geometry";
import { Object3D } from "../object";

export function createCharacter_1() {
    var tmp = GEO.combineLines(
        [1, 0, 0],
        GEO.createCurve([3, 3.5, 0.5, -1.5, -3.5, 0.5, -6, -4.5, 0.5], 30, 2),
        GEO.createCurve([3, 3.5, -0.5, -1.5, -3.5, -0.5, -6, -4.5, -0.5], 30, 2),
        GEO.createCurve([3, 3, -0.5, -1.5, -4, -0.5, -6, -5, -0.5], 30, 2),
        GEO.createCurve([3, 3, 0.5, -1.5, -4, 0.5, -6, -5, 0.5], 30, 2),
    );
    var bicycleBody = new Object3D(tmp.vertices, tmp.faces);

    var redBox = GEO.createBox(1, 1, 1, [1, 0, 0]);
    var greyBox = GEO.createBox(1, 1, 1, [0.5, 0.5, 0.5]);
    var greyPrism = GEO.createCylinder(1.0, 1.0, 3, [0.3, 0.3, 0.3]);
    var darkGreyCylinder = GEO.createCylinder(1.0, 1.0, 20, [0.3, 0.3, 0.3]);
    var greyCylinder = GEO.createCylinder(1, 1, 20, [0.7, 0.7, 0.7]);
    var greyHyperbola = GEO.createEllipticParaboloid(1.0, 1.0, 20, [0.1, 0.1, 0.1]);
    var greySphere = GEO.createSphere(1.0, 20, [0.2, 0.2, 0.2]);
    var yellowHyperboloid = GEO.createHyperboloidOneSheet(1.0, 1.0, 20, [0.5, 0.5, 0]);

    var body_part_1 = new Object3D(redBox.vertices, redBox.faces);
    body_part_1.setLocalScale(0.5, 8.0, 1);
    body_part_1.setLocalRotation(0, 0, GEO.rad(10));
    body_part_1.setLocalTranslation(-6, -4.5, 0);
    bicycleBody.addChild(body_part_1);
    var body_part_2 = new Object3D(redBox.vertices,redBox.faces);
    body_part_2.setLocalScale(0.3, 7.5, 1);
    body_part_2.setLocalRotation(0, 0, GEO.rad(120));
    body_part_2.setLocalTranslation(-9, -6.1, 0);
    bicycleBody.addChild(body_part_2);
    var body_part_3 = new Object3D(redBox.vertices,redBox.faces);
    body_part_3.setLocalScale(0.4, 9.4, 1);
    body_part_3.setLocalRotation(0, 0, GEO.rad(-40));
    body_part_3.setLocalTranslation(-9.6, -4.5, 0);
    bicycleBody.addChild(body_part_3);
    var body_part_4 = new Object3D(redBox.vertices, redBox.faces);
    body_part_4.setLocalScale(0.4, 7.5, 1);
    body_part_4.setLocalRotation(0, 0, GEO.rad(87));
    body_part_4.setLocalTranslation(-8.9, -8.3, 0);
    bicycleBody.addChild(body_part_4);
    var body_part_5 = new Object3D(redBox.vertices,redBox.faces);
    body_part_5.setLocalScale(0.5, 13, 1);
    body_part_5.setLocalRotation(0, 0, GEO.rad(-45));
    body_part_5.setLocalTranslation(-0.7, -3.9, 0);
    bicycleBody.addChild(body_part_5);
    var frontPivot = new Object3D(redBox.vertices, redBox.faces);
    frontPivot.setLocalScale(0.5, 12, 1);
    frontPivot.setLocalRotation(0, 0, GEO.rad(18));
    frontPivot.setLocalTranslation(5, -2.2, 0);
    bicycleBody.addChild(frontPivot, 3.5, 5, 0);
    var body_part_7 = new Object3D(greyBox.vertices, greyBox.faces);
    body_part_7.setLocalScale(0.4, 3, 0.4);
    body_part_7.setLocalRotation(0, 0, GEO.rad(10));
    body_part_7.setLocalTranslation(-6.8, 0.2, 0);
    bicycleBody.addChild(body_part_7);
    var handleRoot = new Object3D(greyBox.vertices, greyBox.faces);
    handleRoot.setLocalScale(0.4, 1.0, 0.4);
    handleRoot.setLocalRotation(0, 0, GEO.rad(18));
    handleRoot.setLocalTranslation(2.9, 4, 0);
    frontPivot.addChild(handleRoot);
    var body_part_9 = new Object3D(greyBox.vertices, greyBox.faces);
    body_part_9.setLocalScale(0.4, 1, 0.4);
    body_part_9.setLocalRotation(0, 0, GEO.rad(-25));
    body_part_9.setLocalTranslation(2.9, 4.9, 0);
    handleRoot.addChild(body_part_9);
    var body_part_10 = new Object3D(greyBox.vertices, greyBox.faces);
    body_part_10.setLocalScale(0.4, 0.6, 0.4);
    body_part_10.setLocalRotation(0, 0, GEO.rad(5));
    body_part_10.setLocalTranslation(3.1, 5.6, 0);
    body_part_9.addChild(body_part_10);

    tmp = GEO.combineLines(
        [0.5, 0.5, 0.5],
        GEO.createCurve([-3, 0, -4, 0, 0, -4, 0, 0, 0, 0, 0, 4, -3, 0, 4], 30, 4),
        GEO.createCurve([-3, 0.5, -4, 0, 0.5, -4, 0, 0.5, 0, 0, 0.5, 4, -3, 0.5, 4], 30, 4),
        GEO.createCurve([-2.5, 0, -3.5, -0.5, 0, -3.5, -0.5, 0.5, 0, -0.5, 0, 3.5, -2.5, 0, 3.5], 30, 4),
        GEO.createCurve([-2.5, 0.5, -3.5, -0.5, 0.5, -3.5, -0.5, 0.5, 0, -0.5, 0.5, 3.5, -2.5, 0.5, 3.5], 30, 4),
    );
    var handle = new Object3D(tmp.vertices, tmp.faces);
    handle.setLocalScale(0.4, 0.5, 0.4);
    handle.setLocalRotation(0, 0, GEO.rad(0));
    handle.setLocalTranslation(3.5, 5.7, 0);
    body_part_10.addChild(handle);

    var handleBar = new Object3D(darkGreyCylinder.vertices, darkGreyCylinder.faces);
    handleBar.setLocalScale(0.3, 2.0, 0.3);
    handleBar.setLocalRotation(0, GEO.rad(60), GEO.rad(90));
    handleBar.setLocalTranslation(2.4, 5.8, 2);
    handle.addChild(handleBar);
    var handleBar = new Object3D(darkGreyCylinder.vertices, darkGreyCylinder.faces);
    handleBar.setLocalScale(0.3, 2.0, 0.3);
    handleBar.setLocalRotation(0, GEO.rad(-60), GEO.rad(90));
    handleBar.setLocalTranslation(2.4, 5.8, -2);
    handle.addChild(handleBar);

    var honk = new Object3D(greySphere.vertices, greySphere.faces);
    honk.setLocalScale(1.3, 1.3, 1.3);
    honk.setLocalTranslation(1, 6.2, 0);
    handle.addChild(honk);
    var trumpet = new Object3D(yellowHyperboloid.vertices, yellowHyperboloid.faces);
    trumpet.setLocalScale(0.3, 0.8, 0.3);
    trumpet.setLocalRotation(0, 0, GEO.rad(90));
    trumpet.setLocalTranslation(3.2, 6.2, 0);
    handle.addChild(trumpet);

    var frontWheel = new Object3D(darkGreyCylinder.vertices, darkGreyCylinder.faces);
    frontWheel.setLocalScale(5, 0.5, 5);
    frontWheel.setLocalRotation(GEO.rad(90), 0, 0);
    frontWheel.setLocalTranslation(6.5, -7.7, 0);
    frontPivot.addChild(frontWheel);
    var innerWheel = new Object3D(greyCylinder.vertices, greyCylinder.faces);
    innerWheel.setLocalScale(4.5, 0.51, 4.5);
    innerWheel.setLocalRotation(GEO.rad(90), 0, 0);
    innerWheel.setLocalTranslation(6.5, -7.7, 0);
    frontWheel.addChild(innerWheel);
    var wheelMarker = new Object3D(greyPrism.vertices, greyPrism.faces);
    wheelMarker.setLocalScale(3.5, 0.52, 0.5);
    wheelMarker.setLocalRotation(GEO.rad(90), 0, 0);
    wheelMarker.setLocalTranslation(3.5, -7.7, 0);
    frontWheel.addChild(wheelMarker);

    var backWheel = new Object3D(darkGreyCylinder.vertices, darkGreyCylinder.faces);
    backWheel.setLocalScale(5, 0.5, 5);
    backWheel.setLocalRotation(GEO.rad(90), 0, 0);
    backWheel.setLocalTranslation(-12, -7.7, 0);
    bicycleBody.addChild(backWheel);
    var innerWheel = new Object3D(greyCylinder.vertices, greyCylinder.faces);
    innerWheel.setLocalScale(4.5, 0.51, 4.5);
    innerWheel.setLocalRotation(GEO.rad(90), 0, 0);
    innerWheel.setLocalTranslation(-12, -7.7, 0);
    backWheel.addChild(innerWheel);
    var wheelMarker = new Object3D(greyPrism.vertices, greyPrism.faces);
    wheelMarker.setLocalScale(3.5, 0.52, 0.5);
    wheelMarker.setLocalRotation(GEO.rad(90), 0, 0);
    wheelMarker.setLocalTranslation(-14.8, -7.7, 0);
    backWheel.addChild(wheelMarker);

    var seat = new Object3D(greyPrism.vertices, greyPrism.faces);
    seat.setLocalScale(3.0, 0.5, 1.0);
    seat.setLocalRotation(0, 0, 0);
    seat.setLocalTranslation(-7.8, 1.5, 0);
    bicycleBody.addChild(seat);

    var gear = new Object3D(darkGreyCylinder.vertices, darkGreyCylinder.faces);
    gear.setLocalScale(1.5, 0.3, 1.5);
    gear.setLocalRotation(GEO.rad(90), 0, 0);
    gear.setLocalTranslation(-5.4, -8.5, 0.6);
    bicycleBody.addChild(gear, -5.4, -8.5, 0);
    var innerGear = new Object3D(greyCylinder.vertices, greyCylinder.faces);
    innerGear.setLocalScale(0.75, 0.1, 0.75);
    innerGear.setLocalRotation(GEO.rad(90), 0, 0);
    innerGear.setLocalTranslation(-5.4, -8.5, 0.71);
    gear.addChild(innerGear);
    var sideGear = new Object3D(darkGreyCylinder.vertices, darkGreyCylinder.faces);
    sideGear.setLocalScale(1.5, 0.3, 1.5);
    sideGear.setLocalRotation(GEO.rad(90), 0, 0);
    sideGear.setLocalTranslation(-5.4, -8.5, -0.6);
    gear.addChild(sideGear, -5.4, -8.5, 0);
    var innerGear = new Object3D(greyCylinder.vertices, greyCylinder.faces);
    innerGear.setLocalScale(0.75, 0.1, 0.75);
    innerGear.setLocalRotation(GEO.rad(90), 0, 0);
    innerGear.setLocalTranslation(-5.4, -8.5, -0.71);
    gear.addChild(innerGear);

    var pedalRoot = new Object3D(darkGreyCylinder.vertices, darkGreyCylinder.faces);
    pedalRoot.setLocalScale(0.2, 1.5, 0.2);
    pedalRoot.setLocalRotation(GEO.rad(90), 0, 0);
    pedalRoot.setLocalTranslation(-5.4, -8.5, 1.5);
    gear.addChild(pedalRoot);
    var pedalRoot = new Object3D(darkGreyCylinder.vertices, darkGreyCylinder.faces);
    pedalRoot.setLocalScale(0.2, 1.5, 0.2);
    pedalRoot.setLocalRotation(GEO.rad(90), 0, 0);
    pedalRoot.setLocalTranslation(-5.4, -8.5, -1.5);
    gear.addChild(pedalRoot);
    var pedalRoot = new Object3D(darkGreyCylinder.vertices, darkGreyCylinder.faces);
    pedalRoot.setLocalScale(0.2, 1.5, 0.2);
    pedalRoot.setLocalRotation(0, 0, GEO.rad(180));
    pedalRoot.setLocalTranslation(-5.4, -7.9, 2.1);
    gear.addChild(pedalRoot);
    var pedalRoot = new Object3D(darkGreyCylinder.vertices, darkGreyCylinder.faces);
    pedalRoot.setLocalScale(0.2, 1.5, 0.2);
    pedalRoot.setLocalRotation(0, 0, GEO.rad(180));
    pedalRoot.setLocalTranslation(-5.4, -9.1, -2.1);
    gear.addChild(pedalRoot);

    var rightPedal = new Object3D(greyHyperbola.vertices, greyHyperbola.faces);
    rightPedal.setLocalScale(1, 1.2, 0.5);
    rightPedal.setLocalRotation(GEO.rad(90), 0, 0);
    rightPedal.setLocalTranslation(-5.4, -7.15, 4.2);
    gear.addChild(rightPedal);
    var leftPedal = new Object3D(greyHyperbola.vertices, greyHyperbola.faces);
    leftPedal.setLocalScale(1, 1.2, 0.5);
    leftPedal.setLocalRotation(GEO.rad(-90), 0, 0);
    leftPedal.setLocalTranslation(-5.4, -9.85, -4.2);
    gear.addChild(leftPedal);

    tmp = GEO.combineLines(
        [0, 0, 0],
        GEO.createCurve([1, 0, -0.3, 1, 1, -0.3, 0, 1, -0.3, -1, 1, -0.3, -1, 0, -0.3, -1, -1, -0.3, 0, -1, -0.3, 1, -1, -0.3, 1, 0.4, -0.3], 70, 7),
        GEO.createCurve([1, 0, 0.3, 1, 1, 0.3, 0, 1, 0.3, -1, 1, 0.3, -1, 0, 0.3, -1, -1, 0.3, 0, -1, 0.3, 1, -1, 0.3, 1, 0.4, 0.3], 70, 7),
    );
    var chain = new Object3D(tmp.vertices, tmp.faces);
    chain.setLocalScale(5.55, 2.72, 0.5);
    chain.setLocalRotation(0, 0, GEO.rad(-7));
    chain.setLocalTranslation(-9.3, -8.17, 0.6);
    bicycleBody.addChild(chain);

    var backGear = new Object3D(darkGreyCylinder.vertices, darkGreyCylinder.faces);
    backGear.setLocalScale(1.5, 0.3, 1.5);
    backGear.setLocalRotation(GEO.rad(90), 0, 0);
    backGear.setLocalTranslation(-11.8, -7.8, 0.6);
    bicycleBody.addChild(backGear, -5.4, -8.5, 0);
    var innerGear = new Object3D(greyCylinder.vertices, greyCylinder.faces);
    innerGear.setLocalScale(0.75, 0.1, 0.75);
    innerGear.setLocalRotation(GEO.rad(90), 0, 0);
    innerGear.setLocalTranslation(-11.8, -7.8, 0.71);
    backGear.addChild(innerGear);

    var whiteCylinder = GEO.createCylinder(1.0, 1.0, 20, [1, 1, 1]);
    var whiteSphere = GEO.createSphere(1.0, 20, [1, 1, 1]);
    var blackCylinder = GEO.createCylinder(1.0, 1.0, 20, [0, 0, 0]);
    var blackParaboloid = GEO.createEllipticParaboloid(1.0, 1.0, 20, [0, 0, 0]);
    var blackSphere = GEO.createSphere(1.0, 20, [0, 0, 0]);

    var body = new Object3D(whiteCylinder.vertices, whiteCylinder.faces);
    body.setLocalScale(3.5, 8.0, 3.5);
    body.setLocalRotation(0, 0, GEO.rad(-12));
    body.setLocalTranslation(-5, 8, 0);
    bicycleBody.addChild(body, -5, 3.5, 0);
    var butt = new Object3D(whiteSphere.vertices, whiteSphere.faces);
    butt.setLocalScale(4.6, 3.0, 4.6);
    butt.setLocalRotation(0, 0, GEO.rad(-15));
    butt.setLocalTranslation(-6, 4.2, 0);
    bicycleBody.addChild(butt);
    var shoulder = new Object3D(whiteSphere.vertices, whiteSphere.faces);
    shoulder.setLocalScale(4, 3.5, 4);
    shoulder.setLocalRotation(0, 0, GEO.rad(-15));
    shoulder.setLocalTranslation(-4, 12, 0);
    body.addChild(shoulder);
    var tail = new Object3D(whiteSphere.vertices, whiteSphere.faces);
    tail.setLocalScale(2, 1, 1);
    tail.setLocalRotation(0, 0, GEO.rad(-40));
    tail.setLocalTranslation(-10.5, 5, 0);
    butt.addChild(tail);

    var leftFoot = new Object3D(blackParaboloid.vertices, blackParaboloid.faces);
    leftFoot.setLocalScale(1, 0.8, 1);
    leftFoot.setLocalTranslation(-5.4, -8.2, -3.5);
    leftPedal.addChild(leftFoot);
    var rightFoot = new Object3D(blackParaboloid.vertices, blackParaboloid.faces);
    rightFoot.setLocalScale(1, 0.8, 1);
    rightFoot.setLocalTranslation(-5.4, -5.5, 3.5);
    rightPedal.addChild(rightFoot);

    var leftLeg = new Object3D(blackCylinder.vertices, blackCylinder.faces);
    leftLeg.setLocalScale(0.7, 7, 0.7);
    leftLeg.setLocalRotation(0, 0, 0);
    leftLeg.setLocalTranslation(-5.4, -5.7, -3.5);
    leftFoot.addChild(leftLeg, -5.4, -8.8, -3.5);
    var rightLeg = new Object3D(blackCylinder.vertices, blackCylinder.faces);
    rightLeg.setLocalScale(0.7, 7, 0.7);
    rightLeg.setLocalRotation(0, 0, GEO.rad(-50));
    rightLeg.setLocalTranslation(-3.1, -3.7, 3.5);
    rightFoot.addChild(rightLeg, -5.4, -6.1, 3.5);

    var leftThigh = new Object3D(blackCylinder.vertices, blackCylinder.faces);
    leftThigh.setLocalScale(0.7, 6.7, 0.7);
    leftThigh.setLocalRotation(GEO.rad(10), 0, 0);
    leftThigh.setLocalTranslation(-5.4, 0.5, -3);
    leftLeg.addChild(leftThigh, -5.4, -2.7, -2);
    var rightThigh = new Object3D(blackCylinder.vertices, blackCylinder.faces);
    rightThigh.setLocalScale(0.7, 6.7, 0.7);
    rightThigh.setLocalRotation(GEO.rad(-10), 0, GEO.rad(45));
    rightThigh.setLocalTranslation(-3.1, 0.5, 3);
    rightLeg.addChild(rightThigh, -0.4, -1.7, 3.5);

    var leftHand = new Object3D(blackSphere.vertices, blackSphere.faces);
    leftHand.setLocalScale(1.5, 1, 1);
    leftHand.setLocalTranslation(2.4, 5.5, -2.2);
    handle.addChild(leftHand);
    var rightHand = new Object3D(blackSphere.vertices, blackSphere.faces);
    rightHand.setLocalScale(1.5, 1, 1);
    rightHand.setLocalTranslation(2.4, 5.5, 2.2);
    handle.addChild(rightHand);

    var tmp = GEO.createPipe(
        GEO.createCurve(
            [-7, 0, 0, 0, 0, -3, 3, 0, 0], 30, 2
        ), 0.7, 10, [0, 0, 0]
    );
    var leftArm = new Object3D(tmp.vertices, tmp.faces);
    leftArm.setLocalRotation(0, 0, GEO.rad(-45));
    leftArm.setLocalTranslation(0.5, 7, -1.5);
    leftHand.addChild(leftArm);
    var rightArm = new Object3D(tmp.vertices, tmp.faces);
    rightArm.setLocalRotation(GEO.rad(180), 0, GEO.rad(45));
    rightArm.setLocalTranslation(0.5, 7, 1.5);
    rightHand.addChild(rightArm);

    var head = new Object3D(blackParaboloid.vertices, blackParaboloid.faces);
    head.setLocalScale(2.0, 3.0, 2.0);
    head.setLocalRotation(GEO.rad(180), 0, GEO.rad(-40));
    head.setLocalTranslation(1, 12, 0);
    body.addChild(head);

    var hair = new Object3D(whiteSphere.vertices, whiteSphere.faces);
    hair.setLocalScale(2.7, 1.7, 2.7);
    hair.setLocalRotation(0, 0, GEO.rad(40));
    hair.setLocalTranslation(-2, 15.8, 0);
    head.addChild(hair);

    var hair = new Object3D(whiteSphere.vertices, whiteSphere.faces);
    hair.setLocalScale(1.5, 1, 1.5);
    hair.setLocalRotation(0, 0, GEO.rad(30));
    hair.setLocalTranslation(-2.3, 16.6, -1);
    head.addChild(hair);

    var hair = new Object3D(whiteSphere.vertices, whiteSphere.faces);
    hair.setLocalScale(1.75, 1.2, 1.75);
    hair.setLocalRotation(0, 0, GEO.rad(30));
    hair.setLocalTranslation(-2.3, 16.5, 1);
    head.addChild(hair);

    tmp = GEO.combineLines(
        [0, 0, 0],
        GEO.createCurve([-2.9, -5, 0, -2.62, -3, -3.36, 1.75, 4, -4.43, 3.31, 5, -1.9], 50, 3),
        GEO.createCurve([-2.9, -5, 0, -2.62, -3, 3.36, 1.75, 4, 4.43, 3.31, 5, 1.9], 50, 3),
        GEO.createCurve([-2.9, -5, 0, -2.62, 0, 3.36, 1.75, 9, 4.43, 3.31, 6, 1.9], 50, 3),
        GEO.createCurve([-2.9, -5, 0, -2.62, 0, -3.36, 1.75, 9, -4.43, 3.31, 6, -1.9], 50, 3),
    );
    var ear = new Object3D(tmp.vertices, tmp.faces);
    ear.setLocalScale(0.6, 0.2, 0.2);
    ear.setLocalRotation(0, GEO.rad(45), GEO.rad(-10));
    ear.setLocalTranslation(-2, 14, 3);
    head.addChild(ear);
    var ear = new Object3D(tmp.vertices, tmp.faces);
    ear.setLocalScale(0.6, 0.2, 0.2);
    ear.setLocalRotation(0, GEO.rad(-45), GEO.rad(-10));
    ear.setLocalTranslation(-2, 14, -3);
    head.addChild(ear);

    var eye = new Object3D(whiteSphere.vertices, whiteSphere.faces);
    eye.setLocalScale(0.6, 0.6, 0.6);
    eye.setLocalTranslation(0.5, 15, 1);
    head.addChild(eye);
    var iris = new Object3D(blackSphere.vertices, blackSphere.faces);
    iris.setLocalScale(0.35, 0.35, 0.35);
    iris.setLocalTranslation(0.85, 15, 1);
    eye.addChild(iris, 0.5, 15, 1);
    var eye = new Object3D(whiteSphere.vertices, whiteSphere.faces);
    eye.setLocalScale(0.6, 0.6, 0.6);
    eye.setLocalTranslation(0.5, 15, -1);
    head.addChild(eye);
    var iris = new Object3D(blackSphere.vertices, blackSphere.faces);
    iris.setLocalScale(0.35, 0.35, 0.35);
    iris.setLocalTranslation(0.85, 15, -1);
    eye.addChild(iris, 0.5, 15, -1);

    var mouth = new Object3D(blackCylinder.vertices, blackCylinder.faces);
    mouth.setLocalScale(0.75, 0.3, 1.5);
    mouth.setLocalRotation(GEO.rad(20), 0, GEO.rad(90));
    mouth.setLocalTranslation(0, 13.2, -1);
    head.addChild(mouth);
    var teeth = new Object3D(whiteCylinder.vertices, whiteCylinder.faces);
    teeth.setLocalScale(0.5, 0.3, 1.25);
    teeth.setLocalRotation(GEO.rad(20), 0, GEO.rad(90));
    teeth.setLocalTranslation(0.01, 13.2, -1);
    mouth.addChild(teeth);

    var flagpole = new Object3D(greyCylinder.vertices, greyCylinder.faces);
    flagpole.setLocalScale(0.2, 35.0, 0.2);
    flagpole.setLocalRotation(GEO.rad(0), GEO.rad(0), GEO.rad(20));
    flagpole.setLocalTranslation(-17.0, 8, -0.8);
    bicycleBody.addChild(flagpole);

    var flag = new Object3D(redBox.vertices, redBox.faces);
    flag.setLocalScale(14.0, 8.0, 0.5);
    flag.setLocalRotation(0, 0, GEO.rad(20));
    flag.setLocalTranslation(-28.0, 20, -0.8);
    bicycleBody.addChild(flag, -25.0, 30.0, -0.8);

    return {
        main: bicycleBody,
        frontPivot: frontPivot,
        frontWheel: frontWheel,
        backWheel: backWheel,
        gear: gear,
        leftPedal: leftPedal,
        rightPedal: rightPedal,
        leftThigh: leftThigh,
        rightThigh: rightThigh,
        leftLeg: leftLeg,
        rightLeg: rightLeg,
        body: body,
        honk: honk,
        flag: flag
    };
}