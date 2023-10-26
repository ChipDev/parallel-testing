const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let socketColors = new Map();
let particleData = [];

let totalParticles = 0;
let inside = 0;

// Set up a connection with worker nodes
io.on('connection', (socket) => {
    console.log('Worker connected:', socket.id);

    socket.once('particleData', (data) => {
        let indexSet = new Set();
        for (let value of socketColors.values()) {
            indexSet.add(value.index);
        }

        let index = findLowestMissingNumber(indexSet);
        const rgb = generateRGB();
        socketColors.set(socket.id, {"color": rgb, "count": 0, "index": index, "name" : "Computer " + index});
        console.log("Assigned index ", index, " to id ", socket.id);
    }); 
    socket.on('particleData', (data, insideRadius) => {
        //console.log(data, insideRadius);
        data.forEach(d => {
            particleData.push(d); 
            totalParticles++;
        });
        inside+=insideRadius;
        //console.log(inside, totalParticles);
        socketColors.get(socket.id).count += data.length;
            
        
        socket.broadcast.emit('broadcastedParticleData', {'data': data, 'inside':inside,'total':totalParticles, 'color': socketColors.get(socket.id), 'computers': JSON.stringify([...socketColors])});
    });
    socket.on('disconnect', () => {
        socketColors.delete(socket.id);
        socket.broadcast.emit('disconnected', socket.id);
    });
});



// Serve the visualization
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/visualization.html');
});

server.listen(3000, () => {
    console.log('Master server listening on port 3000');
});

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function generateRGB() {
    rgb = HSVtoRGB(Math.random(), 1, 1);
    console.log(rgb);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
}

function findLowestMissingNumber(set) {
    let i = 1;
    while (set.has(i)) {
        i++;
    }
    return i;
}
