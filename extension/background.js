chrome.runtime.onInstalled.addListener(() => {
    console.log('YouTube Downloader extension installed');
});

chrome.action.onClicked.addListener((tab) => {
    if (tab.url.includes('youtube.com')) {
        chrome.action.openPopup();
    } else {
        chrome.tabs.create({
            url: 'https://youtube.com'
        });
    }
});