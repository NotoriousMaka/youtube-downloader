const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const app = express();
app.use(express.json());

function getFormatCode(format, quality) {
    if (format === 'audio') {
        return 'bestaudio';
    }
    switch (quality) {
        case '1080p':
            return 'bestvideo[height<=1080]+bestaudio/best[height<=1080]';
        case '720p':
            return 'bestvideo[height<=720]+bestaudio/best[height<=720]';
        case '480p':
            return 'bestvideo[height<=480]+bestaudio/best[height<=480]';
        case '360p':
            return 'bestvideo[height<=360]+bestaudio/best[height<=360]';
        default:
            return 'bestvideo+bestaudio/best';
    }
}

app.post('/download', async (req, res) => {
    const { url, format, quality } = req.body;
    if (!url) return res.status(400).json({ error: 'No URL provided' });

    const tmpDir = os.tmpdir();
    let ext, ytdlpArgs, tmpFile;

    if (format === 'audio') {
        ext = 'mp3';
        tmpFile = path.join(tmpDir, 'yt-' + crypto.randomBytes(8).toString('hex') + '.' + ext);
        ytdlpArgs = [
            '-f', 'bestaudio',
            '-o', tmpFile,
            '--no-playlist',
            '--extract-audio',
            '--audio-format', 'mp3',
            url
        ];
    } else {
        ext = 'mp4';
        tmpFile = path.join(tmpDir, 'yt-' + crypto.randomBytes(8).toString('hex') + '.' + ext);
        ytdlpArgs = [
            '-f', getFormatCode(format, quality),
            '-o', tmpFile,
            '--no-playlist',
            '--merge-output-format', 'mp4',
            '--remux-video', 'mp4',
            '--postprocessor-args', 'ffmpeg:-c:a aac',
            url
        ];
    }

    const ytdlp = spawn('yt-dlp', ytdlpArgs);

    ytdlp.stderr.on('data', data => process.stderr.write(data));
    ytdlp.stdout.on('data', data => process.stdout.write(data));

    ytdlp.on('close', code => {
        if (code !== 0) {
            res.status(500).json({ error: 'yt-dlp failed' });
            try { fs.unlinkSync(tmpFile); } catch {}
            return;
        }
        res.download(tmpFile, err => {
            try { fs.unlinkSync(tmpFile); } catch {}
        });
    });
});

app.listen(3000, () => {
    console.log('YouTube Downloader server running on http://localhost:3000');
});