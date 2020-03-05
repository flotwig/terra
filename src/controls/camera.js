import { Vector3, MOUSE } from 'three'
import { OrbitControls } from './OrbitControls'

const getOnWorldFrame = ({ renderer, camera }) => {
  const controls = new OrbitControls(camera, renderer.domElement)

  controls.keys = { // wasd
    LEFT: 65,
    UP: 87,
    RIGHT: 68,
    BOTTOM: 83,
  }

  controls.mouseButtons = {
    LEFT: null,
    MIDDLE: MOUSE.ROTATE,
    RIGHT: null,
  }

  controls.enableDamping = true

  controls.screenSpacePanning = true

  controls.keyPanSpeed = 15

  controls.target = new Vector3(1, 1, 0)

  return () => {
    controls.update()
  }
}

module.exports = { getOnWorldFrame }
