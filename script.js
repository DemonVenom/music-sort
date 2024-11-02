let lines = null;
let embedContainer = null;
const delay = 250;
let index = 0;

document.getElementById('csvFileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const csvData = e.target.result;
            parseCSV(csvData);
        };
        reader.readAsText(file);
    }
});

function createIframe() {
    if (index >= lines.length) return;

    const line = lines[index];
    const columns = line.split(',');
    if (columns.length > 0) {
        // Get the spotify:track: URI
        const trackUri = columns[4].trim();
         // Extract the ID
        const trackId = trackUri.split(':')[2];

        if (trackId) {
            const embedUrl = `https://open.spotify.com/embed/track/${trackId}?utm_source=oembed`;
            const iframe = document.createElement('iframe');
            iframe.src = embedUrl;
            iframe.title = `Spotify Embed: ${columns[1]} by ${columns[2]}`;
            embedContainer.appendChild(iframe);
        }
    }

    index++;
    // Delay to prevent 429 errors
    // TODO: change to not use delays -- possibly gut embeds entirely
    setTimeout(createIframe, delay);
}

function parseCSV(data) {
    lines = data.split('\n');
    embedContainer = document.getElementById('embedContainer');
    embedContainer.innerHTML = '';

    createIframe();
}