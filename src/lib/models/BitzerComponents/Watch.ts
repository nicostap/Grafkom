import * as glMatrix from "gl-matrix";
import type { AbstractAnimation } from "../../animation";
import { GEO } from "../../geometry";
import { Object3D } from "../../object";
import { Color } from "../../utils/Color";
import { ObjectComponent } from "../../utils/ObjectComponent";

export class Watch extends ObjectComponent {
  public readonly animations: AbstractAnimation[] = [];
  public readonly root: Object3D;

  private colors = {
    band: Color.fromHex("342a14"),
    clock: Color.fromHex("ffffff"),
  } as const;

  constructor() {
    super();
    const bandCyl = GEO.createCylinder(1, 1, 32, this.colors.band);
    const clockCyl = GEO.createCylinder(1, 1, 32, this.colors.clock);

    const band = new Object3D(bandCyl.vertices, bandCyl.faces);
    band.setLocalScale(1.6, 1, 1.6);
    band.setLocalTranslation(0, 0, 0);
    band.setLocalRotation(0, 0, Math.PI / 2);
    this.root = band;

    console.log("band init_transmatrix", band.INIT_TRANSMATRIX);

    const clock = new Object3D(clockCyl.vertices, clockCyl.faces);
    clock.setLocalScale(0.5, 0.1, 0.5);
    clock.setLocalTranslation(0, 1.6, 0);
    band.addChild(clock);

    this.components.push(band, clock);
  }
}
