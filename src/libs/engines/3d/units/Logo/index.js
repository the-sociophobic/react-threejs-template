import Unit from 'libs/engines/3d/Unit'

import logoImage from 'img/NormalMap.png'
// import backgroundImage from 'img/test.jpg'
import backgroundImage from 'img/grad.png'

import { Refractor } from './Refractor'
import { WaterRefractionShader } from './WaterRefractionShader'


export default class Cube extends Unit {
  constructor(props) {
    super(props)
    const { THREE, scene } = props

    const geometry = new THREE.PlaneGeometry(19.20, 10.80, 1, 1)

    new THREE.TextureLoader()
    .load(backgroundImage, texture => {

      let material = new THREE.MeshBasicMaterial({ map: texture })

      this.plane = new THREE.Mesh(geometry, material)
      this.plane.position.set(0, 0, -1)
      this.plane.scale.set(1, 1, 1)

      document.addEventListener('mousemove', e => {
        if (e.pageX && e.pageY)
          this.plane.position.set(
            (window.innerWidth / 2 - e.pageX) / 800,
            (-window.innerHeight / 2 + e.pageY) / 800,
            this.plane.position.z)
      })

      scene.add(this.plane)
    })


    new THREE.TextureLoader()
    .load(logoImage, texture => {

      let refractor = new Refractor( geometry, {
        color: 0x999999,
        textureWidth: 1024,
        textureHeight: 1024,
        shader: WaterRefractionShader
      } );

      refractor.material.uniforms[ "tDudv" ].value = texture

      scene.add( refractor );
    })

  }
  animate() {}
  dispose() {}
}