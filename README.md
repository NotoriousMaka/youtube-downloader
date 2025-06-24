# YouTube Downloader Pro

A Chrome extension and Node.js backend to download YouTube videos and audio in high quality.

## Features

- Download YouTube videos in MP4 format (1080p, 720p, 480p, 360p)
- Download audio in MP3 format
- Simple Chrome extension popup UI
- Uses a local Node.js server with `yt-dlp` and `ffmpeg` for processing

## Project Structure

```
extension/
  background.js
  content.js
  manifest.json
  popup.css
  popup.html
  popup.js
  icons/
    icon128.png
    icon16.png
    icon48.png
server/
  package.json
  server.js
```

## Prerequisites

- [Node.js](https://nodejs.org/)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) installed and available in your system PATH
- [ffmpeg](https://ffmpeg.org/) installed and available in your system PATH
- Google Chrome

## Setup

### 1. Backend Server

1. Open a terminal and navigate to the `server` directory:

    ```sh
    cd server
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Start the server:

    ```sh
    npm start
    ```

   The server will run at [http://localhost:3000](http://localhost:3000).

### 2. Chrome Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked" and select the `extension` folder
4. The extension should now appear in your browser

## Usage

1. Navigate to a YouTube video page
2. Click the YouTube Downloader Pro extension icon
3. Choose "Video" or "Audio" and select the desired quality
4. Click "Download"
5. The extension will communicate with the local server and download the file

## Notes

- The backend server must be running for the extension to work.
- Downloads are processed locally; no data is sent to third-party servers.
- Make sure `yt-dlp` and `ffmpeg` are installed and accessible from your command line.
