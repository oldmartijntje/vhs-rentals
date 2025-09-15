import dgram from 'dgram';
import fs from 'fs';

const PORT = 5000;
const BROADCAST_ADDR = '255.255.255.255';

// Songs database - will merge JSON files here
const songs = {};

// Load Thinking Miku
let data = JSON.parse(fs.readFileSync('./miku/thinking-miku.json', 'utf8'));
songs["Thinking Miku"] = data["Thinking Miku"];

// Load Baka Baka
data = JSON.parse(fs.readFileSync('./miku/baka-baka.json', 'utf8'));
songs["Baka Baka"] = data["Baka Baka"];

// Load Miku Beam
data = JSON.parse(fs.readFileSync('./miku/miku-beam.json', 'utf8'));
songs["Miku Beam"] = data["Miku Beam"];

// Load World is Mine
data = JSON.parse(fs.readFileSync('./miku/world-is-mine.json', 'utf8'));
songs["World is Mine"] = data["World is Mine"];


// Load Nonsense Vocals
data = JSON.parse(fs.readFileSync('./miku/ievan-polkka.json', 'utf8'));
songs["Ievan Polkka"] = data["Ievan Polkka"];


// Choose which song to play
const currentSong = songs["Thinking Miku"]; // or "Baka Baka"
let lineIndex = 0;

// Create UDP socket
const socket = dgram.createSocket('udp4');

socket.bind(() => {
    socket.setBroadcast(true);
    console.log(`Miku LAN singer ready on port ${PORT}`);
});

// Broadcast a line every 4 seconds
setInterval(() => {
    const message = currentSong[lineIndex];
    const buffer = Buffer.from(message);

    socket.send(buffer, 0, buffer.length, PORT, BROADCAST_ADDR, (err) => {
        if (err) console.error('Error sending message:', err);
        else console.log('🎤 Sent:', message);
    });

    lineIndex++;
    if (lineIndex >= currentSong.length) lineIndex = 0; // Loop the song
}, 4000);

// Listen for incoming Miku messages from other devices
socket.on('message', (msg, rinfo) => {
    console.log(`🎶 Heard from ${rinfo.address}: ${msg.toString()}`);
});
