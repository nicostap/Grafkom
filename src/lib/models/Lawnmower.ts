import * as glMatrix from "gl-matrix";
import type { AbstractAnimation } from "../animation";
import { GEO } from "../geometry";
import { Object3D } from "../object";
import { Color } from "../utils/Color";
import { ObjectComponent } from "../utils/ObjectComponent";

export class Lawnmower extends ObjectComponent {
  public readonly animations: AbstractAnimation[] = [];
  public readonly root: Object3D;

  private colors = {
    case: Color.fromHex("3dac4e"),
    caseSecondary: Color.fromHex("161714"),
    tires: Color.fromHex("000000"),
    wheelCaps: Color.fromHex("ffe24c"),
    chair: Color.fromHex("ffd308"),
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
    });
  }
}
