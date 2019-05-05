const LOG_PREFIX = '[agm-chrome-extension]'
const DEFAULT_CONFIG = {
  config: {

  },
  features: [
    { id: 1, name: 'elpais.com anti ad blocker', enabled: true },
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