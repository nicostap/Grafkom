import type { AbstractAnimation } from "../animation";
import type { Object3D } from "../object";
import * as glMatrix from "gl-matrix";

export abstract class ObjectComponent {
  public readonly animations: AbstractAnimation[] = [];
  public abstract readonly root: Object3D;
  public components: Object3D[] = [];

  public offsetLocalTranslate(x: number, y: number, z: number) {
    const addedMatrix = glMatrix.mat4.create();
    glMatrix.mat4.fromTranslation(addedMatrix, [x, y, z]);

    this.components.forEach((component) => {
      const sumMatrix = glMatrix.mat4.create();
      glMatrix.mat4.add(sumMatrix, component.INIT_TRANSMATRIX, addedMatrix);

      component.setLocalTranslation(
        sumMatrix[12],
        sumMatrix[13],
        sumMatrix[14]
      );
    });
  }
}
