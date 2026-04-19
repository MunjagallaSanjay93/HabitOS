import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Dashboard runtime error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-app-bg p-6">
          <div className="glass-panel w-full max-w-xl rounded-2xl p-8 text-center">
            <h1 className="font-heading text-2xl font-semibold text-app-primary">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm text-app-muted">
              The dashboard hit an unexpected issue. Refresh to recover.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
