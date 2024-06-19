chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url.includes('youtube.com')) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: playYouTubeVideo
      }).catch(err => console.error(err));
    } else {
      chrome.tabs.query({ url: "*://*.youtube.com/*" }, function(tabs) {
        tabs.forEach((tab) => {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: pauseYouTubeVideo
          }).catch(err => console.error(err));
        });
      });
    }
  });
  
  chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
      chrome.tabs.query({ url: "*://*.youtube.com/*" }, function(tabs) {
        tabs.forEach((tab) => {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: pauseYouTubeVideo
          }).catch(err => console.error(err));
        });
      });
    } else {
      chrome.windows.get(windowId, { populate: true }, (window) => {
        window.tabs.forEach((tab) => {
          if (tab.url.includes('youtube.com') && tab.active) {
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: playYouTubeVideo
            }).catch(err => console.error(err));
          }
        });
      });
    }
  });
  
  function pauseYouTubeVideo() {
    const video = document.querySelector('video');
    if (video && !video.paused) {
      video.pause();
    }
  }
  
  function playYouTubeVideo() {
    const video = document.querySelector('video');
    if (video && video.paused) {
      video.play();
    }
  }
  