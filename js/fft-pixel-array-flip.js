var imgBufs = [];
var imgPixels = [];
var fftimg;
var canvas;
var pixelData = [];
var brightnessData = [];
var brightnessCats = [];
var brightnessRange = 0.4;

let testimg;
let pink;

function preload() {
  // img = loadImage('../images/IMG_20200317_170411_hori.jpg');
  for(let i=0; i<9; i++){
    imgBufs[i] = loadImage('../images/ohzone/ohzone'+i+'.png');
  }
}

function setup() {
  frameRate(30);
  canvas = createCanvas(600, 600);
  canvas.parent('sketch-holder');
  canvas.id="booklet";
  canvas.mousePressed(startBuf);
  canvas.mouseReleased(freeImg);

  // frameP = createP();

  for(let i=0; i<imgBufs.length; i++){
    imgBufs[i].loadPixels();
    imgPixels[i] = imgBufs[i].pixels;
    brightnessData[i] = findBrightness(imgPixels[i]);
    brightnessCats[i] = pixelsToBins(brightnessData[i]);
  }

  fftimg = createImage(imgBufs[0].width, imgBufs[0].height);
  fftimg.loadPixels();

  pixelData = imgPixels[0];

}




// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
// }

function findBrightness(pixArray) {
  var data = [];
  for(let i=0; i<pixArray.length; i+= 4){
    var r = pixArray[i];
    var g = pixArray[i+1];
    var b = pixArray[i+2];
    var hsv = RGBtoHSV(r, g, b);
    var c = color(hsv.h, hsv.s, hsv.v);
    var val = brightness(c);
    data.push(val);
  }
  return data;
}

function RGBtoHSV(r, g, b) {
    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return { h: h, s: s, v: v };
}




function pixelsToBins(arrayIn) {
  var bandSize = brightnessRange/windowSize;
  var array2DOut = [];
  for(let i=0; i<windowSize; i++) {
    array2DOut[i] = [];
  }
  for (let i=0; i<arrayIn.length; i++){

    for (let j=0; j<windowSize; j++){
      var lowbound = bandSize*j;
      var highbound = bandSize*(j+1);
      if(lowbound<arrayIn[i] && arrayIn[i]<highbound){
        array2DOut[j].push(i);
        break;
      }
    }

  }
  return array2DOut;
}


function draw() {
  background(0);

  if(player.state == 'stopped'){
    textSize(24);
    fill(58, 20, 247);
    textStyle(ITALIC);
    text('click', 300, 300);
  }

  var imgIndex = floor(constrain(level*9, 0, 8.999));
  pixelData = imgPixels[imgIndex];

  for (let j=0; j<brightnessCats[imgIndex].length; j++) {
    for(let i=0; i<brightnessCats[imgIndex][j].length; i++) {
      var index = brightnessCats[imgIndex][j][i]*4;
      fftimg.pixels[index] = pixelData[index];
      fftimg.pixels[index+1] = pixelData[index+1];
      fftimg.pixels[index+2] = pixelData[index+2];
      fftimg.pixels[index+3] = bins[j]*255;
    }
  }

  fftimg.updatePixels();
  image(fftimg, 0, 0, 600, 600);

  // frameP.html(floor(frameRate()));
}
