var GL;

class Object3D {
  // Default Shader
  static default_shader_vertex_source = `
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec3 color;
    uniform mat4 Pmatrix;
    uniform mat4 Vmatrix;
    uniform mat4 Mmatrix;
    uniform mat4 uNormalMatrix;

    varying vec3 vColor;
    varying vec3 v_position;
    varying vec3 vNormal;
    varying vec3 vView;
    
    void main(void) {
        gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.0);
        vColor = color;

        vNormal = vec3(uNormalMatrix * vec4(normal, 1.0));

        // For fog
        v_position = (Vmatrix * Mmatrix * vec4(position, 1.)).xyz;
        vView = vec3(Vmatrix * Mmatrix * vec4(position, 1.));
    }`;
  static default_shader_fragment_source = `
    precision mediump float;
    varying vec3 vColor;

    vec4 u_fogColor = vec4(5. / 255., 13. / 255., 62. / 255., 1.);
    float u_fogNear = 0.1;
    float u_fogFar = 240.;

    varying vec3 v_position;
    varying vec3 vNormal;
    varying vec3 vView;

    // Info sumber cahaya
    const vec3 source_ambient_color = vec3(0.9,0.9,0.9);
    const vec3 source_diffuse_color = vec3(1. ,1., 1.);
    const vec3 source_specular_color = vec3(1.,1.,1.); 
    const vec3 source_direction = vec3(1.,1.,0.8);

    // Info objeknya tipe warna pada materialnya seperti apa
    const vec3 mat_ambient_color = vec3(0.3,0.3,0.3);
    const vec3 mat_diffuse_color = vec3(0.6,0.6,0.6);
    const vec3 mat_specular_color = vec3(0.2,0.2,0.2);
    const float mat_shininess = 0.1;

    void main(void) {
        vec3 I_ambient = source_ambient_color * mat_ambient_color;
        vec3 I_diffuse = source_diffuse_color * mat_diffuse_color * max(0., dot(vNormal, source_direction));
        vec3 V = normalize(vView);
        vec3 normal = normalize(vNormal);
        vec3 R = reflect(source_direction, normal);
        vec3 I_specular = source_specular_color*mat_specular_color*pow(max(dot(R,V),0.), mat_shininess);
        vec3 I = I_ambient + I_diffuse + I_specular;

        vec4 color = vec4(I * vColor, 1.);

        float fogDistance = length(v_position);
        float fogAmount = smoothstep(u_fogNear, u_fogFar, fogDistance);

        gl_FragColor = mix(color, u_fogColor, fogAmount);
    }`;

  object_vertex;
  OBJECT_VERTEX;
  object_faces;
  OBJECT_FACES;

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
  _Nmatrix;
  _color;
  _position;
  _normal;

  constructor(object_vertex, object_faces, shader_vertex_source = null, shader_fragment_source = null) {
    this.object_vertex = object_vertex;
    this.object_faces = object_faces;

    if (shader_vertex_source == null) this.shader_vertex_source = Object3D.default_shader_vertex_source;
    else this.shader_vertex_source = shader_vertex_source;
    if (shader_fragment_source == null) this.shader_fragment_source = Object3D.default_shader_fragment_source;
    else this.shader_fragment_source = shader_fragment_source;

    this.initialize();
  }

  initialize() {
    this.OBJECT_VERTEX = GL.createBuffer();
    this.OBJECT_FACES = GL.createBuffer();
    this.shader_vertex = this.compile_shader(this.shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
    this.shader_fragment = this.compile_shader(this.shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");
    this.SHADER_PROGRAM = GL.createProgram();

    GL.attachShader(this.SHADER_PROGRAM, this.shader_vertex);
    GL.attachShader(this.SHADER_PROGRAM, this.shader_fragment);
    GL.linkProgram(this.SHADER_PROGRAM);

    this._Pmatrix = GL.getUniformLocation(this.SHADER_PROGRAM, "Pmatrix");
    this._Vmatrix = GL.getUniformLocation(this.SHADER_PROGRAM, "Vmatrix");
    this._Mmatrix = GL.getUniformLocation(this.SHADER_PROGRAM, "Mmatrix");
    this._Nmatrix = GL.getUniformLocation(this.SHADER_PROGRAM, "uNormalMatrix");

    this._color = GL.getAttribLocation(this.SHADER_PROGRAM, "color");
    this._position = GL.getAttribLocation(this.SHADER_PROGRAM, "position");
    this._normal = GL.getAttribLocation(this.SHADER_PROGRAM, "normal");

    GL.enableVertexAttribArray(this._color);
    GL.enableVertexAttribArray(this._position);
    GL.enableVertexAttribArray(this._normal);

    GL.useProgram(this.SHADER_PROGRAM);

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

    let NORMALMATRIX = glMatrix.mat4.create();
    glMatrix.mat4.multiply(NORMALMATRIX, VIEWMATRIX, MOVEMATRIX);
    glMatrix.mat4.invert(NORMALMATRIX, NORMALMATRIX);
    glMatrix.mat4.transpose(NORMALMATRIX, NORMALMATRIX);
    
    GL.useProgram(this.SHADER_PROGRAM);
    GL.uniformMatrix4fv(this._Pmatrix, false, PROJMATRIX);
    GL.uniformMatrix4fv(this._Vmatrix, false, VIEWMATRIX);
    GL.uniformMatrix4fv(this._Mmatrix, false, MOVEMATRIX);
    GL.uniformMatrix4fv(this._Nmatrix, false, NORMALMATRIX);

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
    GL.vertexAttribPointer(this._position, 3, GL.FLOAT, false, (3 + 3 + 3) * 4, 0);
    GL.vertexAttribPointer(this._normal, 3, GL.FLOAT, false, (3 + 3 + 3) * 4, 3 * 4);
    GL.vertexAttribPointer(this._color, 3, GL.FLOAT, false, (3 + 3 + 3) * 4, (3 + 3) * 4);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.OBJECT_FACES);
    GL.drawElements(GL.TRIANGLES, this.object_faces.length, GL.UNSIGNED_SHORT, 0);

    for (let i = 0; i < this.child.length; i++) {
      this.child[i].draw();
    }
  }

  addChild(object, ox = object.INIT_TRANSMATRIX[12], oy = object.INIT_TRANSMATRIX[13], oz = object.INIT_TRANSMATRIX[14]) {
    object.parent = this;
    object.origin = [ox, oy, oz];
    this.child.push(object);
  }

  // Warning : Do not use for modelling
  // Child's local transformation can not be automatically adjusted to parent's future change
  clone() {
    var object = new Object3D(this.object_vertex, this.object_faces, this.shader_vertex_source, this.shader_fragment_source);
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

class Object3DTexture extends Object3D {
  static default_shader_vertex_source = `
      attribute vec3 position;
      uniform mat4 Pmatrix, Vmatrix, Mmatrix;
      attribute vec2 uv;
      varying vec2 vUV;
      
      void main(void) {
          gl_Position = Pmatrix * Vmatrix * Mmatrix * vec4(position, 1.);
          vUV=uv;
      }`;
  static default_shader_fragment_source = `
      precision mediump float;
      uniform sampler2D sampler;
      varying vec2 vUV;
      
      void main(void) {
          gl_FragColor = texture2D(sampler, vUV);
          //gl_FragColor = vec4(1.,1.,1.,1.);
      }`;

  _sampler;
  texture;
  textureURL;

  constructor(object_vertex, object_faces, textureURL) {
    super(object_vertex, object_faces, Object3DTexture.default_shader_vertex_source, Object3DTexture.default_shader_fragment_source);
    this.texture = GEO.loadTexture(textureURL);
  }

  initialize() {
    this.shader_vertex = this.compile_shader(this.shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
    this.shader_fragment = this.compile_shader(this.shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");

    this.SHADER_PROGRAM = GL.createProgram();

    GL.attachShader(this.SHADER_PROGRAM, this.shader_vertex);
    GL.attachShader(this.SHADER_PROGRAM, this.shader_fragment);

    GL.linkProgram(this.SHADER_PROGRAM);

    this._Pmatrix = GL.getUniformLocation(this.SHADER_PROGRAM, "Pmatrix");
    this._Vmatrix = GL.getUniformLocation(this.SHADER_PROGRAM, "Vmatrix");
    this._Mmatrix = GL.getUniformLocation(this.SHADER_PROGRAM, "Mmatrix");

    this._sampler = GL.getUniformLocation(this.SHADER_PROGRAM, "sampler");

    this._color = GL.getAttribLocation(this.SHADER_PROGRAM, "uv");
    this._position = GL.getAttribLocation(this.SHADER_PROGRAM, "position");

    GL.enableVertexAttribArray(this._color);
    GL.enableVertexAttribArray(this._position);

    GL.useProgram(this.SHADER_PROGRAM);
    GL.uniform1i(this._sampler, 0);

    this.OBJECT_VERTEX = GL.createBuffer();
    this.OBJECT_FACES = GL.createBuffer();

    GL.bindBuffer(GL.ARRAY_BUFFER, this.OBJECT_VERTEX);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.object_vertex), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.OBJECT_FACES);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.object_faces), GL.STATIC_DRAW);
  }

  draw() {
    GL.useProgram(this.SHADER_PROGRAM);
    GL.activeTexture(GL.TEXTURE0);
    GL.bindTexture(GL.TEXTURE_2D, this.texture);

    GL.bindBuffer(GL.ARRAY_BUFFER, this.OBJECT_VERTEX);
    GL.vertexAttribPointer(this._position, 3, GL.FLOAT, false, 4 * (3 + 2), 0);
    GL.vertexAttribPointer(this._color, 2, GL.FLOAT, false, 4 * (3 + 2), 3 * 4);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.OBJECT_FACES);
    GL.drawElements(GL.TRIANGLE_STRIP, this.object_faces.length, GL.UNSIGNED_SHORT, 0);
    for (let i = 0; i < this.child.length; i++) {
      this.child[i].draw();
    }
  }
}