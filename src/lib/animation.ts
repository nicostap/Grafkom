import { GEO } from "./geometry";
import type { Object3D } from "./object";

export abstract class AbstractAnimation {
  abstract start: number;
  abstract end: number;
  abstract run(time: number, dt: number): void;
}

export class TranslationAnimation extends AbstractAnimation {
  constructor(
    public object: Object3D,
    public start: number,
    public end: number,
    public x: number,
    public y: number,
    public z: number
  ) {
    super();
  }

  run(time: number, dt: number) {
    if (time > this.start && time < this.end) {
      var div = dt / (this.end - this.start);
      this.object.translate(this.x * div, this.y * div, this.z * div);
    }
  }
}

export class RotationAnimation extends AbstractAnimation {
  public ax: number;
  public ay: number;
  public az: number;
  constructor(
    public object: Object3D,
    public start: number,
    public end: number,
    ax: number,
    ay: number,
    az: number
  ) {
    super();
    this.ax = GEO.rad(ax);
    this.ay = GEO.rad(ay);
    this.az = GEO.rad(az);
  }

  run(time: number, dt: number) {
    if (time > this.start && time < this.end) {
      var div = dt / (this.end - this.start);
      this.object.rotate(this.ax * div, this.ay * div, this.az * div);
    }
  }
}

export class ScaleAnimation extends AbstractAnimation {
  curr_x = 1.0;
  curr_y = 1.0;
  curr_z = 1.0;

  constructor(
    public object: Object3D,
    public start: number,
    public end: number,
    public kx: number,
    public ky: number,
    public kz: number
  ) {
    super();
  }

  run(time: number, dt: number) {
    if (time > this.start && time < this.end) {
      var div = dt / (this.end - this.start);
      this.object.scale(1 / this.curr_x, 1 / this.curr_y, 1 / this.curr_z);
      this.curr_x += (this.kx - 1.0) * div;
      this.curr_y += (this.ky - 1.0) * div;
      this.curr_z += (this.kz - 1.0) * div;
      this.object.scale(this.curr_x, this.curr_y, this.curr_z);
    }
  }
}

export class ArbitraryAxisRotationAnimation extends AbstractAnimation {
  // Parameters
  public theta: number;

  constructor(
    public object: Object3D,
    public start: number,
    public end: number,
    public m1: number,
    public m2: number,
    public m3: number,
    theta: number
  ) {
    super();
    this.theta = GEO.rad(theta);
  }

  run(time: number, dt: number) {
    if (time > this.start && time < this.end) {
      var div = dt / (this.end - this.start);
      this.object.rotateArbitraryAxis(
        this.m1,
        this.m2,
        this.m3,
        this.theta * div
      );
    }
  }
}

export class AnimationList extends AbstractAnimation {
  // Parameter
  start = 99999999999;
  end = 0;

  constructor(public animations: AbstractAnimation[], public isLoop: boolean) {
    super();
    for (let i = 0; i < this.animations.length; i++) {
      this.start = Math.min(this.start, this.animations[i].start);
      this.end = Math.max(this.end, this.animations[i].end);
    }
  }

  run(time: number, dt: number) {
    if (time > this.start && time < this.end) {
      for (let animation of this.animations) {
        animation.run(time, dt);
      }
    }
    if (time > this.end && this.isLoop) {
      let duration = this.end - this.start + 2 * dt;
      this.start += duration;
      this.end += duration;
      for (let i = 0; i < this.animations.length; i++) {
        const animation = this.animations[i];
        animation.start += duration;
        animation.end += duration;

        if (animation instanceof ScaleAnimation) {
          animation.curr_x = 1.0;
          animation.curr_y = 1.0;
          animation.curr_z = 1.0;
        }
      }
    }
  }

  multiplySpeed(x: number) {
    this.end = 0;
    for (let i = 0; i < this.animations.length; i++) {
      let offset = this.start * (1 - x);
      this.animations[i].start *= x;
      this.animations[i].end *= x;
      this.animations[i].start += offset;
      this.animations[i].end += offset;
      this.end = Math.max(this.end, this.animations[i].end);
    }
  }
}
