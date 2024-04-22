import { GEO } from "../geometry";
import { Object3D } from "../object";

export function createCharacter_3() {

    //shapes and color
    var beigeCylinder = GEO.createCylinder(1.0, 2.0, 20, [228/255, 179/255, 121/255]);
    var beigeSphere = GEO.createSphere(1, 20, [228/255, 179/255, 121/255]);
    var darkBeigeEllipticParaboloid = GEO.createEllipticParaboloid(1.0, 2.0, 20, [214/255, 177/255, 91/255]);
    var darkBeigeCylinder = GEO.createCylinder(1.0, 2.0, 20, [214/255, 177/255, 91/255]);
    var darkJeansCylinder = GEO.createCylinder(1.0, 2.0, 20, [56/255, 73/255, 75/255]);

    //objects
    var main = new Object3D(beigeCylinder.vertices, beigeCylinder.faces);
    main.setLocalScale(1, 1, 1);
    main.setLocalTranslation(0, 0, 0);

    var body = new Object3D(darkBeigeEllipticParaboloid.vertices, darkBeigeEllipticParaboloid.faces);
    body.setLocalScale(7, 7, 7);
    body.setLocalTranslation(0, 14, 0);
    main.addChild(body);

    var neck = new Object3D(darkBeigeCylinder.vertices, darkBeigeCylinder.faces);
    neck.setLocalScale(3.5, 1, 3.5);
    neck.setLocalTranslation(0, 11, 0);
    main.addChild(neck);

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
    nose_2.setLocalTranslation(0, 18, 3.75);
    head.addChild(nose_2);

    var left_leg = new Object3D(darkJeansCylinder.vertices, darkJeansCylinder.faces);
    left_leg.setLocalScale(2.6, 7, 2.6);
    left_leg.setLocalTranslation(4, -14, 0);
    main.addChild(left_leg);

    var right_leg = new Object3D(darkJeansCylinder.vertices, darkJeansCylinder.faces);
    right_leg.setLocalScale(2.6, 7, 2.6);
    right_leg.setLocalTranslation(-4, -14, 0);
    main.addChild(right_leg);

    return {
        main: main,
    };
}