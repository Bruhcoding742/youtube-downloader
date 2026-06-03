const statusDiv = document.getElementById('status');
const videoInfoDiv = document.getElementById('videoInfo');
const formatSection = document.getElementById('formatSection');

async function getInfo() {
  const url = document.getElementById('videoUrl').value;
  
  if (!url) {
    showStatus('Please enter a YouTube URL', 'error');
    return;
  }

  showStatus('Fetching video information...', 'loading');

  try {
    const response = await fetch('/api/info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      const error = await response.json();
      showStatus(error.error || 'Failed to fetch info', 'error');
      return;
    }

    const data = await response.json();
    
    document.getElementById('videoTitle').textContent = data.title;
    document.getElementById('videoUploader').textContent = data.uploader || 'Unknown';
    document.getElementById('videoDuration').textContent = formatDuration(data.duration);
    document.getElementById('thumbnail').src = data.thumbnail;
    
    videoInfoDiv.classList.remove('hidden');
    formatSection.classList.remove('hidden');
    showStatus('Video information loaded!', 'success');
  } catch (error) {
    showStatus('Error: ' + error.message, 'error');
  }
}

async function downloadVideo(format = 'best') {
  const url = document.getElementById('videoUrl').value;
  
  if (!url) {
    showStatus('Please enter a YouTube URL', 'error');
    return;
  }

  showStatus('Starting download...', 'loading');

  try {
    const response = await fetch('/api/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, format })
    });

    if (!response.ok) {
      const error = await response.json();
      showStatus(error.error || 'Download failed', 'error');
      return;
    }

    showStatus('✅ Download completed successfully!', 'success');
    setTimeout(() => listDownloads(), 1000);
  } catch (error) {
    showStatus('Error: ' + error.message, 'error');
  }
}

async function listDownloads() {
  try {
    const response = await fetch('/api/downloads');
    const data = await response.json();
    
    const downloadsList = document.getElementById('downloadsList');
    
    if (data.files.length === 0) {
      downloadsList.innerHTML = '<p style="color: #999;">No downloads yet</p>';
      return;
    }

    downloadsList.innerHTML = data.files.map(file => `
      <div class="download-item">
        <a href="/api/download/${encodeURIComponent(file)}" target="_blank">
          📁 ${file}
        </a>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error listing downloads:', error);
  }
}

function showStatus(message, type) {
  statusDiv.textContent = message;
  statusDiv.className = 'status ' + type;
}

function formatDuration(seconds) {
  if (!seconds) return 'Unknown';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  return `${minutes}m ${secs}s`;
}

// Load downloads on page load
document.addEventListener('DOMContentLoaded', listDownloads);
