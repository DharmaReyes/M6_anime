const express = require('express');
const fs = require('fs/promises');
const app = express();
const PORT = 8000;

app.use(express.json());

const readAnimeFile = async () => {
  const data = await fs.readFile('./anime.json', 'utf8');
  return JSON.parse(data);
};

const writeAnimeFile = async (data) => {
  await fs.writeFile('./anime.json', JSON.stringify(data, null, 2));
};


app.get('/anime', async (req, res) => {
  try {
    const animeData = await readAnimeFile();
    res.json(animeData);
  } catch (error) {
    res.status(500).send('Error reading data');
  }
});

app.get('/anime/:id', async (req, res) => {
  try {
    const animeData = await readAnimeFile();
    const anime = animeData[req.params.id];
    if (anime) {
      res.json(anime);
    } else {
      res.status(404).send('Anime not found');
    }
  } catch (error) {
    res.status(500).send('Error reading data');
  }
});

app.post('/anime', async (req, res) => {
  try {
    const animeData = await readAnimeFile();
    const newId = Object.keys(animeData).length + 1;
    const newAnime = req.body;
    animeData[newId] = newAnime;
    await writeAnimeFile(animeData);
    res.status(201).json(newAnime);
  } catch (error) {
    res.status(500).send('Error saving data');
  }
});

app.put('/anime/:id', async (req, res) => {
  try {
    const animeData = await readAnimeFile();
    const anime = animeData[req.params.id];
    if (anime) {
      animeData[req.params.id] = req.body;
      await writeAnimeFile(animeData);
      res.json(animeData[req.params.id]);
    } else {
      res.status(404).send('Anime not found');
    }
  } catch (error) {
    res.status(500).send('Error updating data');
  }
});

app.delete('/anime/:id', async (req, res) => {
  try {
    const animeData = await readAnimeFile();
    if (animeData[req.params.id]) {
      delete animeData[req.params.id];
      await writeAnimeFile(animeData);
      res.status(204).send();
    } else {
      res.status(404).send('Anime not found');
    }
  } catch (error) {
    res.status(500).send('Error deleting data');
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
