import { getMaterial } from './terrain/material'
import EventEmitter3 from 'eventemitter3'
const THREE = require('three')
import Controls from './controls'
import Config from './config'
import Gfx from './gfx'

function addLight () {
  let light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1)

  scene.add(light)
}

const { renderer, camera } = Gfx.init()

const scene = new THREE.Scene()

addLight()

const world = new EventEmitter3()

Controls.install({
  camera, world, scene, renderer,
})

const animate = function () {
  window.requestAnimationFrame(animate)
  renderer.render(scene, camera)
  world.emit('frame', world)
}

animate()

function isEven (n) {
  return n % 2 === 0
}

const V = world.V = []
const F = world.F = []

const facesToRowColumns = world.facesToRowColumns = new WeakMap()
const geom = world.geom = new THREE.Geometry()

function drawTerra () {
  function Z (row, column) {
    return Math.random() * .5
  }

  function addVertex (row, column) {
    const y = row
    const x = column + (isEven(y) ? 0 : .5)
    const z = Z(row, column)
    const v = new THREE.Vector3(x, y, z)

    V[row][column] = geom.vertices.push(v) - 1
  }

  for (let row = 0; row < Config.H; row++) {
    V.push([])
    for (let column = 0; column < Config.W; column++) {
      addVertex(row, column)
    }
  }

  for (let row = 0; row < Config.H - 1; row++) {
    F.push([])
    for (let column = 0; column < Config.W * 2 - 2; column++) {
      addTriangle(row, column)
    }
  }

  function addTriangle (row, column) {
    let a; let b; let c
    const vCol = Math.round(column / 2)

    // even columns have 2 from current row, 1 from next row
    if (isEven(row)) {
      if (isEven(column)) {
        a = V[row][vCol]
        b = V[row][vCol + 1]
        c = V[row + 1][vCol]
      } else {
        a = V[row][vCol]
        b = V[row + 1][vCol]
        c = V[row + 1][vCol - 1]
      }
    } else {
      if (isEven(column)) {
        a = V[row][vCol]
        b = V[row + 1][vCol + 1]
        c = V[row + 1][vCol]
      } else {
        a = V[row][vCol - 1]
        b = V[row][vCol]
        c = V[row + 1][vCol]
      }
    }

    const f = new THREE.Face3(a, b, c)

    F[row][column] = f
    facesToRowColumns.set(f, [row, column])
    geom.faces.push(f)
  }

  geom.computeFaceNormals()

  const material = getMaterial()

  let mesh = world.mesh = new THREE.Mesh(geom, material)

  mesh.castShadow = true
  mesh.receiveShadow = true

  scene.add(mesh)
}

drawTerra()
