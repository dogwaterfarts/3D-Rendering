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
    context.fillStyle = `rgb(${finalColor.r}, ${finalColor.g}, ${finalColor.b})`;
    context.closePath();
    context.fill();

    context.restore();
}