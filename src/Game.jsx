import React, { useState } from "react";
import "./Game.css";

const enemies = [
  {
    name: "Goblin",
    hp: 12000,
    mana: 4000,
    img: "goblin.png",
    desc: "Goblin หลบ 10% เมื่อถูกโจมตี",
  },
  {
    name: "Orc",
    hp: 20000,
    mana: 3000,
    img: "orc.png",
    desc: "Orc มีโอกาสโกรธ 10% เมื่อถูกโจมตี",
  },
  {
    name: "Giant",
    hp: 40000,
    mana: 5000,
    img: "giant.png",
    desc: "Giant มีโอกาสลด Mana ผู้เล่น 50",
  },
  {
    name: "Dragon",
    hp: 1200000,
    mana: 40000,
    img: "dragon.png",
    desc: "Dragon มีโอกาสพ่นไฟนรกเดือด",
  },
  {
    name: "God",
    hp: 9999999,
    mana: 999999,
    img: "god.png",
    desc: "God 99% ชนะทันที, 1% แพ้ทันที",
  },
];

const weapons = [
  {
    name: "หมัด",
    atk: 90,
    mana: 900,
    cost: 0,
    img: "fist.png",
    desc: "1% โจมตี 9999999",
  },
  {
    name: "ดาบ",
    atk: 450,
    mana: 300,
    cost: 20,
    img: "sword.png",
    desc: "20% ได้ Mana 100",
  },
  {
    name: "ธนู",
    atk: 150,
    mana: 700,
    cost: 30,
    img: "bow.png",
    desc: "20% หลบศัตรูรอบถัดไป",
  },
  {
    name: "Holy sword",
    atk: 10000,
    mana: 0,
    cost: 999,
    img: "holysword.png",
    desc: "อาวุธศักดิ์สิทธิ์! โจมตี 10000",
  },
];

function getRandomEnemy(playerName) {
  // เพิ่มโอกาสเจอมังกรและบัฟมังกรถ้าชื่อ dragonkiller
  if (playerName.trim().toLowerCase() === "dragonkiller") {
    if (Math.random() < 0.9) {
      // สุ่มเลือดและมานา 2-20 เท่า
      const dragon = { ...enemies[3] };
      const multi = Math.floor(Math.random() * 19) + 2; // 2-20
      dragon.hp = dragon.hp * multi;
      dragon.mana = dragon.mana * multi;
      dragon.desc += ` (x${multi} พลัง!)`;
      return dragon;
    }
  }
  if (playerName === "God777" && Math.random() < 0.9) return enemies[4];
  const r = Math.random();
  if (r < 0.4) return enemies[0];
  if (r < 0.6) return enemies[1];
  if (r < 0.75) return enemies[2];
  if (r < 0.85) return enemies[3];
  return enemies[4];
}

function getRandomWeapon() {
  if (Math.random() < 0.01) return weapons[3];
  return weapons[Math.floor(Math.random() * 3)];
}

function getHpPercent(hp, maxHp) {
  return Math.max(0, Math.min(100, Math.round((hp / maxHp) * 100)));
}

export default function Game() {
  const [step, setStep] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [weapon, setWeapon] = useState(null);
  const [enemy, setEnemy] = useState(null);
  const [player, setPlayer] = useState({ hp: 10000, mana: 1000 });
  const [log, setLog] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  function startGame() {
    setStep(1);
    setPlayerName("");
    setWeapon(null);
    setEnemy(null);
    setPlayer({ hp: 10000, mana: 1000 });
    setLog([]);
    setGameOver(false);
  }

  function selectWeapon(w) {
    setWeapon(w);
    setPlayer((p) => ({
      ...p,
      mana: 1000 + w.mana,
    }));
    setStep(2);
  }

  function selectEnemy() {
    const e = getRandomEnemy(playerName);
    setEnemy({ ...e, hp: e.hp, mana: e.mana });
    setStep(3);
  }

  function handleAction(action) {
    if (gameOver) return;
    let newPlayer = { ...player };
    let newEnemy = { ...enemy };
    let newLog = [...log];
    let win = false;
    let lose = false;

    if (action === "attack") {
      let dmg = 40 + weapon.atk;
      let msg = `${playerName} โจมตีด้วย ${weapon.name} ความเสียหาย ${dmg}`;
      if (weapon.name === "หมัด" && Math.random() < 0.01) {
        dmg = 9999999;
        msg = "** พลังหมัดมหาประลัย! โจมตี 9999999 **";
      }
      if (weapon.name === "ดาบ" && Math.random() < 0.2) {
        newPlayer.mana += 100;
        msg += " (ดาบฟื้นฟูมานา +100)";
      }
      if (weapon.name === "ธนู" && Math.random() < 0.2) {
        msg += " (ธนู: คุณจะหลบการโจมตีศัตรูรอบถัดไป)";
        newPlayer.bow_evasion = true;
      }
      if (enemy.name === "God") {
        if (Math.random() < 0.99) {
          newLog.push("God ใช้พลังเหนือธรรมชาติ! คุณแพ้ทันที...");
          setLog(newLog);
          setGameOver(true);
          return;
        } else {
          newLog.push("ปาฏิหาริย์! คุณเอาชนะ God ได้ทันที!!");
          setLog(newLog);
          setGameOver(true);
          return;
        }
      }
      if (enemy.name === "Goblin" && Math.random() < 0.1) {
        msg += " (Goblin หลบการโจมตี!)";
        newLog.push(msg);
        setLog(newLog);
        return;
      }
      if (enemy.name === "Orc" && Math.random() < 0.1) {
        newEnemy.rage = true;
        msg += " (Orc โกรธ! การโจมตีรอบถัดไปแรงขึ้น!)";
      }
      if (enemy.name === "Giant" && Math.random() < 0.15) {
        newPlayer.mana = Math.max(0, newPlayer.mana - 50);
        msg += " (Giant ลด Mana คุณ 50!)";
      }
      if (enemy.name === "Dragon" && Math.random() < 0.1) {
        newPlayer.hp -= 500;
        newPlayer.hellfire = true;
        msg += " (Dragon พ่นไฟนรกเดือด! คุณเสีย HP 500 และติดไฟ)";
      }
      newEnemy.hp -= dmg;
      if (newEnemy.hp <= 0) {
        newEnemy.hp = 0;
        win = true;
      }
      newLog.push(msg);
    }
    else if (action === "heal") {
      let heal = Math.floor(Math.random() * 71) + 30;
      newPlayer.hp += heal;
      newLog.push(`${playerName} ฟื้น HP ${heal}`);
    }
    else if (action === "defend") {
      newPlayer.defending = true;
      newLog.push(`${playerName} ป้องกันตัว`);
    }
    else if (action === "rest") {
      let hp_gain = Math.floor(Math.random() * 41) + 10;
      let mana_gain = Math.floor(Math.random() * 61) + 40;
      newPlayer.hp += hp_gain;
      newPlayer.mana += mana_gain;
      if (newPlayer.hellfire) {
        delete newPlayer.hellfire;
        newLog.push("คุณพักผ่อนและหายจากไฟนรกไหม้!");
      }
      newLog.push(`${playerName} พักผ่อน +${hp_gain} HP +${mana_gain} Mana`);
    }
    else if (action === "dash") {
      newPlayer.dashing = Math.random() < 0.4;
      newLog.push(`${playerName} Dash!`);
    }
    else if (action === "escape") {
      let chance = 0.3;
      if (enemy.name === "Orc") chance = 0.2;
      if (enemy.name === "Giant") chance = 0.1;
      if (enemy.name === "Dragon") chance = 0.05;
      if (enemy.name === "God") chance = 0.001;
      if (Math.random() < chance) {
        newLog.push("คุณหนีสำเร็จ! จบเกม");
        setLog(newLog);
        setGameOver(true);
        return;
      } else {
        newLog.push("หนีไม่สำเร็จ! ศัตรูโจมตีฟรี!");
      }
    }

    // สถานะไฟนรกไหม้
    if (newPlayer.hellfire) {
      newPlayer.hp -= 5;
      newLog.push("ไฟนรกไหม้! คุณเสีย HP 5 (พักผ่อนเพื่อหาย)");
    }

    // ศัตรูโจมตี (ถ้ายังไม่จบ)
    if (!win && !lose) {
      let enemyDmg = Math.floor(Math.random() * 261) + 40;
      let msg = `${enemy.name} โจมตีคุณ ความเสียหาย ${enemyDmg}`;
      if (enemy.rage) {
        enemyDmg += 200;
        msg += " (Orc โกรธ!)";
        delete newEnemy.rage;
      }
      if (newPlayer.defending) {
        enemyDmg = Math.floor(enemyDmg * 0.4);
        msg += " (คุณป้องกัน! ดาเมจลดลง)";
        delete newPlayer.defending;
      }
      if (newPlayer.dashing) {
        if (newPlayer.dashing) {
          msg += " (Dash หลบสำเร็จ!)";
          enemyDmg = 0;
        }
        delete newPlayer.dashing;
      }
      if (newPlayer.bow_evasion) {
        msg += " (ธนู: หลบการโจมตี!)";
        enemyDmg = 0;
        delete newPlayer.bow_evasion;
      }
      newPlayer.hp -= enemyDmg;
      if (newPlayer.hp <= 0) {
        newPlayer.hp = 0;
        lose = true;
      }
      newLog.push(msg);
    }

    setPlayer(newPlayer);
    setEnemy(newEnemy);
    setLog(newLog);
    if (win) setGameOver("win");
    if (lose) setGameOver("lose");
  }

  return (
    <div className="game-container">
      <h1>Battle Game</h1>
      {step === 0 && (
        <div className="menu">
          <button onClick={startGame}>เริ่มเกม</button>
        </div>
      )}
      {step === 1 && (
        <div className="input-name">
          <label>กรอกชื่อตัวละคร: </label>
          <input value={playerName} onChange={e => setPlayerName(e.target.value)} />
          <button disabled={!playerName} onClick={() => setStep(11)}>ยืนยัน</button>
        </div>
      )}
      {step === 11 && (
        <div className="choose-weapon">
          <h2>เลือกอาวุธ</h2>
          <div className="weapon-list">
            {weapons
              .filter(w => {
                if (w.name === "Holy sword") {
                  const name = playerName.trim().toLowerCase();
                  return name === "ผู้กล้า" || name === "hero";
                }
                return true;
              })
              .map((w, i) => (
                <div key={i} className="weapon-card" onClick={() => selectWeapon(w)}>
                  <img src={w.img} alt={w.name} />
                  <div>{w.name}</div>
                  <div>{w.desc}</div>
                </div>
              ))}
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="enemy-select">
          <button onClick={selectEnemy}>สุ่มศัตรู</button>
        </div>
      )}
      {step === 3 && (
        <div className="battle">
          <div className="status">
            <div>
              <h3>{playerName}</h3>
              <div className="hp-bar-container">
                <div
                  className="hp-bar"
                  style={{
                    width: `${getHpPercent(player.hp, 10000)}%`,
                    transition: "width 0.5s cubic-bezier(.4,2.3,.3,1)",
                  }}
                />
                <span className="hp-bar-text">{player.hp} / 10000</span>
              </div>
              {/* หลอดมานาผู้เล่น */}
              <div className="mana-bar-container">
                <div
                  className="mana-bar"
                  style={{
                    width: `${getHpPercent(player.mana, 1000 + (weapon ? weapon.mana : 0))}%`,
                    transition: "width 0.5s cubic-bezier(.4,2.3,.3,1)",
                  }}
                />
                <span className="mana-bar-text">{player.mana} / {1000 + (weapon ? weapon.mana : 0)}</span>
              </div>
              <img src={weapon.img} alt={weapon.name} className="avatar" />
              <div>อาวุธ: {weapon.name}</div>
            </div>
            <div>
              <h3>{enemy.name}</h3>
              <div className="hp-bar-container">
                <div
                  className="hp-bar"
                  style={{
                    width: `${getHpPercent(enemy.hp, enemies.find(e => e.name === enemy.name)?.hp || enemy.hp)}%`,
                    background: "#e53935",
                    transition: "width 0.5s cubic-bezier(.4,2.3,.3,1)",
                  }}
                />
                <span className="hp-bar-text">{enemy.hp} / {enemies.find(e => e.name === enemy.name)?.hp || enemy.hp}</span>
              </div>
              {/* หลอดมานาศัตรู */}
              <div className="mana-bar-container">
                <div
                  className="mana-bar"
                  style={{
                    width: `${getHpPercent(enemy.mana, enemies.find(e => e.name === enemy.name)?.mana || enemy.mana)}%`,
                    transition: "width 0.5s cubic-bezier(.4,2.3,.3,1)",
                  }}
                />
                <span className="mana-bar-text">{enemy.mana} / {enemies.find(e => e.name === enemy.name)?.mana || enemy.mana}</span>
              </div>
              <div className={`enemy-effect effect-${enemy.name.toLowerCase()}`}></div>
              <img src={enemy.img} alt={enemy.name} className="avatar" />
              <div>{enemy.desc}</div>
            </div>
          </div>
          <div className="actions">
            <button onClick={() => handleAction("attack")} disabled={gameOver}>โจมตี</button>
            <button onClick={() => handleAction("heal")} disabled={gameOver}>Heal</button>
            <button onClick={() => handleAction("defend")} disabled={gameOver}>Defend</button>
            <button onClick={() => handleAction("rest")} disabled={gameOver}>Rest</button>
            <button onClick={() => handleAction("dash")} disabled={gameOver}>Dash</button>
            <button onClick={() => handleAction("escape")} disabled={gameOver}>หนี</button>
          </div>
          <div className="log">
            {log.slice(-8).map((l, i) => <div key={i}>{l}</div>)}
          </div>
          {gameOver && (
            <div className="result">
              {gameOver === "win" ? "คุณชนะ!" : gameOver === "lose" ? "คุณแพ้!" : "จบเกม"}
              <button onClick={startGame}>เล่นใหม่</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}