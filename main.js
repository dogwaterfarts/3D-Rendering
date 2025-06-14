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

// Shapes[0] = new Cube({x: centerX - 200, y: centerY - 200, z: 100, w: 200, h: 200, d: 200})
Shapes[0] = new Cube({x: centerX, y: centerY, z: 0, w: 400, h: 100, d: 100, name: "other cube"})

// Shapes[0] = new Sphere({x: centerX, y: centerY, z: 0, radius: 200, segments: 20})

for (v of Shapes) {
    v.setUp()
}

const camera = new Camera({x: 0, y: 0, z: 0})

function addPerspective(point, fov, viewerDistance) {
    const z = viewerDistance * point.z;

    if (point.z <= 1) return null;

    const scale = fov / point.z

    return {
        x: point.x * scale + centerX,
        y: point.y * scale + centerY,
        z: point.z
    }

    // return {
    //     x: point.x + centerX,
    //     y: point.y + centerY,
    //     z: point.z
    // }
}

const engine = () => {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    console.log(camera.rotationX)

    for (let shape of Shapes) {
        let projected = []

        for (let v of shape.Vertices) {
            let translated = new Vertex(
                v.x - camera.x,
                v.y - camera.y,
                v.z - camera.z
            );

            let rotated = multiplyMatrices(rotYMatrix(camera.rotationX), translated);
            rotated = multiplyMatrices(rotXMatrix(camera.rotationY), rotated);
            // let rotated = multiplyMatrices(rotZMatrix(angle), translated);

            // let movedBack = new Vertex(
            //     rotated.x + center.x,
            //     rotated.y + center.y,
            //     rotated.z + center.z
            // );

            // let projected2D = multiplyMatrices(projectionMatrix, movedBack);

            let projected2D = addPerspective(rotated, camera.fov, camera.camZ)

            if (!projected2D) {projected.push(null); continue;}

            projected2D.x -= camera.x
            projected2D.y -= camera.y
            projected2D.z = rotated.z

            projected.push(projected2D)
        }

        orderByZOrdinate(projected)

        let trianglesWithDepth = [];
        
        for (let i = 0; i < shape.Triangles.length; i++) {
            const t = shape.Triangles[i];
            const p1 = projected[t[0]];
            const p2 = projected[t[1]];
            const p3 = projected[t[2]];

            // Skip triangles with vertices behind camera
            if (!p1 || !p2 || !p3) continue;

            // Calculate average Z depth for this triangle
            const avgZ = (p1.z + p2.z + p3.z) / 3;

            trianglesWithDepth.push({
                vertices: [p1, p2, p3],
                avgZ: avgZ
            });
        }

        // Sort triangles by depth (back to front)
        trianglesWithDepth.sort((a, b) => b.avgZ - a.avgZ);

        // Render sorted triangles
        for (let triangle of trianglesWithDepth) {
            const [p1, p2, p3] = triangle.vertices;
            
            drawLine(p1.x, p1.y, p2.x, p2.y);
            drawLine(p2.x, p2.y, p3.x, p3.y);
            drawLine(p3.x, p3.y, p1.x, p1.y);
            fillTriangle(p1, p2, p3, 0);
        }
    }

    requestAnimationFrame(engine);
}

engine();