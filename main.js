const canvas = document.getElementById('c');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const canvasWidth = 1080;
const canvasHeight = 620;

const centerX = canvasWidth / 2;
const centerY = canvasHeight / 2;

let angle = 0;

const center = new Vertex(centerX, centerY, 0);

const Shapes = []

Shapes[0] = new Cube({x: 200, y: 100, z: 300, w: 200, h: 200, d: 200})
Shapes[1] = new Cube({x: 400, y: 300, z: 200, w: 400, h: 100, d: 100, name: "other cube"})

Shapes[2] = new Sphere({x: 0, y: 0, z: 0, radius: 100, segments: 30})

for (v of Shapes) {
    v.setUp()
}

const camera = new Camera({x: 0, y: 0, z: -500})

let light = new Light({
    x: centerX + 200,
    y: centerY - 300,
    z: -100,
    color: { r: 255, g: 255, b: 255 },
    intensity: 1
});

let time = 0
let lightMovement = true;

 const engine = () => {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.fillStyle = '#1a1a1a';
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    time += 0.02;
    
    // Animate light if enabled
    if (lightMovement) {
        light.x = centerX + Math.cos(time) * 400;
        light.y = centerY + Math.sin(time * 1.3) * 200;
        light.z = Math.sin(time * 0.7) * 300 - 200;
    }

    for (let shape of Shapes) {
        let projected = [];
        let worldVertices = [];

        for (let v of shape.Vertices) {
            let translated = new Vertex(
                v.x - camera.x,
                v.y - camera.y,
                v.z - camera.z
            );

            let rotated = multiplyMatrices(rotYMatrix(-camera.rotationX), translated);
            rotated = multiplyMatrices(rotXMatrix(camera.rotationY), rotated);

            let projected2D = addPerspective(rotated, camera.fov, camera.camZ);

            if (!projected2D) {
                projected.push(null);
                worldVertices.push(null);
                continue;
            }

            // projected2D.x -= camera.x;
            // projected2D.y -= camera.y;
            projected2D.z = rotated.z;

            projected.push(projected2D);
            worldVertices.push(v); // Store world coordinates for lighting
        }

        let trianglesWithDepth = [];
        
        for (let i = 0; i < shape.Triangles.length; i++) {
            const t = shape.Triangles[i];
            const p1 = projected[t[0]];
            const p2 = projected[t[1]];
            const p3 = projected[t[2]];

            const w1 = worldVertices[t[0]];
            const w2 = worldVertices[t[1]];
            const w3 = worldVertices[t[2]];

            if (!p1 || !p2 || !p3 || !w1 || !w2 || !w3) continue;

            // // Calculate surface normal in world space
            const edge1 = vectorSubtract(w2, w1);
            const edge2 = vectorSubtract(w3, w1);
            const normal = vectorNormalize(vectorCross(edge1, edge2));

            const avgZ = (p1.z + p2.z + p3.z) / 3;

            // trianglesWithDepth.push({
            //     vertices: [p1, p2, p3],
            //     worldVertices: [w1, w2, w3],
            //     normal: normal,
            //     avgZ: avgZ
            // });

            // SOLUTION 2: Back-face culling (don't render faces pointing away from camera)
            if (isTriangleFacingCamera(p1, p2, p3)) {
                trianglesWithDepth.push({
                    vertices: [p1, p2, p3],
                    worldVertices: [w1, w2, w3],
                    normal: normal,
                    avgZ: avgZ
                })
            }
        }

        trianglesWithDepth.sort((a, b) => b.avgZ - a.avgZ);

        for (let triangle of trianglesWithDepth) {
            const [p1, p2, p3] = triangle.vertices;
            const [w1, w2, w3] = triangle.worldVertices;
            
            // Draw wireframe (optional)
            // drawLine(p1.x, p1.y, p2.x, p2.y);
            // drawLine(p2.x, p2.y, p3.x, p3.y);
            // drawLine(p3.x, p3.y, p1.x, p1.y);
            
            // Fill triangle with lighting
            fillTriangle(p1, p2, p3, triangle.normal, w1, w2, w3, light, shape.color);
        }
    }

    requestAnimationFrame(engine);
}

engine();