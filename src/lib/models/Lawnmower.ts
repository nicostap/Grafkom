import * as glMatrix from "gl-matrix";
import {
  AbstractAnimation,
  AnimationList,
  RotationAnimation,
} from "../animation";
import { GEO } from "../geometry";
import { Object3D } from "../object";
import { Color } from "../utils/Color";
import { ObjectComponent } from "../utils/ObjectComponent";
import { SteeringWheel } from "./BitzerComponents/SteeringWheel";
import { Bitzer } from "./Bitzer";

export class Lawnmower extends ObjectComponent {
  public readonly animations: AbstractAnimation[] = [];
  public readonly root: Object3D;
  public readonly smokeRoot: Object3D;
  public readonly spawnerLoop: number;

  private colors = {
    case: Color.fromHex("3dac4e"),
    caseSecondary: Color.fromHex("161714"),
    tires: Color.fromHex("000000"),
    wheelCaps: Color.fromHex("ffe24c"),
    chair: Color.fromHex("ffd308"),
    exhaust: Color.fromHex("9fa4a8"),
    smoke: Color.fromHex("2e3038"),
  } as const;

  constructor() {
    super();
    const chairBox = GEO.createBox(1, 1, 1, this.colors.chair);
    const caseBox = GEO.createBox(1, 1, 1, this.colors.case);
    const caseSecondaryBox = GEO.createBox(1, 1, 1, this.colors.caseSecondary);

    const chairSeat = new Object3D(chairBox.vertices, chairBox.faces);
    chairSeat.setLocalScale(15, 1, 10);
    chairSeat.setLocalTranslation(0, 0, 0);
    this.root = chairSeat;
    this.components.push(chairSeat);

    const chairSeatSecondary = new Object3D(
      caseSecondaryBox.vertices,
      caseSecondaryBox.faces
    );
    chairSeatSecondary.setLocalScale(15, 1, 11);
    chairSeatSecondary.setLocalTranslation(0, -1, -0.5);
    chairSeat.addChild(chairSeatSecondary);
    this.components.push(chairSeatSecondary);

    const chairBack = new Object3D(chairBox.vertices, chairBox.faces);
    chairBack.setLocalScale(15, 10, 1);
    chairBack.setLocalTranslation(0, 4.5, -5.75);
    chairBack.setLocalRotation(-Math.PI / 12, 0, 0);
    chairSeat.addChild(chairBack);
    this.components.push(chairBack);

    const chairBackSecondary = new Object3D(
      caseSecondaryBox.vertices,
      caseSecondaryBox.faces
    );
    chairBackSecondary.setLocalScale(15, 10.5, 1);
    chairBackSecondary.setLocalTranslation(0, 4, -6.65);
    chairBackSecondary.setLocalRotation(-Math.PI / 12, 0, 0);
    chairSeat.addChild(chairBackSecondary);
    this.components.push(chairBackSecondary);

    const chairSeatBase = new Object3D(caseBox.vertices, caseBox.faces);
    chairSeatBase.setLocalScale(15, 6, 10);
    chairSeatBase.setLocalTranslation(0, -4.5, -1);
    chairSeat.addChild(chairSeatBase);
    this.components.push(chairSeatBase);

    const lawnmowerBase = new Object3D(caseBox.vertices, caseBox.faces);
    lawnmowerBase.setLocalScale(15, 1, 36);
    lawnmowerBase.setLocalTranslation(0, -8, 12);
    chairSeat.addChild(lawnmowerBase);
    this.components.push(lawnmowerBase);

    const lawnmowerEngine = new Object3D(caseBox.vertices, caseBox.faces);
    lawnmowerEngine.setLocalScale(15, 15, 12.5);
    lawnmowerEngine.setLocalTranslation(0, 0, 23.75);
    lawnmowerBase.addChild(lawnmowerEngine);
    this.components.push(lawnmowerEngine);

    const lawnmowerUpperEngine = new Object3D(caseBox.vertices, caseBox.faces);
    lawnmowerUpperEngine.setLocalScale(15, 8, 15);
    lawnmowerUpperEngine.setLocalTranslation(0, 4, 20);
    lawnmowerUpperEngine.setLocalRotation(Math.PI / 12, 0, 0);
    lawnmowerBase.addChild(lawnmowerUpperEngine);
    this.components.push(lawnmowerUpperEngine);

    const rotationMarkerPrism = GEO.createCylinder(
      1,
      1,
      32,
      this.colors.exhaust
    );

    ["fr", "fl", "br", "bl"].forEach((pos) => {
      const facingMultiplier = pos === "fr" || pos === "br" ? 1 : -1;
      const xOffset = 7;
      const zOffset = pos === "fr" || pos === "fl" ? 25 : 0;

      const tire = new Object3D(
        GEO.createCylinder(1, 1, 32, this.colors.tires).vertices,
        GEO.createCylinder(1, 1, 32, this.colors.tires).faces
      );
      tire.setLocalScale(2.75, 2, 2.75);
      tire.setLocalTranslation(facingMultiplier * xOffset, -11.5, zOffset);
      tire.setLocalRotation(0, 0, (facingMultiplier * Math.PI) / 2);
      lawnmowerBase.addChild(tire);
      this.components.push(tire);

      const wheelCap = new Object3D(
        GEO.createCylinder(1, 1, 32, this.colors.wheelCaps).vertices,
        GEO.createCylinder(1, 1, 32, this.colors.wheelCaps).faces
      );
      wheelCap.setLocalScale(1.5, 2, 1.5);
      wheelCap.setLocalTranslation(
        facingMultiplier * xOffset + facingMultiplier * 0.1,
        -11.5,
        zOffset
      );
      wheelCap.setLocalRotation(0, 0, (facingMultiplier * Math.PI) / 2);
      lawnmowerBase.addChild(wheelCap);
      this.components.push(wheelCap);

      const rotationMarker = new Object3D(
        rotationMarkerPrism.vertices,
        rotationMarkerPrism.faces
      );

      rotationMarker.setLocalScale(0.2, 2, 0.2);
      rotationMarker.setLocalTranslation(
        facingMultiplier * xOffset + facingMultiplier * 0.1,
        -11.5,
        zOffset + 2
      );
      rotationMarker.setLocalRotation(0, 0, (facingMultiplier * Math.PI) / 2);
      tire.addChild(rotationMarker);
      this.components.push(rotationMarker);

      // create animations
      this.animations.push(
        new AnimationList(
          [new RotationAnimation(tire, 0, 2000, 360, 0, 0)],
          true
        )
      );
    });

    const steeringWheel = new SteeringWheel();
    this.animations.push(...steeringWheel.animations);

    const steeringWheelObj = steeringWheel.root;
    steeringWheel.offsetLocalTranslate(0, -1, 2);
    lawnmowerUpperEngine.addChild(steeringWheelObj);

    const exhaustGeometry = GEO.createCylinder(1, 1, 32, this.colors.exhaust);
    const exhaust = new Object3D(
      exhaustGeometry.vertices,
      exhaustGeometry.faces
    );
    exhaust.setLocalScale(0.75, 2, 0.75);
    exhaust.setLocalTranslation(5, -7, -6);
    exhaust.setLocalRotation(Math.PI / 2, 0, 0);
    lawnmowerBase.addChild(exhaust);
    this.components.push(exhaust);

    const bitzer = new Bitzer();
    this.animations.push(...bitzer.animations);
    // bitzer.root.scale(0.9, 0.9, 0.9);
    bitzer.root.translate(0, 10, 0);
    // bitzer.offsetLocalTranslate(0, 14, 0);

    chairSeatBase.addChild(bitzer.root);

    const smokeSphere = GEO.createSphere(1, 10, this.colors.smoke);

    const smokeRoot = new Object3D([], []);
    this.smokeRoot = smokeRoot;
    const activeSmokes: Object3D[] = [];

    // const smokes = Array.from({ length: 1 }, (_, i) => {
    //   const smoke = new Object3D(smokeSphere.vertices, smokeSphere.faces);
    //   smoke.setLocalScale(0.5, 0.5, 0.5);
    //   smoke.setLocalTranslation(5, -7, -6);
    //   smoke.setLocalRotation(Math.PI / 2, 0, 0);
    //   this.smokeRoot.addChild(smoke);
    //   return smoke;
    // });

    this.spawnerLoop = setInterval(() => {
      // max 5 smokes
      if (activeSmokes.length >= 5) {
        const smoke = activeSmokes.shift();
        this.smokeRoot.child = this.smokeRoot.child.filter(
          (child) => child !== smoke
        );
      }

      // const x =

      // create new smoke
      const newSmoke = new Object3D(smokeSphere.vertices, smokeSphere.faces);
      newSmoke.setLocalScale(0.7, 0.7, 0.7);
      const x =
        exhaust.MOVEMATRIX[12] + -Math.sin(lawnmowerBase.rotation.y) * 1;
      const y = exhaust.MOVEMATRIX[13];
      const z =
        exhaust.MOVEMATRIX[14] + -Math.cos(lawnmowerBase.rotation.y) * 1;

      newSmoke.translate(x, y, z);
      newSmoke.setLocalRotation(Math.PI / 2, 0, 0);
      this.smokeRoot.addChild(newSmoke);
      activeSmokes.push(newSmoke);
    }, 200);

    this.animations.push(
      new (class extends AbstractAnimation {
        start: number;
        end: number;
        constructor() {
          super();
          this.start = 0;
          this.end = 99999999999;
        }
        public run(time: number, dt: number) {
          activeSmokes.forEach((smoke) => {
            smoke.translate(0, dt * 0.02, 0);
            smoke.scale(1.01, 1.01, 1.01);
          });
        }
      })()
    );

    // Motion
    let pivotRotation = 35;
    let bodyRotation = 20;
    var motions = new AnimationList(
      [
        new RotationAnimation(this.root, 0, 4000, 0, 90, 0),
        new RotationAnimation(this.root, 4000, 12000, 0, 0, 0),
      ],
      true,
      2000
    );
    motions.multiplySpeed(0.29);
    this.animations.push(motions);
  }

  public destroy() {
    clearInterval(this.spawnerLoop);
  }
}
