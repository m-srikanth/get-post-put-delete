const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
let db = null;
const dbPath = path.join(__dirname, "cricketTeam.db");
const initiatingDBConnection = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("It's Running!");
    });
  } catch (e) {
    console.log(`Error is ${e.message}`);
    process.exit(1);
  }
};
initiatingDBConnection();
//API-1
app.get("/players/", async (request, response) => {
  const query = `SELECT * FROM cricket_team;`;
  const players = await db.all(query);
  const ans = (player) => {
    return {
      playerId: player.player_id,
      playerName: player.player_name,
      jerseyNumber: player.jersey_number,
      role: player.role,
    };
  };
  const arrayList = players.map((eachObject) => ans(eachObject));
  response.send(arrayList);
});
//API-2
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const query = `INSERT INTO cricket_team ( player_name, jersey_number, role ) VALUES ('${playerName}', '${jerseyNumber}', '${role}');`;
  const result = await db.run(query);
  response.send("Player Added to Team");
});
//API-3
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const query = `SELECT * FROM cricket_team WHERE player_id = ${playerId}`;
  const players = await db.get(query);
  const result = {
    playerId: players.player_id,
    playerName: players.player_name,
    jerseyNumber: players.jersey_number,
    role: players.role,
  };
  response.send(result);
});
//API-4
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playersList = request.body;
  const { playerName, jerseyNumber, role } = playersList;
  const query = `UPDATE cricket_team SET player_name = '${playerName}', jersey_number = '${jerseyNumber}', role = '${role}' WHERE player_id = ${playerId};`;
  await db.run(query);
  response.send("Player Details Updated");
});
//API-5
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const query = `DELETE FROM cricket_team WHERE player_id = ${playerId}`;
  await db.run(query);
  response.send("Player Removed");
});
module.exports = app;
