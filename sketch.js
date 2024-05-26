const density = 'oIIccvv::++!!~~""..,,                        '

let video;
let asciiDiv;

// function preload() {
//     plants = loadImage("plants48x48.png")
// }

function setup() {
    noCanvas();
    video = createCapture(VIDEO, { flipped:true });
    video.size(windowWidth / 10, windowHeight / 10);
    video.hide()
    asciiDiv = createDiv();
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
            const avg = r * 0.2126 + g * 0.7152 + b * 0.0722
            const len = density.length;
            const charIndex = floor(map(avg, 0, 255, len, 0));
            const c = density.charAt(charIndex);
            if (c == ' ') asciiImage += '&nbsp;'
            else asciiImage += c;
        }
        asciiImage += '<br/>'
    }
    asciiDiv.html(asciiImage)
}