import React, { Component } from 'react'

import THREE from 'libs/engines/3d/three'

import LevControls from 'libs/engines/3d/units/LevControls'

import ResizeObserver from 'resize-observer-polyfill'

const targetToCamera = 5

export default class ThreeScene extends Component{
  constructor(props) {
    super(props)
    this.viewerRef = new React.createRef()
    this.transitions = []
  }

  updateDimensions() {
    const ViewerDiv = this.viewerRef && this.viewerRef.current
    if (!this.renderer || !ViewerDiv || !this.camera)
      return
    this.camera.aspect = ViewerDiv.clientWidth / ViewerDiv.clientHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(ViewerDiv.clientWidth, ViewerDiv.clientHeight)
    this.controls.update()

    if (ViewerDiv.clientWidth < 500 || ViewerDiv.clientHeight < 500)
      this.renderer.setPixelRatio(2)
    else
      this.renderer.setPixelRatio(1)
  }

  componentDidMount() {
    this.resizeObs = new ResizeObserver(this.updateDimensions.bind(this))
      .observe(this.viewerRef.current)

    const ViewerDiv = this.viewerRef.current
    const width = ViewerDiv.clientWidth
    const height = ViewerDiv.clientHeight

    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setClearColor('#ffffff')
    this.renderer.setSize(width, height)
    if (width < 500 || height < 500)
      this.renderer.setPixelRatio(2)
    ViewerDiv.appendChild(this.renderer.domElement)

    //ADD SCENE
    this.scene = new THREE.Scene()

    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    )
    this.controls = new LevControls( this.camera, ViewerDiv )
    this.controls.panSpeed = 1.5
    this.controls.enableKeys = false
    this.camera.position.z = targetToCamera
    this.controls.update()

    this.units = []
    const props = {
      THREE: THREE,
      renderer: this.renderer,
      scene: this.scene,
      camera: this.camera,
      ...this.props.data, //TODO adequately
    }

    this.props.myScene.units.forEach(unit => this.units.push(new unit(props)))

    if (!this.frameId)
      this.frameId = requestAnimationFrame(this.animate)
  }

  componentWillUnmount(){
    this.units.forEach(unit => unit.dispose())
    cancelAnimationFrame(this.frameId)
    // this.viewerRef.removeChild(this.renderer.domElement)
  }

  animate = () => {
    this.units.forEach(unit => unit.animate())


    //VECTOR TRANSITIONS
    let unregisteredTransitions = []
    this.transitions.forEach((transition, index) => {
      if (transition.currentFrame === transition.numberOfFrames)
        unregisteredTransitions.push(index)
      else {
        const alpha = 1 / (transition.numberOfFrames - transition.currentFrame)
        transition.variable.lerp(transition.value, alpha)
        transition.currentFrame++
      }
    })
    unregisteredTransitions.forEach(transitionIndex =>
      this.transitions = [
        ...this.transitions.slice(0, transitionIndex),
        ...this.transitions.slice(transitionIndex + 1)
      ]
    )


    this.renderer.render(this.scene, this.camera)
    this.frameId = window.requestAnimationFrame(this.animate)
    this.controls.update()
  }

  setCamera = (position, target, transition = true) => {
    // this.camera.position.fromArray(position)
    // this.controls.target.fromArray(target)
    // const newPosition = new THREE.Vector3(...position)
    // console.log(target)
    if (typeof target === "undefined" || this.transitions.length > 0)
      return
    const newTarget = new THREE.Vector3(...target)
    const newPosition = newTarget.clone()
      .add(this.camera.position.clone()
        .sub(this.controls.target)
        .normalize()
        .multiplyScalar(targetToCamera)
      )

    if (transition) {
      let numberOfFrames = new THREE.Vector3()
        .subVectors(newPosition, this.camera.position)
        .lengthSq() ** .25 * 3
      numberOfFrames = Math.ceil(numberOfFrames)
 
      this.registerTransition(this.camera.position, newPosition, numberOfFrames)
      this.registerTransition(this.controls.target, newTarget, numberOfFrames)
    }
    else {
      this.camera.position.copy(newPosition)
      this.controls.target.copy(newTarget)
    }

    this.controls.update()
  }

  registerTransition = (variable, value, numberOfFrames) => {
    this.transitions.push({
      variable: variable,
      value: value,
      numberOfFrames: numberOfFrames || 10,
      currentFrame: 0,
    })
  }
  
  render = () => (
    <div
      className="Viewer"
      ref={this.viewerRef}
    />
  )
}
