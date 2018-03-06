import wepy from 'wepy'

import config from '../config'

const login = async () => {
  const code = (await wepy.login()).code
  const url = `${config.baseUrl}/api/auth`
  const result = await wepy.request({ url, method: 'POST', data: { code } })

  if (result.data) {
    await wepy.setStorage({ key: 'sessionId', data: result.data })
  }
}

export const checkSession = async () => {
  try {
    await wepy.checkSession()
    const sessionId = (await wepy.getStorage({ key: 'sessionId' })).data

    if (!sessionId) {
      await login()
    } else {
      const hasSession = (await wepy.request(`${config.baseUrl}/api/auth?sessionId=${sessionId}`)).data

      if (!hasSession) {
        await login()
      }
    }
  } catch (e) {
    await login()
  }
}

export const makeUrlObject = url => {
  const protocolIndex = url.indexOf(':')
  const protocol = url.slice(0, protocolIndex + 1)

  const slashIndex = url.slice(protocolIndex + 3).indexOf('/')
  const host = url.slice(protocolIndex + 3, slashIndex ? protocolIndex + 3 + slashIndex : -1)

  const origin = `${protocol}//${host}`

  return {
    protocol,
    host,
    origin,
  }
}
