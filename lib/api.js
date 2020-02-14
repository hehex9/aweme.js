const { delay, waitForVarDefined } = require('./util')
const { getWindow } = require('./window')
const AwemeApi = require('./aweme')

const BYTED_ACRAWLER = 'douyin_falcon:node_modules/byted-acrawler/dist/runtime'

exports.posts = async (uid, { count, cursor }) => {
  const window = await getWindow(`https://www.iesdouyin.com/share/user/${uid}`)
  const loader = await waitForVarDefined(window, '__M')

  // no reason, just sleep for a while
  await delay(1000)

  const signature = loader.require(BYTED_ACRAWLER).sign(uid)
  const headers = { 'user-agent': window.navigator.userAgent }

  const posts = await AwemeApi.postsByUser(
    { uid, signature, count, cursor },
    { headers }
  )

  const byIds = await AwemeApi.postsByIds(posts.list.map(i => i.id))
  const postsMap = new Map(byIds.map(i => [i.id, i]))

  return {
    ...posts,
    list: posts.list.map(i => ({
      ...i,
      ...postsMap.get(i.id),
    })),
  }
}
