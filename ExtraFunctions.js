function fillTriangle(v1, v2, v3, alpha) {
    // console.log(JSON.stringify(v1))
    context.save();

    context.beginPath();
    context.moveTo(v1.x, v1.y);
    context.lineTo(v2.x, v2.y);
    context.lineTo(v3.x, v3.y);
    context.fillStyle = `rgb(0, 0, 0)`
    // context.fillStyle = "white";
    context.closePath();
    context.fill();

    context.restore();
}
