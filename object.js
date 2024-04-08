var GL;

class Object3D {
  object_vertex = [];
  OBJECT_VERTEX = GL.createBuffer();
  object_faces = [];
  OBJECT_FACES = GL.createBuffer();

  // Local transformation
  INIT_SCALEMATRIX = glMatrix.mat4.create();
  INIT_ROTATEMATRIX = glMatrix.mat4.create();
  INIT_TRANSMATRIX = glMatrix.mat4.create();

  // Transformation
  SCALEMATRIX = glMatrix.mat4.create();
  ROTATEMATRICES = [glMatrix.mat4.create()];
  TRANSMATRIX = glMatrix.mat4.create();
  origin = [0, 0, 0];

  // Relationship
  parent = null;
  child = [];

  // Shaders
  shader_vertex_source;
  shader_fragment_source;

  compile_shader = function (source, type, typeString) {
    var shader = GL.createShader(type);
    GL.shaderSource(shader, source);
    GL.compileShader(shader);
    if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
      alert("ERROR IN " + typeString + " SHADER: " + GL.getShaderInfoLog(shader));
      return false;
    }
    return shader;
  };

  shader_vertex;
  shader_fragment;
  SHADER_PROGRAM;
  _Pmatrix;
  _Vmatrix;
  _Mmatrix;
  _color;
  _position;

  constructor(object_vertex, object_faces, shader_vertex_source, shader_fragment_source) {
    this.object_vertex = object_vertex;
    this.object_faces = object_faces;
    this.shader_vertex_source = shader_vertex_source;
    this.shader_fragment_source = shader_fragment_source;

    this.shader_vertex = this.compile_shader(this.shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
    this.shader_fragment = this.compile_shader(this.shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");
    this.SHADER_PROGRAM = GL.createProgram();

    GL.attachShader(this.SHADER_PROGRAM, this.shader_vertex);
    GL.attachShader(this.SHADER_PROGRAM, this.shader_fragment);
    GL.linkProgram(this.SHADER_PROGRAM);

    this._Pmatrix = GL.getUniformLocation(this.SHADER_PROGRAM, "Pmatrix");
    this._Vmatrix = GL.getUniformLocation(this.SHADER_PROGRAM, "Vmatrix");
    this._Mmatrix = GL.getUniformLocation(this.SHADER_PROGRAM, "Mmatrix");

    this._color = GL.getAttribLocation(this.SHADER_PROGRAM, "color");
    this._position = GL.getAttribLocation(this.SHADER_PROGRAM, "position");

    GL.enableVertexAttribArray(this._color);
    GL.enableVertexAttribArray(this._position);

    GL.useProgram(this.SHADER_PROGRAM);
    this.initialize();
  }

  initialize() {
    GL.bindBuffer(GL.ARRAY_BUFFER, this.OBJECT_VERTEX);
    GL.bufferData(GL.ARRAY_BUFFER,
      new Float32Array(this.object_vertex),
      GL.STATIC_DRAW);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.OBJECT_FACES);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(this.object_faces),
      GL.STATIC_DRAW);
  }

  translate(tx, ty, tz) {
    glMatrix.mat4.translate(this.TRANSMATRIX, this.TRANSMATRIX, [tx, ty, tz]);
    for (let i = 0; i < this.child.length; i++) {
      this.child[i].translate(tx, ty, tz);
    }
  }

  #rotateChildren(ax, ay, az, x, y, z, depth = 1) {
    while (this.ROTATEMATRICES.length <= depth) {
      this.ROTATEMATRICES.push(glMatrix.mat4.create());
    }
    glMatrix.mat4.translate(this.ROTATEMATRICES[depth], this.ROTATEMATRICES[depth], [x, y, z]);
    glMatrix.mat4.rotateX(this.ROTATEMATRICES[depth], this.ROTATEMATRICES[depth], ax);
    glMatrix.mat4.rotateY(this.ROTATEMATRICES[depth], this.ROTATEMATRICES[depth], ay);
    glMatrix.mat4.rotateZ(this.ROTATEMATRICES[depth], this.ROTATEMATRICES[depth], az);
    glMatrix.mat4.translate(this.ROTATEMATRICES[depth], this.ROTATEMATRICES[depth], [-x, -y, -z]);
    for (let i = 0; i < this.child.length; i++) {
      this.child[i].#rotateChildren(ax, ay, az, x, y, z, depth + 1);
    }
  }

  rotate(ax, ay, az) {
    glMatrix.mat4.translate(this.ROTATEMATRICES[0], this.ROTATEMATRICES[0], this.origin);
    glMatrix.mat4.rotateX(this.ROTATEMATRICES[0], this.ROTATEMATRICES[0], ax);
    glMatrix.mat4.rotateY(this.ROTATEMATRICES[0], this.ROTATEMATRICES[0], ay);
    glMatrix.mat4.rotateZ(this.ROTATEMATRICES[0], this.ROTATEMATRICES[0], az);
    glMatrix.mat4.translate(this.ROTATEMATRICES[0], this.ROTATEMATRICES[0], [-this.origin[0], -this.origin[1], -this.origin[2]]);
    for (let i = 0; i < this.child.length; i++) {
      this.child[i].#rotateChildren(ax, ay, az, this.origin[0], this.origin[1], this.origin[2]);
    }
  }

  scale(kx, ky, kz) {
    glMatrix.vec3.multiply(this.origin, this.origin, [kx, ky, kz]);
    glMatrix.mat4.scale(this.SCALEMATRIX, this.SCALEMATRIX, [kx, ky, kz]);
    for (let i = 0; i < this.child.length; i++) {
      this.child[i].scale(kx, ky, kz);
    }
  }

  setUniform4(PROJMATRIX, VIEWMATRIX) {
    let MOVEMATRIX = glMatrix.mat4.create();
    glMatrix.mat4.multiply(MOVEMATRIX, this.INIT_SCALEMATRIX, MOVEMATRIX);
    glMatrix.mat4.multiply(MOVEMATRIX, this.INIT_ROTATEMATRIX, MOVEMATRIX);
    glMatrix.mat4.multiply(MOVEMATRIX, this.INIT_TRANSMATRIX, MOVEMATRIX);

    glMatrix.mat4.multiply(MOVEMATRIX, this.SCALEMATRIX, MOVEMATRIX);
    for (let i = 0; i < this.ROTATEMATRICES.length; i++) {
      glMatrix.mat4.multiply(MOVEMATRIX, this.ROTATEMATRICES[i], MOVEMATRIX);
    }
    glMatrix.mat4.multiply(MOVEMATRIX, this.TRANSMATRIX, MOVEMATRIX);

    GL.useProgram(this.SHADER_PROGRAM);
    GL.uniformMatrix4fv(this._Pmatrix, false, PROJMATRIX);
    GL.uniformMatrix4fv(this._Vmatrix, false, VIEWMATRIX);
    GL.uniformMatrix4fv(this._Mmatrix, false, MOVEMATRIX);

    for (let i = 0; i < this.child.length; i++) {
      this.child[i].setUniform4(PROJMATRIX, VIEWMATRIX);
    }
  }

  setLocalTranslation(x, y, z) {
    glMatrix.mat4.fromTranslation(this.INIT_TRANSMATRIX, [x, y, z]);
  }

  setLocalRotation(ax, ay, az) {
    glMatrix.mat4.identity(this.INIT_ROTATEMATRIX);
    glMatrix.mat4.rotateX(this.INIT_ROTATEMATRIX, this.INIT_ROTATEMATRIX, ax);
    glMatrix.mat4.rotateY(this.INIT_ROTATEMATRIX, this.INIT_ROTATEMATRIX, ay);
    glMatrix.mat4.rotateZ(this.INIT_ROTATEMATRIX, this.INIT_ROTATEMATRIX, az);
  }

  setLocalScale(kx, ky, kz) {
    glMatrix.mat4.fromScaling(this.INIT_SCALEMATRIX, [kx, ky, kz]);
  }

  draw() {
    GL.useProgram(this.SHADER_PROGRAM);
    GL.bindBuffer(GL.ARRAY_BUFFER, this.OBJECT_VERTEX);
    GL.vertexAttribPointer(this._position, 3, GL.FLOAT, false, 4 * (3 + 3), 0);
    GL.vertexAttribPointer(this._color, 3, GL.FLOAT, false, 4 * (3 + 3), 3 * 4);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.OBJECT_FACES);
    GL.drawElements(GL.TRIANGLES, this.object_faces.length, GL.UNSIGNED_SHORT, 0);

    for (let i = 0; i < this.child.length; i++) {
      this.child[i].draw();
    }
  }

  addChild(object, ox = this.INIT_TRANSMATRIX[12], oy  = this.INIT_TRANSMATRIX[13], oz  = this.INIT_TRANSMATRIX[14]) {
    object.parent = this;
    object.origin = [ox, oy, oz];
    this.child.push(object);
  }
}