const axios = require('axios').default

function get(url, params, headers) {
  return axios.get(url, { params, headers: { ...headers } })
}

function videoUrl(i) {
  try {
    return i.video.play_addr.url_list[0].replace('v1/play/', 'v1/playwm/')
  } catch (error) {
    return ''
  }
}

function coverUrl(i) {
  try {
    return i.video.origin_cover.url_list[0]
  } catch (error) {
    return ''
  }
}

function transformPost(i) {
  return {
    id: i.aweme_id,
    title: i.desc,
    videoUrl: videoUrl(i),
    coverUrl: coverUrl(i),
    duration: i.video.duration,
    praiseCount: i.statistics.digg_count,
    commentCount: i.statistics.comment_count,
  }
}

exports.postsByUser = async (
  { uid, signature, count, cursor = 0 },
  { headers }
) => {
  const { data } = await get(
    'https://www.iesdouyin.com/web/api/v2/aweme/post/',
    {
      user_id: uid,
      count,
      max_cursor: cursor,
      _signature: signature,
    },
    headers
  )

  return {
    list: data.aweme_list.map((i) => ({
      ...transformPost(i),
      authorId: i.author.uid,
      praiseCount: i.statistics.digg_count,
      commentCount: i.statistics.comment_count,
    })),
    cursor: data.max_cursor,
    isEnded: !data.has_more,
  }
}

/**
 * @param {string[]} ids
 * @returns {Promise<*>}
 */
exports.postsByIds = async (ids) => {
  const { data } = await get(
    'https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/',
    {
      item_ids: ids.join(','),
    }
  )

  return data.item_list.map(transformPost)
}
