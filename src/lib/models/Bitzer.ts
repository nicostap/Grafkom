import type { AbstractAnimation } from "../animation";
import { GEO } from "../geometry";
import { Object3D } from "../object";
import { Color } from "../utils/Color";

export class Bitzer {
  public readonly animations: AbstractAnimation[] = [];
  public readonly root: Object3D;

  private colors = {
    skin: Color.fromHex("ffcd5b"),
    nose: Color.fromHex("5b574d"),
    collar: Color.fromHex("20170d"),
    accent1: Color.fromHex("3394c1"),
    wristband: Color.fromHex("ece2cc"),
    whistle: Color.fromHex("90897d"),

    eyes: Color.fromHex("ffffff"),
    retina: Color.fromHex("000000"),
  } as const;

  constructor() {
    const skinStomach = GEO.createEllipticParaboloid(
      1.0,
      2.0,
      20,
      this.colors.skin,
      undefined,
      0.4
    );

    const skinSphere = GEO.createSphere(1.0, 40, this.colors.skin);
    const skinCylinder = GEO.createCylinder(1, 2, 40, this.colors.skin);

    const collarCylinder = GEO.createCylinder(1, 1, 40, this.colors.collar);

    this.root = new Object3D(skinCylinder.vertices, skinCylinder.faces);
    this.root.setLocalScale(0, 0, 0);
    this.root.setLocalTranslation(0, 0, 0);
    this.root.setLocalRotation(0, 0, 0);

    const stomach = new Object3D(skinStomach.vertices, skinStomach.faces);
    stomach.setLocalScale(5.5, 6, 4);
    stomach.setLocalTranslation(0, 10, 0);
    stomach.setLocalRotation(0, 0, 0);
    this.root.addChild(stomach, 0, 0, 0);

    const butt = new Object3D(skinSphere.vertices, skinSphere.faces);
    butt.setLocalScale(6.8, 3, 4.9);
    butt.setLocalTranslation(0, -9, 0);
    butt.setLocalRotation(0, 0, 0);
    stomach.addChild(butt, 0, 0, 0);

    const legs: Record<
      "left" | "right",
      { femur: Object3D; knee: Object3D; crus: Object3D }
    > = Object.fromEntries(
      ["left", "right"].map((side) => {
        const offset = side === "left" ? -2 : 2;

        const femur = new Object3D(skinCylinder.vertices, skinCylinder.faces);
        femur.setLocalScale(2, 2.5, 2);
        femur.setLocalTranslation(offset, -13, 0);
        femur.setLocalRotation(0, 0, 0);
        butt.addChild(femur, offset, -9, 0);

        const knee = new Object3D(skinSphere.vertices, skinSphere.faces);
        knee.setLocalScale(2, 2, 2);
        knee.setLocalTranslation(offset, -16, 0);
        // leftKnee.translate(0, -16, 0);
        knee.setLocalRotation(0, 0, 0);
        femur.addChild(knee);

        const crus = new Object3D(skinCylinder.vertices, skinCylinder.faces);
        crus.setLocalScale(2, 4, 2);
        crus.setLocalTranslation(offset, -20, 0);
        crus.setLocalRotation(0, 0, 0);
        knee.addChild(crus);

        return [
          side,
          {
            femur,
            knee,
            crus,
          },
        ];
      })
    ) as any;

    legs.left.femur.rotate(0.25, 0, 0);
    legs.right.femur.rotate(-0.25, 0, 0);

    legs.left.knee.rotate(-0.25, 0, 0);
    legs.right.knee.rotate(0.25, 0, 0);

    const neckAttachment = new Object3D(skinSphere.vertices, skinSphere.faces);
    neckAttachment.setLocalScale(3.5, 1.25, 2.5);
    neckAttachment.setLocalTranslation(0, 5, 0);
    neckAttachment.setLocalRotation(0, 0, 0);
    stomach.addChild(neckAttachment);

    const collar = new Object3D(collarCylinder.vertices, collarCylinder.faces);
    collar.setLocalScale(2.5, 1, 2.5);
    collar.setLocalTranslation(0, 6.5, 0);
    collar.setLocalRotation(0, 0, 0);
    stomach.addChild(collar);

    const neck = new Object3D(skinCylinder.vertices, skinCylinder.faces);
    neck.setLocalScale(2, 1, 2);
    neck.setLocalTranslation(0, 6.5, 0);
    neck.setLocalRotation(0, 0, 0);
    neckAttachment.addChild(neck);

    const head = new Object3D(skinCylinder.vertices, skinCylinder.faces);
    head.setLocalScale(2.5, 3.5, 2.5);
    head.setLocalTranslation(0, 11, 0);
    head.setLocalRotation(0, 0, 0);
    neck.addChild(head);

    const cheeks = new Object3D(skinSphere.vertices, skinSphere.faces);
    cheeks.setLocalScale(3.25, 2, 2.5);
    cheeks.setLocalTranslation(0, 8.5, 0.25);
    cheeks.setLocalRotation(0, 0, 0);
    head.addChild(cheeks);

    const nose = new Object3D(skinCylinder.vertices, skinCylinder.faces);
    nose.setLocalScale(2, 1.25, 1.5);
    nose.setLocalTranslation(0, 10.5, 2);
    nose.setLocalRotation(Math.PI / 2, 0, 0);
    head.addChild(nose);

    const noseSphere = GEO.createSphere(1.25, 40, this.colors.nose);

    const noseTip = new Object3D(noseSphere.vertices, noseSphere.faces);
    noseTip.setLocalScale(1.6, 1.25, 1.25);
    noseTip.setLocalTranslation(0, 10.5, 3.5);
    noseTip.setLocalRotation(0, 0, 0);
    nose.addChild(noseTip);

    const forehead = new Object3D(skinSphere.vertices, skinSphere.faces);
    forehead.setLocalScale(2.25, 1, 2.25);
    forehead.setLocalTranslation(0, 14, 0.75);
    forehead.setLocalRotation(-Math.PI / 16, 0, 0);
    head.addChild(forehead);

    const accent1Sphere = GEO.createSphere(1.25, 40, this.colors.accent1);
    const accent1EllipticParaboloid = GEO.createEllipticParaboloid(
      1,
      1,
      100,
      this.colors.accent1
    );

    const hatBase = new Object3D(accent1Sphere.vertices, accent1Sphere.faces);
    hatBase.setLocalScale(2.25, 0.75, 2.25);
    hatBase.setLocalTranslation(0, 15, 0);
    hatBase.setLocalRotation(0, 0, 0);
    head.addChild(hatBase);

    const hatTop = new Object3D(
      accent1EllipticParaboloid.vertices,
      accent1EllipticParaboloid.faces
    );
    hatTop.setLocalScale(2.225, 1.5, 2.225);
    hatTop.setLocalTranslation(0, 17.5, 0);
    hatTop.setLocalRotation(0, 0, 0);
    hatBase.addChild(hatTop);

    const eyeSphere = GEO.createSphere(1, 40, this.colors.eyes);
    const retinaSphere = GEO.createSphere(0.3, 40, this.colors.retina);

    const eyes: Record<
      "left" | "right",
      {
        eye: Object3D;
        retina: Object3D;
      }
    > = Object.fromEntries(
      ["left", "right"].map((side) => {
        const offset = side === "left" ? -0.5 : 0.5;

        const eye = new Object3D(eyeSphere.vertices, eyeSphere.faces);
        eye.setLocalScale(0.55, 0.55, 0.55);
        eye.setLocalTranslation(offset, 13.5, 2);
        eye.setLocalRotation(0, 0, 0);
        head.addChild(eye);

        const retinaOffset = side === "left" ? -0.55 : 0.55;

        const retina = new Object3D(retinaSphere.vertices, retinaSphere.faces);
        retina.setLocalScale(0.5, 0.5, 0.1);
        retina.setLocalTranslation(retinaOffset, 13.5, 2.55);
        retina.setLocalRotation(0, 0, 0);
        head.addChild(retina);

        return [side, { eye, retina }];
      })
    ) as any;

    const arms: Record<
      "left" | "right",
      {
        shoulder: Object3D;
        armJoint: Object3D;
        arm: Object3D;
        elbow: Object3D;
        forearm: Object3D;
        hand: Object3D;
      }
    > = Object.fromEntries(
      ["left", "right"].map((side) => {
        const sideMult = side === "left" ? -1 : 1;

        const shoulder = new Object3D(
          skinCylinder.vertices,
          skinCylinder.faces
        );
        shoulder.setLocalScale(1.5, 1.5, 1.5);
        shoulder.setLocalTranslation(sideMult * 3, 3.5, 0);
        shoulder.setLocalRotation(
          0,
          0,
          Math.PI / 2 + (Math.PI * sideMult) / 16
        );
        stomach.addChild(shoulder);

        const armJoint = new Object3D(skinSphere.vertices, skinSphere.faces);
        armJoint.setLocalScale(1.5, 1.5, 1.5);
        armJoint.setLocalTranslation(sideMult * 4.5, 3.8, 0);
        armJoint.setLocalRotation(0, 0, 0);
        shoulder.addChild(armJoint);

        const arm = new Object3D(skinCylinder.vertices, skinCylinder.faces);
        arm.setLocalScale(1.5, 2, 1.5);
        arm.setLocalTranslation(sideMult * 6.5, 3.8, 0);
        arm.setLocalRotation(0, 0, (sideMult * Math.PI) / 2);
        armJoint.addChild(arm);

        const elbow = new Object3D(skinSphere.vertices, skinSphere.faces);
        elbow.setLocalScale(1.5, 1.5, 1.5);
        elbow.setLocalTranslation(sideMult * 8.75, 3.8, 0);
        elbow.setLocalRotation(0, 0, 0);
        arm.addChild(elbow);

        const forearm = new Object3D(skinCylinder.vertices, skinCylinder.faces);
        forearm.setLocalScale(1.5, 4.5, 1.5);
        forearm.setLocalTranslation(sideMult * 13, 3.8, 0);
        forearm.setLocalRotation(0, 0, (sideMult * Math.PI) / 2);
        elbow.addChild(forearm);

        const hand = new Object3D(skinSphere.vertices, skinSphere.faces);
        hand.setLocalScale(1.25, 1.5, 1.5);
        hand.setLocalTranslation(sideMult * 17.5, 3.8, 0);
        hand.setLocalRotation(0, 0, 0);
        forearm.addChild(hand);

        return [
          side,
          {
            shoulder,
            armJoint,
            arm,
            elbow,
            forearm,
          },
        ];
      })
    ) as any;

    arms.left.shoulder.rotate(0, Math.PI / 6, Math.PI / 4);
    arms.right.shoulder.rotate(0, 0, -Math.PI / 4);

    arms.left.elbow.rotate(0, (Math.PI * 5) / 6, -Math.PI / 16);
    // arms.right.elbow.rotate(Math.PI / 4, 0, Math.PI / 16);

    const whistle2DCurveArray = [
      -0.640625, 0.25520833333333337, 0.20833333333333326, 0.25520833333333337,
      0.3828125, 0.203125, 0.46614583333333326, 0.1015625, 0.4921875,
      -0.03385416666666674, 0.47135416666666674, -0.1328125,
      0.39322916666666674, -0.22916666666666674, 0.27864583333333326,
      -0.29166666666666674, 0.14322916666666674, -0.296875, 0.03645833333333326,
      -0.23697916666666674, -0.03385416666666663, -0.171875,
      -0.16145833333333337, -0.01822916666666674, -0.328125,
      0.07291666666666663, -0.4765625, 0.10677083333333337, -0.640625, 0.125,
      -0.640625, 0.125, -0.640625, 0.25520833333333337, -0.640625,
      0.25520833333333337, -0.640625, 0.25520833333333337,
    ];

    const whistleCurveWith = 0.5;
    // Turn into 3D
    const whistle3DCurveArray1: number[] = [];
    const whistle3DCurveArray2: number[] = [];
    for (let i = 0; i < whistle2DCurveArray.length; i += 2) {
      whistle3DCurveArray1.push(
        whistle2DCurveArray[i],
        whistle2DCurveArray[i + 1],
        whistleCurveWith
      );

      whistle3DCurveArray2.push(
        whistle2DCurveArray[i],
        whistle2DCurveArray[i + 1],
        -whistleCurveWith
      );
    }

    const whistleGeometry = GEO.combineLines(
      this.colors.whistle,
      GEO.createCurve(whistle3DCurveArray1, 30, 2),
      GEO.createCurve(whistle3DCurveArray2, 30, 2)
    );

    const whistle = new Object3D(
      whistleGeometry.vertices,
      whistleGeometry.faces
    );

    whistle.setLocalScale(2, 2, 0.75);
    whistle.setLocalTranslation(0, 20, 0);
    whistle.setLocalRotation(0, 0, 0);
    arms.right.forearm.addChild(whistle);
  }
}
