const THREE = require('three')
const { OrbitControls } = require('./OrbitControls')

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

  controls.keyPanSpeed = 15

  controls.target = new THREE.Vector3(1,1,0)

  // controls.minPolarAngle = Math.PI / 4
  // controls.maxPolarAngle = 3 * Math.PI / 4

  // controls.minAzimuthAngle = - Math.PI / 4
  // controls.maxAzimuthAngle = Math.PI / 4

  // renderer.domElement.addEventListener('keydown', ({ key }) => {
  //   if (key === 'q') {
  //     console.log(camera.rotation)
  //     camera.rotateZ(.05 * Math.PI)
  //   }

  //   if (key === 'e') {
  //     camera.rotateZ(-.05 * Math.PI)
  //   }
  // })

  return (world) => {
    controls.update()
  }
}

module.exports = { getOnWorldFrame }
