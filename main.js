function main() {
    var CANVAS = document.getElementById("your_canvas");
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
    glMatrix.mat4.perspective(PROJMATRIX, 17, CANVAS.width / CANVAS.height, 1, 100);
    var VIEWMATRIX = glMatrix.mat4.create();
    glMatrix.mat4.translate(VIEWMATRIX, VIEWMATRIX, [0, 0, -5]);

    // OBJECT
    var object_vertex = [
        -1, -1, -1, 1, 1, 0,
        1, -1, -1, 1, 1, 0,
        1, 1, -1, 1, 1, 0,
        -1, 1, -1, 1, 1, 0,
        -1, -1, 1, 0, 0, 1,
        1, -1, 1, 0, 0, 1,
        1, 1, 1, 0, 0, 1,
        -1, 1, 1, 0, 0, 1,
        -1, -1, -1, 0, 1, 1,
        -1, 1, -1, 0, 1, 1,
        -1, 1, 1, 0, 1, 1,
        -1, -1, 1, 0, 1, 1,
        1, -1, -1, 1, 0, 0,
        1, 1, -1, 1, 0, 0,
        1, 1, 1, 1, 0, 0,
        1, -1, 1, 1, 0, 0,
        -1, -1, -1, 1, 0, 1,
        -1, -1, 1, 1, 0, 1,
        1, -1, 1, 1, 0, 1,
        1, -1, -1, 1, 0, 1,
        -1, 1, -1, 0, 1, 0,
        -1, 1, 1, 0, 1, 0,
        1, 1, 1, 0, 1, 0,
        1, 1, -1, 0, 1, 0
    ];
    var object_faces = [
        0, 1, 2,
        0, 2, 3,
        4, 5, 6,
        4, 6, 7,
        8, 9, 10,
        8, 10, 11,
        12, 13, 14,
        12, 14, 15,
        16, 17, 18,
        16, 18, 19,
        20, 21, 22,
        20, 22, 23];

    // Shader
    var shader_vertex_source = `
      attribute vec3 position;
      attribute vec3 color;
      uniform mat4 Pmatrix;
      uniform mat4 Vmatrix;
      uniform mat4 Mmatrix;
      varying vec3 vColor;
      void main(void) {
      gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.0);
      vColor = color;
      }`;
    var shader_fragment_source = `
      precision mediump float;
      varying vec3 vColor;
      void main(void) {
      gl_FragColor = vec4(vColor, 1.);
      }`;

    // Object creating
    var cube = new Object([...object_vertex], [...object_faces], shader_vertex_source, shader_fragment_source);
    var child_cube = new Object([...object_vertex], [...object_faces], shader_vertex_source, shader_fragment_source);
    var grandchild_cube = new Object([...object_vertex], [...object_faces], shader_vertex_source, shader_fragment_source);

    // Designing the object
    child_cube.setScale(0.5, 1.5, 0.5);
    child_cube.setRotation(0, 0, 0.5);
    child_cube.setPosition(0.7, -2, 0);
    grandchild_cube.setScale(1, 0.1, 0.2);
    grandchild_cube.setRotation(0, 0, 0.5);
    grandchild_cube.setPosition(1.3, -3, 0.7);

    // Linking the objects and add point of origin
    cube.addChild(child_cube, 0, -0.5, 0);
    child_cube.addChild(grandchild_cube, 1.3, -3, 0.7);

    // Transform the combined object
    cube.scale(0.5, 0.5, 0.5);
    cube.rotate(0.6, 0.5, 0.9);
    cube.translate(-3, 0, 0);

    // Drawing
    GL.clearColor(0.0, 0.0, 0.0, 0.0);
    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);
    GL.clearDepth(1.0);

    var time_prev = 0;
    var animate = function (time) {
        var dt = (time - time_prev);
        if (!drag) {
            dX *= AMORTIZATION, dY *= AMORTIZATION;
            THETA += dX, PHI += dY;
        }

        VIEWMATRIX = glMatrix.mat4.create();
        glMatrix.mat4.translate(VIEWMATRIX, VIEWMATRIX, [0, 0, -5]);
        glMatrix.mat4.rotateX(VIEWMATRIX, VIEWMATRIX, PHI);
        glMatrix.mat4.rotateY(VIEWMATRIX, VIEWMATRIX, THETA);

        GL.viewport(0, 0, CANVAS.width, CANVAS.height);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.D_BUFFER_BIT);

        // Moving & Rotating the objects 
        cube.rotate(0.01, 0, 0);
        child_cube.rotate(0, 0.02, 0);
        grandchild_cube.rotate(0, 0, 0.5);
        cube.translate(0, 0.1 * Math.sin(time * Math.PI / 360.0), 0);

        cube.setUniform4(PROJMATRIX, VIEWMATRIX);
        cube.draw();

        GL.flush();
        window.requestAnimationFrame(animate);
    };
    animate(0);
}
window.addEventListener('load', main);