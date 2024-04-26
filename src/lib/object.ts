import * as glMatrix from "gl-matrix";
import defaultVertexShader from "./shaders/default.vert?raw";
import defaultFragmentShader from "./shaders/default.frag?raw";
import { DefaultShader } from "./shaders/default.shader";
import type { Shader } from "./utils/Shader";

export class Object3D {
  static GL: WebGLRenderingContext;
  static defaultShader: Shader;

  // Default Shader
  static default_shader_vertex_source = defaultVertexShader;
  static default_shader_fragment_source = defaultFragmentShader;

  object_vertex;
  OBJECT_VERTEX: WebGLBuffer | null = null;
  object_faces;
  OBJECT_FACES: WebGLBuffer | null = null;

  // Local transformation
  INIT_SCALEMATRIX = glMatrix.mat4.create();
  INIT_ROTATEMATRIX = glMatrix.mat4.create();
  INIT_TRANSMATRIX = glMatrix.mat4.create();

  // Transformation
  SCALEMATRIX = glMatrix.mat4.create();
  ROTATEMATRICES = [glMatrix.mat4.create()];
  TRANSMATRIX = glMatrix.mat4.create();
  origin: [number, number, number] = [0, 0, 0];

  MOVEMATRIX = glMatrix.mat4.create();
  NORMALMATRIX = glMatrix.mat4.create();
  PROJMATRIX = glMatrix.mat4.create();
  VIEWMATRIX = glMatrix.mat4.create();

  rotation = { x: 0, y: 0, z: 0 };

  // Relationship
  parent: Object3D | null = null;
  child: Object3D[] = [];

  SHADER_PROGRAM;
  _Pmatrix: WebGLUniformLocation;
  _Vmatrix: WebGLUniformLocation;
  _Mmatrix: WebGLUniformLocation;
  _Nmatrix: WebGLUniformLocation;
  _color: number = -1;
  _position: number = -1;
  _normal: number = -1;

  constructor(
    object_vertex: number[],
    object_faces: number[],
    public shader: Shader = Object3D.defaultShader
  ) {
    this.object_vertex = object_vertex;
    this.object_faces = object_faces;

    this.OBJECT_VERTEX = Object3D.GL.createBuffer();
    this.OBJECT_FACES = Object3D.GL.createBuffer();
    // this.shader_vertex = this.compile_shader(
    //   this.shader_vertex_source,
    //   Object3D.GL.VERTEX_SHADER,
    //   "VERTEX"
    // ) as WebGLShader;
    // this.shader_fragment = this.compile_shader(
    //   this.shader_fragment_source,
    //   Object3D.GL.FRAGMENT_SHADER,
    //   "FRAGMENT"
    // ) as WebGLShader;
    // this.SHADER_PROGRAM = Object3D.GL.createProgram() as WebGLProgram;

    // if (!this.shader_vertex || !this.shader_fragment || !this.SHADER_PROGRAM) {
    //   alert("Unable to create shaders");
    //   throw new Error("Unable to create shaders");
    // }

    // Object3D.GL.attachShader(this.SHADER_PROGRAM, this.shader_vertex);
    // Object3D.GL.attachShader(this.SHADER_PROGRAM, this.shader_fragment);
    // Object3D.GL.linkProgram(this.SHADER_PROGRAM);

    // this._Pmatrix = Object3D.GL.getUniformLocation(
    //   this.SHADER_PROGRAM,
    //   "Pmatrix"
    // ) as WebGLUniformLocation;
    // this._Vmatrix = Object3D.GL.getUniformLocation(
    //   this.SHADER_PROGRAM,
    //   "Vmatrix"
    // ) as WebGLUniformLocation;
    // this._Mmatrix = Object3D.GL.getUniformLocation(
    //   this.SHADER_PROGRAM,
    //   "Mmatrix"
    // ) as WebGLUniformLocation;
    // this._Nmatrix = Object3D.GL.getUniformLocation(
    //   this.SHADER_PROGRAM,
    //   "uNormalMatrix"
    // ) as WebGLUniformLocation;

    // this._color =
    //   Object3D.GL.getAttribLocation(this.SHADER_PROGRAM, "color") ?? -1;
    // this._position =
    //   Object3D.GL.getAttribLocation(this.SHADER_PROGRAM, "position") ?? -1;
    // this._normal =
    //   Object3D.GL.getAttribLocation(this.SHADER_PROGRAM, "normal") ?? -1;

    // Object3D.GL.enableVertexAttribArray(this._color);
    // Object3D.GL.enableVertexAttribArray(this._position);
    // Object3D.GL.enableVertexAttribArray(this._normal);

    this.SHADER_PROGRAM = shader.program;
    this._Mmatrix = shader.uniforms.Mmatrix;
    this._Pmatrix = shader.uniforms.Pmatrix;
    this._Vmatrix = shader.uniforms.Vmatrix;
    this._Nmatrix = shader.uniforms.uNormalMatrix;

    this._color = shader.attributes.color;
    this._position = shader.attributes.position;
    this._normal = shader.attributes.normal;

    Object3D.GL.bindBuffer(Object3D.GL.ARRAY_BUFFER, this.OBJECT_VERTEX);
    Object3D.GL.bufferData(
      Object3D.GL.ARRAY_BUFFER,
      new Float32Array(this.object_vertex),
      Object3D.GL.STATIC_DRAW
    );
    Object3D.GL.bindBuffer(Object3D.GL.ELEMENT_ARRAY_BUFFER, this.OBJECT_FACES);
    Object3D.GL.bufferData(
      Object3D.GL.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(this.object_faces),
      Object3D.GL.STATIC_DRAW
    );
  }

  translate(tx: number, ty: number, tz: number) {
    glMatrix.mat4.translate(this.TRANSMATRIX, this.TRANSMATRIX, [tx, ty, tz]);
    for (let i = 0; i < this.child.length; i++) {
      this.child[i].translate(tx, ty, tz);
    }
  }

  #rotateChildren(
    ax: number,
    ay: number,
    az: number,
    x: number,
    y: number,
    z: number,
    depth = 1
  ) {
    while (this.ROTATEMATRICES.length <= depth) {
      this.ROTATEMATRICES.push(glMatrix.mat4.create());
    }
    glMatrix.mat4.translate(
      this.ROTATEMATRICES[depth],
      this.ROTATEMATRICES[depth],
      [x, y, z]
    );
    glMatrix.mat4.rotateX(
      this.ROTATEMATRICES[depth],
      this.ROTATEMATRICES[depth],
      ax
    );
    glMatrix.mat4.rotateY(
      this.ROTATEMATRICES[depth],
      this.ROTATEMATRICES[depth],
      ay
    );
    glMatrix.mat4.rotateZ(
      this.ROTATEMATRICES[depth],
      this.ROTATEMATRICES[depth],
      az
    );
    glMatrix.mat4.translate(
      this.ROTATEMATRICES[depth],
      this.ROTATEMATRICES[depth],
      [-x, -y, -z]
    );
    this.rotation.x += ax;
    this.rotation.y += ay;
    this.rotation.z += az;
    for (let i = 0; i < this.child.length; i++) {
      this.child[i].#rotateChildren(ax, ay, az, x, y, z, depth + 1);
    }
  }

  rotate(ax: number, ay: number, az: number) {
    glMatrix.mat4.translate(
      this.ROTATEMATRICES[0],
      this.ROTATEMATRICES[0],
      this.origin
    );
    glMatrix.mat4.rotateX(this.ROTATEMATRICES[0], this.ROTATEMATRICES[0], ax);
    glMatrix.mat4.rotateY(this.ROTATEMATRICES[0], this.ROTATEMATRICES[0], ay);
    glMatrix.mat4.rotateZ(this.ROTATEMATRICES[0], this.ROTATEMATRICES[0], az);
    glMatrix.mat4.translate(this.ROTATEMATRICES[0], this.ROTATEMATRICES[0], [
      -this.origin[0],
      -this.origin[1],
      -this.origin[2],
    ]);
    this.rotation.x += ax;
    this.rotation.y += ay;
    this.rotation.z += az;
    for (let i = 0; i < this.child.length; i++) {
      this.child[i].#rotateChildren(
        ax,
        ay,
        az,
        this.origin[0],
        this.origin[1],
        this.origin[2]
      );
    }
  }

  #scaleChildren(
    kx: number,
    ky: number,
    kz: number,
    x: number,
    y: number,
    z: number
  ) {
    glMatrix.vec3.add(this.origin, this.origin, [x, y, z]);
    glMatrix.vec3.multiply(this.origin, this.origin, [kx, ky, kz]);
    glMatrix.vec3.add(this.origin, this.origin, [-x, -y, -z]);

    glMatrix.mat4.translate(this.SCALEMATRIX, this.SCALEMATRIX, [x, y, z]);
    glMatrix.mat4.scale(this.SCALEMATRIX, this.SCALEMATRIX, [kx, ky, kz]);
    glMatrix.mat4.translate(this.SCALEMATRIX, this.SCALEMATRIX, [-x, -y, -z]);
    for (let i = 0; i < this.child.length; i++) {
      this.child[i].scale(kx, ky, kz);
    }
  }

  scale(kx: number, ky: number, kz: number) {
    glMatrix.mat4.translate(this.SCALEMATRIX, this.SCALEMATRIX, this.origin);
    glMatrix.mat4.scale(this.SCALEMATRIX, this.SCALEMATRIX, [kx, ky, kz]);
    glMatrix.mat4.translate(this.SCALEMATRIX, this.SCALEMATRIX, [
      -this.origin[0],
      -this.origin[1],
      -this.origin[2],
    ]);
    for (let i = 0; i < this.child.length; i++) {
      this.child[i].#scaleChildren(kx, ky, kz, ...this.origin);
    }
  }

  #rotateArbitraryAxisChildren(
    n1: number,
    n2: number,
    n3: number,
    m1: number,
    m2: number,
    m3: number,
    theta: number,
    depth = 1
  ) {
    while (this.ROTATEMATRICES.length <= depth) {
      this.ROTATEMATRICES.push(glMatrix.mat4.create());
    }
    let a = m1;
    let b = m2;
    let c = m3;
    let l = Math.sqrt(a * a + b * b + c * c);
    let v = Math.sqrt(b * b + c * c);
    let translate = glMatrix.mat4.fromValues(
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      n1,
      n2,
      n3,
      1
    );
    let translateInv = glMatrix.mat4.fromValues(
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      -n1,
      -n2,
      -n3,
      1
    );
    let rotateX = glMatrix.mat4.fromValues(
      1,
      0,
      0,
      0,
      0,
      c / v,
      b / v,
      0,
      0,
      -b / v,
      c / v,
      0,
      0,
      0,
      0,
      1
    );
    let rotateY = glMatrix.mat4.fromValues(
      v / l,
      0,
      a / l,
      0,
      0,
      1,
      0,
      0,
      -a / l,
      0,
      v / l,
      0,
      0,
      0,
      0,
      1
    );
    let rotateZ = glMatrix.mat4.fromValues(
      Math.cos(theta),
      -Math.sin(theta),
      0,
      0,
      Math.sin(theta),
      Math.cos(theta),
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    );
    let invX = glMatrix.mat4.create();
    let invY = glMatrix.mat4.create();
    glMatrix.mat4.invert(invX, rotateX);
    glMatrix.mat4.invert(invY, rotateY);

    glMatrix.mat4.multiply(
      this.ROTATEMATRICES[depth],
      translate,
      this.ROTATEMATRICES[depth]
    );
    glMatrix.mat4.multiply(
      this.ROTATEMATRICES[depth],
      rotateX,
      this.ROTATEMATRICES[depth]
    );
    glMatrix.mat4.multiply(
      this.ROTATEMATRICES[depth],
      rotateY,
      this.ROTATEMATRICES[depth]
    );
    glMatrix.mat4.multiply(
      this.ROTATEMATRICES[depth],
      rotateZ,
      this.ROTATEMATRICES[depth]
    );
    glMatrix.mat4.multiply(
      this.ROTATEMATRICES[depth],
      invY,
      this.ROTATEMATRICES[depth]
    );
    glMatrix.mat4.multiply(
      this.ROTATEMATRICES[depth],
      invX,
      this.ROTATEMATRICES[depth]
    );
    glMatrix.mat4.multiply(
      this.ROTATEMATRICES[depth],
      translateInv,
      this.ROTATEMATRICES[depth]
    );

    for (let i = 0; i < this.child.length; i++) {
      // this.child[i].rotateArbitraryAxis(n1, n2, n3, m1, m2, m3, theta, depth + 1);
      this.child[i].#rotateArbitraryAxisChildren(
        n1,
        n2,
        n3,
        m1,
        m2,
        m3,
        theta,
        depth + 1
      );
    }
  }

  rotateArbitraryAxis(m1: number, m2: number, m3: number, theta: number) {
    let a = m1;
    let b = m2;
    let c = m3;
    let l = Math.sqrt(a * a + b * b + c * c);
    let v = Math.sqrt(b * b + c * c);
    let translate = glMatrix.mat4.fromValues(
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      -this.origin[0],
      -this.origin[1],
      -this.origin[2],
      1
    );
    let translateInv = glMatrix.mat4.fromValues(
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      ...this.origin,
      1
    );
    let rotateX = glMatrix.mat4.fromValues(
      1,
      0,
      0,
      0,
      0,
      c / v,
      b / v,
      0,
      0,
      -b / v,
      c / v,
      0,
      0,
      0,
      0,
      1
    );
    let rotateY = glMatrix.mat4.fromValues(
      v / l,
      0,
      a / l,
      0,
      0,
      1,
      0,
      0,
      -a / l,
      0,
      v / l,
      0,
      0,
      0,
      0,
      1
    );
    let rotateZ = glMatrix.mat4.fromValues(
      Math.cos(theta),
      -Math.sin(theta),
      0,
      0,
      Math.sin(theta),
      Math.cos(theta),
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    );
    let invX = glMatrix.mat4.create();
    let invY = glMatrix.mat4.create();
    glMatrix.mat4.invert(invX, rotateX);
    glMatrix.mat4.invert(invY, rotateY);

    glMatrix.mat4.multiply(
      this.ROTATEMATRICES[0],
      translate,
      this.ROTATEMATRICES[0]
    );
    glMatrix.mat4.multiply(
      this.ROTATEMATRICES[0],
      rotateX,
      this.ROTATEMATRICES[0]
    );
    glMatrix.mat4.multiply(
      this.ROTATEMATRICES[0],
      rotateY,
      this.ROTATEMATRICES[0]
    );
    glMatrix.mat4.multiply(
      this.ROTATEMATRICES[0],
      rotateZ,
      this.ROTATEMATRICES[0]
    );
    glMatrix.mat4.multiply(
      this.ROTATEMATRICES[0],
      invY,
      this.ROTATEMATRICES[0]
    );
    glMatrix.mat4.multiply(
      this.ROTATEMATRICES[0],
      invX,
      this.ROTATEMATRICES[0]
    );
    glMatrix.mat4.multiply(
      this.ROTATEMATRICES[0],
      translateInv,
      this.ROTATEMATRICES[0]
    );

    for (let i = 0; i < this.child.length; i++) {
      this.child[i].#rotateArbitraryAxisChildren(
        ...this.origin,
        m1,
        m2,
        m3,
        theta
      );
    }
  }

  setUniform4(PROJMATRIX: glMatrix.mat4, VIEWMATRIX: glMatrix.mat4) {
    this.PROJMATRIX = PROJMATRIX;
    this.VIEWMATRIX = VIEWMATRIX;

    let MOVEMATRIX = glMatrix.mat4.create();
    glMatrix.mat4.multiply(MOVEMATRIX, this.INIT_SCALEMATRIX, MOVEMATRIX);
    glMatrix.mat4.multiply(MOVEMATRIX, this.INIT_ROTATEMATRIX, MOVEMATRIX);
    glMatrix.mat4.multiply(MOVEMATRIX, this.INIT_TRANSMATRIX, MOVEMATRIX);

    glMatrix.mat4.multiply(MOVEMATRIX, this.SCALEMATRIX, MOVEMATRIX);
    for (let i = 0; i < this.ROTATEMATRICES.length; i++) {
      glMatrix.mat4.multiply(MOVEMATRIX, this.ROTATEMATRICES[i], MOVEMATRIX);
    }
    glMatrix.mat4.multiply(MOVEMATRIX, this.TRANSMATRIX, MOVEMATRIX);

    this.MOVEMATRIX = MOVEMATRIX;

    let NORMALMATRIX = glMatrix.mat4.create();
    glMatrix.mat4.multiply(NORMALMATRIX, VIEWMATRIX, MOVEMATRIX);
    glMatrix.mat4.invert(NORMALMATRIX, NORMALMATRIX);
    glMatrix.mat4.transpose(NORMALMATRIX, NORMALMATRIX);

    this.NORMALMATRIX = NORMALMATRIX;

    for (let i = 0; i < this.child.length; i++) {
      this.child[i].setUniform4(PROJMATRIX, VIEWMATRIX);
    }
  }

  setLocalTranslation(x: number, y: number, z: number) {
    glMatrix.mat4.fromTranslation(this.INIT_TRANSMATRIX, [x, y, z]);
  }

  setLocalRotation(ax: number, ay: number, az: number) {
    glMatrix.mat4.identity(this.INIT_ROTATEMATRIX);
    glMatrix.mat4.rotateX(this.INIT_ROTATEMATRIX, this.INIT_ROTATEMATRIX, ax);
    glMatrix.mat4.rotateY(this.INIT_ROTATEMATRIX, this.INIT_ROTATEMATRIX, ay);
    glMatrix.mat4.rotateZ(this.INIT_ROTATEMATRIX, this.INIT_ROTATEMATRIX, az);
  }

  setLocalScale(kx: number, ky: number, kz: number) {
    glMatrix.mat4.fromScaling(this.INIT_SCALEMATRIX, [kx, ky, kz]);
  }

  queueBatch() {
    const result: Object3D[] = [];
    result.push(this);
    for (let i = 0; i < this.child.length; i++) {
      result.push(...this.child[i].queueBatch());
    }

    return result;
  }

  drawBatch() {
    // Set uniforms
    Object3D.GL.uniformMatrix4fv(this._Pmatrix, false, this.PROJMATRIX);
    Object3D.GL.uniformMatrix4fv(this._Vmatrix, false, this.VIEWMATRIX);
    Object3D.GL.uniformMatrix4fv(this._Mmatrix, false, this.MOVEMATRIX);
    Object3D.GL.uniformMatrix4fv(this._Nmatrix, false, this.NORMALMATRIX);

    // Bind data buffers
    Object3D.GL.bindBuffer(Object3D.GL.ARRAY_BUFFER, this.OBJECT_VERTEX);
    Object3D.GL.bindBuffer(Object3D.GL.ELEMENT_ARRAY_BUFFER, this.OBJECT_FACES);

    // Set vertex attributes
    Object3D.GL.vertexAttribPointer(
      this._position,
      3,
      Object3D.GL.FLOAT,
      false,
      (3 + 3 + 3) * 4,
      0
    );
    Object3D.GL.vertexAttribPointer(
      this._normal,
      3,
      Object3D.GL.FLOAT,
      false,
      (3 + 3 + 3) * 4,
      3 * 4
    );
    Object3D.GL.vertexAttribPointer(
      this._color,
      3,
      Object3D.GL.FLOAT,
      false,
      (3 + 3 + 3) * 4,
      (3 + 3) * 4
    );

    // Draw the stuff
    Object3D.GL.drawElements(
      Object3D.GL.TRIANGLES,
      this.object_faces.length,
      Object3D.GL.UNSIGNED_SHORT,
      0
    );
  }

  draw() {
    this.shader.use();

    Object3D.GL.uniformMatrix4fv(this._Pmatrix, false, this.PROJMATRIX);
    Object3D.GL.uniformMatrix4fv(this._Vmatrix, false, this.VIEWMATRIX);
    Object3D.GL.uniformMatrix4fv(this._Mmatrix, false, this.MOVEMATRIX);
    Object3D.GL.uniformMatrix4fv(this._Nmatrix, false, this.NORMALMATRIX);

    Object3D.GL.bindBuffer(Object3D.GL.ARRAY_BUFFER, this.OBJECT_VERTEX);
    Object3D.GL.vertexAttribPointer(
      this._position,
      3,
      Object3D.GL.FLOAT,
      false,
      (3 + 3 + 3) * 4,
      0
    );
    Object3D.GL.vertexAttribPointer(
      this._normal,
      3,
      Object3D.GL.FLOAT,
      false,
      (3 + 3 + 3) * 4,
      3 * 4
    );
    Object3D.GL.vertexAttribPointer(
      this._color,
      3,
      Object3D.GL.FLOAT,
      false,
      (3 + 3 + 3) * 4,
      (3 + 3) * 4
    );
    Object3D.GL.bindBuffer(Object3D.GL.ELEMENT_ARRAY_BUFFER, this.OBJECT_FACES);
    Object3D.GL.drawElements(
      Object3D.GL.TRIANGLES,
      this.object_faces.length,
      Object3D.GL.UNSIGNED_SHORT,
      0
    );

    for (let i = 0; i < this.child.length; i++) {
      this.child[i].draw();
    }
  }

  addChild(
    object: Object3D,
    ox = object.INIT_TRANSMATRIX[12],
    oy = object.INIT_TRANSMATRIX[13],
    oz = object.INIT_TRANSMATRIX[14]
  ) {
    object.parent = this;
    object.origin = [ox, oy, oz];
    this.child.push(object);
  }

  clone() {
    var object = new Object3D(
      this.object_vertex,
      this.object_faces,
      this.shader
    );
    object.INIT_SCALEMATRIX = glMatrix.mat4.clone(this.INIT_SCALEMATRIX);
    object.INIT_ROTATEMATRIX = glMatrix.mat4.clone(this.INIT_ROTATEMATRIX);
    object.INIT_TRANSMATRIX = glMatrix.mat4.clone(this.INIT_TRANSMATRIX);

    object.SCALEMATRIX = glMatrix.mat4.clone(this.SCALEMATRIX);
    object.ROTATEMATRICES = [];
    for (let i = 0; i < this.ROTATEMATRICES.length; i++) {
      object.ROTATEMATRICES.push(glMatrix.mat4.clone(this.ROTATEMATRICES[i]));
    }
    object.TRANSMATRIX = glMatrix.mat4.clone(this.TRANSMATRIX);

    object.origin = [this.origin[0], this.origin[1], this.origin[2]];

    for (let i = 0; i < this.child.length; i++) {
      let newChild = this.child[i].clone();
      object.child.push(newChild);
      newChild.parent = object;
    }
    return object;
  }
}

// class Object3DTexture extends Object3D {
//   static default_shader_vertex_source = `
//       attribute vec3 position;
//       uniform mat4 Pmatrix, Vmatrix, Mmatrix;
//       attribute vec2 uv;
//       varying vec2 vUV;

//       void main(void) {
//           gl_Position = Pmatrix * Vmatrix * Mmatrix * vec4(position, 1.);
//           vUV=uv;
//       }`;
//   static default_shader_fragment_source = `
//       precision mediump float;
//       uniform sampler2D sampler;
//       varying vec2 vUV;

//       void main(void) {
//           gl_FragColor = texture2D(sampler, vUV);
//           //gl_FragColor = vec4(1.,1.,1.,1.);
//       }`;

//   _sampler;
//   texture;
//   textureURL;

//   constructor(object_vertex, object_faces, textureURL) {
//     super(object_vertex, object_faces, Object3DTexture.default_shader_vertex_source, Object3DTexture.default_shader_fragment_source);
//     this.texture = GEO.loadTexture(textureURL);
//   }

//   initialize() {
//     this.shader_vertex = this.compile_shader(this.shader_vertex_source, Object3D.GL.VERTEX_SHADER, "VERTEX");
//     this.shader_fragment = this.compile_shader(this.shader_fragment_source, Object3D.GL.FRAGMENT_SHADER, "FRAGMENT");

//     this.SHADER_PROGRAM = Object3D.GL.createProgram();

//     Object3D.GL.attachShader(this.SHADER_PROGRAM, this.shader_vertex);
//     Object3D.GL.attachShader(this.SHADER_PROGRAM, this.shader_fragment);

//     Object3D.GL.linkProgram(this.SHADER_PROGRAM);

//     this._Pmatrix = Object3D.GL.getUniformLocation(this.SHADER_PROGRAM, "Pmatrix");
//     this._Vmatrix = Object3D.GL.getUniformLocation(this.SHADER_PROGRAM, "Vmatrix");
//     this._Mmatrix = Object3D.GL.getUniformLocation(this.SHADER_PROGRAM, "Mmatrix");

//     this._sampler = Object3D.GL.getUniformLocation(this.SHADER_PROGRAM, "sampler");

//     this._color = Object3D.GL.getAttribLocation(this.SHADER_PROGRAM, "uv");
//     this._position = Object3D.GL.getAttribLocation(this.SHADER_PROGRAM, "position");

//     Object3D.GL.enableVertexAttribArray(this._color);
//     Object3D.GL.enableVertexAttribArray(this._position);

//     Object3D.GL.useProgram(this.SHADER_PROGRAM);
//     Object3D.GL.uniform1i(this._sampler, 0);

//     this.OBJECT_VERTEX = Object3D.GL.createBuffer();
//     this.OBJECT_FACES = Object3D.GL.createBuffer();

//     Object3D.GL.bindBuffer(Object3D.GL.ARRAY_BUFFER, this.OBJECT_VERTEX);
//     Object3D.GL.bufferData(Object3D.GL.ARRAY_BUFFER, new Float32Array(this.object_vertex), Object3D.GL.STATIC_DRAW);

//     Object3D.GL.bindBuffer(Object3D.GL.ELEMENT_ARRAY_BUFFER, this.OBJECT_FACES);
//     Object3D.GL.bufferData(Object3D.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.object_faces), Object3D.GL.STATIC_DRAW);
//   }

//   draw() {
//     Object3D.GL.useProgram(this.SHADER_PROGRAM);
//     Object3D.GL.activeTexture(Object3D.GL.TEXTURE0);
//     Object3D.GL.bindTexture(Object3D.GL.TEXTURE_2D, this.texture);

//     Object3D.GL.bindBuffer(Object3D.GL.ARRAY_BUFFER, this.OBJECT_VERTEX);
//     Object3D.GL.vertexAttribPointer(this._position, 3, Object3D.GL.FLOAT, false, 4 * (3 + 2), 0);
//     Object3D.GL.vertexAttribPointer(this._color, 2, Object3D.GL.FLOAT, false, 4 * (3 + 2), 3 * 4);

//     Object3D.GL.bindBuffer(Object3D.GL.ELEMENT_ARRAY_BUFFER, this.OBJECT_FACES);
//     Object3D.GL.drawElements(Object3D.GL.TRIANGLE_STRIP, this.object_faces.length, Object3D.GL.UNSIGNED_SHORT, 0);
//     for (let i = 0; i < this.child.length; i++) {
//       this.child[i].draw();
//     }
//   }
// }
