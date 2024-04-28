import { AppState, mode } from "./State";

export class CameraController {
  AMORTIZATION = 0.95;
  MOVE_SPEED = 0.02;

  dX = 0;
  dY = 0;
  drag = false;

  dxTranslate = 0;
  dyTranslate = 0;
  dzTranslate = 0;

  xPrev: number = 0;
  yPrev: number = 0;

  private abort = new AbortController();
  keyPressed: Record<string, boolean> = {};

  constructor(
    private canvas: HTMLCanvasElement,
    private readonly state: typeof AppState
  ) {
    this.hookEvents();
  }

  private hookEvents() {
    // Mouse events
    const mouseDown = (e: MouseEvent) => {
      this.drag = true;
      (this.xPrev = e.pageX), (this.yPrev = e.pageY);
      e.preventDefault();
      return false;
    };
    const mouseUp = () => {
      this.drag = false;
    };
    const mouseMove = (e: MouseEvent) => {
      if (!this.drag) return false;
      (this.dX = ((e.pageX - this.xPrev) * 2 * Math.PI) / this.canvas.width),
        (this.dY = ((e.pageY - this.yPrev) * 2 * Math.PI) / this.canvas.height);
      this.state.THETA += this.dX;
      this.state.PHI += this.dY;
      (this.xPrev = e.pageX), (this.yPrev = e.pageY);
      e.preventDefault();
    };
    const mouseScroll = (e: WheelEvent) => {
      const delta = Math.sign(e.deltaY);
      this.state.zoom -= 5 * delta;
      if (this.state.zoom <= -300) this.state.zoom = -300;
      if (this.state.zoom >= -100) this.state.zoom = -100;
    };

    this.canvas.addEventListener("mousedown", mouseDown, {
      signal: this.abort.signal,
    });
    this.canvas.addEventListener("mouseup", mouseUp, {
      signal: this.abort.signal,
    });
    this.canvas.addEventListener("mouseout", mouseUp, {
      signal: this.abort.signal,
    });
    this.canvas.addEventListener("mousemove", mouseMove, {
      signal: this.abort.signal,
    });
    this.canvas.addEventListener("wheel", mouseScroll, {
      signal: this.abort.signal,
    });

    const capture = ["w", "a", "s", "d", "e", "q", "shift"];

    window.addEventListener(
      "keydown",
      (e) => {
        const key = e.key.toLowerCase();
        if (capture.includes(key)) {
          e.preventDefault();
        }

        if (e.repeat) return;
        this.keyPressed[key] = true;
      },
      { signal: this.abort.signal }
    );

    window.addEventListener(
      "keyup",
      (e) => {
        const key = e.key.toLowerCase();
        if (capture.includes(key)) {
          e.preventDefault();
        }

        this.keyPressed[key] = false;
      },
      { signal: this.abort.signal }
    );
  }

  public unhookEvents() {
    this.abort.abort();
  }

  public tick(dt: number) {
    if (!this.drag) {
      (this.dX *= this.AMORTIZATION), (this.dY *= this.AMORTIZATION);
      (this.state.THETA += this.dX), (this.state.PHI += this.dY);
    }

    // Camera control
    if (this.state.cameraMode == "FPS") {
      const speedModifier = this.keyPressed["shift"] ? 1.25 : 0.5;

      let dxTarget = 0;
      let dyTarget = 0;
      let dzTarget = 0;

      if (this.keyPressed["w"]) {
        dzTarget += Math.cos(this.state.THETA) * 1.0 * speedModifier;
        dxTarget += -Math.sin(this.state.THETA) * 1.0 * speedModifier;
      }

      if (this.keyPressed["a"]) {
        dzTarget +=
          Math.cos(this.state.THETA - Math.PI / 2) * 1.0 * speedModifier;
        dxTarget +=
          -Math.sin(this.state.THETA - Math.PI / 2) * 1.0 * speedModifier;
      }

      if (this.keyPressed["s"]) {
        dzTarget += -Math.cos(this.state.THETA) * 1.0 * speedModifier;
        dxTarget += Math.sin(this.state.THETA) * 1.0 * speedModifier;
      }

      if (this.keyPressed["d"]) {
        dzTarget +=
          Math.cos(this.state.THETA + Math.PI / 2) * 1.0 * speedModifier;
        dxTarget +=
          -Math.sin(this.state.THETA + Math.PI / 2) * 1.0 * speedModifier;
      }

      if (this.keyPressed["e"]) dyTarget -= 1.5 * speedModifier;
      if (this.keyPressed["q"]) dyTarget += 1.5 * speedModifier;

      this.dxTranslate +=
        (dxTarget - this.dxTranslate) * (1 - Math.exp(dt * -this.MOVE_SPEED));
      this.dyTranslate +=
        (dyTarget - this.dyTranslate) * (1 - Math.exp(dt * -this.MOVE_SPEED));
      this.dzTranslate +=
        (dzTarget - this.dzTranslate) * (1 - Math.exp(dt * -this.MOVE_SPEED));

      // Apply change
      this.state.cameraX += this.dxTranslate;
      this.state.cameraY += this.dyTranslate;
      this.state.cameraZ += this.dzTranslate;
    }
  }
}

// Too lazy to turn this into a proper module
export function modeStationary() {
  AppState.cameraMode = mode.Stationary;
  AppState.THETA = 0;
  AppState.PHI = 0;
  AppState.zoom = -200;
}
export function modeFPS() {
  AppState.cameraMode = mode.FPS;
  AppState.THETA = 0;
  AppState.PHI = 0;
  (AppState.cameraX = 0), (AppState.cameraY = -20), (AppState.cameraZ = -300);
}
export function modeFollowShaun() {
  AppState.cameraMode = mode.Follow;
  AppState.THETA = 0;
  AppState.PHI = 0;
  AppState.zoom = -200;
}
