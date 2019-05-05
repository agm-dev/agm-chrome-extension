/**
 * This scripts reads the config from chrome sync storage
 * and executes a function if the features is enabled
 *
 * This script is only executed on elpais.com/* domains
 *
 * The script removes the overlay that is shown and fixed
 * for those visitors who use ad blocker
 */
(() => {

  const FEATURE_ID = 1
  const LOG_PREFIX = '[agm-chrome-extension]'

  const log = (text = '') => {
    if (!text.length) return;
    console.log(`${LOG_PREFIX} ${text}`)
  }

  const doTheTrick = () => {
    try {
      const overlay = document.querySelector('.fc-ab-root')
      overlay.parentElement.removeChild(overlay)
      document.body.style.overflow = 'scroll'
      log('removed anti ad blocker')
    } catch (e) {
      log('there is no overlay to be removed')
    }
  }

  chrome.storage.sync.get(['features'], ({ features }) => {

    const feature = features.find(item => item.id === FEATURE_ID)
    if (typeof feature !== 'undefined' && feature.enabled) {
      log(`feature '${feature.name}' with id ${feature.id} is enabled`)
      doTheTrick()
      setTimeout(doTheTrick, 500)
      return
    }
    log(`feature '${feature.name}' with id ${feature.id} is disabled`)

  })

})()