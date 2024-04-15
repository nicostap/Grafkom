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
    var farmer = createCharacter_3();

    // Placing objects
    bicycle.main.translate(-30, 14, -30);
    bicycle.main.rotate(0, GEO.rad(180), 0);
    bicycle.flag.rotateArbitraryAxis(Math.cos(GEO.rad(90 + 20)), Math.sin(GEO.rad(90 + 20)), 0, -45);
    farmer.main.translate(0, 20, -50)

    // Making the animations
    var animations = [];
    var bicycleLoop = new AnimationList([
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
    ], true);
    animations.push(bicycleLoop);

    let pivotRotation = 35;
    let bodyRotation = 20;
    var bicycleMotion = new AnimationList([
        new RotationAnimation(bicycle.main, 0, 4000, 0, 90, 0),
        new RotationAnimation(bicycle.frontPivot, 0, 2000, 0, pivotRotation, 0),
        new RotationAnimation(bicycle.body, 0, 2000, bodyRotation, 0, 0),
        new RotationAnimation(bicycle.frontPivot, 2000, 4000, 0, -pivotRotation, 0),
        new RotationAnimation(bicycle.body, 2000, 4000, -bodyRotation, 0, 0),
        new RotationAnimation(bicycle.main, 4000, 12000, 0, 0, 0),
    ], true);
    bicycleMotion.multiplySpeed(0.5);
    animations.push(bicycleMotion);

    var honking = new AnimationList([
        new ScaleAnimation(bicycle.honk, 0, 1000, 0.6, 0.6, 0.6),
        new ScaleAnimation(bicycle.honk, 1000, 2000, 1 / 0.6, 1 / 0.6, 1 / 0.6),
    ], true);
    animations.push(honking);

    var flagMotion = new AnimationList([
        new ArbitraryAxisRotationAnimation(bicycle.flag, 0, 1000, Math.cos(GEO.rad(90 + 20)), Math.sin(GEO.rad(90 + 20)), 0, 90),
        new ArbitraryAxisRotationAnimation(bicycle.flag, 1000, 2000, Math.cos(GEO.rad(90 + 20)), Math.sin(GEO.rad(90 + 20)), 0, -90),
    ], true);
    animations.push(flagMotion);

    for (let i = 0; i < floor.trees.length; i++) {
        var treeBreathing = new AnimationList([
            new ScaleAnimation(floor.trees[i], 0, 1000, 1.2, 1.2, 1.2),
            new ScaleAnimation(floor.trees[i], 1000, 2000, 1 / 1.2, 1 / 1.2, 1 / 1.2),
        ], true);
        animations.push(treeBreathing);
    }

    var grassBreathing = new AnimationList([
        new TranslationAnimation(floor.grass, 0, 1000, 0, 0.75, 0),
        new TranslationAnimation(floor.grass, 1000, 2000, 0, -0.75, 0),
    ], true);
    animations.push(grassBreathing);

    // Drawing
    GL.enable(GL.CULL_FACE);
    GL.clearColor(0.0, 0.0, 0.0, 0.0);
    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);
    GL.clearDepth(1.0);

    let load_time;
    let render_loop = 3;
    let loaded = false;
    let time_prev = 0;
    var animate = function (time) {
        let dt = (time - time_prev);
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
        floor.main.setUniform4(PROJMATRIX, VIEWMATRIX);
        farmer.main.setUniform4(PROJMATRIX, VIEWMATRIX);
        bicycle.main.draw();
        floor.main.draw();
        farmer.main.draw();

        // Only run transformation after first three render finished
        if (render_loop > 0) render_loop--;
        if (render_loop == 0 && !loaded)  {
            loaded = true;
            load_time = time;
        } else {
            // Running the animations
            time -= load_time;
            for (let animation of animations) {
                animation.run(time, dt);
            }
            // Logic
            bicycle.main.translate(0.01 * dt * Math.cos(bicycle.main.rotation.y), 0, 0.01 * dt * -Math.sin(bicycle.main.rotation.y));
        }

        // Flush
        GL.flush();
        window.requestAnimationFrame(animate);
    };
    animate(0);
}
window.addEventListener('load', main);