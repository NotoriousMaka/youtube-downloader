document.addEventListener('DOMContentLoaded', function() {
    const formatRadios = document.querySelectorAll('input[name="format"]');
    const downloadBtn = document.getElementById('downloadBtn');
    const videoInfo = document.getElementById('videoInfo');
    const status = document.getElementById('status');
    const spinner = document.getElementById('spinner');
    const videoQualityGroup = document.getElementById('videoQualityGroup');
    const videoQualitySelect = document.getElementById('videoQuality');

    let currentVideoData = null;

    function updateQualityVisibility() {
        const format = document.querySelector('input[name="format"]:checked').value;
        videoQualityGroup.style.display = (format === 'video') ? 'block' : 'none';
    }
    formatRadios.forEach(radio => {
        radio.addEventListener('change', updateQualityVisibility);
    });
    updateQualityVisibility();

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentTab = tabs[0];
        if (currentTab.url.includes('youtube.com/watch')) {
            extractVideoInfo(currentTab);
        } else {
            updateStatus('Please navigate to a YouTube video', 'error');
        }
    });

    function extractVideoInfo(tab) {
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            function: getVideoData
        }, (results) => {
            if (results && results[0] && results[0].result) {
                currentVideoData = results[0].result;
                displayVideoInfo(currentVideoData);
                updateStatus('Video detected - Ready to download', 'success');
            } else {
                updateStatus('Could not detect video information', 'error');
            }
        });
    }

    function displayVideoInfo(videoData) {
        document.getElementById('videoThumbnail').src = videoData.thumbnail;
        document.getElementById('videoTitle').textContent = videoData.title;
        document.getElementById('videoChannel').textContent = videoData.author;
        document.getElementById('videoDuration').textContent = videoData.duration;
        videoInfo.style.display = 'flex';
    }

    function updateStatus(message, type = 'info') {
        const statusSpan = status.querySelector('span');
        statusSpan.textContent = message;
        status.className = 'status';
        if (type === 'error') {
            status.classList.add('error');
        } else if (type === 'success') {
            status.classList.add('success');
        }
    }

    downloadBtn.addEventListener('click', function() {
        if (!currentVideoData) {
            updateStatus('No video data available', 'error');
            return;
        }

        const format = document.querySelector('input[name="format"]:checked').value;
        const quality = format === 'video'
            ? videoQualitySelect.value
            : 'best';

        startDownload(currentVideoData.url, format, quality);
    });

    function startDownload(url, format, quality) {
        downloadBtn.disabled = true;
        spinner.style.display = 'block';
        updateStatus('Starting download...', 'info');

        const downloadData = {
            url: url,
            format: format,
            quality: quality
        };

        fetch('http://localhost:3000/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(downloadData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Download failed');
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${currentVideoData.title}.${format === 'video' ? 'mp4' : 'mp3'}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            updateStatus('Download completed!', 'success');
        })
        .catch(error => {
            console.error('Download error:', error);
            updateStatus('Download failed', 'error');
        })
        .finally(() => {
            downloadBtn.disabled = false;
            setTimeout(() => {
                spinner.style.display = 'none';
            }, 1200);
        });
    }
});

function getVideoData() {
    try {
        const url = window.location.href;

        let title =
            document.querySelector('h1.ytd-watch-metadata > yt-formatted-string')?.textContent?.trim() ||
            document.querySelector('h1.title yt-formatted-string')?.textContent?.trim() ||
            document.querySelector('h1.ytd-watch-metadata')?.textContent?.trim() ||
            document.querySelector('h1.title')?.textContent?.trim() ||
            document.querySelector('meta[name="title"]')?.getAttribute('content')?.trim() ||
            document.title.replace(' - YouTube', '').trim() ||
            'Unknown Title';

        const author = document.querySelector('#owner-name a, .ytd-channel-name a, .ytd-video-owner-renderer a')?.textContent?.trim() || 'Unknown Channel';
        const thumbnail = document.querySelector('video')?.poster || document.querySelector('link[rel="image_src"]')?.href || '';
        const duration = document.querySelector('.ytp-time-duration')?.textContent || 'Unknown Duration';

        return {
            url: url,
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