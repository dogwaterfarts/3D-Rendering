const drawVertex = (x, y) => {
    context.fillStyle = 'white';
    context.beginPath();
    context.arc(x, y, 5, 0, Math.PI * 2);
    context.fill();
}

const drawLine = (x1, y1, x2, y2) => {
    context.strokeStyle = 'white';
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
}

class Vertex {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    draw() {
        context.fillStyle = 'white';
        context.beginPath();
        context.arc(this.x, this.y, 5, 0, Math.PI * 2);
        context.fill();
    }
}

class Cube {
    constructor({x, y, z, h = 100, w = 100, d = 100, name = "cube"}) {
        this.name = name

        this.x = x;
        this.y = y;
        this.z = z;

        this.w = w/2;
        this.h = h/2;
        this.d = d/2;

        this.Vertices = [];
        this.Triangles = [
            [0, 1, 2],  [1, 3, 2],
            [5, 4, 7],  [4, 6, 7],
            [4, 0, 6],  [0, 2, 6],
            [1, 5, 3],  [5, 7, 3],
            [4, 5, 0],  [5, 1, 0],
            [2, 3, 6],  [3, 7, 6],
        ];
    }

    setUp() {
        const x = this.x;
        const y = this.y;
        const z = this.z;

        const w = this.w;
        const h = this.h;
        const d = this.d;

        this.Vertices[0] = new Vertex(-w + x, -h + y, -d + z);
        this.Vertices[1] = new Vertex(w + x, -h + y, -d + z);
        this.Vertices[2] = new Vertex(-w + x, h + y, -d + z);
        this.Vertices[3] = new Vertex(w + x, h + y, -d + z);
        this.Vertices[4] = new Vertex(-w + x, -h + y, d + z);
        this.Vertices[5] = new Vertex(w + x, -h + y, d + z);
        this.Vertices[6] = new Vertex(-w + x, h + y, d + z);
        this.Vertices[7] = new Vertex(w + x, h + y, d + z);
    }
}

class Sphere {
    constructor({x, y, z, radius, segments}) {
        this.radius = radius;
        this.segments = segments;

        this.x = x;
        this.y = y;
        this.z = z;

        this.Vertices = [];
        this.Triangles = [];
    }

    setUp() {
        for (let i = 0; i <= this.segments; i++) {
            const theta = i* Math.PI / this.segments;

            for (let j = 0; j <= this.segments; j++) {
                const phi = 2 * j * Math.PI / this.segments;

                const x = this.radius * Math.sin(theta) * Math.cos(phi);
                const y = this.radius * Math.sin(theta) * Math.sin(phi);
                const z = this.radius * Math.cos(theta);

                this.Vertices.push(new Vertex(x + this.x, y + this.y, z + this.z))
            }
        }

        for (let i = 0; i < this.segments+1; i++) {
            for (let j = 0; j < this.segments; j++){
                const a = i * (this.segments + 1)  + j;
                const b = a + 1;
                const c = a + this.segments + 1;
                const d = c + 1;

                this.Triangles.push([a, b, c]);
                this.Triangles.push([b, d, c]);
            }
        }
    }
}

class Light {
    constructor({ x, y, z, color = { r: 255, g: 255, b: 255 }, intensity = 1 }) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.color = color;
        this.intensity = intensity;
    }
}

class Camera {
    constructor({ x, y, z }) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.camZ = 1;
        this.fov = 800;
        this.rotationX = 0;
        this.rotationY = 0;
    }
}