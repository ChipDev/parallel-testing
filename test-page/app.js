let scene, camera, renderer, particles;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create particles
    let geometry = new THREE.BufferGeometry();
    let vertices = [];

    for (let i = 0; i < 10000; i++) {
        let x = (Math.random() - 0.5) * 200;
        let y = (Math.random() - 0.5) * 200;
        let z = (Math.random() - 0.5) * 200;
        vertices.push(x, y, z);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    let material = new THREE.PointsMaterial({ color: 0x00ff00, size: 0.5 });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 300;

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    particles.rotation.x += 0.001;
    particles.rotation.y += 0.002;

    renderer.render(scene, camera);
}

init();
