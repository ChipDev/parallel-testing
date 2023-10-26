const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000');

function generateRandomParticles(count) {
    const particles = [];
    for (let i = 0; i < count; i++) {
        particles.push({
            x: (Math.random() *2) - 1,
            y: (Math.random() *2) - 1,
            z: (Math.random() *2) - 1
        });
    }
    const n = numInRadius(particles);
    return {data: particles, insideRadius: n};
}

setInterval(() => {
    const particleData = generateRandomParticles(2); // Generate 100 random particles
    socket.emit('particleData', particleData.data, particleData.insideRadius);
}, 50);

function numInRadius(particleData) {
    let num = 0;
    particleData.forEach(particle => {
        if (particle.x * particle.x + particle.y * particle.y + particle.z * particle.z <= 1) {
            num++;
        }
    });
    return num;
}
