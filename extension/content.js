console.log('YouTube Downloader content script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getVideoInfo') {
        const videoData = extractVideoData();
        sendResponse(videoData);
    }
});

function extractVideoData() {
    try {
        const url = window.location.href;
        const videoId = new URLSearchParams(window.location.search).get('v');
        
        if (!videoId) {
            return null;
        }

        const title = document.querySelector('h1.title yt-formatted-string, h1[class*="title"] yt-formatted-string, .ytd-video-primary-info-renderer h1, .ytd-watch-metadata h1')?.textContent?.trim() || 'Unknown Title';
        const author = document.querySelector('#owner-name a, .ytd-channel-name a, .ytd-video-owner-renderer a')?.textContent?.trim() || 'Unknown Channel';
        
        let thumbnail = '';
        const video = document.querySelector('video');
        if (video && video.poster) {
            thumbnail = video.poster;
        } else {
            thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }

        const duration = document.querySelector('.ytp-time-duration')?.textContent || 'Unknown Duration';

        return {
            url: url,
            videoId: videoId,
            title: title,
            author: author,
            thumbnail: thumbnail,
            duration: duration
        };
    } catch (error) {
        console.error('Error extracting video data:', error);
        return null;
    }
}