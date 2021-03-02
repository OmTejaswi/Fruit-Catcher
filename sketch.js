var database;
var back_img;
var fruits;
var fruitGroup;
var fruit1_img, fruit2_img, fruit3_img, fruit4_img, fruit5_img;
var player_img;
var wait;

var p1, p2;

var baskets = [];

var pcData = 0;

var score1 = 0;
var score2 = 0;

var basket1, basket2;

var tilte, input, playBtn;
var inputVal;
var name1;

var resetBtn;

var rand;

var x = 0;

var pc = 0;
var gs = 0;

function preload(){
  back_img = loadImage("images/jungle.jpg");
  player_img = loadImage("images/basket2.png");
  fruit1_img = loadImage("images/apple2.png");
  fruit2_img = loadImage("images/banana2.png");
  fruit3_img = loadImage("images/melon2.png");
  fruit4_img = loadImage("images/orange2.png");
  fruit5_img = loadImage("images/pineapple2.png");
  
}
function setup() {
  createCanvas(900, 500);

  //create sprites
  basket1 = createSprite(600,400,20,20);
  basket1.addImage(player_img);
  basket1.scale = 0.9;
  basket1.visible = false;

  basket2 = createSprite(400,400,20,20);
  basket2.addImage(player_img);
  basket2.scale = 0.9;
  basket2.visible = false;

  database = firebase.database();

  tilte = createElement("h1").html("Fruit Catcher").position(570,150).style("color","blue");

  
  input = createInput("","text").position(width/1.68,height/1.5).style("width","250px").style("height","40px").attribute(
    "placeholder","Enter Your Name"
    ).style("textAlign", CENTER).style("borderRadius","50px");

  playBtn = createButton("Play").position(width/1.6,height/1.2).style("background","pink").style('width', 
  '200px').style("height","40px");

    database.ref("playerCount").on("value",function(data){
      pc = data.val();
    })
    database.ref("gameState").on("value", function(data){
      gs = data.val();
    })

    database.ref("x").on("value", function(data){
      x = data.val();
    })

    database.ref("players/player1/name").on("value", function(data){
      p1 = data.val();
    })

    database.ref("players/player2/name").on("value", function(data){
      p2 = data.val();
    })

    database.ref("score1").on("value", function(data){
      score1 = data.val();
    })

    database.ref("score2").on("value", function(data){
      score2 = data.val();
    })
       
  resetBtn = createButton("Reset").position(200,200)
  resetBtn.mousePressed(function(){
    database.ref("/").update({
      playerCount: 0,
      gameState: 0
    })
  })
  
  fruitGroup = new Group();

  baskets = [basket1,basket2];
}

function draw() {
  background(back_img);


  if(inputVal == 0){
    playBtn.mousePressed(function(){
      
    })
  }

  inputVal = input.value();

if(inputVal !== "") {
  playBtn.mousePressed(function(){
    pc+=1;
    pcData = pc;
    
      database.ref("/").update({
      playerCount: pc
    })
    database.ref("players/player"+pc).set({
      x: baskets[pcData-1].x,
      name: inputVal,
      score: 0
    })
    database.ref("players/player1/x").on("value", function(data){
      basket1.x = data.val();
    })

    database.ref("players/player2/x").on("value", function(data){
      basket2.x = data.val();
    })
   
    input.hide();
    playBtn.hide();

    wait = createElement("h3").html("<center>Hello, "+inputVal+"</center><br> Waiting For Other Players...").position(550,250).style("color","white");
    
 })
}

 

  // Add conditions for gameStates and playerCount
  if(pc === 2){
    gs = 1;
  }
  if(gs === 1) {
      wait.hide();
      spawnFruits();

      basket1.visible = true;
      basket2.visible = true;

      if(keyDown(RIGHT)) {
          baskets[pcData-1].x += 10;
 
      }

      if(keyDown(LEFT)) {
        baskets[pcData-1].x -= 10;
    }
    database.ref("players/player"+pcData).update({
      x: baskets[pcData-1].x
    })
  }

  database.ref("/").update({
    gameState: gs
  })

  for(let i = 0; i < fruitGroup.length; i++)
  {
    if(fruitGroup.get(i).isTouching(basket1)) {
      fruitGroup.get(i).destroy();
      score1+=1;
    }
    if(fruitGroup.get(i).isTouching(basket2)) {
      fruitGroup.get(i).destroy();
      score2+=1;
    }
  }

  database.ref("/").update({
    score1: score1,
    score2: score2,
  })

  drawSprites();

  textSize(20);
  if(gs === 1 && baskets[pcData-1] === basket1) {
    textAlign(CENTER);
    fill("black");
    text(p1,baskets[pcData-1].x,baskets[pcData-1].y+20);
  } else if(gs === 1 && baskets[pcData-1] === basket2) {
    textAlign(CENTER);
    fill("black");
    text(p2,baskets[pcData-1].x,baskets[pcData-1].y+20);
  }

  if(gs === 1) {
      textAlign(CENTER);
      fill("fff");
      text(p1+": "+score1,100,40);
      text(p2+": "+score2,100,70);
    
  }

  posUpdate();
}

function posUpdate(){
  if(frameCount%10===0) {
  x = Math.round(random(100,1000));
  }
  
  database.ref("/").update({
    x: x,
  })
}

function spawnFruits() {
  if(frameCount%20===0){
    fruits = createSprite(x,0,100,100);
    fruits.velocityY = 6;

    rand = Math.round(random(1,5));

    if(rand === 1) {
      fruits.addImage(fruit1_img);
    } else if(rand === 2) {
      fruits.addImage(fruit2_img);
    } else if(rand === 3) {
      fruits.addImage(fruit3_img);
    } else if(rand === 4) {
      fruits.addImage(fruit4_img);
    } else {
      fruits.addImage(fruit5_img);
    }

    fruitGroup.add(fruits);
  }
}