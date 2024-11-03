let lines = null;
let embedContainer = null;
const delay = 250;
let index = 0;
let dragged;
let id;
let dragIndex;
let indexDrop;
let list;

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
            const listItem = document.createElement('li');
            listItem.draggable = true;
            listItem.className = "dropzone"
            listItem.id = index;
            const icon = document.createElement('i');
            icon.classList.add('fas', 'fa-grip-vertical');
            listItem.appendChild(icon);
            listItem.appendChild(iframe);
            embedContainer.appendChild(listItem);
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


document.addEventListener("dragstart", ({target}) => {
    dragged = target;
    id = target.id;
    list = target.parentNode.children;
    for(let i = 0; i < list.length; i += 1) {
      if (list[i] === dragged) {
        dragIndex = i;
      }
    }
});

document.addEventListener("dragover", (event) => {
    event.preventDefault();
});

document.addEventListener("drop", ({target}) => {
 if(target.className == "dropzone" && target.id !== id) {
     dragged.remove( dragged );
    for (let i = 0; i < list.length; i += 1) {
      if (list[i] === target) {
        indexDrop = i;
      }
    }
    if (dragIndex > indexDrop) {
      target.before( dragged );
    } else {
     target.after( dragged );
    }
  }
});
