var ball = null;
var paddle = null;
var ballMovement = { x: 100, y: 100, dx: 500, dy: 500 };
var paddleY = 100;
var score = 0;
var timeLastFrame;
var scoreSpan = document.querySelector('#score');

function init() {
    window.ball = window.open('popup.html?ball', 'ball', "popup,width=100,height=100,left=100,top=100");
    window.paddle = window.open('popup.html?paddle', 'paddle', "popup,width=100,height=500,left=100,top=100");
    if (window.ball == null) alert('Initialization failed');
    if (window.paddle == null) alert('Initialization failed');

    window.timeLastFrame = new Date();
}

function gameLoop() {
    if (window.ball == null || window.ball.closed) return;
    if (window.paddle == null || window.paddle.closed) return;

    const frameDelta = Math.abs((new Date()).getTime() - window.timeLastFrame.getTime()) / 1e3;
    window.timeLastFrame = new Date();

    if (window.pressedKeys[38] == true) { // arrow up
        window.paddleY -= 700 * frameDelta;
    } else if (window.pressedKeys[40] == true) { // arrow down
        window.paddleY += 700 * frameDelta;
    }

    let paddleHeight;
    window.paddle.moveTo(window.screen.width, window.paddleY);
    window.paddle.resizeTo(100, paddleHeight = window.screen.height / 3);

    if (Math.abs(window.paddle.screenY - paddleY) > 1) window.paddleY = window.paddle.screenY;

    let dx = window.ballMovement.dx;
    let dy = window.ballMovement.dy;
    let x = window.ballMovement.x + dx * frameDelta;
    let y = window.ballMovement.y + dy * frameDelta;

    window.ball.moveTo(x, y);
    window.ball.resizeTo(100, 100);

    if (Math.abs(window.ball.screenX - x) > 1) dx = -dx;
    if (Math.abs(window.ball.screenY - y) > 1) dy = -dy;

    if (window.ball.screenX > window.screen.width - (window.ball.innerWidth + window.paddle.innerWidth)) { // if in the paddle's column
        if (Math.abs(window.paddleY + paddleHeight / 2 - (y + 50)) < paddleHeight / 2 - 50) { // if in the paddle's row
            window.score++;
            dx = -dx * 1.1;
            dy = dy * 1.1;
        } else {
            window.score = 0;
            x = 0;
            dx = 400;
            dy = 400;
        }
    }

    window.ballMovement = { x, y, dx, dy };
    window.scoreSpan.innerText = window.score;
}

setInterval(() => gameLoop(), 1e3 / 60);

var pressedKeys = {};
window.addEventListener('keyup', e => { pressedKeys[e.keyCode] = false; });
window.addEventListener('keydown', e => { pressedKeys[e.keyCode] = true; });
window.addEventListener("message", message => { pressedKeys[message.data[0]] = message.data[1]; });
