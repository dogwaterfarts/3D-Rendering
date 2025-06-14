// Shadow mapping functions
function rayTriangleIntersection(rayOrigin, rayDirection, v0, v1, v2) {
    const EPSILON = 0.0000001;
    
    const edge1 = vectorSubtract(v1, v0);
    const edge2 = vectorSubtract(v2, v0);
    const h = vectorCross(rayDirection, edge2);
    const a = vectorDot(edge1, h);
    
    if (a > -EPSILON && a < EPSILON) {
        return null; // Ray is parallel to triangle
    }
    
    const f = 1.0 / a;
    const s = vectorSubtract(rayOrigin, v0);
    const u = f * vectorDot(s, h);
    
    if (u < 0.0 || u > 1.0) {
        return null;
    }
    
    const q = vectorCross(s, edge1);
    const v = f * vectorDot(rayDirection, q);
    
    if (v < 0.0 || u + v > 1.0) {
        return null;
    }
    
    const t = f * vectorDot(edge2, q);
    
    if (t > EPSILON) {
        // Ray intersection
        return {
            distance: t,
            point: {
                x: rayOrigin.x + rayDirection.x * t,
                y: rayOrigin.y + rayDirection.y * t,
                z: rayOrigin.z + rayDirection.z * t
            }
        };
    }
    
    return null; // Line intersection but not ray intersection
}

function isPointInShadow(worldPoint, light, allShapes, excludeShape = null) {
    // Ray from point to light
    const lightDirection = vectorSubtract(light, worldPoint);
    const lightDistance = Math.sqrt(
        lightDirection.x * lightDirection.x + 
        lightDirection.y * lightDirection.y + 
        lightDirection.z * lightDirection.z
    );
    
    if (lightDistance === 0) return false;
    
    const normalizedLightDir = {
        x: lightDirection.x / lightDistance,
        y: lightDirection.y / lightDistance,
        z: lightDirection.z / lightDistance
    };
    
    // Start ray slightly above surface to avoid self-intersection
    const rayOrigin = {
        x: worldPoint.x + normalizedLightDir.x * 0.1,
        y: worldPoint.y + normalizedLightDir.y * 0.1,
        z: worldPoint.z + normalizedLightDir.z * 0.1
    };
    
    // Check intersection with all other shapes
    for (let shape of allShapes) {
        if (shape === excludeShape) continue;
        
        // Check all triangles of this shape
        for (let triangleIndices of shape.Triangles) {
            const v0 = shape.Vertices[triangleIndices[0]];
            const v1 = shape.Vertices[triangleIndices[1]];
            const v2 = shape.Vertices[triangleIndices[2]];
            
            const intersection = rayTriangleIntersection(
                rayOrigin, 
                normalizedLightDir, 
                v0, v1, v2
            );
            
            if (intersection && intersection.distance < lightDistance - 0.1) {
                return true; // Point is in shadow
            }
        }
    }
    
    return false; // Point is not in shadow
}

function calculateShadowIntensity(worldPoint, light, allShapes, excludeShape = null) {
    const shadowSamples = 4; // Number of shadow samples for softer shadows
    const lightRadius = 50; // Radius for soft shadows
    let shadowSum = 0;
    
    for (let i = 0; i < shadowSamples; i++) {
        // Create slightly offset light positions for soft shadows
        const angle1 = (i / shadowSamples) * Math.PI * 2;
        const angle2 = Math.random() * Math.PI * 2;
        const radius = Math.random() * lightRadius;
        
        const offsetLight = {
            x: light.x + Math.cos(angle1) * radius,
            y: light.y + Math.sin(angle1) * Math.cos(angle2) * radius,
            z: light.z + Math.sin(angle1) * Math.sin(angle2) * radius
        };
        
        if (isPointInShadow(worldPoint, offsetLight, allShapes, excludeShape)) {
            shadowSum += 1;
        }
    }
    
    return 1.0 - (shadowSum / shadowSamples); // 1.0 = no shadow, 0.0 = full shadow
}