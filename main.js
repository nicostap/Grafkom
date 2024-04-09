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

    // CAMERA
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

    var mouseUp = function (e) {
        drag = false;
    };

    var mouseMove = function (e) {
        if (!drag) return false;
        dX = (e.pageX - x_prev) * 2 * Math.PI / CANVAS.width,
            dY = (e.pageY - y_prev) * 2 * Math.PI / CANVAS.height;
        THETA += dX;
        PHI += dY;
        x_prev = e.pageX, y_prev = e.pageY;
        e.preventDefault();
    };

    CANVAS.addEventListener("mousedown", mouseDown, false);
    CANVAS.addEventListener("mouseup", mouseUp, false);
    CANVAS.addEventListener("mouseout", mouseUp, false);
    CANVAS.addEventListener("mousemove", mouseMove, false);

    // MATRIX
    var PROJMATRIX = glMatrix.mat4.create();
    var VIEWMATRIX = glMatrix.mat4.create();
    glMatrix.mat4.perspective(PROJMATRIX, GEO.rad(90), CANVAS.width / CANVAS.height, 1, 400);

    // Making the objects
    var bicycle = createCharacter_1();

    // Making the animations
    var bicycleLoop = new AnimationList([
        new Animate(bicycle.frontWheel, 0, 800, MoveType.Rotate, 0, 0, -375),
        new Animate(bicycle.backWheel, 0, 800, MoveType.Rotate, 0, 0, -375),
        new Animate(bicycle.gear, 0, 800, MoveType.Rotate, 0, 0, -375),
        new Animate(bicycle.rightPedal, 0, 800, MoveType.Rotate, 0, 0, 375),
        new Animate(bicycle.leftPedal, 0, 800, MoveType.Rotate, 0, 0, 375),

        new Animate(bicycle.leftThigh, 0, 200, MoveType.Rotate, 0, 0, 10),
        new Animate(bicycle.leftThigh, 200, 400, MoveType.Rotate, 0, 0, 25),
        new Animate(bicycle.leftThigh, 400, 600, MoveType.Rotate, 0, 0, -10),
        new Animate(bicycle.leftThigh, 600, 800, MoveType.Rotate, 0, 0, -25),
        new Animate(bicycle.leftLeg, 0, 400, MoveType.Rotate, 0, 0, -65),
        new Animate(bicycle.leftLeg, 400, 800, MoveType.Rotate, 0, 0, 65),
        new Animate(bicycle.rightThigh, 0, 200, MoveType.Rotate, 0, 0, -10),
        new Animate(bicycle.rightThigh, 200, 400, MoveType.Rotate, 0, 0, -25),
        new Animate(bicycle.rightThigh, 400, 600, MoveType.Rotate, 0, 0, 10),
        new Animate(bicycle.rightThigh, 600, 800, MoveType.Rotate, 0, 0, 25),
        new Animate(bicycle.rightLeg, 0, 400, MoveType.Rotate, 0, 0, 65),
        new Animate(bicycle.rightLeg, 400, 800, MoveType.Rotate, 0, 0, -65),
    ], 0, 800, true);

    var animations = [];
    animations.push(bicycleLoop);

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

        VIEWMATRIX = glMatrix.mat4.create();
        glMatrix.mat4.translate(VIEWMATRIX, VIEWMATRIX, [0, 0, -30]);
        glMatrix.mat4.rotateX(VIEWMATRIX, VIEWMATRIX, PHI);
        glMatrix.mat4.rotateY(VIEWMATRIX, VIEWMATRIX, THETA);

        GL.viewport(0, 0, CANVAS.width, CANVAS.height);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.D_BUFFER_BIT);

        // Running the animations
        for (let animation of animations) {
            animation.run(time, dt);
        }

        // Updating and drawing the objects
        bicycle.main.setUniform4(PROJMATRIX, VIEWMATRIX);
        bicycle.main.draw();

        GL.flush();
        window.requestAnimationFrame(animate);
    };
    animate(0);
}
window.addEventListener('load', main);