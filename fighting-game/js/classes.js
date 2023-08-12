/* This file holds the Classes for the Game */

// Sprite Class - is any game image (static object or character)
class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.image = new Image(); // Creates new Image within JS Property
    this.image.src = imageSrc; // Sets Img src to the image being passed in
    this.scale = scale; // How much image should scale
    this.framesMax = framesMax; // Handle Frames and background images
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5; // This will change speed of frames
    this.offset = offset;
  }

  //Draw
  draw() {
    c.drawImage(
      this.image,
      // Croping Shop Image
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      // Placing image
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      // Scaling Image
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.framesElapsed++; // for every frame iteration it increases
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }

  // Call update when I want things to start moving or updating postion
  update() {
    this.draw();
    this.animateFrames();
    // this.framesElapsed++; // for every frame iteration it increases
    // if (this.framesElapsed % this.framesHold === 0) {
    //   if (this.framesCurrent < this.framesMax - 1) {
    //     this.framesCurrent++;
    //   } else {
    //     this.framesCurrent = 0;
    //   }
    // }
  }
}

// Fighter Class - fighter object (extends Sprite class to use some of those methods)
class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = "red",
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, Y: 0 },
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined },
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    });
    // this.position = position;
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.attckBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      //   offset: offset,
      offset: attackBox.offset, // This is the same as above line of code, if its same name you dont need to declare
      width: attackBox.width,
      height: attackBox.height,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    //   Moved Frames
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5; // This will change speed of frames
    this.sprites = sprites; // holds all sprites for fighter
    this.dead = false;

    // loop through sprites object
    for (const sprite in sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
    console.log(this.sprites);
  }

  // Call update when I want things to start moving or updating postion
  update() {
    // Draw and Animate frames
    this.draw();
    if (!this.dead) {
      this.animateFrames();
    }

    // Attack Box - draw onto character
    this.attckBox.position.x = this.position.x + this.attckBox.offset.x;
    this.attckBox.position.y = this.position.y + this.attckBox.offset.y;

    /* Only use this to show where attack box's are */
    // // Draw attack box onto animation
    // c.fillRect(
    //   this.attckBox.position.x,
    //   this.attckBox.position.y,
    //   this.attckBox.width,
    //   this.attckBox.height
    // );

    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    // Handle Gravity
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 95) {
      this.velocity.y = 0;
      this.position.y = 331.0999;
    } else {
      this.velocity.y += gravity;
    }

    // console.log(this.position.y);
  }

  attack() {
    this.switchSprite("attack1");
    this.isAttacking = true;
    // setTimeout(() => {
    //   this.isAttacking = false; // After 100ms it sets attacking back to false
    // }, 500);
  }

  takeHit(amt) {
    // this.switchSprite("takeHit");
    //this.health -= 20;
    this.health -= amt;

    if (this.health <= 0) {
      this.switchSprite("death");
    } else {
      this.switchSprite("takeHit");
    }
  }

  // Responsible for switching between different sprites
  switchSprite(sprite) {
    // Handle if dead
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1)
        this.dead = true;
      return;
    }
    //Overriding all other animations with the attack animation
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    )
      return;
    if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1
    )
      // Override when fighter gets hit
      return;
    switch (sprite) {
      case "idle":
        // Allows it to siwtch over to this sprite just onceW
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "takeHit":
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.framesMax = this.sprites.takeHit.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "death":
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.framesMax = this.sprites.death.framesMax;
          this.framesCurrent = 0;
        }
        break;
    }
  }
}
