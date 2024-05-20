const ytdl = require('ytdl-core');

exports.handler = async function(event, context) {
    const videoURL = event.queryStringParameters.url;
    const quality = event.queryStringParameters.quality;
    const start = event.queryStringParameters.start;
    const end = event.queryStringParameters.end;
    if (!ytdl.validateURL(videoURL)) {
        return {
            statusCode: 400,
            body: 'Invalid URL',
        };
    }

    try {
        const info = await ytdl.getInfo(videoURL);
        const adaptiveFormats = info.formats.filter(format => format.hasAudio && format.hasVideo);

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
             // Prepare options for start and end duration
             const options = {};
             if (start) options.begin = parseInt(start, 10);
             if (end) options.end = parseInt(end, 10);
 
             // Generate the download URL with options
             const downloadURL = ytdl.downloadFromInfo(info, { quality: format.itag, requestOptions: { headers: { range: options } } });
 
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: downloadURL,
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
