const express = require('express');
const app = express();
const port = 3000;
const db = require('./database');
const cors = require('cors');
const moment = require('moment-timezone');

app.use(express.json());
app.use(cors()); 

app.get('/', (req, res) => res.send('Hello Tic-Tac-Toe!'));

app.post('/save-game', (req, res) => {
  const { playerXName, playerOName, startTime, endTime, gridSize, winner, moves } = req.body;

  const formattedStartTime = moment(startTime).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss"); 
  const formattedEndTime = moment(endTime).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");

  const sql = 'INSERT INTO game_history (playerXName, playerOName, start_time, end_time, grid_size, winner, moves) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [playerXName, playerOName, formattedStartTime, formattedEndTime, gridSize, winner, JSON.stringify(moves)], (error, result) => {
    if (error) {
      console.error('Error saving game:', error);
      res.status(500).json({ error: 'An error occurred while saving the game.' });
      return;
    }
    res.json({ message: 'Game saved successfully', gameId: result.insertId });
  });
});

app.get('/all-game-history/', (req, res) => {
  const sql = 'SELECT * FROM game_history order by end_time desc';
  db.query(sql, (error, results) => {
    if (error) {
      console.error('Error fetching game history:', error);
      res.status(500).json({ error: 'An error occurred' });
      return;
    }
    console.log("Game history fetched successfully:", results);
    res.json(results);
  });
});

app.get('/game-history/:ID', (req, res) => {
  const id = req.params.ID;
  console.log("Fetching game history with ID:", id);
  const sql = 'SELECT * FROM game_history WHERE id = ?';
  db.query(sql, [id], (error, results) => {
    if (error) {
      console.error('Error fetching game history:', error);
      res.status(500).json({ error: 'An error occurred' });
      return;
    }
    console.log("Game history fetched successfully:", results);
    res.json(results);
  });
});

app.listen(port, () => console.log(`Example app listening on http://localhost:${port}`));
