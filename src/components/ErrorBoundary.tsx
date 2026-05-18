import { Component, ReactNode } from 'react'
import { View, Text, Button } from '@tarojs/components'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: string
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: '' }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error: error.message }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: '' })
  }

  render() {
    if (this.state.hasError) {
      return (
        <View className='empty-state'>
          <Text className='empty-state__icon'>⚠️</Text>
          <Text className='empty-state__message'>出错了: {this.state.error}</Text>
          <Button className='empty-state__btn' onClick={this.handleRetry}>重试</Button>
        </View>
      )
    }
    return this.props.children
  }
}
