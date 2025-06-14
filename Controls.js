let lastX = 0;
let lastY = 0;

let canSpin = false

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
    switch (event.key) {
        case "w": {
            camera.y += 10 * Math.sin(camera.rotationY);
            camera.x += 10 * (Math.sin(camera.rotationX) * Math.cos(camera.rotationY));
            camera.camZ += 10 * (Math.cos(camera.rotationX) * Math.cos(camera.rotationY));
            console.log("monkey");
            break;
        }
        case "s": {
            camera.y -= 10 * Math.sin(camera.rotationY);
            camera.x -= 10 * (Math.sin(camera.rotationX) * Math.cos(camera.rotationY));
            camera.camZ -= 10 * (Math.cos(camera.rotationX) * Math.cos(camera.rotationY));
            console.log("monkey");
            break;
        }
        case "d": {
            camera.x += 10 * Math.cos(camera.rotationX);
            camera.camZ += 10 * -Math.sin(camera.rotationX);
            break;
        }
        case "a": {
            camera.x -= 10 * Math.cos(camera.rotationX);
            camera.camZ -= 10 * -Math.sin(camera.rotationX);
            break;
        }
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