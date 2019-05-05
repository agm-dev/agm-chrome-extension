const { h, app } = hyperapp

const state = {
  title: 'options',
  config: {},
  features: [],
}

const actions = {
  log: text => (state, actions) => console.log(text),
  toggleFeature: item => (state, actions) => {
    const updatedFeatures = state.features.reduce((result, current) => {
      if (current.id === item.id) {
        return [...result, { id: current.id, name: current.name, enabled: !current.enabled }]
      }
      return [...result, current]
    }, [])
    chrome.storage.sync.set({ features: updatedFeatures }, null)
    return { features: updatedFeatures }
  }
}

const title = state => h('h1', {}, `${state.title}`)
const feature = item => (state, actions) => h('tr', {}, [
  h('td', {}, item.name),
  h('td', {}, item.enabled ? 'enabled' : 'disabled'),
  h('td', {}, [
    h('button', { onclick: () => actions.toggleFeature(item) }, 'toggle'),
  ]),
])
const features = (state, actions) => h('table', {}, [
  h('thead', {}, [
    h('tr', {}, [
      h('td', {}, 'Feature'),
      h('td', {}, 'State'),
      h('td', {}, 'Actions'),
    ])
  ]),
  h('tbody', {}, state.features.map(feature)),
])

const view = (state, actions) => h('div', {}, [
  title,
  features,
])

chrome.storage.sync.get(['config', 'features'], storage => {
  state.config = storage.config
  state.features = storage.features
  app(state, actions, view, document.querySelector('#app'))
})
