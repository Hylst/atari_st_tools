export class WebGLRenderer {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private vertexBuffer: WebGLBuffer;
  private indexBuffer: WebGLBuffer;
  
  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl');
    if (!gl) {
      throw new Error('WebGL not supported');
    }
    this.gl = gl;
    this.program = this.createShaderProgram();
    this.vertexBuffer = gl.createBuffer()!;
    this.indexBuffer = gl.createBuffer()!;
    this.setupGL();
  }
  
  private createShaderProgram(): WebGLProgram {
    const vsSource = `
      attribute vec4 aVertexPosition;
      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;
      void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      }
    `;

    const fsSource = `
      void main() {
        gl_FragColor = vec4(0.8, 0.8, 0.8, 1.0);
      }
    `;
    
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vsSource);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fsSource);
    
    const program = this.gl.createProgram()!;
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      throw new Error('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(program));
    }
    
    return program;
  }

  private createShader(type: number, source: string): WebGLShader {
    const shader = this.gl.createShader(type)!;
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const info = this.gl.getShaderInfoLog(shader);
      this.gl.deleteShader(shader);
      throw new Error('An error occurred compiling the shaders: ' + info);
    }

    return shader;
  }
  
  private setupGL(): void {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  }
  
  render(mesh: any, camera: any): void {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    
    // Préparer les données de vertex
    const vertices = new Float32Array(mesh.vertices.flatMap(v => [
      v.position.x, v.position.y, v.position.z
    ]));
    
    // Préparer les indices
    const indices = new Uint16Array(mesh.faces.flatMap(f => f.vertices));
    
    // Charger les données dans les buffers
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
    
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indices, this.gl.STATIC_DRAW);
    
    // Configurer les attributs
    const vertexPosition = this.gl.getAttribLocation(this.program, 'aVertexPosition');
    this.gl.vertexAttribPointer(vertexPosition, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(vertexPosition);
    
    // Utiliser le programme shader
    this.gl.useProgram(this.program);
    
    // Définir les matrices uniformes
    const projectionMatrix = this.gl.getUniformLocation(this.program, 'uProjectionMatrix');
    const modelViewMatrix = this.gl.getUniformLocation(this.program, 'uModelViewMatrix');
    
    this.gl.uniformMatrix4fv(projectionMatrix, false, camera.projectionMatrix.m);
    this.gl.uniformMatrix4fv(modelViewMatrix, false, camera.modelViewMatrix.m);
    
    // Dessiner
    this.gl.drawElements(
      this.gl.TRIANGLES,
      indices.length,
      this.gl.UNSIGNED_SHORT,
      0
    );
  }
}