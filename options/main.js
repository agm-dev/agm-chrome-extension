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

const title = state => h('div', { className: 'row' }, [
  h('h1', { className: 'col-12 text-center text-uppercase' }, `${state.title}`)
])
const feature = (item, index) => (state, actions) => h('tr', {}, [
  h('th', { scope: 'row', className: 'align-middle' }, `${index + 1}`),
  h('td', { className: 'align-middle' }, item.name),
  h('td', { className: 'align-middle' }, [
    h('button', { className: `btn ${item.enabled ? 'btn-success' : 'btn-danger'}`, onclick: () => actions.toggleFeature(item) }, item.enabled ? 'Enabled' : 'Disabled')
  ]),
])
const features = (state, actions) => h('table', { className: 'table table-striped' }, [
  h('thead', { className: 'thead-dark' }, [
    h('tr', {}, [
      h('th', { scope: 'col' }, '#'),
      h('th', { scope: 'col' }, 'Feature'),
      h('th', { scope: 'col' }, 'State'),
    ])
  ]),
  h('tbody', {}, state.features.map(feature)),
])

const view = (state, actions) => h('div', { className: 'container mt-3' }, [
  title,
  features,
])

chrome.storage.sync.get(['config', 'features'], storage => {
  state.config = storage.config
  state.features = storage.features
  app(state, actions, view, document.querySelector('#app'))
})
