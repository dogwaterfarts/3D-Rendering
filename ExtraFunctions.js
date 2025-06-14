function fillTriangle(v1, v2, v3, normal, worldV1, worldV2, worldV3, light, materialColor = { r: 100, g: 150, b: 200 }) {
    context.save();

    // Calculate triangle center in world space
    const centerWorld = {
        x: (worldV1.x + worldV2.x + worldV3.x) / 3,
        y: (worldV1.y + worldV2.y + worldV3.y) / 3,
        z: (worldV1.z + worldV2.z + worldV3.z) / 3
    };

    // Light direction from surface to light
    const lightDir = vectorNormalize(vectorSubtract(light, centerWorld));
    
    // Calculate lighting intensity using dot product
    let intensity = Math.max(0, vectorDot(normal, lightDir));
    
    // Add ambient lighting
    const ambient = 0.2;
    intensity = Math.min(1, intensity + ambient);

    // Apply lighting to material color
    const finalColor = {
        r: Math.floor(materialColor.r * intensity),
        g: Math.floor(materialColor.g * intensity),
        b: Math.floor(materialColor.b * intensity)
    };

    context.beginPath();
    context.moveTo(v1.x, v1.y);
    context.lineTo(v2.x, v2.y);
    context.lineTo(v3.x, v3.y);
    context.closePath();
    context.fillStyle = `rgb(${finalColor.r}, ${finalColor.g}, ${finalColor.b})`;
    context.strokeStyle = context.fillStyle;
    context.stroke();
    context.fill();

    context.restore();
}

function addPerspective(point, fov) {
    if (point.z <= 0) return null;

    const scale = fov / point.z;
    
    return {
        x: point.x * scale + centerX,
        y: point.y * scale + centerY,
        z: point.z
    };
}

function isTriangleFacingCamera(p1, p2, p3) {
    // Calculate screen-space normal using cross product
    const v1 = { x: p2.x - p1.x, y: p2.y - p1.y };
    const v2 = { x: p3.x - p1.x, y: p3.y - p1.y };
    
    // Cross product Z component (for 2D vectors, this is the "winding")
    const crossZ = v1.x * v2.y - v1.y * v2.x;
    
    // If positive, triangle is counter-clockwise (facing camera)
    return crossZ > 0;
}

function orderByZOrdinate(array) {
    array.sort((a,b) => {
        a.z - b.z;
    })
}

function CollisionDetection(player, collidableObjects) {
    for (const obj of collidableObjects) {
        const plrToObjectVector = {
            x: Math.abs(player.x - obj.x),
            y: Math.abs(player.y - obj.y),
            z: Math.abs(player.z - obj.z)
        };

        const plrToObjectMagnitude = Math.sqrt(plrToObjectVector.x ** 2 + plrToObjectVector.y ** 2 + plrToObjectVector.z ** 2);

        if (plrToObjectMagnitude <= 100) {
            return false;
        }

        return true; 
    }
}