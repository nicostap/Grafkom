import {
  AnimationList,
  ArbitraryAxisRotationAnimation,
  RotationAnimation,
  type AbstractAnimation,
} from "../animation";
import { GEO } from "../geometry";
import { Object3D } from "../object";
import { Color } from "../utils/Color";
import { ObjectComponent } from "../utils/ObjectComponent";
import { Watch } from "./BitzerComponents/Watch";
import { Whistle } from "./BitzerComponents/Whistle";
import { Wristband } from "./BitzerComponents/Wristband";

export class Bitzer extends ObjectComponent {
  public readonly animations: AbstractAnimation[] = [];
  public readonly root: Object3D;

  private colors = {
    skin: Color.fromHex("ffcd5b"),
    nose: Color.fromHex("5b574d"),
    collar: Color.fromHex("20170d"),
    accent1: Color.fromHex("3394c1"),
    wristband: Color.fromHex("ece2cc"),
    ears: Color.fromHex("5d3c1c"),

    eyes: Color.fromHex("ffffff"),
    retina: Color.fromHex("000000"),
  } as const;

  constructor() {
    super();
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
    this.components.push(this.root);

    const stomach = new Object3D(skinStomach.vertices, skinStomach.faces);
    stomach.setLocalScale(5.5, 6, 4);
    stomach.setLocalTranslation(0, 10, 0);
    stomach.setLocalRotation(0, 0, 0);
    this.root.addChild(stomach, 0, 0, 0);
    this.components.push(stomach);

    const butt = new Object3D(skinSphere.vertices, skinSphere.faces);
    butt.setLocalScale(6.8, 3, 4.9);
    butt.setLocalTranslation(0, -9, 0);
    butt.setLocalRotation(0, 0, 0);
    stomach.addChild(butt, 0, 0, 0);
    this.components.push(butt);

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
        crus.setLocalScale(2, 5, 2);
        crus.setLocalTranslation(offset, -21, 0);
        crus.setLocalRotation(0, 0, 0);
        knee.addChild(crus);
        this.components.push(femur, knee, crus);

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

    const neckAttachment = new Object3D(skinSphere.vertices, skinSphere.faces);
    neckAttachment.setLocalScale(3.5, 1.25, 2.5);
    neckAttachment.setLocalTranslation(0, 5, 0);
    neckAttachment.setLocalRotation(0, 0, 0);
    stomach.addChild(neckAttachment);

    const collar = new Object3D(collarCylinder.vertices, collarCylinder.faces);
    collar.setLocalScale(2.5, 1, 2.5);
    collar.setLocalTranslation(0, 6.25, 0);
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

    this.components.push(
      neckAttachment,
      collar,
      neck,
      head,
      cheeks,
      nose,
      noseTip,
      forehead
    );

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

    const hatCover = new Object3D(
      accent1EllipticParaboloid.vertices,
      accent1EllipticParaboloid.faces
    );
    hatCover.setLocalScale(2.225, 1.5, 2.225);
    hatCover.setLocalTranslation(0, 17.5, 0);
    hatCover.setLocalRotation(0, 0, 0);
    hatBase.addChild(hatCover);

    const hatTop = new Object3D(accent1Sphere.vertices, accent1Sphere.faces);
    hatTop.setLocalScale(0.5, 0.25, 0.5);
    hatTop.setLocalTranslation(0, 17.25, 0);
    hatTop.setLocalRotation(0, 0, 0);
    hatCover.addChild(hatTop);

    this.components.push(hatBase, hatCover, hatTop);

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
        this.components.push(eye, retina);

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

        this.components.push(shoulder, armJoint, arm, elbow, forearm, hand);

        return [
          side,
          {
            shoulder,
            armJoint,
            arm,
            elbow,
            forearm,
            hand,
          },
        ];
      })
    ) as any;

    const redBox = GEO.createBox(1, 1, 1, Color.fromHex("ff0000"));
    const redCard = new Object3D(redBox.vertices, redBox.faces);
    redCard.setLocalScale(3, 2, 0.1);
    redCard.setLocalTranslation(-20, 4, 0.5);
    redCard.setLocalRotation(0, 0, Math.PI / 6);
    arms.left.hand.addChild(redCard);

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

    const whistle = new Whistle();
    whistle.root.scale(2, 1.5, 1.5);
    whistle.offsetLocalTranslate(0, 5.25, 2.5);
    cheeks.addChild(whistle.root);

    const watch = new Watch();
    watch.offsetLocalTranslate(15, 3.8, 0);
    arms.right.forearm.addChild(watch.root);

    const wristband = new Wristband();
    wristband.offsetLocalTranslate(-15, 3.8, 0);
    arms.left.forearm.addChild(wristband.root);

    arms.left.armJoint.rotate(0, Math.PI / 4, -Math.PI / 6);
    arms.right.armJoint.rotate(0, -Math.PI / 3, -Math.PI / 4);

    arms.left.elbow.rotate(0, 0, -Math.PI / 3);
    arms.right.elbow.rotate(0, -Math.PI / 4, Math.PI / 12);

    legs.left.femur.rotate(-Math.PI / 2, 0, 0);
    legs.right.femur.rotate(-Math.PI / 2, 0, 0);

    legs.left.knee.rotate((Math.PI * 2) / 6, 0, 0);
    legs.right.knee.rotate((Math.PI * 2) / 6, 0, 0);

    this.components.push(
      ...whistle.components,
      ...watch.components,
      ...wristband.components
    );

    // Animate the left arm to wave
    this.animations.push(
      new AnimationList(
        [
          new RotationAnimation(arms.left.armJoint, 0, 400, 20, 10, 20),
          new RotationAnimation(arms.left.armJoint, 400, 1000, -20, -10, -20),
          new RotationAnimation(arms.left.elbow, 0, 400, 0, 0, -20),
          new RotationAnimation(arms.left.elbow, 400, 1000, 0, 0, 20),
        ],
        true
      )
    );

    // Make feet less dead
    this.animations.push(
      new AnimationList(
        [
          new RotationAnimation(legs.left.knee, 0, 500, 5, 0, 0),
          new RotationAnimation(legs.left.knee, 800, 1300, -5, 0, 0),
        ],
        true
      ),
      new AnimationList(
        [
          new RotationAnimation(legs.right.knee, 0, 500, 5, 0, 0),
          new RotationAnimation(legs.right.knee, 800, 1300, -5, 0, 0),
        ],
        true,
        100
      )
    );

    // Add ears
    const earGeometry = GEO.combineLines(
      this.colors.ears,
      GEO.createCurve(
        [-1.9, 0, 0, -2.62, -3, -3.36, 1.75, 4, -4.43, 3.31, 5, -1],
        50,
        3
      ),
      GEO.createCurve(
        [-1.9, 0, 0, -2.62, -3, 3.36, 1.75, 4, 4.43, 3.31, 5, 1],
        50,
        3
      ),
      GEO.createCurve(
        [-2.9, 0, 0, -2.62, 0, 3.36, 1.75, 9, 4.43, 3.31, 6, 1],
        50,
        3
      ),
      GEO.createCurve(
        [-2.9, 0, 0, -2.62, 0, -3.36, 1.75, 9, -4.43, 3.31, 6, -1.9],
        50,
        3
      )
    );

    const earRotation = 10;
    const rotationAxis = [-4, 11.5, 0] as const;

    const leftEar = new Object3D(earGeometry.vertices, earGeometry.faces);
    leftEar.setLocalScale(0.5, 0.25, 0.5);
    leftEar.setLocalTranslation(-2.5, 11.5, 0);
    leftEar.setLocalRotation(0, 0, Math.PI / 5);

    head.addChild(leftEar, -2, 13.5, 0);
    this.components.push(leftEar);
    this.animations.push(
      new AnimationList(
        [
          new ArbitraryAxisRotationAnimation(
            leftEar,
            0,
            400,
            0,
            0,
            Math.sin(GEO.rad(90)),
            earRotation
          ),
          new ArbitraryAxisRotationAnimation(
            leftEar,
            400,
            800,
            0,
            0,
            Math.sin(GEO.rad(90)),
            -earRotation
          ),
        ],
        true
      )
    );

    const rightEar = new Object3D(earGeometry.vertices, earGeometry.faces);
    rightEar.setLocalScale(0.5, 0.25, 0.5);
    rightEar.setLocalTranslation(2.5, 11.5, 0);
    rightEar.setLocalRotation(0, Math.PI, Math.PI / 5);
    head.addChild(rightEar, 2, 13.5, 0);
    this.components.push(rightEar);

    this.animations.push(
      new AnimationList(
        [
          new ArbitraryAxisRotationAnimation(
            rightEar,
            0,
            400,
            0,
            0,
            Math.sin(GEO.rad(90)),
            -earRotation
          ),
          new ArbitraryAxisRotationAnimation(
            rightEar,
            400,
            800,
            0,
            0,
            Math.sin(GEO.rad(90)),
            earRotation
          ),
        ],
        true
      )
    );
  }
}
