//Game and other website logic
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const VIRTUAL_WIDTH = 480;
const VIRTUAL_HEIGHT = 320;

/* Function that manages resizing of all the elements*/
function resizeCanvas() {
    const aspectRatio = VIRTUAL_WIDTH / VIRTUAL_HEIGHT;
    const paddingHeight = 200; // Reserve vertical space for text + buttons

    const screenWidth = window.innerWidth * 0.95;
    const screenHeight = (window.visualViewport?.height || window.innerHeight) - paddingHeight;

    let width = screenWidth;
    let height = width / aspectRatio;

    if (height > screenHeight) {
        height = screenHeight;
        width = height * aspectRatio;
    }

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.width = width;
    canvas.height = height;

    scale = canvas.width / VIRTUAL_WIDTH;
}

/*Resize function call*/
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/*Variable to save username*/
let username = "Player";
/*Function that reads and saves username*/
function submitUsername() {
    const input = document.getElementById("usernameInput").value.trim();
    if (input) username = input;
    document.getElementById("usernameOverlay").style.display = "none";

}   

/*Paddle variables*/
const paddleHeight = 10;
const paddleWidth = 80;
const paddleY = VIRTUAL_HEIGHT - paddleHeight - 20;
let paddleX = (VIRTUAL_WIDTH - paddleWidth) / 2;
const paddleSpeed = 7;

/*Ball variables*/
const ballRadius = 10;
let ballX = VIRTUAL_WIDTH / 2;
let ballY = VIRTUAL_HEIGHT - 40;
let initialDx = 2;
let initialDy = -2;
let dx = 0;
let dy = 0;
let ballSpeed = Math.sqrt(initialDx * initialDx + initialDy * initialDy);

/*Control variables*/
let rightPressed = false;
let leftPressed = false;
let intervalId = null;
let score = 0;

/*Brick field variables*/
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const bricks = [];
let bricksLeft = 0;

/*Function that initializes the brick field*/
function initializeBricks() {
    bricks.length = 0;
    bricksLeft = 0;
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
            bricksLeft++;
        }
    }
}

/*Function to reset the ball and paddle values*/
function resetBallAndPaddle() {
    ballX = VIRTUAL_WIDTH / 2;
    ballY = VIRTUAL_HEIGHT - 40;
    dx = (Math.random() < 0.5 ? 1 : -1) * initialDx;
    dy = initialDy;
    paddleX = (VIRTUAL_WIDTH - paddleWidth) / 2;
}

/*Display the score at the top*/
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.fillText(username + "'s Score: " + score, VIRTUAL_WIDTH/2, 20);
}

/*Display the ball*/
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#303032";
    ctx.fill();
    ctx.closePath();
}

/*Display the paddle*/
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = "#9fded5";
    ctx.fill();
    ctx.closePath();
}

/*Display the brick field*/
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#b2daed";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

/*Main draw function that handles the main logic*/
function draw() {
    /*clear canvas, save the state and scale the canvas to the window size*/
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(canvas.width / VIRTUAL_WIDTH, canvas.height / VIRTUAL_HEIGHT);

    /*draw the elements*/
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();

    /*Predict ball position*/
    let nextBallX = ballX + dx;
    let nextBallY = ballY + dy;

    /*Handle wall collisions*/
    if (nextBallX > VIRTUAL_WIDTH - ballRadius || nextBallX < ballRadius) {
        dx = -dx;
    }
    if (nextBallY < ballRadius) {
        dy = -dy;
    }
    else if (nextBallY > VIRTUAL_HEIGHT - ballRadius) {
        let willHitPaddle = nextBallX + ballRadius > paddleX &&
                            nextBallX - ballRadius < paddleX + paddleWidth &&
                            nextBallY + ballRadius > paddleY;

        if (!willHitPaddle) {
            initialDx = 2;
            initialDy= -2;
            ballSpeed = Math.sqrt(initialDx * initialDx + initialDy * initialDy);
            rightPressed = false;
            leftPressed = false;
            clearInterval(intervalId);
            intervalId = null;
            alert("GAME OVER! Final Score: " + score);
            sendScoreToAPI(username, score)
                .then(savedPlayer => fetchAndDisplayScores(savedPlayer.id))
                .catch(err => console.error("Error submitting score:", err));
            score = 0;
            dx = 0;
            dy = 0;
            ctx.restore();
            return;
        }
    }

    /*Handle brick collisions*/
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
        let b = bricks[c][r];
        if (b.status === 1) {
        if (
        nextBallX + ballRadius > b.x &&
        nextBallX - ballRadius < b.x + brickWidth &&
        nextBallY + ballRadius > b.y &&
        nextBallY - ballRadius < b.y + brickHeight
        ) {
        dy = -dy;
        b.status = 0;
        bricksLeft--;
        score++;
        if (bricksLeft === 0) {
        alert("Round Finished, Speeding up ball by 10% Current score: " + score);
        initialDx *= 1.1;
        initialDy *= 1.1;
        rightPressed = false;
        leftPressed = false;
        ballSpeed = Math.sqrt(initialDx ** 2 + initialDy ** 2);
        initializeBricks();
        resetBallAndPaddle();
                    }
                }
            }
        }
    }
        
    /*Handle paddle collisions*/
    if (nextBallX + ballRadius > paddleX &&
        nextBallX - ballRadius < paddleX + paddleWidth &&
        nextBallY + ballRadius > paddleY &&
        nextBallY - ballRadius < paddleY + paddleHeight) {

    let hitSide = false;
    const epsilon = 0.1;
    let currentlyVerticallyAligned = (ballY >= paddleY && ballY <= paddleY + paddleHeight);
    let currentlyHorizontallyAligned = (ballX >= paddleX && ballX <= paddleX + paddleWidth);

    let wasLeft = (ballX + ballRadius <= paddleX);
    let wasRight = (ballX - ballRadius >= paddleX + paddleWidth);
    let movingTowardsPaddleX = (wasLeft && dx > 0) || (wasRight && dx < 0);

    let wasAbove = (ballY + ballRadius <= paddleY);
    let movingTowardsPaddleY = (wasAbove && dy > 0);

    if (movingTowardsPaddleX && currentlyVerticallyAligned) {
        hitSide = true;
    } else if (movingTowardsPaddleY) {
        hitSide = false;
    } else if (movingTowardsPaddleX && !wasAbove && !currentlyHorizontallyAligned) {
        hitSide = true;
    } else {
        hitSide = false;
    }

    if (hitSide) {
        dx = -dx;
        if (nextBallX < paddleX + paddleWidth / 2) {
        ballX = paddleX - ballRadius - epsilon;
        } else {
        ballX = paddleX + paddleWidth + ballRadius + epsilon;
        }
        if (Math.abs(dx) < 0.1) dx = (ballX < paddleX + paddleWidth / 2) ? -initialDx * 0.5 : initialDx * 0.5;
    } else {
        let hitPointX = nextBallX - (paddleX + paddleWidth / 2);
        let normalizedHitPointX = hitPointX / (paddleWidth / 2);
        normalizedHitPointX = Math.max(-1, Math.min(1, normalizedHitPointX));
        let maxBounceAngle = Math.PI / 2.5;
        let bounceAngle = normalizedHitPointX * maxBounceAngle;
        ballY = paddleY - ballRadius;
        dx = ballSpeed * Math.sin(bounceAngle);
        dy = -ballSpeed * Math.cos(bounceAngle);
        if (dy >= 0) dy = -Math.abs(initialDy);
    }
    }

    ballX += dx;
    ballY += dy;

    if (rightPressed && paddleX + paddleWidth < VIRTUAL_WIDTH) {
        paddleX += paddleSpeed;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= paddleSpeed;
    }
    ctx.restore();
}

/*Handle key presses*/
function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a") {
        leftPressed = false;
    }
}

/*Function to submit score and username to the api, which sends it to the database*/
function sendScoreToAPI(username, score) {
    console.log("Sending JSON:", JSON.stringify({
        name: username,
        score: score
    }));

    return fetch("http://localhost:8080/api/players", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: username,
            score: score
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error posting name and scoreboard to DB.");
        }
        return response.json();
    })
    .then(data => {
        console.log("Score submitted successfully: ", data, "!");
        return data;
    })
    .catch(error => {
        console.error("Error submitting score:", error);
        alert("Score could not be submitted. Refreshing...");
        location.reload();
    });
}

/*Function to fetch scores and usernames from the api, and display them when game over*/
function fetchAndDisplayScores(playerId) {
    fetch("http://localhost:8080/api/players")
        .then(res => res.json())
        .then(data => {
            data.sort((a, b) => b.score - a.score);

            const top10 = data.slice(0, 10);
            const list = document.getElementById("topScores");
            list.innerHTML = "";

            top10.forEach(player => {
                const li = document.createElement("li");
                li.textContent = `${player.name}: ${player.score}`;
                if (player.id === playerId) {
                    li.style.fontWeight = "bold";
                    li.style.color = "#d9534f";
                }
                list.appendChild(li);
            });

            const placement = data.findIndex(p => p.id === playerId) + 1;

            const rankText = placement > 0
                ? `You ranked #${placement} out of ${data.length}`
                : `Score not found. Maybe a glitch in the multiverse 👀`;

            document.getElementById("playerRank").textContent = rankText;
            document.getElementById("scoreboard").style.display = "block";
        })
        .catch(err => {
            console.error("Leaderboard error:", err);
            document.getElementById("playerRank").textContent = "Error loading scoreboard.";
            document.getElementById("scoreboard").style.display = "block";
        });
}

/*Function to start the game, initializes elemements and resets values, display start button.*/
function startGame() {
    document.getElementById("scoreboard").style.display = "none";

    initializeBricks();
    resetBallAndPaddle();
    dx = initialDx;
    dy = initialDy;
    document.removeEventListener("keydown", keyDownHandler);
    document.removeEventListener("keyup", keyUpHandler);
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
    intervalId = setInterval(draw, 10);
    document.getElementById("runButton").disabled = true;
}

/*Draw everthing*/
initializeBricks();
draw();

/*Handle button functionality*/
document.getElementById("runButton").addEventListener("click", startGame);

document.getElementById("leftButton").addEventListener("touchstart", () => {leftPressed = true;});
document.getElementById("leftButton").addEventListener("touchend", () => {leftPressed = false;});
document.getElementById("rightButton").addEventListener("touchstart", () => {rightPressed = true;});
document.getElementById("rightButton").addEventListener("touchend", () => {rightPressed = false;});

document.getElementById("leftButton").addEventListener("mousedown", () => {leftPressed = true;});
document.getElementById("leftButton").addEventListener("mouseup", () => {leftPressed = false;});
document.getElementById("rightButton").addEventListener("mousedown", () => {rightPressed = true;});
document.getElementById("rightButton").addEventListener("mouseup", () => {rightPressed = false;});

document.getElementById("scoreboardStartButton").addEventListener("click", () => {
    document.getElementById("scoreboard").style.display = "none";
    startGame();
});

// Prevent double-tap zoom
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault(); // Prevent zoom
    }
    lastTouchEnd = now;
}, false);

// Prevent pinch zoom
document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});
