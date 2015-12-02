// main 
var container, scene, camera, renderer, mesh, controls, model;

var keyboard = new KeyboardState();
var clock = new THREE.Clock();

init();
animate();

// initializing stuff
function init() {
    // creating a new scene
    scene = new THREE.Scene();
    THREE.ImageUtils.crossOrigin = '';
    // setting up camera
    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 60, ASPECT = 1.5 * (SCREEN_WIDTH / SCREEN_HEIGHT), NEAR = 0.1, FAR = 20000;
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    camera.position.set(0, 650, -675);
    camera.lookAt(scene.position);


    // set up renderer
    if (Detector.webgl) {
        renderer = new THREE.WebGLRenderer({ antialias: true });
    }
    else {
        renderer = new THREE.CanvasRenderer();
    }
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container = document.getElementById('ThreeJS');
    container.appendChild(renderer.domElement);

    // setup Events
    THREEx.WindowResize(renderer, camera);


    // setup controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);


    // set up light 
    var light = new THREE.PointLight(0xffffff);
    light.position.set(0, 250, 0);
    scene.add(light);

    //floor 
    var floorTexture = new THREE.ImageUtils.loadTexture('images/grasschecker.jpg');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(10, 10);
    var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
    var floorWireframe = new THREE.MeshBasicMaterial({ color: 0x00ee00, wireframe: true, transparant: true });
    var floorMaterials = [floorMaterial, floorWireframe];

    var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);

    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.5;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);


    // setup skybox
    var image = "images/forest.jpg";
    var materialArray = [];
    for (var i = 0; i < 6; i++)
        materialArray.push(new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture(image),
            side: THREE.BackSide
        }));
    var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
    var skyGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
    var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);

    scene.add(skyBox);


    var jsonloader = new THREE.JSONLoader();
    jsonloader.load("models/stickfigurewarrior.js", addModelToScene);

    /*
    var ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);
    */
}

// adding models
function addModelToScene(geometry, materials) {
    var material = new THREE.MeshFaceMaterial(materials);
    model = new THREE.Mesh(geometry, material);
    model.scale.set(10, 10, 10);
    scene.add(model);
}

// will do our rendering. 
function animate() {
    requestAnimationFrame(animate);
    render();
    update();
}

function render() {
    renderer.render(scene, camera);
}

function update() {
    if (keyboard.pressed("z")) {
        // do something
    }
    controls.update();
    //stats.update();
}
