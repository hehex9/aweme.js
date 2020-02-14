/* eslint-disable no-console */

const Api = require('../lib/api')
const { delay } = require('../lib/util')

async function main() {
  let cnt = 0
  let nextCursor = 0
  let t = Date.now()

  const id = process.argv.slice(2)[0]

  for (;;) {
    const rs = await Api.posts(id, { count: 10, cursor: nextCursor })
    nextCursor = rs.cursor

    rs.list.map(i => console.log(i))
    console.log(`${((Date.now() - t) / 1000).toFixed(2)}s`)
    t = Date.now()

    if (rs.isEnded) {
      break
    }

    cnt += rs.list.length
    await delay(1000)
  }

  console.log('total:', cnt)
}

main()
