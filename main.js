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

    // Creating the parts
    var body = new Object3D([...object_vertex], [...object_faces], shader_vertex_source, shader_fragment_source);
    var left_leg = new Object3D([...object_vertex], [...object_faces], shader_vertex_source, shader_fragment_source);
    var right_leg = new Object3D([...object_vertex], [...object_faces], shader_vertex_source, shader_fragment_source);
    var left_foot = new Object3D([...object_vertex], [...object_faces], shader_vertex_source, shader_fragment_source);
    var right_foot = new Object3D([...object_vertex], [...object_faces], shader_vertex_source, shader_fragment_source);
    var left_knee = new Object3D([...object_vertex], [...object_faces], shader_vertex_source, shader_fragment_source);
    var right_knee = new Object3D([...object_vertex], [...object_faces], shader_vertex_source, shader_fragment_source);
    var head =  new Object3D([...object_vertex], [...object_faces], shader_vertex_source, shader_fragment_source);
    var left_eye = new Object3D([...object_vertex], [...object_faces], shader_vertex_source, shader_fragment_source);
    var right_eye = new Object3D([...object_vertex], [...object_faces], shader_vertex_source, shader_fragment_source);
    var left_hand = new Object3D([...object_vertex], [...object_faces], shader_vertex_source, shader_fragment_source);
    var right_hand = new Object3D([...object_vertex], [...object_faces], shader_vertex_source, shader_fragment_source);

    // Setting the parts location
    left_leg.setLocalScale(0.3, 1.5, 0.3);
    left_leg.setLocalTranslation(0.7, 1.8, 0);
    right_leg.setLocalScale(0.3, 1.5, 0.3);
    right_leg.setLocalTranslation(-0.7, 1.8, 0);
    left_foot.setLocalScale(0.3, 1.5, 0.3);
    left_foot.setLocalTranslation(0.7, 4.9, 0);
    right_foot.setLocalScale(0.3, 1.5, 0.3);
    right_foot.setLocalTranslation(-0.7, 4.9, 0);
    left_knee.setLocalScale(0.5, 0.5, 0.5);
    left_knee.setLocalTranslation(0.7, 3.6, 0);
    right_knee.setLocalScale(0.5, 0.5, 0.5);
    right_knee.setLocalTranslation(-0.7, 3.6, 0);
    head.setLocalScale(0.7, 0.7, 0.7);
    head.setLocalTranslation(0, -1.7, 0);
    left_eye.setLocalScale(0.1, 0.3, 0.1);
    left_eye.setLocalTranslation(0.3, -2.0, 0.8);
    right_eye.setLocalScale(0.1, 0.3, 0.1);
    right_eye.setLocalTranslation(-0.3, -2.0, 0.8);
    left_hand.setLocalScale(0.3, 1.5, 0.3);
    left_hand.setLocalTranslation(1.3, 0.2, 0);
    left_hand.setLocalRotation(0, 0, -0.3);
    right_hand.setLocalScale(0.3, 1.5, 0.3);
    right_hand.setLocalTranslation(-1.3, 0.2, 0);
    right_hand.setLocalRotation(0, 0, 0.3);

    // Linking the parts along with point of origin (if not set, point of origin is part's local translation)
    body.addChild(left_leg, 0, 0, 0);
    body.addChild(right_leg, 0, 0, 0);
    body.addChild(left_hand, 0, 0, 0);
    body.addChild(right_hand, 0, 0, 0);
    body.addChild(head);
    left_leg.addChild(left_foot, 0.7, 3.6, 0);
    left_leg.addChild(left_knee);
    right_leg.addChild(right_foot, -0.7, 3.6, 0);   
    right_leg.addChild(right_knee);
    head.addChild(left_eye);
    head.addChild(right_eye);

    // Transform the combined object
    body.scale(0.5, 0.5, 0.5);
    body.translate(0.0, 0.0, -5.0);

    // Making the animations
    var animations = [];
    animations.push(new Animate(body, 2000.0, 8000.0, MoveType.Translate, 0.0, 0.0, 5.0));

    animations.push(new Animate(left_leg, 2000.0, 3500.0, MoveType.Rotate, 30.0, 0.0, 0.0));
    animations.push(new Animate(right_leg, 2000.0, 3500.0, MoveType.Rotate, -30.0, 0.0, 0.0));
    animations.push(new Animate(left_foot, 2000.0, 3500.0, MoveType.Rotate, -30.0, 0.0, 0.0));
    animations.push(new Animate(right_foot, 2000.0, 3500.0, MoveType.Rotate, 30.0, 0.0, 0.0));1

    animations.push(new Animate(left_leg, 3500.0, 6500.0, MoveType.Rotate, -60.0, 0.0, 0.0));
    animations.push(new Animate(right_leg, 3500.0, 6500.0, MoveType.Rotate, 60.0, 0.0, 0.0));
    animations.push(new Animate(left_foot, 3500.0, 6500.0, MoveType.Rotate, 60.0, 0.0, 0.0));
    animations.push(new Animate(right_foot, 3500.0, 6500.0, MoveType.Rotate, -60.0, 0.0, 0.0));1

    animations.push(new Animate(left_leg, 6500.0, 8000.0, MoveType.Rotate, 30.0, 0.0, 0.0));
    animations.push(new Animate(right_leg, 6500.0, 8000.0, MoveType.Rotate, -30.0, 0.0, 0.0));
    animations.push(new Animate(left_foot, 6500.0, 8000.0, MoveType.Rotate, -30.0, 0.0, 0.0));
    animations.push(new Animate(right_foot, 6500.0, 8000.0, MoveType.Rotate, 30.0, 0.0, 0.0));1
    
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
        glMatrix.mat4.translate(VIEWMATRIX, VIEWMATRIX, [0, 0, -5]);
        glMatrix.mat4.rotateX(VIEWMATRIX, VIEWMATRIX, PHI);
        glMatrix.mat4.rotateY(VIEWMATRIX, VIEWMATRIX, THETA);

        GL.viewport(0, 0, CANVAS.width, CANVAS.height);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.D_BUFFER_BIT);

        // Running the animations
        for(let animation of animations) {
            animation.run(time, dt);
        }

        body.setUniform4(PROJMATRIX, VIEWMATRIX);
        body.draw();

        GL.flush();
        window.requestAnimationFrame(animate);
    };
    animate(0);
}
window.addEventListener('load', main);