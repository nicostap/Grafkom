// CAMERA MODE
let mode = Object.freeze({
    Stationary: 'Stationary',
    FPS: 'FPS',
    Follow: 'Follow'
});
let cameraX = 0, cameraY = -20, cameraZ = 0;
let cameraMode = mode.FPS;
let zoom = -30;
function modeStationary() {
    cameraMode = mode.Stationary;
    THETA = 0;
    PHI = 0;
    zoom = -30;
}
function modeFPS() {
    cameraMode = mode.FPS;
    THETA = 0;
    PHI = 0;
    cameraX = 0, cameraY = -20, cameraZ = 0;
}
function modeFollowShaun() {
    cameraMode = mode.Follow;
    THETA = 0;
    PHI = 0;
    zoom = -30;
}

function main() {
    CANVAS = document.getElementById("your_canvas");
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;

    try {
        GL = CANVAS.getContext("webgl", { antialias: true });
    } catch (e) {
        alert("WebGL context cannot be initialized");
        return false;
    }

    // CAMERA CONTROL
    var AMORTIZATION = 0.95;
    var dX = 0, dY = 0;
    var drag = false;
    var THETA = 0, PHI = 0;
    var x_prev, y_prev;
    var mouseDown = function (e) {
        drag = true;
        x_prev = e.pageX, y_prev = e.pageY;
        e.preventDefault();
        return false;
    };
    var mouseUp = function (e) { drag = false; };
    var mouseMove = function (e) {
        if (!drag) return false;
        dX = (e.pageX - x_prev) * 2 * Math.PI / CANVAS.width,
            dY = (e.pageY - y_prev) * 2 * Math.PI / CANVAS.height;
        THETA += dX;
        PHI += dY;
        x_prev = e.pageX, y_prev = e.pageY;
        e.preventDefault();
    };
    var mouseScroll = function (e) {
        const delta = Math.sign(e.deltaY);
        zoom -= 3 * delta;
        if (zoom <= -100) zoom = -100;
        if (zoom >= -20) zoom = -20;
    };
    CANVAS.addEventListener("mousedown", mouseDown, false);
    CANVAS.addEventListener("mouseup", mouseUp, false);
    CANVAS.addEventListener("mouseout", mouseUp, false);
    CANVAS.addEventListener("mousemove", mouseMove, false);
    CANVAS.addEventListener("wheel", mouseScroll, false);
    var keyPressed = {};
    window.onkeydown = function (e) {
        keyPressed[e.key] = true;
    };
    window.onkeyup = function (e) {
        keyPressed[e.key] = false;
    };

    // MATRIX
    var PROJMATRIX = glMatrix.mat4.create();
    var VIEWMATRIX = glMatrix.mat4.create();
    glMatrix.mat4.perspective(PROJMATRIX, GEO.rad(90), CANVAS.width / CANVAS.height, 1, 1000);

    // Making the objects
    var bicycle = createCharacter_1();
    var floor = createFloor();

    // Placing objects
    bicycle.main.translate(-30, 14, -30);
    bicycle.main.rotate(0, GEO.rad(180), 0);

    // Making the animations
    var animations = [];
    var bicycleLoop = new AnimationList([
        new Animate(bicycle.frontWheel, 0, 2000, MoveType.Rotate, 0, 0, -360),
        new Animate(bicycle.backWheel, 0, 2000, MoveType.Rotate, 0, 0, -360),
        new Animate(bicycle.gear, 0, 2000, MoveType.Rotate, 0, 0, -360),
        new Animate(bicycle.rightPedal, 0, 2000, MoveType.Rotate, 0, 0, 360),
        new Animate(bicycle.leftPedal, 0, 2000, MoveType.Rotate, 0, 0, 360),
        new Animate(bicycle.leftLeg, 0, 1000, MoveType.Rotate, 0, 0, -50),
        new Animate(bicycle.leftLeg, 1000, 2000, MoveType.Rotate, 0, 0, 50),
        new Animate(bicycle.rightLeg, 0, 1000, MoveType.Rotate, 0, 0, 50),
        new Animate(bicycle.rightLeg, 1000, 2000, MoveType.Rotate, 0, 0, -50),
        new Animate(bicycle.leftThigh, 0, 1000, MoveType.Rotate, 0, 0, 85),
        new Animate(bicycle.leftThigh, 1000, 2000, MoveType.Rotate, 0, 0, -85),
        new Animate(bicycle.rightThigh, 0, 1000, MoveType.Rotate, 0, 0, -85),
        new Animate(bicycle.rightThigh, 1000, 2000, MoveType.Rotate, 0, 0, 85),
    ], true);
    animations.push(bicycleLoop);

    let pivotRotation = 30;
    let bodyRotation = 15;
    var bicycleMotion = new AnimationList([
        new Animate(bicycle.main, 0, 4000, MoveType.Rotate, 0, 90, 0),
        new Animate(bicycle.frontPivot, 0, 2000, MoveType.Rotate, 0, pivotRotation, 0),
        new Animate(bicycle.body, 0, 2000, MoveType.Rotate, 15, 0, 0),
        new Animate(bicycle.frontPivot, 2000, 4000, MoveType.Rotate, 0, -pivotRotation, 0),
        new Animate(bicycle.body, 2000, 4000, MoveType.Rotate, -bodyRotation, 0, 0),

        new Animate(bicycle.main, 12000, 16000, MoveType.Rotate, 0, 90, 0),
        new Animate(bicycle.frontPivot, 12000, 14000, MoveType.Rotate, 0, pivotRotation, 0),
        new Animate(bicycle.body, 12000, 14000, MoveType.Rotate, bodyRotation, 0, 0),
        new Animate(bicycle.frontPivot, 14000, 16000, MoveType.Rotate, 0, -pivotRotation, 0),
        new Animate(bicycle.body, 14000, 16000, MoveType.Rotate, -bodyRotation, 0, 0),

        new Animate(bicycle.main, 24000, 28000, MoveType.Rotate, 0, 90, 0),
        new Animate(bicycle.frontPivot, 24000, 26000, MoveType.Rotate, 0, pivotRotation, 0),
        new Animate(bicycle.body, 24000, 28000, MoveType.Rotate, bodyRotation, 0, 0),
        new Animate(bicycle.frontPivot, 26000, 28000, MoveType.Rotate, 0, -pivotRotation, 0),
        new Animate(bicycle.body, 26000, 28000, MoveType.Rotate, -bodyRotation, 0, 0),

        new Animate(bicycle.main, 36000, 40000, MoveType.Rotate, 0, 90, 0),
        new Animate(bicycle.frontPivot, 36000, 38000, MoveType.Rotate, 0, pivotRotation, 0),
        new Animate(bicycle.body, 36000, 38000, MoveType.Rotate, bodyRotation, 0, 0),
        new Animate(bicycle.frontPivot, 38000, 40000, MoveType.Rotate, 0, -pivotRotation, 0),
        new Animate(bicycle.body, 38000, 40000, MoveType.Rotate, -bodyRotation, 0, 0),

        new Animate(bicycle.main, 40000, 48000, MoveType.Rotate, 0, 0, 0),
    ], true);
    bicycleMotion.multiplySpeed(0.5);
    animations.push(bicycleMotion);

    var honking = new AnimationList([
        new Animate(bicycle.honk, 0, 1000, MoveType.Scale, 0.8, 0.8, 0.8),
        new Animate(bicycle.honk, 1000, 2000, MoveType.Scale, 1 / 0.8, 1 / 0.8, 1 / 0.8),
    ], true);
    animations.push(honking);

    for (let i = 0; i < floor.trees.length; i++) {
        var treeBreathing = new AnimationList([
            new Animate(floor.trees[i], 0, 1000, MoveType.Scale, 1.2, 1.2, 1.2),
            new Animate(floor.trees[i], 1000, 2000, MoveType.Scale, 1 / 1.2, 1 / 1.2, 1 / 1.2),
        ], true);
        animations.push(treeBreathing);
    }

    var grassBreathing = new AnimationList([
        new Animate(floor.grass, 0, 1000, MoveType.Translate, 0, 1, 0),
        new Animate(floor.grass, 1000, 2000, MoveType.Translate, 0, -1, 0),
    ], true);
    animations.push(grassBreathing);

    // Drawing
    GL.clearColor(0.0, 0.0, 0.0, 0.0);
    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);
    GL.clearDepth(1.0);

    var time_prev = 0.0;
    var animate = function (time) {
        var dt = (time - time_prev);
        time_prev = time;
        if (!drag) {
            dX *= AMORTIZATION, dY *= AMORTIZATION;
            THETA += dX, PHI += dY;
        }

        // Camera control
        if (cameraMode == 'FPS') {
            if (keyPressed['w'] || keyPressed['W']) {
                cameraZ += Math.cos(THETA) * 1.0;
                cameraX += -Math.sin(THETA) * 1.0;
            }
            if (keyPressed['a'] || keyPressed['A']) {
                cameraZ += Math.cos(THETA - Math.PI / 2) * 1.0;
                cameraX += -Math.sin(THETA - Math.PI / 2) * 1.0;
            }
            if (keyPressed['s'] || keyPressed['S']) {
                cameraZ += -Math.cos(THETA) * 1.0;
                cameraX += Math.sin(THETA) * 1.0;
            }
            if (keyPressed['d'] || keyPressed['D']) {
                cameraZ += Math.cos(THETA + Math.PI / 2) * 1.0;
                cameraX += -Math.sin(THETA + Math.PI / 2) * 1.0;
            }
            if (keyPressed['e'] || keyPressed['E']) cameraY -= 1.5;
            if (keyPressed['q'] || keyPressed['Q']) cameraY += 1.5;
        }
        VIEWMATRIX = glMatrix.mat4.create();
        if (cameraMode == 'Stationary') {
            glMatrix.mat4.translate(VIEWMATRIX, VIEWMATRIX, [0, -20, zoom]);
            glMatrix.mat4.rotateX(VIEWMATRIX, VIEWMATRIX, PHI);
            glMatrix.mat4.rotateY(VIEWMATRIX, VIEWMATRIX, THETA);
        } else if (cameraMode == 'FPS') {
            glMatrix.mat4.rotateX(VIEWMATRIX, VIEWMATRIX, PHI);
            glMatrix.mat4.rotateY(VIEWMATRIX, VIEWMATRIX, THETA);
            glMatrix.mat4.translate(VIEWMATRIX, VIEWMATRIX, [cameraX, cameraY, cameraZ]);
        } else if (cameraMode == 'Follow') {
            glMatrix.mat4.translate(VIEWMATRIX, VIEWMATRIX, [bicycle.main.TRANSMATRIX[12] + 30, 20, bicycle.main.TRANSMATRIX[12] + 30]);
            glMatrix.mat4.lookAt(VIEWMATRIX, [VIEWMATRIX[12], VIEWMATRIX[13], VIEWMATRIX[14]], [bicycle.main.TRANSMATRIX[12], bicycle.main.TRANSMATRIX[13], bicycle.main.TRANSMATRIX[14]], [0, 1, 0]);
        }

        // Drawing the objects
        GL.viewport(0, 0, CANVAS.width, CANVAS.height);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.D_BUFFER_BIT);
        bicycle.main.setUniform4(PROJMATRIX, VIEWMATRIX);
        floor.main.setUniform4(PROJMATRIX, VIEWMATRIX);;
        bicycle.main.draw();
        floor.main.draw();

        // Running the animations
        for (let animation of animations) {
            animation.run(time, dt);
        }

        // Logic
        bicycle.main.translate(0.01 * dt * Math.cos(bicycle.main.rotation.y), 0, 0.01 * dt * -Math.sin(bicycle.main.rotation.y));

        // Flush
        GL.flush();
        window.requestAnimationFrame(animate);
    };
    animate(-1);
}
window.addEventListener('load', main);