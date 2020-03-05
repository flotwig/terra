import { PerspectiveCamera, Vector3 } from 'three'

export function createCamera (renderer) {
  const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

  camera.up = new Vector3(0, 0, 1)

  camera.position.z = 30

  camera.rotation.z = Math.PI / 6

  function onWindowResize () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  window.addEventListener('resize', onWindowResize, false)

  return camera
}
