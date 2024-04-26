import * as glMatrix from "gl-matrix";
import { GEO } from "./geometry";
import {
  AnimationList,
  ArbitraryAxisRotationAnimation,
  RotationAnimation,
  ScaleAnimation,
  TranslationAnimation,
  type AbstractAnimation,
} from "./animation";
import { createCharacter_1 } from "./models/character1";
import { createCharacter_3 } from "./models/character3";
import { createFloor } from "./models/world";
import { Object3D } from "./object";
import { writable } from "svelte/store";
import { DefaultShader } from "./shaders/default.shader";
import { calculateFPS, calculateTick } from "./utils/StatCounter";
import { AppState, mode } from "./utils/State";

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
  (AppState.cameraX = 0), (AppState.cameraY = -20), (AppState.cameraZ = -200);
}
export function modeFollowShaun() {
  AppState.cameraMode = mode.Follow;
  AppState.THETA = 0;
  AppState.PHI = 0;
  AppState.zoom = -200;
}

export function renderMain() {
  const CANVAS = document.getElementById("your_canvas");
  if (!(CANVAS instanceof HTMLCanvasElement)) {
    alert("Canvas not found");
    return false;
  }

  CANVAS.width = window.innerWidth;
  CANVAS.height = window.innerHeight;

  let GL: WebGLRenderingContext;

  try {
    const glCtx = CANVAS.getContext("webgl", { antialias: true });

    if (!glCtx) {
      alert("WebGL context cannot be initialized");
      return false;
    }

    GL = glCtx;
  } catch (e) {
    alert("WebGL context cannot be initialized");
    return false;
  }

  Object3D.GL = GL;
  Object3D.defaultShader = new DefaultShader(GL);

  // CAMERA CONTROL
  var AMORTIZATION = 0.95;
  var dX = 0,
    dY = 0;
  var drag = false;
  //var THETA = 0,
  //  PHI = 0;
  var x_prev: number, y_prev: number;
  var mouseDown = function (e: MouseEvent) {
    drag = true;
    (x_prev = e.pageX), (y_prev = e.pageY);
    e.preventDefault();
    return false;
  };
  var mouseUp = function () {
    drag = false;
  };
  var mouseMove = function (e: MouseEvent) {
    if (!drag) return false;
    (dX = ((e.pageX - x_prev) * 2 * Math.PI) / CANVAS.width),
      (dY = ((e.pageY - y_prev) * 2 * Math.PI) / CANVAS.height);
    AppState.THETA += dX;
    AppState.PHI += dY;
    (x_prev = e.pageX), (y_prev = e.pageY);
    e.preventDefault();
  };
  var mouseScroll = function (e: WheelEvent) {
    const delta = Math.sign(e.deltaY);
    AppState.zoom -= 3 * delta;
    if (AppState.zoom <= -200) AppState.zoom = -200;
    if (AppState.zoom >= -100) AppState.zoom = -100;
  };
  CANVAS.addEventListener("mousedown", mouseDown, false);
  CANVAS.addEventListener("mouseup", mouseUp, false);
  CANVAS.addEventListener("mouseout", mouseUp, false);
  CANVAS.addEventListener("mousemove", mouseMove, false);
  CANVAS.addEventListener("wheel", mouseScroll, false);

  var keyPressed: Record<string, boolean> = {};
  window.onkeydown = function (e) {
    keyPressed[e.key] = true;
  };
  window.onkeyup = function (e) {
    keyPressed[e.key] = false;
  };

  // MATRIX
  var PROJMATRIX = glMatrix.mat4.create();
  var VIEWMATRIX = glMatrix.mat4.create();
  glMatrix.mat4.perspective(
    PROJMATRIX,
    GEO.rad(100),
    CANVAS.width / CANVAS.height,
    1,
    500
  );

  // Making the objects
  var bicycle = createCharacter_1();
  var floor = createFloor();
  var farmer = createCharacter_3();

  // Placing objects
  bicycle.main.translate(-40, 14, -55);
  bicycle.main.rotate(0, GEO.rad(180), 0);
  bicycle.flag.rotateArbitraryAxis(
    Math.cos(GEO.rad(90 + 20)),
    Math.sin(GEO.rad(90 + 20)),
    0,
    -45
  );
  farmer.main.translate(0, 20, -50);

  // Making the animations
  var animations: AbstractAnimation[] = [];
  var bicycleLoop = new AnimationList(
    [
      new RotationAnimation(bicycle.frontWheel, 0, 2000, 0, 0, -360),
      new RotationAnimation(bicycle.backWheel, 0, 2000, 0, 0, -360),
      new RotationAnimation(bicycle.gear, 0, 2000, 0, 0, -360),
      new RotationAnimation(bicycle.rightPedal, 0, 2000, 0, 0, 360),
      new RotationAnimation(bicycle.leftPedal, 0, 2000, 0, 0, 360),
      new RotationAnimation(bicycle.leftLeg, 0, 1000, 0, 0, -50),
      new RotationAnimation(bicycle.leftLeg, 1000, 2000, 0, 0, 50),
      new RotationAnimation(bicycle.rightLeg, 0, 1000, 0, 0, 50),
      new RotationAnimation(bicycle.rightLeg, 1000, 2000, 0, 0, -50),
      new RotationAnimation(bicycle.leftThigh, 0, 1000, 0, 0, 85),
      new RotationAnimation(bicycle.leftThigh, 1000, 2000, 0, 0, -85),
      new RotationAnimation(bicycle.rightThigh, 0, 1000, 0, 0, -85),
      new RotationAnimation(bicycle.rightThigh, 1000, 2000, 0, 0, 85),
    ],
    true
  );
  animations.push(bicycleLoop);

  let pivotRotation = 35;
  let bodyRotation = 20;
  var bicycleMotion = new AnimationList(
    [
      new RotationAnimation(bicycle.main, 0, 4000, 0, 90, 0),
      new RotationAnimation(bicycle.frontPivot, 0, 2000, 0, pivotRotation, 0),
      new RotationAnimation(bicycle.body, 0, 2000, bodyRotation, 0, 0),
      new RotationAnimation(
        bicycle.frontPivot,
        2000,
        4000,
        0,
        -pivotRotation,
        0
      ),
      new RotationAnimation(bicycle.body, 2000, 4000, -bodyRotation, 0, 0),
      new RotationAnimation(bicycle.main, 4000, 12000, 0, 0, 0),
    ],
    true
  );
  bicycleMotion.multiplySpeed(1.1);
  animations.push(bicycleMotion);

  var honking = new AnimationList(
    [
      new ScaleAnimation(bicycle.honk, 0, 1000, 0.7, 0.7, 0.7),
      new ScaleAnimation(bicycle.honk, 1000, 2000, 1 / 0.7, 1 / 0.7, 1 / 0.7),
    ],
    true
  );
  animations.push(honking);

  var flagMotion = new AnimationList(
    [
      new ArbitraryAxisRotationAnimation(
        bicycle.flag,
        0,
        1000,
        Math.cos(GEO.rad(90 + 20)),
        Math.sin(GEO.rad(90 + 20)),
        0,
        90
      ),
      new ArbitraryAxisRotationAnimation(
        bicycle.flag,
        1000,
        2000,
        Math.cos(GEO.rad(90 + 20)),
        Math.sin(GEO.rad(90 + 20)),
        0,
        -90
      ),
    ],
    true
  );
  animations.push(flagMotion);

  for (let i = 0; i < floor.smokes.length; i++) {
    var smokeMotion = new AnimationList(
      [
        new TranslationAnimation(floor.smokes[i], 0, 3000, 0, 30, 0),
        new ScaleAnimation(floor.smokes[i], 0, 3000, 4, 4, 4),
      ],
      true,
      i * 1000,
      () => {
        floor.smokes[i].translate(0, -30, 0);
        floor.smokes[i].scale(0.25, 0.25, 0.25);
      }
    );
    animations.push(smokeMotion);
  }

  for (let i = 0; i < floor.trees.length; i++) {
    var treeBreathing = new AnimationList(
      [
        new ScaleAnimation(floor.trees[i], 0, 1000, 1.2, 1.2, 1.2),
        new ScaleAnimation(
          floor.trees[i],
          1000,
          2000,
          1 / 1.2,
          1 / 1.2,
          1 / 1.2
        ),
      ],
      true
    );
    animations.push(treeBreathing);
  }

  // Drawing
  GL.enable(GL.CULL_FACE);
  GL.clearColor(0.0, 0.0, 0.0, 0.0);
  GL.enable(GL.DEPTH_TEST);
  GL.depthFunc(GL.LEQUAL);
  GL.clearDepth(1.0);

  let load_time: number;
  let render_loop = 3;
  let loaded = false;
  let time_prev = 0;

  let isTerminated = false;

  const animate = function (time: number) {
    if (isTerminated) return;
    const startTick = performance.now();

    let dt = time - time_prev;
    calculateFPS(dt);
    time_prev = time;
    if (!drag) {
      (dX *= AMORTIZATION), (dY *= AMORTIZATION);
      (AppState.THETA += dX), (AppState.PHI += dY);
    }

    // Camera control
    if (AppState.cameraMode == "FPS") {
      if (keyPressed["w"] || keyPressed["W"]) {
        AppState.cameraZ += Math.cos(AppState.THETA) * 1.0;
        AppState.cameraX += -Math.sin(AppState.THETA) * 1.0;
      }
      if (keyPressed["a"] || keyPressed["A"]) {
        AppState.cameraZ += Math.cos(AppState.THETA - Math.PI / 2) * 1.0;
        AppState.cameraX += -Math.sin(AppState.THETA - Math.PI / 2) * 1.0;
      }
      if (keyPressed["s"] || keyPressed["S"]) {
        AppState.cameraZ += -Math.cos(AppState.THETA) * 1.0;
        AppState.cameraX += Math.sin(AppState.THETA) * 1.0;
      }
      if (keyPressed["d"] || keyPressed["D"]) {
        AppState.cameraZ += Math.cos(AppState.THETA + Math.PI / 2) * 1.0;
        AppState.cameraX += -Math.sin(AppState.THETA + Math.PI / 2) * 1.0;
      }
      if (keyPressed["e"] || keyPressed["E"]) AppState.cameraY -= 1.5;
      if (keyPressed["q"] || keyPressed["Q"]) AppState.cameraY += 1.5;
    }
    VIEWMATRIX = glMatrix.mat4.create();
    if (AppState.cameraMode == "Stationary") {
      glMatrix.mat4.translate(VIEWMATRIX, VIEWMATRIX, [0, -20, AppState.zoom]);
      glMatrix.mat4.rotateX(VIEWMATRIX, VIEWMATRIX, AppState.PHI);
      glMatrix.mat4.rotateY(VIEWMATRIX, VIEWMATRIX, AppState.THETA);
    } else if (AppState.cameraMode == "FPS") {
      glMatrix.mat4.rotateX(VIEWMATRIX, VIEWMATRIX, AppState.PHI);
      glMatrix.mat4.rotateY(VIEWMATRIX, VIEWMATRIX, AppState.THETA);
      glMatrix.mat4.translate(VIEWMATRIX, VIEWMATRIX, [
        AppState.cameraX,
        AppState.cameraY,
        AppState.cameraZ,
      ]);
    } else if (AppState.cameraMode == "Follow") {
      glMatrix.mat4.translate(VIEWMATRIX, VIEWMATRIX, [
        bicycle.main.TRANSMATRIX[12] + 15,
        25,
        bicycle.main.TRANSMATRIX[14] + 15,
      ]);
      glMatrix.mat4.lookAt(
        VIEWMATRIX,
        [VIEWMATRIX[12], VIEWMATRIX[13], VIEWMATRIX[14]],
        [
          bicycle.main.TRANSMATRIX[12],
          bicycle.main.TRANSMATRIX[13],
          bicycle.main.TRANSMATRIX[14],
        ],
        [0, 1, 0]
      );
    }

    // Drawing the objects
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
    bicycle.main.setUniform4(PROJMATRIX, VIEWMATRIX);
    // bicycle.main.draw();
    floor.main.setUniform4(PROJMATRIX, VIEWMATRIX);
    // floor.main.draw();
    farmer.main.setUniform4(PROJMATRIX, VIEWMATRIX);
    // farmer.main.draw();

    // Manual batch drawing
    Object3D.defaultShader.use();
    [bicycle.main, floor.main, farmer.main]
      .flatMap((o) => o.queueBatch())
      .forEach((o) => {
        o.drawBatch();
      });

    // Only run transformation after first three render finished
    if (render_loop > 0) render_loop--;
    if (render_loop == 0 && !loaded) {
      loaded = true;
      load_time = time;
    } else if (loaded) {
      // Running the animations
      time -= load_time;
      for (let animation of animations) {
        animation.run(time, dt);
      }
      // Logic
      bicycle.main.translate(
        0.01 * dt * Math.cos(bicycle.main.rotation.y),
        0,
        0.01 * dt * -Math.sin(bicycle.main.rotation.y)
      );
    }

    // Flush
    GL.flush();
    window.requestAnimationFrame(animate);

    calculateTick(startTick);
  };
  animate(0);

  return () => {
    isTerminated = true;
  };
}
