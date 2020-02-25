const EventEmitter3 = require('eventemitter3')
const THREE = require('three')

const Controls = require('./controls')

function createRenderer() {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  return renderer
}

function createCamera() {
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

  camera.up = new THREE.Vector3(0,0,1)

  camera.position.z = 30;

  camera.rotation.z = Math.PI / 6

  // camera.rotation.y = -Math.PI /4
  // camera.rotation.z = -Math.PI / 4

  return camera
}

function resizeHandler(camera, renderer) {
  return function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
  }
}

function addLight() {
  var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
  scene.add(light)
}

function addEdges(geometry) {
  const edges = new THREE.EdgesGeometry(geometry)
  const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 0x0000ff }))
  scene.add( line )
}

var scene = new THREE.Scene();

const renderer = createRenderer()
const camera = createCamera()
addLight()

window.addEventListener('resize', resizeHandler(camera, renderer), false)

const world = new EventEmitter3()

Controls.install({
  camera, world, scene, renderer
})

var animate = function () {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
  world.emit('frame', world)
};

animate();

function isEven(n) {
  return n % 2 === 0
}

const V = world.V = [ ]
const F = world.F = [ ]

const facesToRowColumns = world.facesToRowColumns = new WeakMap()
const geom = world.geom = new THREE.Geometry()

function drawTerra(W, H) {
  function Z(row, column) {
    return Math.random()*.5
  }


  function addVertex(row, column) {
    const y = row
    const x = column + (isEven(y) ? 0 : .5)
    const z = Z(row, column)
    const v = new THREE.Vector3(x, y, z)
    V[row][column] = geom.vertices.push(v) - 1
  }

  for (var row = 0; row < H; row++) {
    V.push([])
    for (var column = 0; column < W; column++) {
      addVertex(row, column)
    }
  }

  for (var row = 0; row < H - 1; row++) {
    F.push([])
    for (var column = 0; column < W * 2 - 2; column++) {
      addTriangle(row, column)
    }
  }

  let crestCol = 0

  world.on('frame', () => {
    // crestCol = (crestCol + 1) % (W - 1)
    // for (var row = 0; row < H; row++) {
    //   for (var column = 0; column < W; column++) {
    //     const v = geom.vertices[V[row][column]]
    //     v.z = v.origZ + Math.sin(Math.PI * 2 * ((column - crestCol) / (W - 1)))
    //   }
    // }
    geom.verticesNeedUpdate = true
    geom.computeFaceNormals()
  })

  function addTriangle(row, column) {
    let a, b, c
    const vCol = Math.round(column/2)
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
    const f = new THREE.Face3(a,b,c)
    F[row][column] = f
    facesToRowColumns.set(f, [row, column])
    geom.faces.push(f)
  }

  geom.computeFaceNormals()
  // const mat = new THREE.RawShaderMaterial(( {
  //   fragmentShader: document.getElementById('triShader').textContent,
  //   vertexShader: document.getElementById( 'vertexShader' ).textContent,
  //   side: THREE.DoubleSide,
  //   transparent: true
  // }))
  // const mat = new THREE.MeshDepthMaterial({ side: THREE.DoubleSide, visible: true, transparent: false, depthTest: true, depthWrite: true, wireframe: true })
  const mat = new THREE.MeshPhongMaterial()
  var mesh= world.mesh = new THREE.Mesh( geom, mat );
  mesh.castShadow = true
  mesh.receiveShadow = true

  scene.add(mesh)
}

const W = world.W = 100
const H = world.H = 100

drawTerra(W, H)
