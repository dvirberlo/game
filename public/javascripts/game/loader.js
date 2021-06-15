'use strict'

;(function () {
  const scripts = {}
  const getPath = (file) => `/javascripts/game/${file}.js`
  const files = ['manager', 'pixi', 'home', 'nav', 'alert', 'mission', 'map']
  const postLoadFuncs = []
  for (const script of files) $.getScript(getPath(script), () => scriptLoaded(script))

  function scriptLoaded (script) {
    // make each script from global variable(window.script) to local variable(scripts[script])
    scripts[script] = window[script]
    delete window[script]

    if (typeof scripts[script].setup === 'function') scripts[script].setup()
    if (typeof scripts[script].postLoad === 'function') postLoadFuncs.push(scripts[script].postLoad)

    files.splice(files.indexOf(script), 1)
    if (files.length === 0) {
      for (const func of postLoadFuncs) func(scripts)
      scripts.manager.start(scripts)
    }
  }
})()
