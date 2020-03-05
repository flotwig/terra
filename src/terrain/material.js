import Config from '../config'
import { ShaderMaterial, Vector2 } from 'three'

function getMaterial () {
  return new ShaderMaterial({
    uniforms: {
      time: { value: 1.0 },
      resolution: { value: new Vector2(Config.W, Config.H) },
      zRange: { value: new Vector2(Config.minZ, Config.maxZ) },
    },
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent,
  })
}

module.exports = { getMaterial }
