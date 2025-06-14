function fillTriangle(v1, v2, v3, normal, worldV1, worldV2, worldV3, light, materialColor = { r: 100, g: 150, b: 200 }, currentShape = null, allShapes = []) {
    if (!v1 || !v2 || !v3 || !worldV1 || !worldV2 || !worldV3) return;
    
    context.save();

    const centerWorld = {
        x: (worldV1.x + worldV2.x + worldV3.x) / 3,
        y: (worldV1.y + worldV2.y + worldV3.y) / 3,
        z: (worldV1.z + worldV2.z + worldV3.z) / 3
    };

    const lightDir = vectorNormalize(vectorSubtract(light, centerWorld));
    
    let intensity = Math.max(0, vectorDot(normal, lightDir));
    
    let shadowIntensity = 1.0;
    if (allShapes.length > 1) {
        shadowIntensity = calculateShadowIntensity(centerWorld, light, allShapes, currentShape);
    }
    
    const ambient = 0.15;
    intensity = Math.min(1, intensity + ambient);
    
    const directLight = Math.max(0, intensity - ambient);
    intensity = ambient + (directLight * shadowIntensity);

    const colorInfluence = 0.3;
    
    const lightColor = {
        r: (light.color.r / 255) * colorInfluence + (1 - colorInfluence),
        g: (light.color.g / 255) * colorInfluence + (1 - colorInfluence),
        b: (light.color.b / 255) * colorInfluence + (1 - colorInfluence)
    };

    const finalColor = {
        r: Math.floor(materialColor.r * intensity * lightColor.r * light.intensity),
        g: Math.floor(materialColor.g * intensity * lightColor.g * light.intensity),
        b: Math.floor(materialColor.b * intensity * lightColor.b * light.intensity)
    };

    finalColor.r = Math.max(0, Math.min(255, finalColor.r));
    finalColor.g = Math.max(0, Math.min(255, finalColor.g));
    finalColor.b = Math.max(0, Math.min(255, finalColor.b));

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
    if (!point || point.z <= 0) return null;

    const scale = fov / point.z;
    
    return {
        x: point.x * scale + centerX,
        y: point.y * scale + centerY,
        z: point.z
    };
}

function isTriangleFacingCamera(p1, p2, p3) {
    if (!p1 || !p2 || !p3) return false;
    
    const v1 = { x: p2.x - p1.x, y: p2.y - p1.y };
    const v2 = { x: p3.x - p1.x, y: p3.y - p1.y };
    
    const crossZ = v1.x * v2.y - v1.y * v2.x;
    
    return crossZ > 0;
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
    }
    return true; 
}