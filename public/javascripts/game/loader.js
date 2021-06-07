'use strict'

// ;(function () {
const scripts = {}
const getPath = (file) => `/javascripts/game/${file}.js`
const files = ['manager', 'pixi', 'home', 'nav', 'mission', 'map']
for (const script of files) $.getScript(getPath(script), () => scriptLoaded(script))

function scriptLoaded (script) {
  // make each script from global variable(window.script) to local variable(scripts[script])
  scripts[script] = window[script]
  delete window[script]

  if (typeof scripts[script].setup === 'function') scripts[script].setup()

  files.splice(files.indexOf(script), 1)
  if (files.length === 0) scripts.manager.start(scripts)
}
// })()
