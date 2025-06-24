# 🎬 YouTube Downloader Pro

A powerful Chrome extension with a local Node.js backend that allows you to download YouTube videos and audio in high quality using `yt-dlp` and `ffmpeg`.

---

## 🚀 Features

- 📥 Download YouTube **videos** in MP4 format (1080p, 720p, 480p, 360p)
- 🎧 Download **audio only** in high-quality MP3 format
- ⚡ Clean and simple **Chrome extension UI**
- 🔧 Local processing — no third-party servers
- 🔌 Built with `yt-dlp`, `ffmpeg`, and Node.js

---

## 📁 Project Structure

```
youtube-downloader/
│
├── extension/           # Chrome extension files
│   ├── popup.html       # Extension UI
│   ├── popup.css        # Styling
│   ├── popup.js         # UI logic
│   ├── content.js       # Script to extract video data
│   ├── background.js    # Extension background service
│   ├── manifest.json    # Chrome extension config
│   └── icons/           # Extension icons
│       └── icon16.png
│       └── icon48.png
│       └── icon128.png
│
└── server/              # Node.js backend
    ├── server.js        # Express server with yt-dlp + ffmpeg
    └── package.json     # Node dependencies
```

---

## ✅ Requirements

- [Node.js](https://nodejs.org/)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) (must be in your system's PATH)
- [ffmpeg](https://ffmpeg.org/) (must be in your system's PATH)
- Google Chrome (for the extension)

---

## ⚙️ Setup Instructions

### 🔌 1. Start the Backend Server

```bash
cd server
npm install
npm start
```

The backend will run at: [http://localhost:3000](http://localhost:3000)

---

### 🧩 2. Install the Chrome Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `extension/` folder

---

## 📓 Usage

1. Go to any YouTube video page
2. Click the **YouTube Downloader Pro** extension icon
3. Select format (**Video** or **Audio**) and desired quality
4. Click **Download**
5. The extension communicates with your local server and downloads the file

---

## 💡 Notes

- The local server must be running while using the extension
- All downloads are processed **locally** — no data is sent to third-party servers
- Ensure `yt-dlp` and `ffmpeg` are properly installed and accessible via command line

---

## 📄 License

This project is licensed under the MIT License.
