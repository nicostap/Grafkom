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
import { DefaultShader } from "./shaders/default.shader";
import { calculateFPS, calculateTick } from "./utils/StatCounter";
import { AppState, mode } from "./utils/State";
import { CameraController } from "./utils/CameraController";
import { Bitzer } from "./models/Bitzer";
import { Lawnmower } from "./models/Lawnmower";

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
    if (!glCtx) throw new Error("WebGL context cannot be initialized");
    GL = glCtx;
  } catch (e) {
    alert("WebGL context cannot be initialized");
    return false;
  }

  const cameraController = new CameraController(CANVAS, AppState);

  Object3D.GL = GL;
  Object3D.defaultShader = new DefaultShader(GL);

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
  const bitzer = new Bitzer();
  const lawnmower = new Lawnmower();

  // Placing objects
  bicycle.main.translate(-60, 20, -72);
  bicycle.main.rotate(0, GEO.rad(180), 0);
  bicycle.main.scale(1.5, 1.5, 1.5);
  bicycle.flag.rotateArbitraryAxis(
    Math.cos(GEO.rad(90 + 20)),
    Math.sin(GEO.rad(90 + 20)),
    0,
    -45
  );
  farmer.main.translate(0, 25, 70);
  farmer.body.rotate(-0.8, 0, 0);
  farmer.body.translate(0, -12, -5);
  farmer.head.rotate(0.3, 0, 0);
  farmer.head.translate(0, 1, 1);
  farmer.leftShoulder.rotate(1.5, 0.2, 0.2);
  farmer.leftElbow.rotate(0, -1, 0);
  farmer.rightShoulder.rotate(0.8, 0.5, 0);
  farmer.rightElbow.rotate(0, 0, -1.0);
  farmer.leftLeg.rotate(-0.2, 0, 0.2);
  farmer.leftKnee.rotate(0.9, 0, 0);
  farmer.rightLeg.rotate(-0.2, 0, -0.2);
  farmer.rightKnee.rotate(0.9, 0, 0);
  farmer.pizza.rotate(0, 0, 1.5);
  farmer.pizza.translate(-2, -1, 2);

  bitzer.root.translate(0, 25, 120);
  lawnmower.root.translate(0, 15, 120);

  // Making the animations
  var animations: AbstractAnimation[] = [];

  animations.push(...bitzer.animations);
  animations.push(...lawnmower.animations);
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
  bicycleLoop.multiplySpeed(0.4);
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
  bicycleMotion.multiplySpeed(0.29);
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

  for (let i = 0; i < floor.clouds.length; i++) {
    var cloudMotion = new AnimationList(
      [new TranslationAnimation(floor.clouds[i], 0, 20000, 0, 0, -1000)],
      true,
      0,
      () => {
        floor.clouds[i].translate(0, 0, 1000);
      }
    );
    animations.push(cloudMotion);
  }

  for (let i = 0; i < floor.butterflies.length; i++) {
    var butterflyMotion = new AnimationList(
      [
        new RotationAnimation(floor.butterflies[i].child[1], 0, 500, -90, 0, 0),
        new RotationAnimation(
          floor.butterflies[i].child[1],
          500,
          1000,
          90,
          0,
          0
        ),
      ],
      true
    );
    animations.push(butterflyMotion);
    var butterflyMotion = new AnimationList(
      [
        new RotationAnimation(floor.butterflies[i].child[2], 0, 500, 90, 0, 0),
        new RotationAnimation(
          floor.butterflies[i].child[2],
          500,
          1000,
          -90,
          0,
          0
        ),
      ],
      true
    );
    animations.push(butterflyMotion);
    var butterflyMotion = new AnimationList(
      [
        new ArbitraryAxisRotationAnimation(
          floor.butterflies[i],
          0,
          3000,
          -1 + 2 * Math.random(),
          1,
          -1 + 2 * Math.random(),
          360
        ),
      ],
      true
    );
    animations.push(butterflyMotion);
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
    cameraController.tick(dt);

    VIEWMATRIX = glMatrix.mat4.create();
    if (AppState.cameraMode == "Stationary") {
      glMatrix.mat4.translate(VIEWMATRIX, VIEWMATRIX, [
        AppState.zoom * Math.cos(time * 0.0003),
        80,
        AppState.zoom * Math.sin(time * 0.0003),
      ]);
      glMatrix.mat4.lookAt(
        VIEWMATRIX,
        [VIEWMATRIX[12], VIEWMATRIX[13], VIEWMATRIX[14]],
        [0, 0, 0],
        [0, 1, 0]
      );
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
        bicycle.main.TRANSMATRIX[12] -
          30 * Math.cos(bicycle.main.rotation.y + GEO.rad(45)),
        25,
        bicycle.main.TRANSMATRIX[14] -
          30 * Math.sin(bicycle.main.rotation.y + GEO.rad(45)),
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

    [
      bicycle.main,
      floor.main,
      farmer.main,
      bitzer.root,
      lawnmower.root,
    ].forEach((o) => {
      o.setUniform4(PROJMATRIX, VIEWMATRIX);
    });

    // Manual batch drawing
    Object3D.defaultShader.use();
    [bicycle.main, floor.main, farmer.main, bitzer.root, lawnmower.root]
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
        0.05 * dt * Math.cos(bicycle.main.rotation.y),
        0,
        0.05 * dt * -Math.sin(bicycle.main.rotation.y)
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
    cameraController.unhookEvents();
  };
}
