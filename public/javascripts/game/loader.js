'use strict'

;(function () {
  const lib = {}
  const getPath = (file) => `/javascripts/game/${file}.js`
  const files = ['manager', 'pixi', 'home', 'nav', 'prompt', 'mission', 'map']
  const postLoadFuncs = []
  for (const script of files) $.getScript(getPath(script), () => scriptLoaded(script))

  function scriptLoaded (script) {
    // make each script from global variable(window.script) to local variable(scripts[script])
    lib[script] = window[script]
    delete window[script]

    if (typeof lib[script].setup === 'function') lib[script].setup()
    if (typeof lib[script].postLoad === 'function') postLoadFuncs.push(lib[script].postLoad)

    files.splice(files.indexOf(script), 1)
    if (files.length === 0) {
      for (const func of postLoadFuncs) func(lib)
      lib.manager.start(lib)
    }
  }
})()
