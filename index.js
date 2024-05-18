const express = require('express');
const path = require('path');
const ytdl = require('ytdl-core');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/download', async (req, res) => {
    const videoURL = req.query.url;

    if (!ytdl.validateURL(videoURL)) {
        return res.status(400).send('Invalid URL');
    }

    res.header('Content-Disposition', 'attachment; filename="video.mp4"');
    ytdl(videoURL, { format: 'mp4' }).pipe(res);
});

app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
});
