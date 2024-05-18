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
        const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });

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
    } catch (error) {
        return {
            statusCode: 500,
            body: `Server Error: ${error.message}`,
        };
    }
};
