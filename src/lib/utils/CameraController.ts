import { AppState, mode } from "./State";

export class CameraController {
  AMORTIZATION = 0.01;
  dX = 0;
  dY = 0;
  drag = false;

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

    window.addEventListener(
      "keydown",
      (e) => {
        this.keyPressed[e.key] = true;
      },
      { signal: this.abort.signal }
    );

    window.addEventListener(
      "keyup",
      (e) => {
        this.keyPressed[e.key] = false;
      },
      { signal: this.abort.signal }
    );
  }

  public unhookEvents() {
    this.abort.abort();
  }

  public tick() {
    if (!this.drag) {
      (this.dX *= this.AMORTIZATION), (this.dY *= this.AMORTIZATION);
      (this.state.THETA += this.dX), (this.state.PHI += this.dY);
    }

    // Camera control
    if (this.state.cameraMode == "FPS") {
      if (this.keyPressed["w"] || this.keyPressed["W"]) {
        this.state.cameraZ += Math.cos(this.state.THETA) * 0.6;
        this.state.cameraX += -Math.sin(this.state.THETA) * 0.6;
      }
      if (this.keyPressed["a"] || this.keyPressed["A"]) {
        this.state.cameraZ += Math.cos(this.state.THETA - Math.PI / 2) * 0.6;
        this.state.cameraX += -Math.sin(this.state.THETA - Math.PI / 2) * 0.6;
      }
      if (this.keyPressed["s"] || this.keyPressed["S"]) {
        this.state.cameraZ += -Math.cos(this.state.THETA) * 0.6;
        this.state.cameraX += Math.sin(this.state.THETA) * 0.6;
      }
      if (this.keyPressed["d"] || this.keyPressed["D"]) {
        this.state.cameraZ += Math.cos(this.state.THETA + Math.PI / 2) * 0.6;
        this.state.cameraX += -Math.sin(this.state.THETA + Math.PI / 2) * 0.6;
      }
      if (this.keyPressed["e"] || this.keyPressed["E"])
        this.state.cameraY -= 1.5;
      if (this.keyPressed["q"] || this.keyPressed["Q"])
        this.state.cameraY += 1.5;
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
