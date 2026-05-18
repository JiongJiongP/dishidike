import { PropsWithChildren } from 'react'
import Taro, { useLaunch } from '@tarojs/taro'
import './app.scss'

function App({ children }: PropsWithChildren) {
  useLaunch(() => {
    console.log('App launched')

    if (Taro.cloud) {
      Taro.cloud.init({
        env: 'cloudbase-d9gno6xbiba7edf22',
        traceUser: true
      })
    }
  })

  return children
}

export default App
