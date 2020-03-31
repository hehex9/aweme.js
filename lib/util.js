function delay(t) {
  return new Promise((resolve) => setTimeout(resolve, t))
}

function waitForVarDefined(obj, key) {
  if (key in obj) {
    return Promise.resolve(obj[key])
  }

  return delay(1000).then(() => waitForVarDefined(obj, key))
}

exports.delay = delay
exports.waitForVarDefined = waitForVarDefined
