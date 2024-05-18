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
        const formats = ytdl.filterFormats(info.formats, 'videoonly');

        if (!quality) {
            // If no quality specified, return available qualities
            const availableQualities = formats.map(format => ({
                quality: format.qualityLabel,
                itag: format.itag,
                format: `${format.container.toUpperCase()} - ${format.resolution} - ${format.encoding || 'Video Only'} - ${format.audioBitrate ? format.audioBitrate + 'kbps' : ''}`
            }));
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ availableQualities }),
            };
        } else {
            // If quality is specified, find the format
            const format = formats.find(f => f.itag.toString() === quality);
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
                    title: info.videoDetails.title
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
