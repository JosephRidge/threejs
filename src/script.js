import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui' 

import { initializeApp } from "firebase/app";  
import { getAnalytics } from "firebase/analytics"; 

import { getDatabase, ref, set, onValue } from 'firebase/database';


const firebaseConfig = {
  apiKey: "AIzaSyDCHFx4vmcS8ap50304OLO_gtN2F4ig49E",
  authDomain: "iotlab2021dev1.firebaseapp.com",
  databaseURL: "https://iotlab2021dev1-default-rtdb.firebaseio.com",
  projectId: "iotlab2021dev1",
  storageBucket: "iotlab2021dev1.appspot.com",
  messagingSenderId: "815978701320",
  appId: "1:815978701320:web:8fea9c91d06ad0b93867bd",
  measurementId: "G-N52RW1WDHJ"
};
const peopleArray = [
    {
    'name': 'Jerry',
    'age': 58,
    'gender': 'Male',
    'accountActive': true
  },
  {
    'name': 'Jessica',
    'age': 25,
    'gender': 'Female',
    'accountActive': 'Processing'
  },
  {
    'name': 'Lauren',
    'age': 32,
    'gender': 'Female',
    'accountActive': true
  },
  {
    'name': 'Fabian',
    'age': 28,
    'gender': 'Male',
    'accountActive': false
  }
]

const list = document.querySelector('.list')

const addList = ( element, deviceObj) => {
    let array = []
    array.push(deviceObj)
    console.log("== > ",array)
    array.forEach(item => {

        const id = document.createElement('div')
        id.textContent = item.id
        id.setAttribute('id','deviceID')
        element.appendChild(id)
        const li = document.createElement('li')
        // const tempString = document.createElement('li')
        const temp =document.createElement('div')
        temp.textContent  = "Temperture : "+item.temperature+" °C"
        temp.setAttribute('id','temp')
        element.appendChild(temp)
        const hum =document.createElement('div')
        hum.textContent = "Humidity : "+item.humidity + " %"
        hum.setAttribute('id','hum')
        element.appendChild(hum)
        const timestamp =document.createElement('div')
        timestamp.textContent = (item.last_seen).toLocaleString()
        timestamp.setAttribute('id','time')
        element.appendChild(timestamp)
        const sm =document.createElement('div')
        sm.textContent = item.soil_moisture
        sm.setAttribute('id','sm')
        element.appendChild(sm) 
        element.appendChild(li)
    });
}



const filteredArray = peopleArray.filter(person => person.name.match(/^J/g) )

// addList(peopleArray, list)

/// FIREBASE SEction
const app = initializeApp(firebaseConfig);
const database = getDatabase(app)
getPayload()


// const dbRef = firebase.database().ref();
// const usersRef = dbRef.child('data')

async function getPayload(){
const devicePayload = ref(database, 'data') 
console.log('device', devicePayload)

let device 
onValue(devicePayload, (snapshot)=>{
    const data = snapshot.val();
    const dataKey = snapshot.toJSON()
    console.log('== >EKY  : ', snapshot.key)

    snapshot.forEach(function (childSnapshot){
    const value = snapshot.val(childSnapshot.key);
    // console.log('== > KEY : : ', value)
     device = {
        id: childSnapshot.val().dev_id,
        humidity:childSnapshot.val().payload_fields.humidity,
        temperature:childSnapshot.val().payload_fields.temperature,
        soil_moisture:childSnapshot.val().payload_fields.soilMoisture,
        last_seen:Date.parse(childSnapshot.val().metadata.time),
    }
    console.log("Map == > ", device)
    addList(list, device)
    // devicesArray.appendChild(device) 
    // console.log(" ADTA ---- > ", childSnapshot.val().payload_fields)
    // document.getElementById('template').innerHTML = childSnapshot.val().payload_fields.humidity 
    // return device    
}) 
})


}


 ///THREE JS SECTION
//Textureloader 
const textureLoader = new THREE.TextureLoader()
const cross = textureLoader.load('/textures/normalMap.png')
// Debug
const gui = new dat.GUI()
gui.hide()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );

const particlesGeometry = new THREE.BufferGeometry;
const paritclesCnt = 5000

const posArray = new Float32Array(paritclesCnt * 3)

for(let i = 0 ; i<paritclesCnt*3 ; i++){
    posArray[i] = (Math.random()-0.5)* 5 
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

// Materials


const material = new THREE.PointsMaterial({
    
    size:0.005,
     map:cross,
    transparent:true,
    color:'aqua',
    blending:THREE.AdditiveBlending
})

// material.color = new THREE.Color(0xff0000)

// Mesh
const sphere = new THREE.Points(geometry,material)
const particlesMesh = new THREE.Points(particlesGeometry, material)
scene.add(sphere, particlesMesh)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

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
    renderer.setClearColor(new THREE.Color("#21282a"),1)

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

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()
let mouseX = 0 
let mouseY = 0
let targetX = 0
let targetY = 0
const windowX = window.innerHeight /2;
const windowY = window.innerWidth /2;
document.addEventListener('mousemove', animateParticles)
function animateParticles (event)  {
    mouseX = (event.clientX )
    mouseY = (event.clientY )
}



const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()
    //particlesMesh.rotation.x = mouseX  *(elapsedTime*0.0008)
    particlesMesh.rotation.y = -.1 *(elapsedTime*0.0008)
    particlesMesh.rotation.x = mouseX  *(elapsedTime*0.00008)

    // Update objects
     sphere.rotation.y = .5 * elapsedTime
     if(mouseX>0){
    particlesMesh.rotation.x = mouseX  *(elapsedTime*0.00008)
    particlesMesh.rotation.y = mouseY  *(elapsedTime*0.00008)
  
     } 

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

























/*import './style.css'
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

// gui.add(pointLight2.position, 'y').min(-3).max(3).step(0.01)
// gui.add(pointLight2.position, 'x').min(-6).max(6).step(0.01)
// gui.add(pointLight2.position, 'z').min(-3).max(3).step(0.01)

const pointLight3 = new THREE.PointLight(0x073763, 0.1)
pointLight3.position.set(-2.50 ,1.6,-1.39 )
// gui.add(pointLight3.position, 'y').min(-3).max(3).step(0.01)
// gui.add(pointLight3.position, 'x').min(-6).max(6).step(0.01)
// gui.add(pointLight3.position, 'z').min(-3).max(3).step(0.01)


pointLight3.intensity = 5
// const pointLightHelper3 = new THREE.PointLightHelper(pointLight3,1)
// scene.add(pointLightHelper3)
scene.add(pointLight3)

/**
 * Sizes

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

const renderer = new THREE.WebGLRenderer({
    canvas: canvas, 
    alpha:true
})
// renderer.setClearColor(0x073763,0)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate


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
*/