const THREE = require('three')

// between -1 and 1
const getTerraformingPower = (buttons) => {
  if (buttons.primary) {
    return -1
  }

  if (buttons.secondary) {
    return 1
  }

  return 0
}

const MAX_Z = 100
const MIN_Z = -50

const getOnWorldFrame = ({ buttons, getPointerIntersections }) => {
  let targetZ;

  return (world) => {
    if (!buttons.primary && !buttons.secondary) {
      targetZ = undefined
      return
    }

    const { F, W, H, facesToRowColumns, geom } = world

    const Va = geom.vertices

    const getTerraFn = (clickedFace) => {
      if (buttons.primary && buttons.secondary) {
        if (!targetZ) {
          targetZ = (Va[clickedFace.a].z + Va[clickedFace.b].z + Va[clickedFace.c].z) / 3
        }

        return function smoothen (face, increment) {
          ;([face.a, face.b, face.c]).forEach(vi => {
            const v = Va[vi]
            const diff = targetZ - v.z
            v.z += .5 * Math.abs(increment) * diff
          })
        }
      }

      return function shape(face, increment) {
        ;([face.a, face.b, face.c]).forEach(vi => {
          const v = Va[vi]
          v.z = Math.min(Math.max(v.z + increment, MIN_Z), MAX_Z)
        })
      }
    }

    const incrementMultiplier = getTerraformingPower(buttons)
    const intersects = getPointerIntersections()

    intersects.forEach(({ face }) => {
      const terraFn = getTerraFn(face)

      const [row, column] = facesToRowColumns.get(face)

      terraFn(face, incrementMultiplier)

      let otherFaces = []

      if (column + 1 < W * 2 - 2) {
        otherFaces.push(F[row][column+1])
      }
      if (column - 1 >= 0) {
        otherFaces.push(F[row][column-1])
      }
      if (row + 1 < H - 1) {
        otherFaces.push(F[row+1][column])
      }
      if (row - 1 >= 0) {
        otherFaces.push(F[row-1][column])
      }
      otherFaces.map((face) => terraFn(face, incrementMultiplier * .5))
    })
  }
}

module.exports = { getOnWorldFrame }
