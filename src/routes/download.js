const express = require('express');
const ytdl = require('ytdl-core');
const router = express.Router();

router.get('/', async (req, res) => {
    const videoURL = req.query.url;

    if (!ytdl.validateURL(videoURL)) {
        return res.status(400).send('Invalid URL');
    }

    res.header('Content-Disposition', 'attachment; filename="video.mp4"');
    ytdl(videoURL, { format: 'mp4' }).pipe(res);
});

module.exports = router;
