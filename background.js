const LOG_PREFIX = '[agm-chrome-extension]'
const DEFAULT_CONFIG = {
  config: {

  },
  features: [
    { id: 1, name: 'Elpais anti ad blocker', enabled: true },
    { id: 2, name: 'Twitch initial mute', enabled: true },
    { id: 3, name: 'Twitch channel points clicker', enabled: true },
  ],
}

function log(text = '') {
  if (!text.length) return;
  console.log(`${LOG_PREFIX} ${text}`)
}

const logHoF = text => () => log(text)

chrome.runtime.onInstalled.addListener(function() {
  log('background script has been installed')
  chrome.storage.sync.set(DEFAULT_CONFIG, logHoF('set default config'))
})
