let playerHp = 100;
let maxPlayerHp = 100;  // 最大血量
let enemyHp;
let playerExp = 0;
let totalExp = 0;  // 累計經驗值
let level = 1;
let isPlayerTurn = true;
let totalAttacks = 0;
let totalDamageTaken = 0;

// 技能使用次數限制
let powerAttackUses = 3;
let healUses = 3;

const enemies = [
    { name: "史萊姆", hp: 50, attack: 5, exp: 10 },
    { name: "哥布林", hp: 80, attack: 10, exp: 20 },
    { name: "巨狼", hp: 120, attack: 15, exp: 30 }
];

function startBattle() {
    const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
    enemyHp = randomEnemy.hp;
    document.getElementById('enemy-name').textContent = randomEnemy.name;
    document.getElementById('enemy-hp').textContent = `HP: ${enemyHp}`;
    document.getElementById('message').textContent = "戰鬥開始！";
    isPlayerTurn = true;  // 確保戰鬥開始時是玩家的回合
}

function attack() {
    if (isPlayerTurn) {
        const damage = Math.floor(Math.random() * 10) + 5;
        enemyHp -= damage;
        totalAttacks++;
        document.getElementById('enemy-hp').textContent = `HP: ${enemyHp}`;
        document.getElementById('message').textContent = `你攻擊了敵人，造成了 ${damage} 點傷害！`;

        if (enemyHp <= 0) {
            document.getElementById('message').textContent = '你贏了！敵人被擊敗了。';
            gainExp();
            healAfterBattle();  // 在戰鬥結束後恢復血量
            setTimeout(() => {
                showBattleStats();
                prepareForNextBattle();
            }, 1000); // 在1秒後顯示戰鬥數據並準備下一次戰鬥
            return;
        }

        isPlayerTurn = false;
        setTimeout(enemyTurn, 1000); // 1秒後敵人進行攻擊
    }
}

function powerAttack() {
    if (isPlayerTurn && powerAttackUses > 0) {
        const damage = Math.floor(Math.random() * 20) + 10;  // 更高的傷害
        enemyHp -= damage;
        totalAttacks++;
        powerAttackUses--;  // 減少技能使用次數
        document.getElementById('enemy-hp').textContent = `HP: ${enemyHp}`;
        document.getElementById('message').textContent = `你使用了強力攻擊，造成了 ${damage} 點傷害！ 剩餘使用次數：${powerAttackUses}`;

        if (enemyHp <= 0) {
            document.getElementById('message').textContent = '你贏了！敵人被擊敗了。';
            gainExp();
            healAfterBattle();  // 在戰鬥結束後恢復血量
            setTimeout(() => {
                showBattleStats();
                prepareForNextBattle();
            }, 1000); // 在1秒後顯示戰鬥數據並準備下一次戰鬥
            return;
        }

        isPlayerTurn = false;
        setTimeout(enemyTurn, 1000); // 1秒後敵人進行攻擊
    } else if (powerAttackUses === 0) {
        document.getElementById('message').textContent = '強力攻擊次數已用完！';
    }
}

function heal() {
    if (isPlayerTurn && healUses > 0) {
        const healAmount = Math.floor(Math.random() * 20) + 15;
        playerHp += healAmount;
        if (playerHp > maxPlayerHp) playerHp = maxPlayerHp;
        healUses--;  // 減少技能使用次數
        document.getElementById('player-hp').textContent = `HP: ${playerHp}`;
        document.getElementById('message').textContent = `你使用了治療技能，恢復了 ${healAmount} 點生命值！ 剩餘使用次數：${healUses}`;

        isPlayerTurn = false;
        setTimeout(enemyTurn, 1000); // 1秒後敵人進行攻擊
    } else if (healUses === 0) {
        document.getElementById('message').textContent = '治療技能次數已用完！';
    }
}

function enemyTurn() {
    const randomEnemy = enemies.find(e => e.name === document.getElementById('enemy-name').textContent);
    const damage = Math.floor(Math.random() * randomEnemy.attack) + 5;
    playerHp -= damage;
    totalDamageTaken += damage;
    document.getElementById('player-hp').textContent = `HP: ${playerHp}`;
    document.getElementById('message').textContent = `敵人攻擊了你，造成了 ${damage} 點傷害！`;

    if (playerHp <= 0) {
        document.getElementById('message').textContent = '你被擊敗了！遊戲結束。';
        disableButtons();
        showBattleStats(true);  // 玩家被擊敗後顯示數據
        return;
    }

    // 確保在敵人攻擊後可以回到玩家回合
    isPlayerTurn = true;
}

function gainExp() {
    const randomEnemy = enemies.find(e => e.name === document.getElementById('enemy-name').textContent);
    const gainedExp = randomEnemy.exp;
    playerExp += gainedExp;
    totalExp += gainedExp;  // 累計經驗值
    document.getElementById('player-exp').textContent = `EXP: ${totalExp} (本次: ${playerExp})`;

    // 檢查是否達到升級所需的經驗值
    if (playerExp >= level * 30) {
        levelUp();
    }
}

function levelUp() {
    level++;
    playerExp = 0;  // 升級後重置本級的經驗值
    maxPlayerHp += 10;  // 升級時增加最大血量
    playerHp = maxPlayerHp;  // 升級時恢復滿血
    powerAttackUses++;  // 升級後增加強力攻擊次數
    healUses++;  // 升級後增加治療技能次數
    document.getElementById('player-hp').textContent = `HP: ${playerHp}`;
    document.getElementById('message').textContent += ` 你升級了！現在是 ${level} 級，最大血量提升至 ${maxPlayerHp} 點。`;
}

function healAfterBattle() {
    const heal = Math.floor(Math.random() * 10) + 10;
    playerHp += heal;
    if (playerHp > maxPlayerHp) playerHp = maxPlayerHp;
    document.getElementById('player-hp').textContent = `HP: ${playerHp}`;
    document.getElementById('message').textContent += ` 戰鬥結束後，你恢復了 ${heal} 點生命值。`;
}

function showBattleStats(isGameOver = false) {
    document.getElementById('total-attacks').textContent = `總攻擊次數: ${totalAttacks}`;
    document.getElementById('total-damage-taken').textContent = `受到的總傷害: ${totalDamageTaken}`;
    document.getElementById('battle-stats').style.display = 'block';
    disableButtons();
    
    if (isGameOver) {
        document.getElementById('message').textContent = '遊戲結束。點擊重新開始。';
        document.querySelector('button[onclick="restartGame()"]').disabled = false;
    }
}

function disableButtons() {
    document.querySelectorAll('button').forEach(button => {
        button.disabled = true;
    });
}

function prepareForNextBattle() {
    setTimeout(() => {
        document.getElementById('battle-stats').style.display = 'none';
        document.getElementById('message').textContent = '';
        document.querySelectorAll('button').forEach(button => {
            button.disabled = false;
        });
        startBattle();
    }, 2000); // 2秒後開始下一次隨機遇敵
}

function restartGame() {
    playerHp = maxPlayerHp;
    totalAttacks = 0;
    totalDamageTaken = 0;
    powerAttackUses = 3;  // 重置技能使用次數
    healUses = 3;  // 重置技能使用次數
    document.getElementById('player-hp').textContent = `HP: ${playerHp}`;
    document.getElementById('message').textContent = '';
    document.getElementById('battle-stats').style.display = 'none';
    document.querySelectorAll('button').forEach(button => {
        button.disabled = false;
    });
    startBattle();
}

// 初始化遊戲
startBattle();
