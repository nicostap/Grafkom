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
    accent1: Color.fromHex("3394c1"),
    wristband: Color.fromHex("ece2cc"),
    whistle: Color.fromHex("90897d"),
  } as const;

  constructor() {
    const skinEP = GEO.createEllipticParaboloid(1.0, 2.0, 20, this.colors.skin);
    const skinSphere = GEO.createSphere(1.0, 20, this.colors.skin);
    const skinCylinder = GEO.createCylinder(1, 2, 40, this.colors.skin);
    this.root = new Object3D(skinCylinder.vertices, skinCylinder.faces);
    this.root.setLocalScale(0, 0, 0);
    this.root.setLocalTranslation(0, 0, 0);
    this.root.setLocalRotation(0, 0, 0);

    const stomach = new Object3D(skinEP.vertices, skinEP.faces);
    stomach.setLocalScale(6, 6, 4);
    stomach.setLocalTranslation(0, 10, 0);
    stomach.setLocalRotation(0, 0, 0);
    this.root.addChild(stomach, 0, 0, 0);

    const butt = new Object3D(skinSphere.vertices, skinSphere.faces);
    butt.setLocalScale(7, 4, 5);
    butt.setLocalTranslation(0, -9.5, 0);
    butt.setLocalRotation(0, 0, 0);
    stomach.addChild(butt, 0, 0, 0);
  }
}
