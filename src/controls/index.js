const cameraControls = require('./camera')
const terraformingControls = require('./terraforming')
const THREE = require('three')

function install({
  camera,
  world,
  scene,
  renderer
}) {
  const mouse = new THREE.Vector2()
  const buttons = {
    primary: false,
    secondary: false,
    auxiliary: false
  }

  const onMouseMove = (event) => {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
    buttons.primary = event.buttons & 1
    buttons.secondary = event.buttons & 2
    buttons.auxiliary = event.buttons & 4
  }

  renderer.domElement.addEventListener('mousemove', onMouseMove)

  const onContextMenu = (event) => {
    event.preventDefault()
  }

  renderer.domElement.addEventListener('contextmenu', onContextMenu)

  const getPointerIntersections = () => {
    const raycaster = new THREE.Raycaster()

    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera( mouse, camera );

    // calculate objects intersecting the picking ray
    return raycaster.intersectObjects( scene.children );
  }

  world.on('frame', cameraControls.getOnWorldFrame({ renderer, camera }))
  world.on('frame', terraformingControls.getOnWorldFrame({ getPointerIntersections, buttons }))
}

module.exports = { install }
