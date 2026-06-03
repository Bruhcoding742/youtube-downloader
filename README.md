# YouTube Downloader

A simple, ad-free YouTube video downloader built with Node.js and yt-dlp.

## Features

✅ **No ads** - Clean, ad-free interface  
✅ **Video info preview** - See title, duration, uploader before downloading  
✅ **Multiple formats** - Best quality, 1080p, 720p, or audio-only  
✅ **Download management** - List and access all downloaded files  
✅ **Responsive design** - Works on desktop and mobile  

## Prerequisites

- Node.js (v14 or higher)
- yt-dlp
- npm or yarn

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Bruhcoding742/youtube-downloader.git
cd youtube-downloader
```

### 2. Install Node.js Dependencies
```bash
npm install
```

### 3. Install yt-dlp

**Windows:**
```bash
pip install yt-dlp
```

**macOS:**
```bash
brew install yt-dlp
```

**Linux:**
```bash
sudo apt-get install yt-dlp
```

### 4. Start the Server
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

### 5. Open in Browser
Go to `http://localhost:3000`

## Usage

1. **Paste a YouTube URL** - Enter any valid YouTube URL
2. **Get Info** - Click "Get Info" to preview video details
3. **Select Format** - Choose your preferred quality (Best, 1080p, 720p, or Audio Only)
4. **Download** - Click the format button to start downloading
5. **Access Downloads** - View and download your files from the "Downloaded Files" section

## API Endpoints

### POST `/api/info`
Fetch video information (title, duration, thumbnail, uploader)
```json
{
  "url": "https://youtube.com/watch?v=..."
}
```

### POST `/api/download`
Start downloading a video
```json
{
  "url": "https://youtube.com/watch?v=...",
  "format": "best|1080p|720p|audio"
}
```

### GET `/api/downloads`
List all downloaded files

### GET `/api/download/:filename`
Download a specific file

## Configuration

Edit `.env` to customize:
```
PORT=3000
```

## Project Structure
```
youtube-downloader/
├── public/
│   ├── index.html      # Frontend UI
│   ├── style.css       # Styling
│   └── script.js       # Frontend logic
├── downloads/          # Downloaded files (auto-created)
├── server.js           # Express server & API routes
├── package.json        # Dependencies
├── .env               # Environment variables
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## Important Legal Notice

⚠️ **DISCLAIMER**: This tool is provided for educational purposes only. Users are responsible for complying with YouTube's Terms of Service and all applicable laws. Only download videos:
- That you have permission to download
- Your own content
- Content with explicit download permissions
- Creative Commons content with appropriate licenses

Downloading copyrighted content without permission is illegal in most jurisdictions.

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## Troubleshooting

**yt-dlp not found?**
- Make sure yt-dlp is installed: `yt-dlp --version`
- Check it's in your PATH

**Port already in use?**
- Change PORT in `.env` file

**Downloads not appearing?**
- Check that the `downloads/` directory was created
- Verify file permissions
