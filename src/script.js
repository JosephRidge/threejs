import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Debug
const gui = new dat.GUI()

//loading 
const textureLoader = new THREE.TextureLoader()
const normalTexture = textureLoader.load('/textures/normalMap.png')

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.SphereBufferGeometry( .5, 64, 64 );

// Materials

const material = new THREE.MeshStandardMaterial()
// material.wireframe = false
material.metalness = 0.7
material.roughness = 0.2
material.normalMap = normalTexture;
material.color = new THREE.Color(0x292929)

// Mesh
const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
pointLight.intensity = 1
scene.add(pointLight)

const pointLight2 = new THREE.PointLight(0xFFFF00, 0.1)
pointLight2.position.set(1,-1.5,1)
pointLight2.intensity = 5
scene.add(pointLight2)
// const pointLightHelper2 = new THREE.PointLightHelper(pointLight2,1)
// scene.add(pointLightHelper2)

gui.add(pointLight2.position, 'y').min(-3).max(3).step(0.01)
gui.add(pointLight2.position, 'x').min(-6).max(6).step(0.01)
gui.add(pointLight2.position, 'z').min(-3).max(3).step(0.01)

const pointLight3 = new THREE.PointLight(0x073763, 0.1)
pointLight3.position.set(-2.50 ,1.6,-1.39 )
gui.add(pointLight3.position, 'y').min(-3).max(3).step(0.01)
gui.add(pointLight3.position, 'x').min(-6).max(6).step(0.01)
gui.add(pointLight3.position, 'z').min(-3).max(3).step(0.01)


pointLight3.intensity = 5
// const pointLightHelper3 = new THREE.PointLightHelper(pointLight3,1)
// scene.add(pointLightHelper3)
scene.add(pointLight3)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)
// scene.background()

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas, 
    alpha:true
})
// renderer.setClearColor(0x073763,0)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

 function onDocumentMouseMove (event)  {
    mouseX = (event.clientX - windowX)
    mouseY = (event.clientY - windowY)
}
document.addEventListener('mousemove', onDocumentMouseMove)

let mouseX = 0 
let mouseY = 0
let targetX = 0
let targetY = 0

const windowX = window.innerHeight /2;
const windowY = window.innerWidth /2;


const clock = new THREE.Clock()

const tick = () =>
{

targetX = mouseX * .001 ; 
targetY = mouseY *.001 ; 
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime
    sphere.rotation.y += .5 * (targetX -sphere.rotation.y) 
    sphere.rotation.x += .5 * (targetX -sphere.rotation.x) 

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()