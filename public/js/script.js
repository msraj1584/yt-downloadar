document.getElementById('fetch-qualities').addEventListener('click', function(event) {
    event.preventDefault();
    const url = document.getElementById('url').value;
    document.getElementById('message').textContent = '';

    if (!url) {
        document.getElementById('message').textContent = 'Please enter a valid URL.';
        return;
    }

    fetch(`/.netlify/functions/download?url=${encodeURIComponent(url)}`)
        .then(response => response.json())
        .then(data => {
            displayVideoDetails(data);
        })
        .catch(error => {
            document.getElementById('message').textContent = `Error: ${error.message}`;
        });
});

function displayVideoDetails(data) {
    const qltylbl = document.getElementById('qltylbl');
    const qualityList = document.getElementById('qualityList');
    const thumbnailContainer = document.getElementById('thumbnail-container');
    const videoTitle = document.getElementById('videoTitle');

    qualityList.innerHTML = ''; // Clear old list
    data.availableQualities.forEach(quality => {
        const listItem = document.createElement('li');
        listItem.textContent = `${quality.quality} (${quality.format}) - Size: ${quality.size ? formatBytes(quality.size) : 'unknown'}`;
        listItem.dataset.value = quality.itag; // Use dataset to store the value
        listItem.style.marginBottom = '10px';

        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download';
        downloadButton.type = 'submit';
        styleDownloadButton(downloadButton);
        downloadButton.addEventListener('click', (event) => {
            event.preventDefault();
            downloadVideo(quality.itag);
        });

        listItem.appendChild(downloadButton);
        qualityList.appendChild(listItem);
    });

    qualityList.style.display = 'block';
    qltylbl.style.display = 'block';
    thumbnailContainer.innerHTML = `<img src="${data.thumbnail}" alt="Video Thumbnail" style="margin-left: auto; margin-right: auto;">`;
    videoTitle.innerHTML = `${data.title}`;
}

function styleDownloadButton(button) {
    button.style.backgroundColor = '#4CAF50'; // Green background
    button.style.color = 'white'; // White text
    button.style.padding = '10px'; // Padding
    button.style.border = 'none'; // No border
    button.style.cursor = 'pointer'; // Cursor on hover
    button.style.borderRadius = '5px'; // Rounded corners
}

function downloadVideo(quality) {
    const url = document.getElementById('url').value;
    document.getElementById('message').textContent = '';

    if (!url) {
        document.getElementById('message').textContent = 'Please enter a valid URL and select a quality.';
        return;
    }

    const downloadUrl = `/.netlify/functions/download?url=${encodeURIComponent(url)}&quality=${quality}`;
    triggerDownload(downloadUrl);
}
function triggerDownload(downloadUrl) {
    fetch(downloadUrl, {
        method: 'GET',
        headers: {
            'Content-Disposition': 'attachment' // Set Content-Disposition header to 'attachment'
        }
    })
    .then(response => {
        // Check if response is successful
        if (!response.ok) {
            throw new Error('Failed to download video');
        }
        // Return response blob
        return response.blob();
    })
    .then(blob => {
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);
        // Create a temporary anchor element
        const a = document.createElement('a');
        // Set the href attribute to the blob URL
        a.href = url;
        // Set the download attribute to force download
        a.download = ''; // This will trigger download instead of opening in a new tab
        // Append the anchor to the document body
        document.body.appendChild(a);
        // Programmatically click the anchor element
        a.click();
        // Remove the anchor from the document body
        document.body.removeChild(a);
        // Revoke the blob URL to free up memory
        window.URL.revokeObjectURL(url);
    })
    .catch(error => {
        // Handle errors
        console.error('Error downloading video:', error);
    });
}

// function triggerDownload(downloadUrl) {
//     fetch(downloadUrl)
//         .then(response => response.json())
//         .then(data => {
//             if (data.url) {
//                 const a = document.createElement('a');
//                 a.href = data.url;
//                 a.download = `${data.title}.mp4`;
//                 document.body.appendChild(a);
//                 a.click();
//                 document.body.removeChild(a);
//             } else {
//                 document.getElementById('message').textContent = 'Error: Unable to fetch video URL.';
//             }
//         })
//         .catch(error => {
//             document.getElementById('message').textContent = `Error: ${error.message}`;
//         });
// }

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
