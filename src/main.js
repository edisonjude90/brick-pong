

var canvas = document.getElementById("canvas-game");
var ctx = canvas.getContext("2d");
var wHeight = canvas.height = (window.innerHeight - 50); 
var wWidth = canvas.width = window.innerWidth - 10;
var noOfBricksPerRow = 10;
var noOfRows = 5;
var bricksWidth = (wWidth / noOfBricksPerRow);
var bricks;
var totalBricks = noOfRows * noOfBricksPerRow;

var gameControl = {
	point:0,
	pointHitCount:10,
	score:0,
	bestScore:0,
	maxLife:3,
	curLife:3,
	gameAbort:true,
	loopGame:function(){
		if (!gameControl.gameAbort){
			requestAnimationFrame(loop);
		}
	},
	stopGame:function(){
		gameControl.gameAbort = true;
		cancelAnimationFrame(loop);
	},
	updateScoreBoard:function(){

		gameControl.point += 1;
		gameControl.score = gameControl.point * gameControl.pointHitCount;
		document.getElementById("game-points").innerHTML = gameControl.score;

		if (gameControl.score == (gameControl.pointHitCount * totalBricks)){
			gameControl.stopGame();
			gameControl.gameStart();
		}

	},
	reduceGameLife:function(){
		gameControl.stopGame();
		gameControl.curLife -= 1;
		gameControl.updateGameLife();
	},
	updateGameLife:function(){

		if (gameControl.curLife == gameControl.maxLife){
			gameControl.gameStart();
		}
		else if (gameControl.curLife > 0){
			gameControl.gameContinue();
		}else if (gameControl.curLife == 0){
			gameControl.setBestScore(gameControl.score);
			gameControl.gameStart();
		}

		document.getElementById("game-life1").innerHTML = gameControl.curLife;
		document.getElementById("game-life2").innerHTML = gameControl.curLife;

	},
	gameStart:function(){
		bricks = [];
		gameControl.score = 0;
		gameControl.curLife = 3;
		document.getElementById("game-best-score").innerHTML = gameControl.getBestScore();
		document.getElementById("game-best-score-sec").style.display = "block";
		document.getElementById("btnStart").style.display = "inline-block";
		document.getElementById("btnContinue").style.display = "none";
		document.getElementById("game-popup").style.display = "block";
		document.getElementById("game-popup-background").style.display = "block";	
		document.getElementById("btnStart").focus();
	},
	gameContinue:function(){
		document.getElementById("game-best-score-sec").style.display = "none";
		document.getElementById("btnContinue").style.display = "inline-block";
		document.getElementById("btnStart").style.display = "none";
		document.getElementById("game-popup").style.display = "block";
		document.getElementById("game-popup-background").style.display = "block";	
		document.getElementById("btnContinue").focus();
	},
	initGame:function(){
		gameControl.updateGameLife();
	},
	setBestScore:function(score){

		var bestScore = gameControl.getBestScore();

		if (score > bestScore){
			localStorage.setItem("brick-pong-bestScore",score);
		} 

	},
	getBestScore:function(){

		var bestScore = localStorage.getItem("brick-pong-bestScore");
		bestScore = (bestScore) ? bestScore : 0;
		return bestScore;

	},

};

function Bricks(x,y){
	this.x = x;
	this.y = y;
	this.width = bricksWidth;
	this.height = 20;
	this.bgcolor = "#FFFFFF";
	this.bcolor = "#000000";
	this.active = true;
}

Bricks.prototype.draw = function(){

	ctx.beginPath();
	
	ctx.fillStyle = this.bgcolor;
	ctx.rect(this.x, this.y, this.width, this.height);
	ctx.fill();

	ctx.strokeStyle = this.bcolor;
	ctx.rect(this.x, this.y, this.width, this.height);
	ctx.stroke();
	

}

function Ball(x,y,xVel,yVel,size){
	this.x = x;
	this.y = x;
	this.xVel = xVel;
	this.yVel = yVel;
	this.size = size;
	this.color = "#FFFFFF";
}

Ball.prototype.update = function(){

    
  if (this.x + this.size >= wWidth){ // right of the screen
    this.xVel = -(this.xVel); 
  }

  if ((this.x - this.size) <= 0){ // left of the screen 
    this.xVel = -(this.xVel);
  }

  if ((this.y - this.size) <= 0){ // top of the screen
    this.yVel = -(this.yVel);
  }


  if (this.x >= bar.x && this.x <= (bar.x + bar.width) && this.y >= bar.y && this.y <= bar.y + bar.height){
	this.yVel = -(this.yVel);
  } 


  if (this.y >= wHeight){ // bottom of the screen
    gameControl.reduceGameLife();
  }	

  this.x += this.xVel;
  this.y += this.yVel;

}

Ball.prototype.collisionDetect = function(){

	for (var i = 0; i < bricks.length; i++){
	   for (var j = 0; j < bricks[i].length; j++){
	      	
	      	var curBrick = bricks[i][j];
	   		if(curBrick.active){

	   			if (this.x >= curBrick.x && this.x <= (curBrick.x + curBrick.width) && this.y >= curBrick.y && this.y <= (curBrick.y + curBrick.height)){
	   				curBrick.active = false;
	   				this.yVel = -(this.yVel);
	   				gameControl.updateScoreBoard();
	   			}
	   			
	   		}

	   	}
    }

}   


Ball.prototype.draw = function(){

	ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
    ctx.fill();

}


function PongBar(){

	this.x = 0;
	this.y = (wHeight - 10);
	this.width = 130;
	this.height = 10;
	this.color = "#FFFFFF";
	this.velocity = 50;

}

PongBar.prototype.move = function(event,direction){

	var keyPressedCode = event.keyCode || event.which;

	if (keyPressedCode == 37 || direction == "L"){
	
		if (this.x > 0){
			this.x = this.x - this.velocity;
		}

	}else if (keyPressedCode == 39 || direction == "R"){
	
		if (this.x < wWidth - this.width){
			this.x = this.x + this.velocity;
		}
		
	}

}

PongBar.prototype.draw = function(){

	ctx.beginPath();
	ctx.lineWidth = "1";
	ctx.strokeStyle = this.color;
	ctx.rect(this.x, this.y, this.width, this.height);
	ctx.fill();

}


var ball = new Ball(0,0,6,6,10);
var bar = new PongBar();

function loop(){


    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, wWidth, wHeight);

	if (bricks.length == 0){
		
		var yAxis = 0;

		for (var i = 0; i < noOfRows; i++){

			var xAxis = 0;
			var bricksInRow = [];

			for (var j = 0; j < noOfBricksPerRow; j++){

				var brick = new Bricks(xAxis,yAxis);

				bricksInRow[j] = brick;

				xAxis += brick.width;
				

			}		

			bricks.push(bricksInRow);

			yAxis += brick.height;

		}

	}

	for (var i = 0; i < noOfRows; i++){

		for (var j = 0; j < noOfBricksPerRow; j++){

			var curBrick = bricks[i][j];
			if (curBrick.active == true){
				curBrick.draw();
			}

		}		

	}

	ball.update();
	ball.draw();
	bar.draw();
	ball.collisionDetect();

	gameControl.loopGame();

}

// Events

document.getElementsByTagName("body")[0].onkeydown = function(event){
	bar.move.call(bar,event);
}


window.addEventListener("load",function(){

	var currentX;
	document.body.addEventListener("click",function(e){

		var windowCenter = wWidth / 2; 

		if (currentX > windowCenter){
			bar.move.call(bar,event,"R");
		}else if (currentX < windowCenter){
			bar.move.call(bar,event,"L");
		}

	}, false);

	document.body.addEventListener("touchend",function(e){

		e.preventDefault();
		currentX = e.changedTouches[0].pageX;
		e.target.click();

	}, false);

},false);

document.getElementById("btnStart").onclick = function(){
	document.getElementById("game-points").innerHTML = 0;
	document.getElementById("game-popup").style.display = "none";
	document.getElementById("game-popup-background").style.display = "none";
	ball.x = 50;
	ball.y = 100;
	bar.x = 50;
	gameControl.gameAbort = false;
	gameControl.loopGame();
}	

document.getElementById("btnContinue").onclick = function(){
	document.getElementById("game-popup").style.display = "none";
	document.getElementById("game-popup-background").style.display = "none";
	ball.x = 50;
	ball.y = 100;
	bar.x = 50;
	gameControl.gameAbort = false;
	gameControl.loopGame();
}

window.onload = function(){
	gameControl.initGame();
}

