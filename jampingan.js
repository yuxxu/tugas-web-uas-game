//board

let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

//chara

let charaWidth = 46;
let charaHeight = 46;
let charaX = boardWidth/2 - charaWidth/2;
let charaY = boardHeight*7/8 - charaHeight;
let charaRightImg;
let charaLeftImg;

//physic
let velocityX = 0;
let velocityY = 0;
let initialVelocityY = -7;
let gravity = 0.4;

//benda
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

let score = 0;
let maxScore = 0;

let gameOver = false;

let chara = {
    img : null,
    x : charaX,
    y : charaY,
    width : charaWidth,
    height : charaHeight
}

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //character gambar
    charaRightImg = new Image();
    charaRightImg.src = './doodler-right.png';
    chara.img = charaRightImg;
    charaRightImg.onload = function() {
        context.drawImage(chara.img, chara.x, chara.y, chara.width, chara.height);
    }

    platformImg = new Image()
    platformImg.src = './platform.png'
    
    velocityY = initialVelocityY;
    placePlatform();

    charaLeftImg = new Image();
    charaLeftImg.src = './character-img-left.gif';

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveChara);

    function update() {
        requestAnimationFrame(update);

        if(chara.y > board.height){
            gameOver = true
        }

        context.clearRect(0,0,board.width,board.height)
        if(chara.x > boardWidth){
            chara.x = 0;
        }

        else if(chara.x + chara.width < 0){
            chara.x = boardWidth;
        }

        chara.x += velocityX;
        chara.y += velocityY;
        velocityY += gravity;
        context.drawImage(chara.img, chara.x, chara.y, chara.width, chara.height);

        //benda
        for(let i = 0; i < platformArray.length; i++){
            let platform = platformArray[i];

            if(velocityY < 0 && chara.y < boardHeight*3/4){
                platform.y -= -5;
            }

            if (detectCollision(chara, platform)){
                velocityY = initialVelocityY;
            }
            context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
        }

        while(platformArray.length > 0 && platformArray[0].y >= boardHeight){
            platformArray.shift();
            newPlatform();
        }

        //score
        updateScore();
        context.fillStyle = "black";
        context.font = "16px sans-serif";
        context.fillText(score, 5, 20);

        if(gameOver){
            context.fillText("Anda jatuh, klik spasi untuk restart", boardWidth/7, boardHeight*7/8);
        }
    }

    function moveChara(e) {
        if(e.code == "ArrowRight" || e.code == "KeyD"){
            velocityX = 4;
            chara.img = charaRightImg;
        }

        else if(e.code == "ArrowLeft" || e.code == "KeyA"){
            velocityX = -4;
            chara.img = charaLeftImg;
        }

        else if(e.code == "Space" && gameOver){
            chara = {
                img : charaRightImg,
                x : charaX,
                y : charaY,
                width : charaWidth,
                height : charaHeight
            }

            velocityX = 0;
            velocityY = initialVelocityY;
            score = 0;
            maxScore = 0;
            gameOver = false;
            placePlatform();
        }
    }
    
    function placePlatform(){
        platformArray = [];

        let platform = {
            img : platformImg,
            x : boardWidth/2,
            y : boardHeight - 50,
            width : platformWidth,
            height : platformHeight
        }

        platformArray.push(platform);

        // platform = {
        //     img : platformImg,
        //     x : boardWidth/2,
        //     y : boardHeight - 150,
        //     width : platformWidth,
        //     height : platformHeight
        // }

        for (let i = 0; i < 6; i++){
            let randomX = Math.floor(Math.random() * boardWidth*3/4);
            let platform = {
                img : platformImg,
                x : randomX,
                y : boardHeight - 75 * i - 150,
                width : platformWidth,
                height : platformHeight
            }
            platformArray.push(platform);
        }
    }
  
}

function newPlatform(){
    let randomX = Math.floor(Math.random() * boardWidth*3/4);
    let platform = {
        img : platformImg,
        x : randomX,
        y : -platformHeight,
        width : platformWidth,
        height : platformHeight
    }
    platformArray.push(platform);
}

function detectCollision(a, b){
    return a.x < b.x + b.width && a.x + a.width > b.x &&
            a.y < b.y + b.height && a.y + a.height > b.y;

}

function updateScore(){
    let points = Math.floor(50*Math.random());

    if(velocityY < 0){
        maxScore += points;
        if(score < maxScore){
            score = maxScore;
        }
    }

    else if(velocityY >= 0){
        maxScore -= points;
    }
}