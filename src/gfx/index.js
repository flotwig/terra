import { WebGLRenderer } from 'three'
import { createCamera } from './camera'

function createRenderer () {
  const renderer = new WebGLRenderer()

  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  return renderer
}

function init () {
  const renderer = createRenderer()
  const camera = createCamera(renderer)

  return {
    renderer,
    camera,
  }
}

module.exports = { init }
