import type { AbstractAnimation } from "../../animation";
import { GEO } from "../../geometry";
import { Object3D } from "../../object";
import { Color } from "../../utils/Color";
import { ObjectComponent } from "../../utils/ObjectComponent";

export class Whistle extends ObjectComponent {
  public readonly animations: AbstractAnimation[] = [];
  public readonly root: Object3D;

  private colors = {
    whistle: Color.fromHex("90897d"),
  } as const;

  constructor() {
    super();
    const cyl = GEO.createCylinder(1, 1, 32, this.colors.whistle);
    const box = GEO.createBox(1, 1, 1, this.colors.whistle);

    const whistleBase = new Object3D(cyl.vertices, cyl.faces);
    whistleBase.setLocalScale(0.5, 0.5, 0.5);
    whistleBase.setLocalTranslation(0, 0, 0);
    whistleBase.setLocalRotation(0, 0, Math.PI / 2);
    this.root = whistleBase;

    const whistlePipe = new Object3D(box.vertices, box.faces);
    whistlePipe.setLocalScale(0.5, 0.325, 1.25);
    whistlePipe.setLocalTranslation(0, 0.325, -0.55);
    whistleBase.addChild(whistlePipe);

    this.components.push(whistleBase, whistlePipe);
  }
}
