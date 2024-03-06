import './style.css';
import p5 from 'p5';

const symbolSize = 14;
const spaceBetweenSymbols = 7;

class StreamsManager{
  streams = [];
  
  generateStreams() {
    for (let index = 0; index < window.innerWidth / symbolSize; index++) {
      this.streams.push(new Stream({
        x: index * symbolSize,
        y: Math.random() * -window.innerHeight / 3,
        speed: 6 + Math.random() * 20,
        sybolsCount: Math.round(6 + Math.random() * 14),
        opacity: Math.round(155 + Math.random() * 100)
      }));
    }
  }
  
  updateStreams(p) {
    this.streams.forEach(stream => {
      stream.update(p);
    });
  }
  drawStreams(p) {
    this.streams.forEach(s => {
      s.draw(p);
    });
  }
}

class Stream {
  symbols = [];
  intervals = [];

  constructor({x = 0, y = 0, speed = 5, opacity = 255, sybolsCount = 5}) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.opacity = opacity;
    this.symbolsCount = (sybolsCount > 0) ? sybolsCount : 5;
    this.symbolSize = Math.round(10 + Math.random() * (symbolSize - 10));
    this.leght = this.symbolsCount  *  this.symbolSize;
    for (var index = 0; index <= this.symbolsCount; index++) {
      this.symbols.push('');
      this.intervals.push(0);
    }
    this.initSymbols();
  }

  getRandomSymbol() {
    var charType = Math.random() * 5;

    if (charType > 1) {
      return String.fromCharCode(0x30A0 + Math.floor(Math.random() * 97));
    } else {
      return Math.floor(Math.random(0,10));
    }
  }

  initSymbols() {
    for (var index = 0; index <= this.symbolsCount; index++) {
      this.symbols[index] = this.getRandomSymbol();
      this.intervals[index] = Math.round(15 + Math.random() * 30);
    }
  }

  generateUpdateSymbols(p) {
    this.intervals.forEach((interval, index) => {
      if (p.frameCount % interval === 0) {
        this.symbols[index] = this.getRandomSymbol();
      }
    });
  }

  update(p) {
    this.y += this.speed  * p.deltaTime * 0.01;
    if (this.y > window.innerHeight + this.leght) {
      this.y = Math.random() * -window.innerHeight / 3;
    }

    this.generateUpdateSymbols(p);
  }

  draw(p) {
    p.fill(180, 255, 180, this.opacity);
    p.text(this.symbols[0], this.x, this.y);
    
    let color = p.color(0, 255, 70);
    for (var index = 1; index < this.symbols.length; index++) {
      color.setAlpha(this.opacity - index * 12);
      p.fill(color);
      p.text(this.symbols[index], this.x, this.y - index * symbolSize);
    }
  }
}

new p5(p => {
  const streamsManager = new StreamsManager();

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.noStroke();

    p.textFont('Consolas');
    p.textSize(symbolSize);

    streamsManager.generateStreams();
    p.frameRate(30);
  }

  p.draw = () => {    
    streamsManager.updateStreams(p);
    p.clear();
    streamsManager.drawStreams(p);
  }

  p.windowResized = () => {
    resizeCanvas(windowWidth, windowHeight);
  }
});