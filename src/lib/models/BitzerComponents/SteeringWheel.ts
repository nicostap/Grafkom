import * as glMatrix from "gl-matrix";
import type { AbstractAnimation } from "../../animation";
import { GEO } from "../../geometry";
import { Object3D } from "../../object";
import { Color } from "../../utils/Color";
import { ObjectComponent } from "../../utils/ObjectComponent";

export class SteeringWheel extends ObjectComponent {
  public readonly animations: AbstractAnimation[] = [];
  public readonly root: Object3D;

  private colors = {
    caseSecondary: Color.fromHex("161714"),
  } as const;

  constructor() {
    super();

    const circlePointCount = 40;
    const circleRadius = 5;
    const circlePoints = new Array(circlePointCount)
      .fill(0)
      .map((_, i) => {
        const angle = (i / (circlePointCount - 3)) * Math.PI * 2;
        return [
          Math.cos(angle) * circleRadius,
          Math.sin(angle) * circleRadius,
          0,
        ];
      })
      .flat();

    const steeringGeometry = GEO.createPipe(
      GEO.createCurve(circlePoints, 100, 2),
      1,
      8,
      this.colors.caseSecondary
    );

    const outerSteeringWheel = new Object3D(
      steeringGeometry.vertices,
      steeringGeometry.faces
    );

    outerSteeringWheel.setLocalScale(0.5, 0.5, 0.5);
    outerSteeringWheel.setLocalTranslation(0, 10, 10);
    outerSteeringWheel.setLocalRotation(Math.PI / 16, 0, Math.PI / 2);

    const caseSecondaryCylinder = GEO.createCylinder(
      1,
      1,
      32,
      this.colors.caseSecondary
    );

    const innerSteeringWheel = new Object3D(
      caseSecondaryCylinder.vertices,
      caseSecondaryCylinder.faces
    );
    this.components.push(outerSteeringWheel);

    innerSteeringWheel.setLocalScale(1, 1, 1);
    innerSteeringWheel.setLocalTranslation(0, 10, 10);
    innerSteeringWheel.setLocalRotation(Math.PI / 2 + Math.PI / 16, 0, 0);

    innerSteeringWheel.addChild(outerSteeringWheel);
    this.components.push(innerSteeringWheel);

    this.root = innerSteeringWheel;

    const innerSteeringCylinder = GEO.createCylinder(
      1,
      1,
      32,
      this.colors.caseSecondary
    );
    const innerSteeringWheelConnector1 = new Object3D(
      innerSteeringCylinder.vertices,
      innerSteeringCylinder.faces
    );
    innerSteeringWheelConnector1.setLocalScale(0.45, 2, 0.45);
    innerSteeringWheelConnector1.setLocalTranslation(1.25, 9.25, 9.9);
    innerSteeringWheelConnector1.setLocalRotation(
      Math.PI / 2 + Math.PI / 16,
      -Math.PI / 8,
      Math.PI / 2
    );
    innerSteeringWheel.addChild(innerSteeringWheelConnector1);
    this.components.push(innerSteeringWheelConnector1);

    const innerSteeringWheelConnector2 = new Object3D(
      innerSteeringCylinder.vertices,
      innerSteeringCylinder.faces
    );
    innerSteeringWheelConnector2.setLocalScale(0.45, 2, 0.5);
    innerSteeringWheelConnector2.setLocalTranslation(-1.25, 9.25, 9.9);
    innerSteeringWheelConnector2.setLocalRotation(
      Math.PI / 2 + Math.PI / 16,
      Math.PI / 8,
      Math.PI / 2
    );
    innerSteeringWheel.addChild(innerSteeringWheelConnector2);
    this.components.push(innerSteeringWheelConnector2);

    const steeringWheelEngineConnector = new Object3D(
      innerSteeringCylinder.vertices,
      innerSteeringCylinder.faces
    );

    steeringWheelEngineConnector.setLocalScale(0.5, 4, 0.5);
    steeringWheelEngineConnector.setLocalTranslation(0, 9.5, 12);
    steeringWheelEngineConnector.setLocalRotation(
      Math.PI / 2 + Math.PI / 12,
      0,
      0
    );
    innerSteeringWheel.addChild(steeringWheelEngineConnector);
    this.components.push(steeringWheelEngineConnector);

    const steeringWheel = new Object3D(
      GEO.createPipe(
        GEO.createCurve(circlePoints, 100, 2),
        1,
        8,
        this.colors.caseSecondary
      ).vertices,
      GEO.createPipe(
        GEO.createCurve(circlePoints, 100, 2),
        1,
        8,
        this.colors.caseSecondary
      ).faces
    );
    steeringWheel.setLocalScale(0.5, 0.5, 0.5);
    steeringWheel.setLocalTranslation(0, 10, 10);
    steeringWheel.setLocalRotation(Math.PI / 16, 0, Math.PI / 2);
    innerSteeringWheel.addChild(steeringWheel);
    this.components.push(steeringWheel);
  }
}
