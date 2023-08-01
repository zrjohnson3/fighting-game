function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attckBox.position.x + rectangle1.attckBox.width >=
      rectangle2.position.x &&
    rectangle1.attckBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attckBox.position.y + rectangle1.attckBox.height >=
      rectangle2.position.y &&
    rectangle1.attckBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

//Determine Winner
function determineWinner({ player, enemy }) {
  document.querySelector("#displayText").style.display = "flex";
  if (player.health === enemy.health) {
    console.log("Tie");
    document.querySelector("#displayText").innerHTML = "Tie";
  } else if (player.health > enemy.health) {
    console.log("Player 1 Wins");
    document.querySelector("#displayText").innerHTML = "Player 1 Wins!";
  } else if (player.health < enemy.health) {
    console.log("Player 2 Wins!");
    document.querySelector("#displayText").innerHTML = "Player 2 Wins!";
  }
}

// Timer Function
let timer = 60;
function decreaseTimer() {
  //Infinite loop but stops after certain amount of time
  if (timer > 0) {
    setTimeout(decreaseTimer, 1000);
    console.log(timer);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }

  if (timer === 0) {
    determineWinner({ player, enemy });
  }
}
