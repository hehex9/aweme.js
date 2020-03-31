const { JSDOM, VirtualConsole } = require('jsdom')

exports.getWindow = async (url) => {
  // ignore console output
  const virtualConsole = new VirtualConsole()
  const { window } = await JSDOM.fromURL(url, {
    virtualConsole,
    runScripts: 'dangerously',
    resources: 'usable',
  })

  return window
}
