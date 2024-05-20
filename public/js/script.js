document.getElementById('fetch-qualities').addEventListener('click', function(event) {
    event.preventDefault();
    const url = document.getElementById('url').value;
    if (!url) {
        document.getElementById('message').textContent = 'Please enter a valid URL.';
        return;
    }

    fetch(`/.netlify/functions/download?url=${encodeURIComponent(url)}`)
        .then(response => response.json())
        .then(data => {
            // if (data.availableQualities) {
            //     const qltylbl =  document.getElementById('qltylbl');
            //     const qualitySelect = document.getElementById('quality');
            //     qualitySelect.innerHTML = '';
            //     data.availableQualities.forEach(quality => {
            //         const option = document.createElement('option');
            //         option.value = quality.itag;
            //         option.textContent = `${quality.quality} (${quality.format})`;
            //         qualitySelect.appendChild(option);
            //     });
            //     qltylbl.style.display = 'block';
            //     qualitySelect.style.display = 'block';
            //     // document.getElementById('download-button').style.display = 'block';




            //     // Display video thumbnail
            //     const thumbnailContainer = document.getElementById('thumbnail-container');
            //     thumbnailContainer.innerHTML = `<img src="${data.thumbnail}" alt="Video Thumbnail" style="margin-left: auto; margin-right: auto;">`;

            //     // Display Video Title
            //     const videoTitle = document.getElementById('videoTitle');
            //     videoTitle.innerHTML=`${data.title}`;
            // } else {
            //     document.getElementById('message').textContent = 'Error: Unable to fetch video qualities.';
            // }
            const qltylbl =  document.getElementById('qltylbl');
            const qualityList = document.getElementById('qualityList');
            qualityList.innerHTML = ''; // Clear old list
            data.availableQualities.forEach(quality => {
                const listItem = document.createElement('li');
                listItem.textContent = `${quality.quality} (${quality.format})`;
                listItem.dataset.value = quality.itag; // Use dataset to store the value
                listItem.style.marginBottom = '10px'; // Set margin-bottom to 10px
// Display size if available
const sizeText = quality.size ? ` - Size: ${formatBytes(quality.size)}` : ''; // Convert bytes to human-readable format
listItem.textContent += sizeText;

                const downloadButton = document.createElement('button');
                downloadButton.textContent = 'Download';
                downloadButton.type='submit';
                downloadButton.style.backgroundColor = '#4CAF50'; // Green background
downloadButton.style.color = 'white'; // White text
downloadButton.style.padding = '10px'; // Padding
downloadButton.style.border = 'none'; // No border
downloadButton.style.cursor = 'pointer'; // Cursor on hover
downloadButton.style.borderRadius = '5px'; // Rounded corners
                downloadButton.addEventListener('click', (event) => {
                        event.preventDefault();
                    downloadVideo(quality.itag);
                });
            
                listItem.appendChild(downloadButton);
                qualityList.appendChild(listItem);
            });
            qualityList.style.display = 'block';
            qltylbl.style.display = 'block';
// Display video thumbnail
const thumbnailContainer = document.getElementById('thumbnail-container');
thumbnailContainer.innerHTML = `<img src="${data.thumbnail}" alt="Video Thumbnail" style="margin-left: auto; margin-right: auto;">`;

// Display Video Title
const videoTitle = document.getElementById('videoTitle');
videoTitle.innerHTML=`${data.title}`;
        })
        .catch(error => {
            document.getElementById('message').textContent = `Error: ${error.message}`;
        });
});
// Function to convert bytes to human-readable format
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function downloadVideo(quality) {
    const url = document.getElementById('url').value;
    if (!url) {
        document.getElementById('message').textContent = 'Please enter a valid URL.';
        return;
    }

    fetch(`/.netlify/functions/download?url=${encodeURIComponent(url)}&quality=${quality}`)
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
}

// document.getElementById('download-form').addEventListener('submit', function(event) {
//     event.preventDefault();
//     const url = document.getElementById('url').value;
//     const quality = document.getElementById('quality').value;
//     if (!url || !quality) {
//         document.getElementById('message').textContent = 'Please enter a valid URL and select a quality.';
//         return;
//     }

//     fetch(`/.netlify/functions/download?url=${encodeURIComponent(url)}&quality=${quality}`)
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
// });
