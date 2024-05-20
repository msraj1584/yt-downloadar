const ytdl = require('ytdl-core');

exports.handler = async function(event, context) {
    const videoURL = event.queryStringParameters.url;
    const quality = event.queryStringParameters.quality;

    if (!ytdl.validateURL(videoURL)) {
        return {
            statusCode: 400,
            body: 'Invalid URL',
        };
    }

    try {
        const info = await ytdl.getInfo(videoURL);
        const adaptiveFormats = info.formats.filter(format => format.hasAudio && format.hasVideo);

           // Get video thumbnail
        //    const thumbnail = info.videoDetails.thumbnails && info.videoDetails.thumbnails[0] && info.videoDetails.thumbnails[0].url;

           // Get video title and thumbnail
        const title = info.videoDetails.title;
        const thumbnail = info.videoDetails.thumbnails?.[0]?.url || null;

        if (!quality) {
            // If no quality specified, return available qualities
            const availableQualities = adaptiveFormats.map(format => ({
                quality: format.qualityLabel,
                itag: format.itag,
                format: `${format.container.toUpperCase()} - ${format.audioBitrate ? format.audioBitrate + 'kbps' : ''}`
            }));
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title,availableQualities,thumbnail }),
            };
        } else {
            // If quality is specified, find the format
            const format = adaptiveFormats.find(f => f.itag.toString() === quality);
            if (!format) {
                return {
                    statusCode: 400,
                    body: 'Invalid quality selected',
                };
            }
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: format.url,
                    title,
                    thumbnail
                }),
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: `Server Error: ${error.message}`,
        };
    }
};
