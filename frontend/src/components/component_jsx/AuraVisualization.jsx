

import React, { useEffect, useState } from 'react';
import { ReactP5Wrapper } from 'react-p5-wrapper';

function sketch(p5) {
  let particles = [];
  let flowField = [];
  let cols, rows;
  let scaleVal = 20;
  let zoff = 0;
  
  let currentSentiment = 0;
  let targetSentiment = 0;
  let currentHue = 200;
  let currentSpeed = 1;
  let currentDensity = 0.5;
  let isDarkMode = true;

  const lerp = (start, end, amt) => {
    return start + (end - start) * amt;
  };

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.colorMode(p5.HSB, 360, 100, 100, 100);
    p5.background(isDarkMode ? 0 : 95);

    cols = Math.floor(p5.width / scaleVal);
    rows = Math.floor(p5.height / scaleVal);

    flowField = new Array(cols * rows);

    for (let i = 0; i < 1000; i++) {
      particles.push(new Particle(p5));
    }
  };

  p5.updateWithProps = (props) => {
    if (props.sentiment !== undefined) {
      targetSentiment = props.sentiment;
    }
    if (props.isDarkMode !== undefined) {
      isDarkMode = props.isDarkMode;
    }
  };

  p5.draw = () => {
    // Background with fade effect
    if (isDarkMode) {
      p5.background(0, 0, 0, 10);
    } else {
      p5.background(0, 0, 95, 8);  // Light beige with fade
    }

    currentSentiment = lerp(currentSentiment, targetSentiment, 0.05);

    let targetHue;
    if (currentSentiment < 0) {
      targetHue = lerp(0, 240, (currentSentiment + 1));
    } else {
      targetHue = lerp(240, 120, currentSentiment);
    }
    currentHue = lerp(currentHue, targetHue, 0.05);

    let intensity = Math.abs(currentSentiment);
    currentSpeed = lerp(currentSpeed, 1 + intensity * 3, 0.05);
    currentDensity = lerp(currentDensity, 0.3 + intensity * 0.7, 0.05);

    let yoff = 0;
    for (let y = 0; y < rows; y++) {
      let xoff = 0;
      for (let x = 0; x < cols; x++) {
        let index = x + y * cols;
        let angle = p5.noise(xoff, yoff, zoff) * p5.TWO_PI * 2;
        let v = p5.constructor.Vector.fromAngle(angle);
        v.setMag(currentSpeed);
        flowField[index] = v;
        xoff += 0.1;
      }
      yoff += 0.1;
    }
    zoff += 0.005 * currentSpeed;

    particles.forEach(particle => {
      particle.follow(flowField, cols, scaleVal);
      particle.update();
      particle.edges();
      particle.show(p5, currentHue, currentDensity, isDarkMode);
    });
  };

  p5.windowResized = () => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    cols = Math.floor(p5.width / scaleVal);
    rows = Math.floor(p5.height / scaleVal);
    flowField = new Array(cols * rows);
  };

  class Particle {
    constructor(p5) {
      this.pos = p5.createVector(p5.random(p5.width), p5.random(p5.height));
      this.vel = p5.createVector(0, 0);
      this.acc = p5.createVector(0, 0);
      this.maxSpeed = 4;
      this.prevPos = this.pos.copy();
    }

    follow(flowField, cols, scaleVal) {
      let x = Math.floor(this.pos.x / scaleVal);
      let y = Math.floor(this.pos.y / scaleVal);
      let index = x + y * cols;
      let force = flowField[index];
      if (force) {
        this.applyForce(force);
      }
    }

    applyForce(force) {
      this.acc.add(force);
    }

    update() {
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }

    show(p5, hue, density, isDarkMode) {
      let alpha = density * 100;
      let brightness = isDarkMode ? 100 : 60;  // Darker particles in light mode
      let saturation = isDarkMode ? 80 : 70;
      
      p5.stroke(hue, saturation, brightness, alpha);
      p5.strokeWeight(2);
      p5.line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
      this.updatePrev();
    }

    updatePrev() {
      this.prevPos.x = this.pos.x;
      this.prevPos.y = this.pos.y;
    }

    edges() {
      if (this.pos.x > p5.width) {
        this.pos.x = 0;
        this.updatePrev();
      }
      if (this.pos.x < 0) {
        this.pos.x = p5.width;
        this.updatePrev();
      }
      if (this.pos.y > p5.height) {
        this.pos.y = 0;
        this.updatePrev();
      }
      if (this.pos.y < 0) {
        this.pos.y = p5.height;
        this.updatePrev();
      }
    }
  }
}

const AuraVisualization = ({ sentiment = 0, keywords = [], isDarkMode = true }) => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
      <ReactP5Wrapper sketch={sketch} sentiment={sentiment} keywords={keywords} isDarkMode={isDarkMode} />
    </div>
  );
};

export default AuraVisualization;