import { GEO } from "../geometry";
import { Object3D } from "../object";

export function createCharacter_3() {

    //shapes and color
    var beige = [228/255, 179/255, 121/255];
    var darkBeige = [214/255, 177/255, 91/255];
    var jeans = [56/255, 73/255, 75/255];
    var beigeCylinder = GEO.createCylinder(1.0, 2.0, 40, beige);
    var beigeSphere = GEO.createSphere(1, 20, beige);
    var darkBeigeEllipticParaboloid = GEO.createEllipticParaboloid(1.0, 2.0, 20, darkBeige);
    var darkBeigeCylinder = GEO.createCylinder(1.0, 2.0, 20, darkBeige);
    var darkBeigeHyperboloid = GEO.createHyperboloidOneSheet(0.5, 5, 20, [darkBeige[0]*0.5, darkBeige[1]*0.5, darkBeige[2]*0.5]);
    var darkJeansCylinder = GEO.createCylinder(1.0, 2.0, 20, jeans);
    var darkJeansSphere = GEO.createSphere(1, 20, jeans);
    var blackMouth = GEO.combineLines(
        [0, 0, 0],
        GEO.createCurve([3, 3.5, -0.8, 0, 3, -0.4, -3, 3.5, -0.8], 30, 2),
        GEO.createCurve([3, 3, -0.8, 0, 2.5, -0.4, -3, 3, -0.8], 30, 2)
    );
    var beigeEar = GEO.createCylinder(1, 1, 20, beige);

    // Custom Curve
    let tmp1 = [-0.35, 0.5, 0.50, -0.65, 0.6, 0.3, -0.6, 0.8, -0.5, 0, 1.1, -0.7, 0.6, 0.8, -0.5, 0.65, 0.6, 0.3, 0.35, 0.5, 0.5];
    let tmp2 = [-0.35, 0.0, 0.55, -0.65, 0.0, 0.3, -0.6, 0.0, -0.5, 0, 0.0, -0.7, 0.6, 0.0, -0.5, 0.65, 0.0, 0.3, 0.35, 0, 0.55];
    let tmp3 = [], tmp4 = [];
    for (let i = 0; i < tmp1.length; i++) {
        tmp3.push(tmp1[i]*0.9);
        tmp4.push(tmp2[i]*0.9);
    }
    var orangeHair = GEO.combineLines(
        [182/255, 107/255, 50/255],
        GEO.createCurve(tmp1, 30, 2),
        GEO.createCurve(tmp2, 30, 2),
        GEO.createCurve(tmp3, 30, 2),
        GEO.createCurve(tmp4, 30, 2)
    );
    var darkBeigeSphere = GEO.createSphere(1, 20, darkBeige);
// 0.25, ~, 0.5
    //objects
    var main = new Object3D(beigeCylinder.vertices, beigeCylinder.faces);
    main.setLocalScale(1, 1, 1);
    main.setLocalTranslation(0, 0, 0);
    main.setLocalRotation(0, 0, 0);

    var body = new Object3D(darkBeigeEllipticParaboloid.vertices, darkBeigeEllipticParaboloid.faces);
    body.setLocalScale(7, 7, 7);
    body.setLocalTranslation(0, 14, 0);
    main.addChild(body);

    var stomach = new Object3D(darkBeigeSphere.vertices, darkBeigeSphere.faces);
    stomach.setLocalScale(8.5, 5, 8.5);
    stomach.setLocalTranslation(0, -7.5, 0);
    body.addChild(stomach);

    var neck = new Object3D(darkBeigeCylinder.vertices, darkBeigeCylinder.faces);
    neck.setLocalScale(3.5, 1, 3.5);
    neck.setLocalTranslation(0, 11, 0);
    main.addChild(neck);
    
    var neck2 = new Object3D(darkBeigeHyperboloid.vertices, darkBeigeHyperboloid.faces);
    neck2.setLocalScale(3.5, 0.7, 3.5);
    neck2.setLocalTranslation(0, 5, 0);
    neck.addChild(neck2);

    var head = new Object3D(beigeCylinder.vertices, beigeCylinder.faces);
    head.setLocalScale(3, 4, 3);
    head.setLocalTranslation(0, 16, 0);
    main.addChild(head);

    var head_bald = new Object3D(beigeSphere.vertices, beigeSphere.faces);
    head_bald.setLocalScale(3, 3, 3);
    head_bald.setLocalTranslation(0, 20, 0);
    head.addChild(head_bald);

    var nose = new Object3D(beigeCylinder.vertices, beigeCylinder.faces);
    nose.setLocalScale(1, 1, 1);
    nose.setLocalTranslation(0, 18, 3);
    nose.setLocalRotation(GEO.rad(90), 0, 0);
    head.addChild(nose);

    var nose_2 = new Object3D(beigeSphere.vertices, beigeSphere.faces);
    nose_2.setLocalScale(1, 1, 1);
    nose_2.setLocalTranslation(0, 18, 4);
    head.addChild(nose_2);

    var mouth = new Object3D(blackMouth.vertices, blackMouth.faces)
    mouth.setLocalScale(0.5, 0.5, 0.5);
    mouth.setLocalTranslation(0, 12, 3.3)
    head.addChild(mouth);

    var cheeks1 = new Object3D(beigeSphere.vertices, beigeSphere.faces);
    cheeks1.setLocalScale(0.5, 0.5, 0.5);
    cheeks1.setLocalTranslation(-1.8, 13.9, 2);
    head.addChild(cheeks1);

    var cheeks2 = new Object3D(beigeSphere.vertices, beigeSphere.faces);
    cheeks2.setLocalScale(0.5, 0.5, 0.5);
    cheeks2.setLocalTranslation(1.8, 13.9, 2);
    head.addChild(cheeks2);

    var ear1 = new Object3D(beigeEar.vertices, beigeEar.faces);
    ear1.setLocalScale(1.2, 1.4, 1.2);
    ear1.setLocalTranslation(3, 19, 0);
    ear1.setLocalRotation(1.5708, 0, 0);
    head.addChild(ear1);

    var ear2 = new Object3D(beigeEar.vertices, beigeEar.faces);
    ear2.setLocalScale(1.2, 1.4, 1.2);
    ear2.setLocalTranslation(-3, 19, 0);
    ear2.setLocalRotation(1.5708, 0, 0);
    head.addChild(ear2);

    var hair = new Object3D(orangeHair.vertices, orangeHair.faces);
    hair.setLocalScale(5, 5, 5)
    hair.setLocalTranslation(0, 19, 0);
    hair.setLocalRotation(0, 0, 0);
    head.addChild(hair);

    var armLeft = new Object3D(darkBeigeSphere.vertices, darkBeigeSphere.faces);
    armLeft.setLocalScale(2.8, 2.8, 2.8)
    armLeft.setLocalTranslation(4, 8, 0);
    body.addChild(armLeft);

    var armLeftUpper = new Object3D(darkBeigeCylinder.vertices, darkBeigeCylinder.faces);
    armLeftUpper.setLocalScale(2.5, 4.5, 2.5);
    armLeftUpper.setLocalTranslation(8, 4, 0);
    armLeftUpper.setLocalRotation(0, 0, 0.785398);
    armLeft.addChild(armLeftUpper);

    var armLeft2 = new Object3D(darkBeigeSphere.vertices, darkBeigeSphere.faces);
    armLeft2.setLocalScale(2.5, 2.5, 2.5)
    armLeft2.setLocalTranslation(11, 1, 0);
    armLeft.addChild(armLeft2);

    var armLeftLower = new Object3D(darkBeigeCylinder.vertices, darkBeigeCylinder.faces);
    armLeftLower.setLocalScale(2.4, 4.5, 2.4)
    armLeftLower.setLocalTranslation(11, -3, 0);
    armLeft2.addChild(armLeftLower);

    var handLeft1 = new Object3D(beigeSphere.vertices, beigeSphere.faces);
    handLeft1.setLocalScale(2.2, 4, 2.2)
    handLeft1.setLocalTranslation(11.2, -7, 0);
    handLeft1.setLocalRotation(0, 0, 0.2);
    armLeft2.addChild(handLeft1);

    var handLeft2 = new Object3D(beigeSphere.vertices, beigeSphere.faces);
    handLeft2.setLocalScale(1.1, 3, 1.1)
    handLeft2.setLocalTranslation(10, -7, 0);
    handLeft2.setLocalRotation(0, 0, -0.5);
    handLeft1.addChild(handLeft2);

    var armRight = new Object3D(darkBeigeSphere.vertices, darkBeigeSphere.faces);
    armRight.setLocalScale(2.8, 2.8, 2.8)
    armRight.setLocalTranslation(-4, 8, 0);
    body.addChild(armRight);

    var armRightUpper = new Object3D(darkBeigeCylinder.vertices, darkBeigeCylinder.faces);
    armRightUpper.setLocalScale(2.5, 4.5, 2.5);
    armRightUpper.setLocalTranslation(-8, 4, 0);
    armRightUpper.setLocalRotation(0, 0, -0.785398);
    armRight.addChild(armRightUpper);

    var armRight2 = new Object3D(darkBeigeSphere.vertices, darkBeigeSphere.faces);
    armRight2.setLocalScale(2.5, 2.5, 2.5)
    armRight2.setLocalTranslation(-11, 1, 0);
    armRight.addChild(armRight2);

    var armRightLower = new Object3D(darkBeigeCylinder.vertices, darkBeigeCylinder.faces);
    armRightLower.setLocalScale(2.4, 4.5, 2.4)
    armRightLower.setLocalTranslation(-11, -3, 0);
    armRight2.addChild(armRightLower);

    var handRight1 = new Object3D(beigeSphere.vertices, beigeSphere.faces);
    handRight1.setLocalScale(2.2, 4, 2.2)
    handRight1.setLocalTranslation(-11.2, -7, 0);
    handRight1.setLocalRotation(0, 0, -0.2);
    armRight2.addChild(handRight1);

    var handRight2 = new Object3D(beigeSphere.vertices, beigeSphere.faces);
    handRight2.setLocalScale(1.1, 3, 1.1)
    handRight2.setLocalTranslation(-10, -7, 0);
    handRight2.setLocalRotation(0, 0, 0.5);
    handRight1.addChild(handRight2);
    
    var left_leg_joint = new Object3D(darkJeansSphere.vertices, darkJeansSphere.faces);
    left_leg_joint.setLocalScale(1, 1, 1);
    left_leg_joint.setLocalTranslation(4, -8, 0);
    main.addChild(left_leg_joint);

    var right_leg_joint = new Object3D(darkJeansSphere.vertices, darkJeansSphere.faces);
    right_leg_joint.setLocalScale(1, 1, 1);
    right_leg_joint.setLocalTranslation(-4, -8, 0);
    main.addChild(right_leg_joint);

    var left_leg = new Object3D(darkJeansCylinder.vertices, darkJeansCylinder.faces);
    left_leg.setLocalScale(2.6, 6, 2.6);
    left_leg.setLocalTranslation(4, -14, 0);
    left_leg_joint.addChild(left_leg);

    var right_leg = new Object3D(darkJeansCylinder.vertices, darkJeansCylinder.faces);
    right_leg.setLocalScale(2.6, 6, 2.6);
    right_leg.setLocalTranslation(-4, -14, 0);
    right_leg_joint.addChild(right_leg);

    return {
        main: main,
        head: head,
    };
}