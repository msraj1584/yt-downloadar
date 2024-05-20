document.getElementById('fetch-qualities').addEventListener('click', function(event) {
    event.preventDefault();
    const url = document.getElementById('url').value;
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;
    if (!url) {
        document.getElementById('message').textContent = 'Please enter a valid URL.';
        return;
    }

    let fetchUrl = `/.netlify/functions/download?url=${encodeURIComponent(url)}`;
    if (start) fetchUrl += `&start=${start}`;
    if (end) fetchUrl += `&end=${end}`;

    fetch(fetchUrl)
        .then(response => response.json())
        .then(data => {
            if (data.availableQualities) {
                const qualitySelect = document.getElementById('quality');
                qualitySelect.innerHTML = '';
                data.availableQualities.forEach(quality => {
                    const option = document.createElement('option');
                    option.value = quality.itag;
                    option.textContent = `${quality.quality} (${quality.format})`;
                    qualitySelect.appendChild(option);
                });
                qualitySelect.style.display = 'block';
                document.getElementById('download-button').style.display = 'block';

                // Display video thumbnail
                const thumbnailContainer = document.getElementById('thumbnail-container');
                thumbnailContainer.innerHTML = `<img src="${data.thumbnail}" alt="Video Thumbnail">`;

                // Display Video Title
                const videoTitle = document.getElementById('videoTitle');
                videoTitle.innerHTML=`${data.title}`;
            } else {
                document.getElementById('message').textContent = 'Error: Unable to fetch video qualities.';
            }
        })
        .catch(error => {
            document.getElementById('message').textContent = `Error: ${error.message}`;
        });
});

document.getElementById('download-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const url = document.getElementById('url').value;
    const quality = document.getElementById('quality').value;
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;
    if (!url || !quality) {
        document.getElementById('message').textContent = 'Please enter a valid URL and select a quality.';
        return;
    }

let fetchUrl = `/.netlify/functions/download?url=${encodeURIComponent(url)}&quality=${quality}`;
    if (start) fetchUrl += `&start=${start}`;
    if (end) fetchUrl += `&end=${end}`;

    fetch(fetchUrl)
        .then(response => response.json())
        .then(data => {
            if (data.url) {
                const a = document.createElement('a');
                a.href = data.url;
                a.download = `${data.title}.mp4`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                document.getElementById('message').textContent = 'Error: Unable to fetch video URL.';
            }
        })
        .catch(error => {
            document.getElementById('message').textContent = `Error: ${error.message}`;
        });
});
