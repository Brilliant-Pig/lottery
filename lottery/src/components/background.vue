    <template>
        <div ref="container" class="particles-container"></div>
    </template>
    
    <script>
    import { Renderer, Camera, Geometry, Program, Mesh } from "ogl";
    
    export default {
        props: {
        particleCount: { type: Number, default: 200 },
        particleSpread: { type: Number, default: 10 },
        speed: { type: Number, default: 0.1 },
        particleColors: { type: Array, default: () => ["#ffffff", "#ffffff"] },
        moveParticlesOnHover: { type: Boolean, default: true },
        particleBaseSize: { type: Number, default: 100 },
        alphaParticles: { type: Boolean, default: false },
        disableRotation: { type: Boolean, default: false }
        },
        mounted() {
        this.initParticles();
        },
        beforeUnmount() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        if (this.gl && this.container && this.container.contains(this.gl.canvas)) {
            this.container.removeChild(this.gl.canvas);
        }
        },
        methods: {
        hexToRgb(hex) {
            hex = hex.replace(/^#/, "");
            if (hex.length === 3) {
            hex = hex.split("").map(c => c + c).join("");
            }
            const int = parseInt(hex, 16);
            return [
            ((int >> 16) & 255) / 255,
            ((int >> 8) & 255) / 255,
            (int & 255) / 255
            ];
        },
        initParticles() {
            this.container = this.$refs.container;
            if (!this.container) return;
    
            const renderer = new Renderer({ depth: false, alpha: true });
            this.gl = renderer.gl;
            this.container.appendChild(this.gl.canvas);
            this.gl.clearColor(0, 0, 0, 0);
    
            const camera = new Camera(this.gl, { fov: 15 });
            camera.position.set(0, 0, 20);
    
            const resize = () => {
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;
            renderer.setSize(width, height);
            camera.perspective({ aspect: this.gl.canvas.width / this.gl.canvas.height });
            };
            window.addEventListener("resize", resize, false);
            resize();
    
            const count = this.particleCount;
            const positions = new Float32Array(count * 3);
            const randoms = new Float32Array(count * 4);
            const colors = new Float32Array(count * 3);
    
            for (let i = 0; i < count; i++) {
            let x, y, z, len;
            do {
                x = Math.random() * 2 - 1;
                y = Math.random() * 2 - 1;
                z = Math.random() * 2 - 1;
                len = x * x + y * y + z * z;
            } while (len > 1 || len === 0);
            const r = Math.cbrt(Math.random());
            positions.set([x * r, y * r, z * r], i * 3);
            randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
            const col = this.hexToRgb(this.particleColors[Math.floor(Math.random() * this.particleColors.length)]);
            colors.set(col, i * 3);
            }
    
            const geometry = new Geometry(this.gl, {
            position: { size: 3, data: positions },
            random: { size: 4, data: randoms },
            color: { size: 3, data: colors }
            });
    
            const vertex = `
            attribute vec3 position;
            attribute vec4 random;
            attribute vec3 color;
            
            uniform mat4 modelMatrix;
            uniform mat4 viewMatrix;
            uniform mat4 projectionMatrix;
            uniform float uTime;
            uniform float uSpread;
            uniform float uBaseSize;
            
            varying vec4 vRandom;
            varying vec3 vColor;
            
            void main() {
                vRandom = random;
                vColor = color;
                
                vec3 pos = position * uSpread;
                pos.z *= 10.0;
                
                vec4 mPos = modelMatrix * vec4(pos, 1.0);
                float t = uTime;
                mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
                mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
                mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);
                
                vec4 mvPos = viewMatrix * mPos;
                gl_PointSize = uBaseSize / length(mvPos.xyz);
                gl_Position = projectionMatrix * mvPos;
            }
            `;
    
            const fragment = `
            precision highp float;
            
            uniform float uTime;
            uniform float uAlphaParticles;
            varying vec4 vRandom;
            varying vec3 vColor;
            
            void main() {
                vec2 uv = gl_PointCoord.xy;
                float d = length(uv - vec2(0.5));
                
                if(uAlphaParticles < 0.5) {
                if(d > 0.5) {
                    discard;
                }
                gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
                } else {
                float circle = smoothstep(0.5, 0.4, d) * 0.8;
                gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
                }
            }
            `;
    
            const program = new Program(this.gl, {
            vertex,
            fragment,
            uniforms: {
                uTime: { value: 0 },
                uSpread: { value: this.particleSpread },
                uBaseSize: { value: this.particleBaseSize },
                uAlphaParticles: { value: this.alphaParticles ? 1 : 0 }
            },
            transparent: true,
            depthTest: false
            });
    
            this.particles = new Mesh(this.gl, { mode: this.gl.POINTS, geometry, program });
            this.camera = camera;
            this.renderer = renderer;
    
            let lastTime = performance.now();
            let elapsed = 0;
    
            const update = (t) => {
            this.animationFrameId = requestAnimationFrame(update);
            const delta = t - lastTime;
            lastTime = t;
            elapsed += delta * this.speed;
    
            program.uniforms.uTime.value = elapsed * 0.001;
    
            if (!this.disableRotation) {
                this.particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1;
                this.particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15;
                this.particles.rotation.z += 0.01 * this.speed;
            }
    
            renderer.render({ scene: this.particles, camera });
            };
    
            this.animationFrameId = requestAnimationFrame(update);
        }
        }
    };
    </script>
    
    <style scoped>
    .particles-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        overflow: hidden;
    }
    </style>