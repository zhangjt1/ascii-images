const density = 'oIIccvv::++!!~~""..,,                  '
const colorArray = ['blue', 'red', 'lime', 'cyan', 'magenta', 'white']
const len = density.length;
const colorLen = colorArray.length;
const volLevels = [35, 25, 15, 5, 1]

let pressed =  false;
let video;
let asciiDiv;
let mic;
let analyserNode;

// function preload() {
//     plants = loadImage("plants48x48.png")
// }

function setup() {
    noCanvas();
    frameRate(30);
    video = createCapture(VIDEO, { flipped:true });
    video.size(windowWidth / 10, windowHeight / 10);
    video.hide()
    asciiDiv = createDiv();
    makeAudioHelper();
}

async function makeAudioHelper() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    const audioContext = new AudioContext();
    const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
    analyserNode = audioContext.createAnalyser();
    mediaStreamAudioSourceNode.connect(analyserNode);
    console.log('Made Stream')
}

function draw() {
    video.loadPixels();
    let asciiImage = ''
    for (let j = 0; j < video.height; j++) {
        for (let i = 0; i < video.width; i++) {
            const pixelIndex = (i + j * video.width) * 4;
            const r = video.pixels[pixelIndex + 0];
            const g = video.pixels[pixelIndex + 1];
            const b = video.pixels[pixelIndex + 2];
            const avg = Math.floor(r * 0.2126 + g * 0.7152 + b * 0.0722)
            const charIndex = floor(map(avg, 0, 255, len, 0));
            const c = density.charAt(charIndex);
            if (c == ' ') asciiImage += '&nbsp;'
            else asciiImage += c;
            asciiImage += '</span>';
        }
        asciiImage += '<br/>'
    }
    asciiDiv.html(asciiImage);
    asciiDiv.center('horizontal');

    if (pressed && frameCount % 3 == 0) {
        const pcmData = new Float32Array(analyserNode.fftSize);
        analyserNode.getFloatTimeDomainData(pcmData);
        let sumSquares = 0.0;
        for (const amplitude of pcmData) { sumSquares += amplitude*amplitude; }
        let volval = Math.sqrt(sumSquares / pcmData.length) * 100;
        // console.log(volval)
        if (volval > volLevels[0]) {
            asciiDiv.style('color', colorArray[Math.floor(Math.random() * colorLen)])
        }
        else if (volval > volLevels[1]) {
            asciiDiv.style('color', 'blue')
        }
        else if (volval > volLevels[2]) {
            asciiDiv.style('color', 'red')
        }
        else if (volval > volLevels[3]) {
            asciiDiv.style('color', 'orange')
        }
        else if (volval > volLevels[4]) {
            asciiDiv.style('color', 'yellow')
        }
        else {
            asciiDiv.style('color', 'white')
        }
    }
}

function mousePressed() {
    pressed = true;
}