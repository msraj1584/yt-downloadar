const ytdl = require('ytdl-core');

exports.handler = async function(event, context) {
    const videoURL = event.queryStringParameters.url;

    if (!ytdl.validateURL(videoURL)) {
        return {
            statusCode: 400,
            body: 'Invalid URL',
        };
    }

    const videoReadableStream = ytdl(videoURL, { format: 'mp4' });

    const headers = {
        'Content-Type': 'video/mp4',
        'Content-Disposition': 'attachment; filename="video.mp4"',
    };

    return new Promise((resolve, reject) => {
        const chunks = [];
        videoReadableStream.on('data', chunk => chunks.push(chunk));
        videoReadableStream.on('end', () => {
            const body = Buffer.concat(chunks).toString('base64');
            resolve({
                statusCode: 200,
                headers,
                isBase64Encoded: true,
                body,
            });
        });
        videoReadableStream.on('error', err => reject({
            statusCode: 500,
            body: 'Server Error: ' + err.message,
        }));
    });
};
