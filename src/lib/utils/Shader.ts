/**
 * @author Nathan Adhitya
 * @since 2024-04-26
 */
export class Shader<
  UniformNames extends string = string,
  AttributeNames extends string = string
> {
  readonly program: WebGLProgram;
  readonly gl: WebGLRenderingContext;

  readonly vertexShader: WebGLShader;
  readonly fragmentShader: WebGLShader;

  public readonly uniforms: Record<UniformNames, WebGLUniformLocation> =
    {} as any;
  public readonly attributes: Record<AttributeNames, number> = {} as any;

  constructor(
    gl: WebGLRenderingContext,
    vertexShader: string | WebGLShader,
    fragmentShader: string | WebGLShader
  ) {
    this.gl = gl;
    if (vertexShader instanceof WebGLShader) {
      this.vertexShader = vertexShader;
    } else {
      this.vertexShader = this.compileShader(gl.VERTEX_SHADER, vertexShader);
    }

    if (fragmentShader instanceof WebGLShader) {
      this.fragmentShader = fragmentShader;
    } else {
      this.fragmentShader = this.compileShader(
        gl.FRAGMENT_SHADER,
        fragmentShader
      );
    }

    this.program = gl.createProgram() as WebGLProgram;

    // Sanity check
    if (!this.program) {
      throw new Error("Failed to create program");
    }

    gl.attachShader(this.program, this.vertexShader);
    gl.attachShader(this.program, this.fragmentShader);
    gl.linkProgram(this.program);

    // Get all attributes and uniforms
    for (
      let i = 0,
        total = gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES);
      i < total;
      i++
    ) {
      const attrib = gl.getActiveAttrib(this.program, i);
      if (!attrib) break;

      const location = gl.getAttribLocation(this.program, attrib.name);
      (this.attributes as any)[attrib.name] = location;
      gl.enableVertexAttribArray(location);
    }

    for (
      let i = 0,
        total = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
      i < total;
      i++
    ) {
      const uniform = gl.getActiveUniform(this.program, i);
      if (!uniform) break;

      const location = gl.getUniformLocation(
        this.program,
        uniform.name
      ) as WebGLUniformLocation;
      (this.uniforms as any)[uniform.name] = location;
    }
  }
  public use() {
    this.gl.useProgram(this.program);
  }

  public clone(): Shader<UniformNames, AttributeNames> {
    return new Shader(this.gl, this.vertexShader, this.fragmentShader);
  }

  private compileShader(
    type:
      | WebGLRenderingContext["VERTEX_SHADER"]
      | WebGLRenderingContext["FRAGMENT_SHADER"],
    source: string
  ): WebGLShader {
    const gl = this.gl;
    const shader = gl.createShader(type);

    if (!shader) {
      throw new Error("Failed to create shader");
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error("Failed to compile shader: " + info);
    }

    return shader;
  }
}
