/*

To-Do List for Fighting Game
- x Project Setup
- x Move Characters with Event Listeners
- Attacks
- Health Bar Interface
- Game Timers and Game Over

*/

// Create Canvas and make it 2d
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d"); //set 2d or 3d (demensions in game)
// Create Canvas width and height
canvas.width = 1024; // 16 x 9 ratio
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

// global gravity varibale
const gravity = 0.7;

// Background Sprite
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

// Shop Sprite
const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: "./img/shop.png",
  scale: 2.75,
  framesMax: 6,
});

// Player Sprite
const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: "./img/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./img/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: { x: 100, y: 50 },
    width: 155,
    height: 50,
  },
});

// Enemy Sprite
const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "./img/kenji/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imageSrc: "./img/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./img/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./img/kenji/Take Hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./img/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: { x: -175, y: 50 },
    width: 155,
    height: 50,
  },
});

console.log(player);
console.log(enemy);

// Keys
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

decreaseTimer();

// Infinite loop to start animation
function animate() {
  // Create background frame and animate screen
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  // Render Background
  background.update();
  // Shop Sprite
  shop.update();
  // Starts rendering player and Enemy
  player.update();
  enemy.update();

  // Player movement
  player.velocity.x = 0;
  enemy.velocity.x = 0;

  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("jump");
  } else {
    player.switchSprite("idle");
  }

  // Player Jumping Animation
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  // Enemy movement
  enemy.velocity.x = 0;
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  // Enemy Animation
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  /* Detect Collision */

  // Player Attacking
  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit(20);
    //console.log("Player Attacked!");
    player.isAttacking = false;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  // If player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  // Enemy Attacking
  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking
  ) {
    player.takeHit(20);
    enemy.isAttacking = false;
    //console.log("Enemy Attacked!");
    // player.health -= 12;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  // If Enemy misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  // End Game Based on Health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy });
  }
}

animate(); // Start the Animation

window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    switch (event.key) {
      // ASDW Keys
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;

      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;

      case "w":
        player.velocity.y -= 15;
        player.lastKey = "w";
        break;
      case "s":
        player.velocity.y = -10;
        player.lastKey = "s";
        break;
      // case " ":
      //   if (event.key === " " && !player.isAttacking) {
      //     player.attack();
      //   }
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      // Arrow keys
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;

      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;

      case "ArrowUp":
        enemy.velocity.y -= 15;
        break;
      case "ArrowDown":
        //enemy.velocity.y = -10;
        //enemy.isAttacking = true;
        if (event.key === "ArrowDown" && !enemy.isAttacking) {
          enemy.attack();
        }
        enemy.lastKey = "ArrowRight";
        break;
    }
  }

  console.log(event.key);
});

window.addEventListener("keyup", (event) => {
  if (!player.dead) {
    switch (event.key) {
      case "d":
        keys.d.pressed = false;
        break;

      case "a":
        //player.velocity.x = 0;
        keys.a.pressed = false;
        break;
      // Attack Keys
      case " ":
        if (event.key === " " && !player.isAttacking) {
          player.attack();
        }
      // case " ":
      //   player.attack();
      //   break;
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = false;
        enemy.lastKey = "ArrowRight";
        break;

      case "ArrowLeft":
        keys.ArrowLeft.pressed = false;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowDown":
        //enemy.velocity.y = -10;
        enemy.isAttacking = false;
        break;
    }
  }
  console.log(event.key);
});
