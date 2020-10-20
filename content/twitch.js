/**
 * This script mutes the streaming on Twitch TV during configured
 * time, and then unmutes it again.
 *
 * The idea is to mute the possible streaming ads when you enter
 * on a channel.
 */
(() => {

  // TODO: check if import and modules work on chrome extensions
  // to make a const and utils modules
  const FEATURE_ID = 2
  const LOG_PREFIX = '[agm-chrome-extension]'
  const DEFAULT_MUTE_TIME = 20 // seconds
  const BUTTON_QUERY_SELECTOR = 'button.player-button--volume'
  const MUTE_STATE_QUERY_SELECTOR = 'span.mute-button'
  const UNMUTE_STATE_QUERY_SELECTOR = 'span.unmute-button'

  const FEATURE_POINTS_AUTOCLICK_ID = 3

  const log = (text = '') => {
    if (!text.length) return;
    console.log(`${LOG_PREFIX} ${text}`)
  }

  const isMuted = () => {
    const mute = document.querySelector(MUTE_STATE_QUERY_SELECTOR)
    const unmute = document.querySelector(UNMUTE_STATE_QUERY_SELECTOR)
    return !mute && unmute
  }

  const simulateClick = element => {
    const e = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    })
    // If cancelled, don't dispatch our event
    const canceled = !element.dispatchEvent(e)
  }

  const mute = () => {
    log('mute audio stream')
    const muteButton = document.querySelector(BUTTON_QUERY_SELECTOR)
    if (muteButton && !isMuted()) simulateClick(muteButton)
  }

  const unmute = () =>  {
    log('unmute audio stream')
    const muteButton = document.querySelector(BUTTON_QUERY_SELECTOR)
    if (muteButton && isMuted()) simulateClick(muteButton)
  }

  let timer

  const doTheTrick = () => {
    const muteButton = document.querySelector(BUTTON_QUERY_SELECTOR)
    log(`muteButton ${muteButton ? 'AVAILABLE' : 'nope'}`)
    if (muteButton) {
      clearInterval(timer)
      mute()
      setTimeout(unmute, DEFAULT_MUTE_TIME * 1000) // TODO: make this value configurable on options, config key
    }
  }

  let pointsAutoClickTimer

  const channelPointsAutoClick = () => {
    const el = document.querySelector('.tw-button')
    const logTag = "Twitch channelPointsAutoClick"
    if (el) {
      simulateClick(el)
      log(`${logTag} POP!`)
    } else {
      log(`${logTag} nothing to POP :(`)
    }
  }

  // main

  chrome.storage.sync.get(['features'], ({ features }) => {

    const feature = features.find(item => item.id === FEATURE_ID)
    const featurePointsAutoClick = features.find(item => item.id === FEATURE_POINTS_AUTOCLICK_ID)

    if (typeof feature !== 'undefined' && feature.enabled) {
      log(`feature '${feature.name}' with id ${feature.id} is enabled`)
      timer = setInterval(doTheTrick, 10)
    } else {
      log(`feature '${feature.name}' with id ${feature.id} is disabled`)
    }

    if (typeof featurePointsAutoClick !== 'undefined' && featurePointsAutoClick.enabled) {
      log(`feature ${featurePointsAutoClick.name} with id ${featurePointsAutoClick.id} is enabled`)
      const intervalMinutes = 3 * 60 * 1000
      pointsAutoClickTimer = setInterval(channelPointsAutoClick, intervalMinutes)
    } else {
      log(`feature ${featurePointsAutoClick.name} with id ${featurePointsAutoClick.id} is disabled`)
    }
  })

})()