const form = document.getElementById('form');
const linkInput = document.getElementById('video-link');
const loadingEl = document.getElementById('loading');
const resultElement = document.getElementById('search-results');

const PORT = 3005;
const API_URL = `http://localhost:${PORT}`;

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const videoLink = linkInput.value;
  const videoId = videoLink.split('=')[1].substring(0, 11);

  populateResults(videoId);
});

async function populateResults(videoId) {
  resultElement.innerHTML = '';
  loadingEl.classList.add('show');
  const { video } = await getResults(API_URL, videoId);
  loadingEl.classList.remove('show');

  // creating the thumbnail
  const thumbnail = document.createElement('img');
  thumbnail.classList.add('thumbnail');
  thumbnail.src = video.thumbnail.url;

  // creating the title and duration elements
  const title = document.createElement('h4');
  title.textContent = video.title;
  const duration = document.createElement('p');
  duration.textContent = `Duration: ${formatTime(video.duration)}`;
  const infoContainer = document.createElement('div');
  infoContainer.classList.add('info-container');
  infoContainer.appendChild(title);
  infoContainer.appendChild(duration);

  // Creating the flexbox container
  const container = document.createElement('div');
  container.classList.add('video-info');
  container.appendChild(thumbnail);
  container.appendChild(infoContainer);

  // creating the select element for all the formats
  const formatSelect = document.createElement('select');
  formatSelect.classList.add('format-select');
  video.formats.forEach((format, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${format.mimeType.split(';')[0]} ${
      format.qualityLabel || ''
    } ${formatSize(format.contentLength)}`;
    formatSelect.appendChild(option);
  });

  // Appending the form select to the info container
  infoContainer.appendChild(formatSelect);

  // Creating the download button
  const download = document.createElement('button');
  download.classList.add('button');
  download.textContent = 'Download';

  // Appending the download button to the info container
  infoContainer.appendChild(download);

  // Listen for the click event on the button
  download.addEventListener('click', () => {
    const formatIndex = formatSelect.value;

    downloadVideo(API_URL, formatIndex).then(console.log);
  });

  // Creating the iframe to embed to the page
  const videoEmbed = document.createElement('iframe');
  videoEmbed.classList.add('video-embed');
  videoEmbed.setAttribute('frameBorder', '0');
  videoEmbed.setAttribute('allowfullscreen', true);
  videoEmbed.src = video.embed.iframeUrl;

  // Appending all the elements to the page
  resultElement.appendChild(container);
  resultElement.appendChild(videoEmbed);
}

async function getResults(api, videoId) {
  try {
    const response = await fetch(`${api}/video/${videoId}`);
    const data = await response.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function downloadVideo(api, formatIndex) {
  try {
    const response = await fetch(`${api}/download/${formatIndex}`);
    const data = await response.json();

    return data;
  } catch (error) {
    return error;
  }
}

function formatSize(size_string) {
  const size = Number(size_string);

  return `${(size / Math.pow(10, 6)).toFixed(2)}MB`;
}

function formatTime(seconds_string) {
  const seconds = Number(seconds_string);

  let hours = Math.floor(seconds / 3600);
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = Math.floor(seconds / 60);
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let remaining_seconds = Math.floor(seconds % 60);
  if (remaining_seconds < 10) {
    remaining_seconds = `0${remaining_seconds}`;
  }

  return `${hours}:${minutes}:${remaining_seconds}`;
}
