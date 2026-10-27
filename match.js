
(() => {
    const MATCH_DURATION = 120; // 2 minutes

    let timeLeft = MATCH_DURATION;
    let score = 0;
    let timerInterval = null;
    let matchRunning = false;

    // Create the match information on the screen
    function createMatchUI() {
        if (document.getElementById("match-hud")) return;

        const hud = document.createElement("div");
        hud.id = "match-hud";

        hud.innerHTML = `
            <div id="match-timer">02:00</div>
            <div id="match-score">Score: 0</div>
        `;

        Object.assign(hud.style, {
            position: "fixed",
            top: "15px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "25px",
            padding: "12px 22px",
            background: "rgba(0, 0, 0, 0.8)",
            color: "white",
            fontFamily: "Arial, sans-serif",
            fontSize: "20px",
            fontWeight: "bold",
            borderRadius: "10px",
            zIndex: "99999",
            pointerEvents: "none"
        });

        document.body.appendChild(hud);
    }

    function updateHUD() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        document.getElementById("match-timer").textContent =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        document.getElementById("match-score").textContent =
            `Score: ${score}`;
        const timerElement = document.getElementById('gameTimer');

if (timerElement) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerElement.textContent =
        String(minutes).padStart(2, '0') + ':' +
        String(seconds).padStart(2, '0');
}
    }

    function endMatch() {
        if (!matchRunning) return;

        matchRunning = false;
        clearInterval(timerInterval);
        timerInterval = null;

        // Notify the existing game code that the match has ended.
        window.dispatchEvent(new Event("strikeMatchEnded"));

        const results = document.createElement("div");
        results.id = "match-results";

        Object.assign(results.style, {
            position: "fixed",
            inset: "0",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "18px",
            background: "rgba(0, 0, 0, 0.92)",
            color: "white",
            fontFamily: "Arial, sans-serif",
            zIndex: "100000"
        });

        results.innerHTML = `
            <h1 style="margin:0;font-size:42px">MATCH OVER</h1>
            <h2 style="margin:0">Final Score: ${score}</h2>
            <p>Time survived: 2 minutes</p>
            <button id="match-play-again"
                style="padding:12px 25px;font-size:18px;
                cursor:pointer;border:0;border-radius:8px">
                Play Again
            </button>
        `;

        document.body.appendChild(results);

        document.getElementById("match-play-again")
            .addEventListener("click", () => {
                results.remove();
                window.dispatchEvent(new Event("strikeMatchRestart"));
                startMatch();
            });
    }

    function startMatch() {
        clearInterval(timerInterval);

        const oldResults = document.getElementById("match-results");
        if (oldResults) oldResults.remove();

        timeLeft = MATCH_DURATION;
        score = 0;
        matchRunning = true;

        createMatchUI();
        updateHUD();

        timerInterval = setInterval(() => {
            if (!matchRunning) return;

            timeLeft--;

            updateHUD();

            if (timeLeft <= 0) {
                timeLeft = 0;
                updateHUD();
                endMatch();
            }
        }, 1000);
    }

    // Call this for a normal kill or a headshot kill.
    function addKillScore(isHeadshot = false) {
        if (!matchRunning) return;

        score += isHeadshot ? 30 : 20;
        updateHUD();
    }

    // Make the match functions available to your existing game.
    window.startStrikeMatch = startMatch;
    window.addStrikeKillScore = addKillScore;
    window.getStrikeMatchScore = () => score;
    window.isStrikeMatchRunning = () => matchRunning;
})();
