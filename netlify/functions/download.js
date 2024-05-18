const ytdl = require('ytdl-core');

exports.handler = async function(event, context) {
    const videoURL = event.queryStringParameters.url;

    if (!ytdl.validateURL(videoURL)) {
        return {
            statusCode: 400,
            body: 'Invalid URL',
        };
    }

    try {
        const info = await ytdl.getInfo(videoURL);
        const formats = ytdl.filterFormats(info.formats, 'videoonly');

        const availableQualities = formats.map(format => ({
            quality: format.qualityLabel,
            itag: format.itag,
            format: `${format.container.toUpperCase()} - ${format.resolution} - ${format.encoding} - ${format.audioBitrate ? format.audioBitrate + 'kbps' : 'Video Only'}`,
            url: format.url
        }));

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ availableQualities }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: `Server Error: ${error.message}`,
        };
    }
};
