import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(ambientLight)

const guiAmbientLightFolder = gui.addFolder('Ambient Light')
// guiAmbientLightFolder.open()
guiAmbientLightFolder.add(ambientLight, 'intensity').min(0).max(1).step(0.001)

// Directional Light
{
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4)
    directionalLight.position.set(2, 2, - 1)
    // Shadow
    directionalLight.castShadow = true
    // console.log(directionalLight.shadow)
    // Shadow size
    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024
    // Shadow Camera near/far casting
    directionalLight.shadow.camera.near = 1
    directionalLight.shadow.camera.far = 6
    // Reduce size of shadow camera (makes shadows sharper, moRe detail, more precise)
    directionalLight.shadow.camera.top = 2
    directionalLight.shadow.camera.right = 2
    directionalLight.shadow.camera.bottom = -2
    directionalLight.shadow.camera.left = -2
    // Shadow blur
    directionalLight.shadow.radius = 10
    // Shadow algorithm, standard: PCFShadowMap => renderer
    scene.add(directionalLight)

    // shadow camera helper
    // console.log(directionalLight.shadow.camera)
    const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
    // directionalLightCameraHelper.visible = false
    scene.add(directionalLightCameraHelper)

    // Debug
    const guiDirectionalLightFolder = gui.addFolder('Directional Light')
    guiDirectionalLightFolder.open()
    guiDirectionalLightFolder.add(directionalLight, 'visible', false)
    guiDirectionalLightFolder.add(directionalLight, 'intensity', 0, 1, 0.001)
    guiDirectionalLightFolder.add(directionalLight.position, 'x', -5, 5, 0.001)
    guiDirectionalLightFolder.add(directionalLight.position, 'y', -5, 5, 0.001)
    guiDirectionalLightFolder.add(directionalLight.position, 'z', -5, 5, 0.001)
    guiDirectionalLightFolder.add(directionalLightCameraHelper, 'visible', false)

    const guiDirectionalLightCameraFolder = guiDirectionalLightFolder.addFolder('Directional Light: Shadow Camera')
    guiDirectionalLightCameraFolder.open()
    guiDirectionalLightCameraFolder.add(directionalLight.shadow.camera, 'near', 0, 15, 0.1)
        .onChange(
            () => {
                directionalLight.shadow.camera.updateProjectionMatrix()
                directionalLightCameraHelper.update()
            }
        )
    guiDirectionalLightCameraFolder.add(directionalLight.shadow.camera, 'far', 0, 15, 0.1)
        .onChange(
            () => {
                directionalLight.shadow.camera.updateProjectionMatrix()
                directionalLightCameraHelper.update()
            }
        )
}

// SpotLight
{
    const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3)
    spotLight.castShadow = true
    spotLight.position.set(0,2,6)
    console.log("spotLight.shadow =", spotLight.shadow)
    spotLight.shadow.mapSize.width = 1024
    spotLight.shadow.mapSize.height = 1024
    spotLight.shadow.camera.fov = 20
    spotLight.shadow.camera.near = 1
    spotLight.shadow.camera.far = 6

    scene.add(spotLight)
    scene.add(spotLight.target)
    // shadow camera helper
    const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
    spotLightCameraHelper.visible = true
    scene.add(spotLightCameraHelper)

    // Debug
    const guiSpotLightFolder = gui.addFolder('Spot Light')
    guiSpotLightFolder.open()
    guiSpotLightFolder.add(spotLight, 'visible')
    guiSpotLightFolder.add(spotLight, 'intensity', 0, 1, 0.001)
    guiSpotLightFolder.add(spotLight.position, 'x', -5, 5, 0.001)
    guiSpotLightFolder.add(spotLight.position, 'y', -5, 5, 0.001)
    guiSpotLightFolder.add(spotLight.position, 'z', -5, 10, 0.001)
    guiSpotLightFolder.add(spotLightCameraHelper, 'visible')

    const guiSpotLightShadowFolder = guiSpotLightFolder.addFolder('Spot Light Shadow: Camera')
    guiSpotLightShadowFolder.open()
    guiSpotLightShadowFolder.add(spotLight.shadow.camera, 'fov', 1, 100, 1)
        .onChange(
            () => {
                spotLight.shadow.camera.updateProjectionMatrix()
                spotLightCameraHelper.update()
            }
        )
    guiSpotLightShadowFolder.add(spotLight.shadow.camera, 'near', 0, 10, 0.1)
        .onChange(
            () => {
                spotLight.shadow.camera.updateProjectionMatrix()
                spotLightCameraHelper.update()
            }
        )
    guiSpotLightShadowFolder.add(spotLight.shadow.camera, 'far', 0, 15, 0.1)
        .onChange(
            () => {
                spotLight.shadow.camera.updateProjectionMatrix()
                spotLightCameraHelper.update()
            }
        )
}

// PointLight
{
    const pointLight = new THREE.PointLight(0xffffff, 0.3)
    pointLight.castShadow = true
    pointLight.position.set(-1,1,0)
    console.log("pointLight.shadow =", pointLight.shadow)
    pointLight.shadow.mapSize.width = 1024
    pointLight.shadow.mapSize.height = 1024
    pointLight.shadow.camera.fov = 30
    pointLight.shadow.camera.near = 1
    pointLight.shadow.camera.far = 6

    scene.add(pointLight)
    // scene.add(pointLight.target)
    // shadow camera helper
    const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
    pointLightCameraHelper.visible = false
    scene.add(pointLightCameraHelper)

    // Debug
    const guiPointLightFolder = gui.addFolder('Point Light')
    // guiPointLightFolder.open()
    guiPointLightFolder.add(pointLight, 'visible')
    guiPointLightFolder.add(pointLight, 'intensity').min(0).max(1).step(0.001)
    guiPointLightFolder.add(pointLight.position, 'x').min(-5).max(5).step(0.001)
    guiPointLightFolder.add(pointLight.position, 'y').min(-5).max(5).step(0.001)
    guiPointLightFolder.add(pointLight.position, 'z').min(-5).max(5).step(0.001)
    guiPointLightFolder.add(pointLightCameraHelper, 'visible')
}
/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7

// Debug
const guiMaterialFolder = gui.addFolder('Material')
// guiMaterialFolder.open()
guiMaterialFolder.add(material, 'metalness').min(0).max(1).step(0.001)
guiMaterialFolder.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.castShadow = true

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.5
plane.receiveShadow = true

scene.add(sphere, plane)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = -3
camera.position.y = 0
camera.position.z = 7
scene.add(camera)
// console.log('camera =', camera);

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.tpe = THREE.PCFSoftShadowMap // does not support radius (blur)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

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