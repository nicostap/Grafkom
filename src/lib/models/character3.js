import { GEO } from "../geometry";
import { Object3D } from "../object";

export function createCharacter_3() {

    //shapes and color
    var beige = [228/255, 179/255, 121/255];
    var darkBeige = [214/255, 177/255, 91/255];
    var jeans = [56/255, 73/255, 75/255];
    var orange = [182/255, 107/255, 50/255];
    var green = [27/255, 140/255, 60/255];
    var darkRed = [148/255, 18/255, 18/255];
    var beigeCylinder = GEO.createCylinder(1.0, 2.0, 40, beige);
    var beigeSphere = GEO.createSphere(1, 30, beige);
    var beigeEar = GEO.createCylinder(1, 1, 20, beige);
    var darkBeigeEllipticParaboloid = GEO.createEllipticParaboloid(1.0, 2.0, 20, darkBeige);
    var darkBeigeCylinder = GEO.createCylinder(1.0, 2.0, 20, darkBeige);
    var darkBeigeHyperboloid = GEO.createHyperboloidOneSheet(0.5, 5, 20, [darkBeige[0]*0.5, darkBeige[1]*0.5, darkBeige[2]*0.5]);
    var darkJeansCylinder = GEO.createCylinder(1.0, 2.0, 20, jeans);
    var darkJeansSphere = GEO.createSphere(1, 20, jeans);
    var darkBeigeSphere = GEO.createSphere(1, 20, darkBeige);
    var blackMouth = GEO.combineLines(
        [0, 0, 0],
        GEO.createCurve([3, 3.5, -0.8, 0, 3, -0.4, -3, 3.5, -0.8], 30, 2),
        GEO.createCurve([3, 3, -0.8, 0, 2.5, -0.4, -3, 3, -0.8], 30, 2)
    );

    // Custom Curve
    let tmp1 = [
        -0.45, 0.5, 0.45, 
        -0.65, 0.6, 0.3, 
        -0.6, 0.8, -0.5, 
        0, 1.1, -0.7, 
        0.6, 0.8, -0.5, 
        0.65, 0.6, 0.3, 
        0.45, 0.5, 0.45];
    let tmp2 = [
        -0.45, -0.5, 0.45, 
        -0.65, 0.3, 0.3,
        -0.6, -0.8, -0.5, 
        0, -0.0, -0.7, 
        0.6, -0.8, -0.5, 
        0.65, 0.3, 0.3, 
        0.45, -0.8, 0.45];
    let tmp3 = [], tmp4 = [];
    for (let i = 0; i < tmp1.length; i++) {
        tmp3.push(tmp1[i]*0.9);
        tmp4.push(tmp2[i]*0.9);
    }
    var orangeHair = GEO.combineLines(
        orange,
        GEO.createCurve(tmp1, 30, 2),
        GEO.createCurve(tmp2, 30, 2),
        GEO.createCurve(tmp4, 30, 2),
        GEO.createCurve(tmp3, 30, 2)
    );
    var orangeSphere = GEO.createSphere(1, 20, orange);
    var orangeCylinder = GEO.createCylinder(1, 1, 20, orange);
    var glassSphere = GEO.createSphere(1, 20, [0, 0, 0]);
    var glass = GEO.combineLines(
        [0, 0, 0],
        GEO.createCurve([
            1.0, 7.5, -0.25,
            1.2, 1.0, -0.25,
            2.5, 1.0, -0.25,
            9.0, 1.0, -0.25,
            10.0, 7.5, -0.25,
            10.0, 8.0, -0.25,
            1.0, 8.0, -0.25,
            1.0, 6.5, -0.25,
            1.0, 6.5, -0.25]
            , 30, 2),
        GEO.createCurve([
            2.0, 7.0, -0.25,
            2.0, 2.0, -0.25,
            3.0, 2.0, -0.25,
            8.5, 2.0, -0.25,
            9.0, 7.0, -0.25,
            9.0, 7.0, -0.25,
            1.5, 7.0, -0.25,
            1.5, 6.0, -0.25,
            1.5, 6.0, -0.25]
            , 30, 2),
        GEO.createCurve([
            2.0, 7.0, 0.25,
            2.0, 2.0, 0.25,
            3.0, 2.0, 0.25,
            8.5, 2.0, 0.25,
            9.0, 7.0, 0.25,
            9.0, 7.0, 0.25,
            1.5, 7.0, 0.25,
            1.5, 6.0, 0.25,
            1.5, 6.0, 0.25]
            , 30, 2),
        GEO.createCurve([
            1.0, 7.5, 0.25,
            1.2, 1.0, 0.25,
            2.5, 1.0, 0.25,
            9.0, 1.0, 0.25,
            10.0, 7.5, 0.25,
            10.0, 8.0, 0.25,
            1.0, 8.0, 0.25,
            1.0, 6.5, 0.25,
            1.0, 6.5, 0.25]
            , 30, 2),
    );
    var glassHandle = GEO.combineLines(
        [0, 0, 0],
        GEO.createCurve([
            0.0, 0.0, -0.25,
            1.0, 1.5, -0.25,
            5.0, 1.5, -0.25,
            6.0, 1.2, -0.25,
            7.0, 0.6, -0.25,
            7.0, 1.0, -0.25
            ]
        , 30, 2),
        GEO.createCurve([
            0.0, 2.0, -0.25,
            5.0, 2.0, -0.25,
            5.5, 1.8, -0.25,
            6.0, 1.6, -0.25
            ]
        , 30, 2),
        GEO.createCurve([
            0.0, 2.0, 0.25,
            5.0, 2.0, 0.25,
            5.5, 1.8, 0.25,
            6.0, 1.6, 0.25
            ]
        , 30, 2),
        GEO.createCurve([
            0.0, 0.0, 0.25,
            1.0, 1.5, 0.25,
            5.0, 1.5, 0.25,
            6.0, 1.2, 0.25,
            7.0, 0.6, 0.25,
            7.0, 1.0, 0.25
            ]
        , 30, 2),
    );

    var greenBox = GEO.createBox(1, 1, 1, green);
    var greenCylinder = GEO.createCylinder(1, 1, 30, green);
    var greenSphere = GEO.createSphere(1, 30, green);
    var darkRedSphere = GEO.createSphere(1, 10, darkRed);
    var darkBeigePizza = GEO.combineLines(
        darkBeige, 
        GEO.createCurve([
            0, 2.0, 1,
            7, 1.8, 0.4,
            10, 0.0, 0,
            10, 0.0, 0
        ], 20, 2), 
        GEO.createCurve([
            0, 3.0, 1,
            7, 2.6, 0.4,
            10.5, 0.0, 0,
            10, 0.0, 0
        ], 20, 2), 
        GEO.createCurve([
            0, 3.0, -1,
            7, 2.6, -0.4,
            10.5, 0.0, 0,
            10, 0.0, 0
        ], 20, 2), 
        GEO.createCurve([
            0, 2.0, -1,
            7, 1.8, -0.4,
            10, 0.0, 0,
            10, 0.0, 0
        ], 20, 2)
    );
// 0.25, ~, 0.5
    //objects
    var main = new Object3D(beigeCylinder.vertices, beigeCylinder.faces);
    main.setLocalScale(1, 1, 1);
    main.setLocalTranslation(0, 0, 0);
    main.setLocalRotation(0, 0, 0);

    var body = new Object3D(darkBeigeEllipticParaboloid.vertices, darkBeigeEllipticParaboloid.faces);
    body.setLocalScale(7, 6, 7);
    body.setLocalTranslation(0, 14, 0);
    main.addChild(body);

    var stomach = new Object3D(darkBeigeSphere.vertices, darkBeigeSphere.faces);
    stomach.setLocalScale(8.5, 5, 8.5);
    stomach.setLocalTranslation(0, -4.5, 0);
    body.addChild(stomach);

    var neck = new Object3D(darkBeigeCylinder.vertices, darkBeigeCylinder.faces);
    neck.setLocalScale(3.5, 1, 3.5);
    neck.setLocalTranslation(0, 11, 0);
    body.addChild(neck);
    
    var neck2 = new Object3D(darkBeigeHyperboloid.vertices, darkBeigeHyperboloid.faces);
    neck2.setLocalScale(3.5, 0.7, 3.5);
    neck2.setLocalTranslation(0, 5, 0);
    neck.addChild(neck2);

    var head = new Object3D(beigeCylinder.vertices, beigeCylinder.faces);
    head.setLocalScale(3, 4, 3);
    head.setLocalTranslation(0, 16, 0);
    body.addChild(head);

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
    mouth.setLocalTranslation(0, 13, 3.3)
    head.addChild(mouth);

    var cheeks1 = new Object3D(beigeSphere.vertices, beigeSphere.faces);
    cheeks1.setLocalScale(0.5, 0.5, 0.5);
    cheeks1.setLocalTranslation(-1.8, 14.9, 2);
    head.addChild(cheeks1);

    var cheeks2 = new Object3D(beigeSphere.vertices, beigeSphere.faces);
    cheeks2.setLocalScale(0.5, 0.5, 0.5);
    cheeks2.setLocalTranslation(1.8, 14.9, 2);
    head.addChild(cheeks2);

    var ear1 = new Object3D(beigeEar.vertices, beigeEar.faces);
    ear1.setLocalScale(1.2, 1.4, 1.2);
    ear1.setLocalTranslation(3, 19.6, 0);
    ear1.setLocalRotation(1.5708, 0, 0);
    head.addChild(ear1);

    var ear2 = new Object3D(beigeEar.vertices, beigeEar.faces);
    ear2.setLocalScale(1.2, 1.4, 1.2);
    ear2.setLocalTranslation(-3, 19.6, 0);
    ear2.setLocalRotation(1.5708, 0, 0);
    head.addChild(ear2);

    var hair = new Object3D(orangeHair.vertices, orangeHair.faces);
    hair.setLocalScale(5, 5, 5)
    hair.setLocalTranslation(0, 19, 0);
    hair.setLocalRotation(0, 0, 0);
    head.addChild(hair);
    
    var glasses = new Object3D(glassSphere.vertices, glassSphere.faces);
    glasses.setLocalScale(0.4, 0.2, 0.2)
    glasses.setLocalTranslation(0, 20.9, 3);
    head.addChild(glasses);

    var glassesRight = new Object3D(glass.vertices, glass.faces);
    glassesRight.setLocalScale(0.35, 0.3, 0.35)
    glassesRight.setLocalTranslation(-3.6, 19, 3);
    glassesRight.setLocalRotation(0, 0, 0);
    glasses.addChild(glassesRight);

    var glassesLeft = new Object3D(glass.vertices, glass.faces);
    glassesLeft.setLocalScale(0.35, 0.3, 0.35);
    glassesLeft.setLocalTranslation(3.6, 19, 3);
    glassesLeft.setLocalRotation(0, 3.14, 0);
    glasses.addChild(glassesLeft);

    var glassesRightHandle = new Object3D(glassHandle.vertices, glassHandle.faces);
    glassesRightHandle.setLocalScale(0.7, 0.7, 1);
    glassesRightHandle.setLocalTranslation(-3.1, 19.8, 3);
    glassesRightHandle.setLocalRotation(0, 3.14/2, 0);
    glasses.addChild(glassesRightHandle);

    var glassesLeftHandle = new Object3D(glassHandle.vertices, glassHandle.faces);
    glassesLeftHandle.setLocalScale(0.7, 0.7, 1);
    glassesLeftHandle.setLocalTranslation(3.1, 19.8, 3);
    glassesLeftHandle.setLocalRotation(0, 3.14/2, 0);
    glasses.addChild(glassesLeftHandle);

    var armLeft = new Object3D(darkBeigeSphere.vertices, darkBeigeSphere.faces);
    armLeft.setLocalScale(2.8, 2.8, 2.8)
    armLeft.setLocalTranslation(4, 8, 0);
    body.addChild(armLeft);

    var armLeftUpper = new Object3D(darkBeigeCylinder.vertices, darkBeigeCylinder.faces);
    armLeftUpper.setLocalScale(2.5, 4.5, 2.5);
    armLeftUpper.setLocalTranslation(8, 8, 0);
    armLeftUpper.setLocalRotation(0, 0, 3.14/2);
    armLeft.addChild(armLeftUpper);

    var armLeft2 = new Object3D(darkBeigeSphere.vertices, darkBeigeSphere.faces);
    armLeft2.setLocalScale(2.5, 2.5, 2.5)
    armLeft2.setLocalTranslation(12, 8, 0);
    armLeft.addChild(armLeft2);

    var armLeftLower = new Object3D(darkBeigeCylinder.vertices, darkBeigeCylinder.faces);
    armLeftLower.setLocalScale(2.4, 4.5, 2.4)
    armLeftLower.setLocalTranslation(16, 8, 0);
    armLeftLower.setLocalRotation(0, 0, 3.14/2);
    armLeft2.addChild(armLeftLower);

    var handLeft1 = new Object3D(beigeSphere.vertices, beigeSphere.faces);
    handLeft1.setLocalScale(2.2, 4, 2.2)
    handLeft1.setLocalTranslation(21, 8, 0);
    handLeft1.setLocalRotation(0, 0, -0.2-3.14/2);
    armLeft2.addChild(handLeft1);

    var handLeft2 = new Object3D(beigeSphere.vertices, beigeSphere.faces);
    handLeft2.setLocalScale(1.1, 3, 1.1)
    handLeft2.setLocalTranslation(20, 9, 0);
    handLeft2.setLocalRotation(0, 0, 0.5-3.14/2);
    handLeft1.addChild(handLeft2);

    var armRight = new Object3D(darkBeigeSphere.vertices, darkBeigeSphere.faces);
    armRight.setLocalScale(2.8, 2.8, 2.8)
    armRight.setLocalTranslation(-4, 8, 0);
    body.addChild(armRight);

    var armRightUpper = new Object3D(darkBeigeCylinder.vertices, darkBeigeCylinder.faces);
    armRightUpper.setLocalScale(2.5, 4.5, 2.5);
    armRightUpper.setLocalTranslation(-8, 8, 0);
    armRightUpper.setLocalRotation(0, 0, 3.14/2);
    armRight.addChild(armRightUpper);

    var armRight2 = new Object3D(darkBeigeSphere.vertices, darkBeigeSphere.faces);
    armRight2.setLocalScale(2.5, 2.5, 2.5)
    armRight2.setLocalTranslation(-12, 8, 0);
    armRight.addChild(armRight2);

    var armRightLower = new Object3D(darkBeigeCylinder.vertices, darkBeigeCylinder.faces);
    armRightLower.setLocalScale(2.4, 4.5, 2.4)
    armRightLower.setLocalTranslation(-16, 8, 0);
    armRightLower.setLocalRotation(0, 0, 3.14/2);
    armRight2.addChild(armRightLower);

    var handRight1 = new Object3D(beigeSphere.vertices, beigeSphere.faces);
    handRight1.setLocalScale(2.2, 4, 2.2)
    handRight1.setLocalTranslation(-21, 8, 0);
    handRight1.setLocalRotation(0, 0, 0.2+3.14/2);
    armRight2.addChild(handRight1);

    var handRight2 = new Object3D(beigeSphere.vertices, beigeSphere.faces);
    handRight2.setLocalScale(1.1, 3, 1.1)
    handRight2.setLocalTranslation(-20, 9, 0);
    handRight2.setLocalRotation(0, 0, -0.5+3.14/2);
    handRight1.addChild(handRight2);
    
    var left_leg = new Object3D(darkJeansSphere.vertices, darkJeansSphere.faces);
    left_leg.setLocalScale(1, 1, 1);
    left_leg.setLocalTranslation(4, -4, 0);
    body.addChild(left_leg);

    var left_leg_upper = new Object3D(darkJeansCylinder.vertices, darkJeansCylinder.faces);
    left_leg_upper.setLocalScale(2.6, 5, 2.6);
    left_leg_upper.setLocalTranslation(4, -10, 0);
    left_leg.addChild(left_leg_upper);

    var left_leg_upper2 = new Object3D(darkJeansSphere.vertices, darkJeansSphere.faces);
    left_leg_upper2.setLocalScale(3, 6, 3);
    left_leg_upper2.setLocalTranslation(4.7, -9, 0);
    left_leg_upper2.setLocalRotation(0, 0, -0.117);
    left_leg.addChild(left_leg_upper2);
    
    var left_leg_joint = new Object3D(darkJeansSphere.vertices, darkJeansSphere.faces);
    left_leg_joint.setLocalScale(2.5, 2.5, 2.5);
    left_leg_joint.setLocalTranslation(4, -15, 0);
    left_leg.addChild(left_leg_joint);

    var left_leg_lower = new Object3D(darkJeansCylinder.vertices, darkJeansCylinder.faces);
    left_leg_lower.setLocalScale(2.6, 4, 2.6);
    left_leg_lower.setLocalTranslation(4, -18, 0);
    left_leg_joint.addChild(left_leg_lower);

    var left_shoe = new Object3D(orangeSphere.vertices, orangeSphere.faces);
    left_shoe.setLocalScale(3.5, 3.5, 3.5);
    left_shoe.setLocalTranslation(4, -20, 3);
    left_leg_joint.addChild(left_shoe);

    var left_shoe2 = new Object3D(orangeCylinder.vertices, orangeCylinder.faces);
    left_shoe2.setLocalScale(3.5, 5.5, 3.5);
    left_shoe2.setLocalTranslation(4, -20, 0.5);
    left_shoe2.setLocalRotation(1.571, 0, 0);
    left_leg_joint.addChild(left_shoe2);
    
    var right_leg = new Object3D(darkJeansSphere.vertices, darkJeansSphere.faces);
    right_leg.setLocalScale(1, 1, 1);
    right_leg.setLocalTranslation(-4, -4, 0);
    body.addChild(right_leg);

    var right_leg_upper = new Object3D(darkJeansCylinder.vertices, darkJeansCylinder.faces);
    right_leg_upper.setLocalScale(2.6, 5, 2.6);
    right_leg_upper.setLocalTranslation(-4, -10, 0);
    right_leg.addChild(right_leg_upper);

    var right_leg_upper2 = new Object3D(darkJeansSphere.vertices, darkJeansSphere.faces);
    right_leg_upper2.setLocalScale(3, 6, 3);
    right_leg_upper2.setLocalTranslation(-4.7, -9, 0);
    right_leg_upper2.setLocalRotation(0, 0, 0.117);
    right_leg.addChild(right_leg_upper2);
    
    var right_leg_joint = new Object3D(darkJeansSphere.vertices, darkJeansSphere.faces);
    right_leg_joint.setLocalScale(2.5, 2.5, 2.5);
    right_leg_joint.setLocalTranslation(-4, -15, 0);
    right_leg.addChild(right_leg_joint);

    var right_leg_lower = new Object3D(darkJeansCylinder.vertices, darkJeansCylinder.faces);
    right_leg_lower.setLocalScale(2.6, 4, 2.6);
    right_leg_lower.setLocalTranslation(-4, -18, 0);
    right_leg_joint.addChild(right_leg_lower);

    var right_shoe = new Object3D(orangeSphere.vertices, orangeSphere.faces);
    right_shoe.setLocalScale(3.5, 3.5, 3.5);
    right_shoe.setLocalTranslation(-4, -20, 3);
    right_leg_joint.addChild(right_shoe);

    var right_shoe2 = new Object3D(orangeCylinder.vertices, orangeCylinder.faces);
    right_shoe2.setLocalScale(3.5, 5.5, 3.5);
    right_shoe2.setLocalTranslation(-4, -20, 0.5);
    right_shoe2.setLocalRotation(1.571, 0, 0);
    right_leg_joint.addChild(right_shoe2);

    var sofa = new Object3D(greenSphere.vertices, greenSphere.faces);
    sofa.setLocalScale(10, 5, 8);
    sofa.setLocalTranslation(0, -13, 0);
    main.addChild(sofa);

    var sofaLowerCushion1 = new Object3D(greenCylinder.vertices, greenCylinder.faces);
    sofaLowerCushion1.setLocalScale(4, 24, 4);
    sofaLowerCushion1.setLocalTranslation(0, -20, 8);
    sofaLowerCushion1.setLocalRotation(0, 0, 3.14/2);
    sofa.addChild(sofaLowerCushion1);
    
    var sofaLowerCushion2 = new Object3D(greenCylinder.vertices, greenCylinder.faces);
    sofaLowerCushion2.setLocalScale(4, 24, 4);
    sofaLowerCushion2.setLocalTranslation(0, -20, -8);
    sofaLowerCushion2.setLocalRotation(0, 0, 3.14/2);
    sofa.addChild(sofaLowerCushion2);
    
    var sofaLowerCushion3 = new Object3D(greenBox.vertices, greenBox.faces);
    sofaLowerCushion3.setLocalScale(7.8, 24, 17);
    sofaLowerCushion3.setLocalTranslation(0, -20, 0);
    sofaLowerCushion3.setLocalRotation(0, 0, 3.14/2);
    sofa.addChild(sofaLowerCushion3);
    
    var sofaUpperCushion1 = new Object3D(greenCylinder.vertices, greenCylinder.faces);
    sofaUpperCushion1.setLocalScale(4, 24, 4);
    sofaUpperCushion1.setLocalTranslation(0, -15, 8);
    sofaUpperCushion1.setLocalRotation(0, 0, 3.14/2);
    sofa.addChild(sofaUpperCushion1);
    
    var sofaUpperCushion2 = new Object3D(greenCylinder.vertices, greenCylinder.faces);
    sofaUpperCushion2.setLocalScale(4, 24, 4);
    sofaUpperCushion2.setLocalTranslation(0, -15, -8);
    sofaUpperCushion2.setLocalRotation(0, 0, 3.14/2);
    sofa.addChild(sofaUpperCushion2);
    
    var sofaUpperCushion3 = new Object3D(greenBox.vertices, greenBox.faces);
    sofaUpperCushion3.setLocalScale(7.8, 24, 17);
    sofaUpperCushion3.setLocalTranslation(0, -15, 0);
    sofaUpperCushion3.setLocalRotation(0, 0, 3.14/2);
    sofa.addChild(sofaUpperCushion3);
    
    var sofaLeft1 = new Object3D(greenBox.vertices, greenBox.faces);
    sofaLeft1.setLocalScale(6, 20, 17);
    sofaLeft1.setLocalTranslation(9.005, -15, 0);
    sofaLeft1.setLocalRotation(0, 0, 0);
    sofa.addChild(sofaLeft1);
    
    var sofaLeft2 = new Object3D(greenCylinder.vertices, greenCylinder.faces);
    sofaLeft2.setLocalScale(4, 17, 4);
    sofaLeft2.setLocalTranslation(9.89, -6, 0);
    sofaLeft2.setLocalRotation(3.14/2, 0, 0);
    sofa.addChild(sofaLeft2);
    
    var sofaRight1 = new Object3D(greenBox.vertices, greenBox.faces);
    sofaRight1.setLocalScale(6, 20, 17);
    sofaRight1.setLocalTranslation(-9.005, -15, 0);
    sofaRight1.setLocalRotation(0, 0, 0);
    sofa.addChild(sofaRight1);
    
    var sofaRight2 = new Object3D(greenCylinder.vertices, greenCylinder.faces);
    sofaRight2.setLocalScale(4, 17, 4);
    sofaRight2.setLocalTranslation(-9.89, -6, 0);
    sofaRight2.setLocalRotation(3.14/2, 0, 0);
    sofa.addChild(sofaRight2);
    
    var sofaBackCushion1 = new Object3D(greenBox.vertices, greenBox.faces);
    sofaBackCushion1.setLocalScale(7, 24, 24);
    sofaBackCushion1.setLocalTranslation(0, -10, -10);
    sofaBackCushion1.setLocalRotation(0, 3.14/2, 0);
    sofa.addChild(sofaBackCushion1);
    
    var sofaBackCushion2 = new Object3D(greenCylinder.vertices, greenCylinder.faces);
    sofaBackCushion2.setLocalScale(3.51, 24, 3.51);
    sofaBackCushion2.setLocalTranslation(0, 2, -10);
    sofaBackCushion2.setLocalRotation(0, 0, 3.14/2);
    sofa.addChild(sofaBackCushion2);

    var pizza = new Object3D(darkBeigePizza.vertices, darkBeigePizza.faces);
    pizza.setLocalScale(1, 1, 4.2)
    pizza.setLocalTranslation(-21, 12.5, 0);
    pizza.setLocalRotation(0, 0, 0);
    handRight1.addChild(pizza);

    var pizzaEdge = new Object3D(orangeSphere.vertices, orangeSphere.faces);
    pizzaEdge.setLocalScale(1, 1, 5)
    pizzaEdge.setLocalTranslation(-21, 15, 0);
    pizzaEdge.setLocalRotation(0, 0, 0);
    pizza.addChild(pizzaEdge);

    var pizzaPepperoni1 = new Object3D(darkRedSphere.vertices, darkRedSphere.faces);
    pizzaPepperoni1.setLocalScale(1.5, 0.2, 1.5)
    pizzaPepperoni1.setLocalTranslation(-20, 15.5, -1.5);
    pizzaPepperoni1.setLocalRotation(0, 0, 0);
    pizza.addChild(pizzaPepperoni1);

    var pizzaPepperoni2 = new Object3D(darkRedSphere.vertices, darkRedSphere.faces);
    pizzaPepperoni2.setLocalScale(1.5, 0.2, 1.5)
    pizzaPepperoni2.setLocalTranslation(-15, 14.8, -0.5);
    pizzaPepperoni2.setLocalRotation(0, 0, -0.2);
    pizza.addChild(pizzaPepperoni2);

    var pizzaPepperoni3 = new Object3D(darkRedSphere.vertices, darkRedSphere.faces);
    pizzaPepperoni3.setLocalScale(1.5, 0.2, 1.5)
    pizzaPepperoni3.setLocalTranslation(-18, 15.3, 1.5);
    pizzaPepperoni3.setLocalRotation(0, 0, -0.08);
    pizza.addChild(pizzaPepperoni3);

    return {
        main: main,
        body: body,
        head: head,
        leftShoulder: armLeft,
        leftElbow: armLeft2,
        rightShoulder: armRight,
        rightElbow: armRight2,
        leftHand: handLeft1,
        rightHand: handRight1,
        leftLeg: left_leg,
        leftKnee: left_leg_joint,
        rightLeg: right_leg,
        rightKnee: right_leg_joint,
        sofa: sofa,
        pizza: pizza
    };
}