import { Shader } from "../utils/Shader";
import vertShader from "./default.vert";
import fragShader from "./default.frag";

type UniformNames = "Pmatrix" | "Vmatrix" | "Mmatrix" | "uNormalMatrix";
type AttributeNames = "position" | "color" | "normal";

export class DefaultShader extends Shader<UniformNames, AttributeNames> {
  constructor(gl: WebGLRenderingContext) {
    super(gl, vertShader, fragShader);
  }
}
