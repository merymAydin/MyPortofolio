import { Component } from 'react'

/**
 * Catches WebGL/context or scene-render failures so the page can fall
 * back without breaking the rest of the application.
 */
export default class SceneErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error('The Forgotten Archives: library scene failed to render.', error)
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}
