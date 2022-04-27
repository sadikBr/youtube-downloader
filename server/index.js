const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');

const PORT = process.env.PORT || 3005;
let videoFormats = [];

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json({
    message: 'This is the home page!',
  });
});

app.get('/video/:id', async (req, res) => {
  const { id } = req.params;
  // const videoUrl = `https://www.youtube.com/watch?v=${id}`;
  const videoInfo = await ytdl.getInfo(id);
  const video = {};

  console.log(videoInfo);

  video.title = videoInfo.videoDetails.title;
  video.thumbnail = videoInfo.videoDetails.thumbnails[2];
  video.duration = videoInfo.videoDetails.lengthSeconds;
  video.embed = videoInfo.videoDetails.embed;
  video.formats = videoInfo.formats;
  videoFormats = videoInfo.formats;

  res.json({
    video,
  });
});

app.get('/download/:format', (req, res) => {
  const { format } = req.params;

  res.json({ format: videoFormats[format] });
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
