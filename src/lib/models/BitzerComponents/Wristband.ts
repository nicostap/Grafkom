import type { AbstractAnimation } from "../../animation";
import { GEO } from "../../geometry";
import { Object3D } from "../../object";
import { Color } from "../../utils/Color";
import { ObjectComponent } from "../../utils/ObjectComponent";

export class Wristband extends ObjectComponent {
  public readonly animations: AbstractAnimation[] = [];
  public readonly root: Object3D;

  private colors = {
    band: Color.fromHex("baae96"),
    accent: Color.fromHex("3f858f"),
  } as const;

  constructor() {
    super();
    const bandCyl = GEO.createCylinder(1, 1, 32, this.colors.band);
    const accentCyl = GEO.createCylinder(1, 1, 32, this.colors.accent);

    const band = new Object3D(bandCyl.vertices, bandCyl.faces);
    band.setLocalScale(1.6, 2, 1.6);
    band.setLocalTranslation(0, 0, 0);
    band.setLocalRotation(0, 0, Math.PI / 2);
    this.root = band;

    const accent1 = new Object3D(accentCyl.vertices, accentCyl.faces);
    accent1.setLocalScale(1.605, 0.25, 1.605);
    accent1.setLocalTranslation(0.25, 0, 0);
    accent1.setLocalRotation(0, 0, Math.PI / 2);
    band.addChild(accent1);

    const accent2 = new Object3D(accentCyl.vertices, accentCyl.faces);
    accent2.setLocalScale(1.605, 0.25, 1.605);
    accent2.setLocalTranslation(-0.25, 0, 0);
    accent2.setLocalRotation(0, 0, Math.PI / 2);
    band.addChild(accent2);

    this.components.push(band, accent1, accent2);
  }
}
