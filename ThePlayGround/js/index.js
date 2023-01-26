// global funcionality
let myFooter = document.getElementById('footerText');
myFooter.innerText=`The Fox Play-Ground © ${new Date().getFullYear()}`

let player="";


let snakeImg = document.getElementById('snakeImg');
let piongImg = document.getElementById('piongImg');

let record={
    snake:0,
    pingpong:0
}
let recordVal = document.getElementById("recordVal");

function changePointer(){
    if(document.body.style.cursor == 'pointer') document.body.style.cursor = 'default'
    else document.body.style.cursor = 'pointer';
}

snakeImg.addEventListener('mouseover',(e)=>{
    changePointer();
});
snakeImg.addEventListener('mouseleave',(e)=>{
    changePointer();
});

piongImg.addEventListener('mouseover',(e)=>{
    changePointer();
});
piongImg.addEventListener('mouseleave',(e)=>{
    changePointer();
});

function writeScore(score){
    recordVal.innerText=score;
}

function recoverScore(e){
    if (e.target===snakeImg) 
        tmpRecord =record["snake"];
    else if(e.target===piongImg)
        tmpRecord =record["pingpong"];

    writeScore(tmpRecord);
}


snakeImg.addEventListener('click',(e)=>{
    recoverScore(e);
    playSnake();
});

piongImg.addEventListener('click',(e)=>{
    recoverScore(e);
    // playPingPong();
});

///SNAKE GAME FUNCIONALITY
function playSnake(){
    const canvas = document.getElementById("arenaCanvas");
    const ctx = canvas.getContext("2d");
    
    class SnakePart {
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }
    }
    
    let speed = 7;
    
    let tileCount = 20;
    let tileSize = canvas.width / tileCount - 2;
    
    let headX = 10;
    let headY = 10;
    const snakeParts = [];
    let tailLength = 2;
    
    let appleX = 5;
    let appleY = 5;
    
    let inputsXVelocity = 0;
    let inputsYVelocity = 0;
    
    let xVelocity = 0;
    let yVelocity = 0;
    
    let score = 0;
    
    const gulpSound = new Audio("./media/gulp.mp3");
    
    //game loop
    function drawGame() {
      xVelocity = inputsXVelocity;
      yVelocity = inputsYVelocity;
    
      changeSnakePosition();
      let result = isGameOver();
      if (result) {
        return;
      }
    
      clearScreen();
    
      checkAppleCollision();
      drawApple();
      drawSnake();
    
      drawScore();
    
      if (score > 5) {
        speed = 9;
      }
      if (score > 10) {
        speed = 11;
      }
    
      setTimeout(drawGame, 1000 / speed);
    }
    

    function updateScoreSnake(){
        if(score>record["snake"]){
            record["snake"]=score;
        }
        writeScore(record["snake"]);
    }

    function isGameOver() {
      let gameOver = false;
    
      if (yVelocity === 0 && xVelocity === 0) {
        return false;
      }
    
      //walls
      if (headX < 0) {
        gameOver = true;
      } else if (headX === tileCount) {
        gameOver = true;
      } else if (headY < 0) {
        gameOver = true;
      } else if (headY === tileCount) {
        gameOver = true;
      }
    
      for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        if (part.x === headX && part.y === headY) {
          gameOver = true;
          break;
        }
      }
    
    
        if (gameOver) {
          ctx.fillStyle = "white";
          ctx.font = "50px Sans";
    
          var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
          gradient.addColorStop("0", " magenta");

          ctx.fillStyle = gradient;
    
          ctx.fillText("Upss!!", canvas.width / 6.5, canvas.height / 2);
          updateScoreSnake();
        }
    

    
      return gameOver;
    }
    
    function drawScore() {
      ctx.fillStyle = "white";
      ctx.font = "10px Verdana";
      ctx.fillText("Score " + score, canvas.width - 50, 10);
    }
    
    function clearScreen() {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    function drawSnake() {
      ctx.fillStyle = "green";
      for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
      }
    
      snakeParts.push(new SnakePart(headX, headY)); //put an item at the end of the list next to the head
      while (snakeParts.length > tailLength) {
        snakeParts.shift(); // remove the furthet item from the snake parts if have more than our tail size.
      }
    
      ctx.fillStyle = "orange";
      ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
    }
    
    function changeSnakePosition() {
      headX = headX + xVelocity;
      headY = headY + yVelocity;
    }
    
    function drawApple() {
      ctx.fillStyle = "red";
      ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
    }
    
    function checkAppleCollision() {
      if (appleX === headX && appleY == headY) {
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        tailLength++;
        score++;
        gulpSound.play();
      }
    }
    
    document.body.addEventListener("keydown", pressedKey);
    
    function pressedKey(e) {
      //up
      if (e.keyCode == 38 ) {
        
        if (inputsYVelocity == 1) return;
        inputsYVelocity = -1;
        inputsXVelocity = 0;
      }
    
      //down
      if (e.keyCode == 40 ) {
        
        if (inputsYVelocity == -1) return;
        inputsYVelocity = 1;
        inputsXVelocity = 0;
      }
    
      //left
      if (e.keyCode == 37) {
        
        if (inputsXVelocity == 1) return;
        inputsYVelocity = 0;
        inputsXVelocity = -1;
      }
    
      //right
      if (e.keyCode == 39) {
        
        if (inputsXVelocity == -1) return;
        inputsYVelocity = 0;
        inputsXVelocity = 1;
      }
    }
    
    drawGame();

}

function changeNamePlayer(player){
    document.getElementById('playerName').innerHTML=player + " Record:";
}

function showHideBlockingDiv(){
  let disabled=document.getElementById("disableDiv");

  if(disabled.style.display!="none") {
      disabled.style.display="none";
  }
  else{ 
    disabled.style.display="block";  
  }
}

//pop-up window FUNCIONALITY
let usrNameQs="";

function loadPopUp(){
    setTimeout(()=>{
      document.querySelector(".popup").style.display = "block";
      usrNameQs=document.querySelector("#userName");
      console.log(`usrName when loading ${usrNameQs}`);
      usrNameQs.value="";
      changeNamePlayer("");
  },500);
}

window.addEventListener("load",loadPopUp());

document.querySelector("#close").addEventListener("click", ()=>{
    // console.log(e);
    showHideBlockingDiv();
    document.querySelector(".popup").style.display = "none";
});
document.querySelector("#letsgo").addEventListener("click", ()=>{
    // console.log(e);
    showHideBlockingDiv();
    let nameId = document.querySelector("#userName");
    player=nameId.value;
    //console.log(player);
    changeNamePlayer(player);
    
    document.querySelector(".popup").style.display = "none";
});





