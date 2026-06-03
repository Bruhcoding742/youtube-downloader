const express = require('express');
const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const DOWNLOADS_DIR = path.join(__dirname, 'downloads');

// Create downloads directory if it doesn't exist
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

app.use(express.json());
app.use(express.static('public'));

// Download route
app.post('/api/download', (req, res) => {
  const { url, format } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Validate URL
  if (!isValidYouTubeUrl(url)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  const outputPath = path.join(DOWNLOADS_DIR, '%(title)s.%(ext)s');
  let args = [url, '-o', outputPath];

  // Add format options
  if (format === 'audio') {
    args.push('-f', 'bestaudio[ext=m4a]');
  } else if (format === '1080p') {
    args.push('-f', 'bestvideo[height<=1080]+bestaudio/best[height<=1080]');
  } else if (format === '720p') {
    args.push('-f', 'bestvideo[height<=720]+bestaudio/best[height<=720]');
  } else {
    args.push('-f', 'best');
  }

  execFile('yt-dlp', args, (error, stdout, stderr) => {
    if (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Download failed', details: error.message });
    }

    res.json({ 
      success: true, 
      message: 'Download started successfully',
      output: stdout 
    });
  });
});

// Get download info
app.post('/api/info', (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  if (!isValidYouTubeUrl(url)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  execFile('yt-dlp', ['-j', url], (error, stdout, stderr) => {
    if (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Failed to fetch info', details: error.message });
    }

    try {
      const info = JSON.parse(stdout);
      res.json({
        title: info.title,
        duration: info.duration,
        thumbnail: info.thumbnail,
        uploader: info.uploader,
        formats: info.formats.map(f => ({
          format_id: f.format_id,
          format: f.format,
          resolution: f.format_note || 'unknown'
        }))
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to parse video info' });
    }
  });
});

// List downloaded files
app.get('/api/downloads', (req, res) => {
  fs.readdir(DOWNLOADS_DIR, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read downloads' });
    }
    res.json({ files });
  });
});

// Download file
app.get('/api/download/:filename', (req, res) => {
  const filename = path.basename(req.params.filename);
  const filepath = path.join(DOWNLOADS_DIR, filename);

  res.download(filepath, (err) => {
    if (err) {
      res.status(500).json({ error: 'Download failed' });
    }
  });
});

function isValidYouTubeUrl(url) {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
  return youtubeRegex.test(url);
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
