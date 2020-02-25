const THREE = require('three')
const { OrbitControls } = require('three/examples/jsm/controls/OrbitControls')


const getOnWorldFrame = ({ renderer, camera }) => {
  const controls = new OrbitControls(camera, renderer.domElement)

  controls.keys = { // wasd
    LEFT: 65,
    UP: 87,
    RIGHT: 68,
    BOTTOM: 83
  }

  controls.mouseButtons = {
    LEFT: null,
    MIDDLE: THREE.MOUSE.ROTATE,
    RIGHT: null,
  }

  controls.enableDamping = true

  controls.screenSpacePanning = true

  return () => {
    controls.update()
  }
}

module.exports = { getOnWorldFrame }
