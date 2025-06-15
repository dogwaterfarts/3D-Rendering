let lastX = 0;
let lastY = 0;

let canSpin = false
let canMove = true

document.addEventListener("mousemove", (event) => {
    let deltaX = event.clientX - lastX;
    let deltaY = event.clientY - lastY;

    if (canSpin) {
        camera.rotationX += deltaX / 400 * Math.PI;
        camera.rotationY += deltaY / 400 * 108 / 62 * Math.PI;
    }
    lastX = event.clientX;
    lastY = event.clientY;
});

document.addEventListener("keydown", function(event) {
    const moveSpeed = 10;
    canMove = CollisionDetection(camera, Shapes);
    
    switch (event.key) {
        case "w": { // Move forward
            camera.x += moveSpeed * Math.sin(camera.rotationX) * Math.cos(camera.rotationY);
            camera.y += moveSpeed * Math.sin(camera.rotationY);
            camera.z += moveSpeed * Math.cos(camera.rotationX) * Math.cos(camera.rotationY);
            break;
        }
        case "s": { // Move backward
            camera.x -= moveSpeed * Math.sin(camera.rotationX) * Math.cos(camera.rotationY);
            camera.y -= moveSpeed * Math.sin(camera.rotationY);
            camera.z -= moveSpeed * Math.cos(camera.rotationX) * Math.cos(camera.rotationY);
            break;
        }
        case "d": { // Strafe right
            camera.x += moveSpeed * Math.cos(camera.rotationX);
            camera.z -= moveSpeed * Math.sin(camera.rotationX);
            break;
        }
        case "a": { // Strafe left
            camera.x -= moveSpeed * Math.cos(camera.rotationX);
            camera.z += moveSpeed * Math.sin(camera.rotationX);
            break;
        }
        case "q": { // Move up
            camera.y -= moveSpeed;
            break;
        }
        case "e": { // Move down
            camera.y += moveSpeed;
            break;
        }
        case "l":
            lightMovement = !lightMovement;
            break;
    }
})

document.addEventListener('mousedown', function(event) {
    if (event.button === 2) {
        event.preventDefault();
        canSpin = true;
    }
});

document.addEventListener('mouseup', function(event) {
    if (event.button === 2) {
        event.preventDefault();
        canSpin = false;
    }
});

document.addEventListener('contextmenu', function(event) {
  event.preventDefault();
});

// const K = {
//     r: false,
//     l: false,
//     u: false,
//     d: false,

//     W: false,
//     A: false,
//     S: false,
//     D: false,
//     Q: false,
//     E: false,
// };

// const controls = () => {
//     document.addEventListener('keydown', (e) => {
//         switch (e.key) {
//             case 'ArrowUp':
//                 if (!K.d) K.u = true;
//                 break;
//             case 'ArrowLeft':
//                 if (!K.r) K.l = true;
//                 break;
//             case 'ArrowRight':
//                 if (!K.l) K.r = true;
//                 break;
//             case 'ArrowDown':
//                 if (!K.u) K.d = true;
//                 break;

//             case 'w':
//                 if (!K.S) K.W = true;
//                 break;
//             case 'a':
//                 if (!K.D) K.A = true;
//                 break;
//             case 's':
//                 if (!K.W) K.S = true;
//                 break;
//             case 'd':
//                 if (!K.A) K.D = true;
//                 break;
//             case 'q':
//                 if (!K.E) K.Q = true;
//                 break;
//             case 'e':
//                 if (!K.Q) K.E = true;
//                 break;
//         }
//     });

//     document.addEventListener('keyup', (e) => {
//         switch (e.key) {
//             case 'ArrowUp':
//                 K.u = false;
//                 break;
//             case 'ArrowLeft':
//                 K.l = false;
//                 break;
//             case 'ArrowRight':
//                 K.r = false;
//                 break;
//             case 'ArrowDown':
//                 K.d = false;
//                 break;

//             case 'w':
//                 K.W = false;
//                 break;
//             case 'a':
//                 K.A = false;
//                 break;
//             case 's':
//                 K.S = false;
//                 break;
//             case 'd':
//                 K.D = false;
//                 break;
//             case 'q':
//                 K.Q = false;
//                 break;
//             case 'e':
//                 K.E = false;
//                 break;
//         }
//     });
// }

// controls();