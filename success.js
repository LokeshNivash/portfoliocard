

    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

    let container, camera, scene, renderer;

    // PLAY WITH THE PARAMS!:)

    let sceneParams = {
    
    handsCount: 100,
    handsRadius: 400,
    handsColor: 0xd79bff,
    dreamballColor: 0xff00ff,
    dreamballRadius: getRandomBetween(10, 18),
    stardustCount: getRandomIntBetween(5000, 10000),
    stardustRadius: 700,
    starsCount: getRandomIntBetween(900, 1400),
    starsRadius: 550, // whole group of stars
    starRadius: getRandomIntBetween(6, 12), // single star
    starNumArms: getRandomIntBetween(4, 11),
    starSpikeFactor: 0.6 // less than 1.0

    }

    // ASSETS 

    const handURL = 'assets/images/glbmodel.glb';
    const steelURL = 'assets/images/matcap_steel_256.jpg';
    const purpleGlassURL = 'assets/images/matcapPurpleGlass_256.png';

    let materials;
    let materialsArr = [];

    // INSTANCED HANDS
    
    let hand, iHand;

    // GLOBAL DUMMY TO CONTROL TRANFORMS

    const dummy = new THREE.Object3D();
    const mat4 = new THREE.Matrix4();
    let counter = 0;

    // INSTANCED STARS

    let iStardust, iStar;

    // DUMMY FOR STARS

    const dummyS = new THREE.Object3D();
    const mat4S = new THREE.Matrix4();
    let counterS = 0;

    // STARRY BALL YAYYY

    let dreamball;
    
    const mouse = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();

    // STARDUST MOUSE ANIM

    let speed = 0.03;
    let rotX = 0;
    let rotY = 0;

    init();
    render();

    function init() {
        
    container = document.querySelector('#scene-container');
        
    scene = new THREE.Scene();

    initCamera();
    initLights();
    initRenderer();
        
    materials = initMaterials();
    
    loadHand();
    initDreamball();
    initStardust();
    initStars();
        
    document.addEventListener('pointermove', onMouseMove, false);
    document.addEventListener('click', onMouseClick, false);
    window.addEventListener('resize', onWindowResize, false);

    }
    
    function initCamera() {
        
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 2500);
    camera.position.set(0, 0, 550);

    }
    
    function initLights() {

    const bottomLight = new THREE.DirectionalLight(0x3a3aff, 1.0 * Math.PI);
    bottomLight.position.set(0, -100, 0);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.15 * Math.PI);
    dirLight.position.set(-20, 100, 100);
        
    const dirLight2 = new THREE.DirectionalLight(0xff00ff, 0.75 * Math.PI);
    dirLight2.position.set(100, 100, -50);
        
    scene.add(bottomLight, dirLight, dirLight2);
        
    }
    
    function initRenderer() {
        
    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio > 1.4 ? Math.min(window.devicePixelRatio, 1.25) : Math.min(window.devicePixelRatio, 1.25));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
        
    }
    
    function initMaterials() {
    
    const texLoader = new THREE.TextureLoader();

    const steelTexture = texLoader.load(steelURL);
    const matcapSteel = new THREE.MeshMatcapMaterial({matcap: steelTexture});
            
    return {
        
        matcapSteel
        
    }
        
    }

    function loadHand() {
        
    const loader = new GLTFLoader();
        
    loader.load(handURL,
                    
        function (gltf) {
        
        const hands = gltf.scene;
        
        hand = hands.children[0];
        hand.geometry.computeVertexNormals();
        
        initInstancedHands();

        },
                    
        function ( xhr ) { console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' ); },
                    
        function ( error ) { console.log( 'An error happened' ); }
                    
    );
        
    }

    async function initInstancedHands() {
    
    const baseGeom = hand.geometry;
    const handsCount = sceneParams.handsCount;
    const handsRadius = sceneParams.handsRadius;
    
    const texLoader = new THREE.TextureLoader();
    
    const [ steelTex, purpleGlassTex ] = await Promise.all([
    
        texLoader.loadAsync(steelURL),
        texLoader.loadAsync(purpleGlassURL),
        
    ]);
    
    const matcapSteel  = new THREE.MeshMatcapMaterial({matcap: steelTex});
    const matcapPurpleGlass = new THREE.MeshMatcapMaterial({matcap: purpleGlassTex});
    materialsArr.push(matcapSteel, matcapPurpleGlass);
    
    const lavender = new THREE.MeshPhongMaterial({ color: 0xb493ff, shininess: 100 });
    const lightblue = new THREE.MeshPhongMaterial({ color: 0xbcceff, shininess: 100 });
    materialsArr.push(lavender, lightblue);

    const handMat = new THREE.MeshPhongMaterial({color: sceneParams.handsColor, shininess: 100, specular: 0x383838 });

    const fibonacciSpherePoints = getFibonacciSpherePoints(handsCount, handsRadius);
        
    iHand = new THREE.InstancedMesh(baseGeom, handMat, handsCount);

    for (let i = 0; i < handsCount; i++) {
        
        let point = fibonacciSpherePoints[i];

        dummy.position.set(1.75 * point.x, point.y, point.z - Math.random() * 200 - 350); 
        dummy.scale.setScalar(4.0);
        dummy.lookAt(dreamball.position);
        dummy.updateMatrix();
        iHand.setMatrixAt(i, dummy.matrix);
        counter++;

    }

    iHand.instanceMatrix.needsUpdate = true;
    scene.add(iHand);
    
    }

    function initStardust() {
        
    let count = sceneParams.stardustCount;
    let stardustRadius = sceneParams.stardustRadius;
    
    const geom = new THREE.IcosahedronGeometry(1.15, 0);
    
    let points = new Array(count).fill(0).map(p => {
        return new THREE.Vector3().randomDirection().setLength(stardustRadius)});
    
    iStardust = new THREE.InstancedMesh(geom, new THREE.MeshBasicMaterial({ color: 0xffffff }), count);
    
    let white = new THREE.Color(0xffffff);
    
    let dummy = new THREE.Object3D();
    let matrix = new THREE.Matrix4();
        
    for (let i = 0; i < count; i++) {
        
        dummy.position.set(0.9 * points[i].x, 0.9 * points[i].y, 0.9 * points[i].z);
        
        dummy.updateMatrix();
        iStardust.setMatrixAt(i, dummy.matrix);
        
        let randCol = new THREE.Color(`hsl(${getRandomIntBetween(240, 300)}, ${getRandomIntBetween(50, 100)}%, ${getRandomIntBetween(50, 100)}%)`);
        
        let col = (Math.random() > 0.5) ? white : randCol;
        
        iStardust.setColorAt(i, col);
            
    }
        
    iStardust.rotation.set(0.25 * Math.PI, 0.25 * Math.PI, 0);
    scene.add(iStardust);
    
    }
    
    function initDreamball() {
    
    let starsCount = getRandomIntBetween(30, 50);
    let radius = sceneParams.dreamballRadius;
    
    // BALL GROUP CONSISTS OF A SPHERE + STARS
    dreamball = new THREE.Group();
    
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.95 * radius * 2, 15, 15), new THREE.MeshPhongMaterial({color: sceneParams.dreamballColor, shininess: 40}));
    dreamball.add(ball);

    const starGeom = new StarGeometry(5, 7, 0.65, 1.5);
    const starMat = materials.matcapSteel;
    const starMesh = new InstancedFiboMesh(starsCount, radius * 2, starGeom, starMat);
    dreamball.add(starMesh);

    scene.add(dreamball);
    
    }

    function changeMaterials() {
        
    // purple, darkpurple, orange, blue, darkblue, purple, purple2
    let colors = [0xaa00ff, 0x5d00ff, 0xff5016, 0x91c0ff, 0x3e0082, 0xef00fc, 0xaa00ff];
    let color = getRandomFromArr(colors);
    let shininess = getRandomIntBetween(30, 100);
    
    const material = new THREE.MeshPhongMaterial({color: color, shininess: shininess});
    
    dreamball.children[0].material = material;
    iStar.material = material;
    
    iHand.material = getRandomFromArr(materialsArr);
    
    }

    function initStars() {
    
    let numStars = sceneParams.starsCount;
    let radius = sceneParams.starsRadius;
    let starRadius = sceneParams.starRadius;
    
    const starGeom = new StarGeometry(starRadius, sceneParams.starNumArms, sceneParams.starSpikeFactor, 1.5);
    
    const starMat = materials.matcapSteel;
    
    let fiboPoints = getFibonacciSpherePoints(numStars, radius * 2.5);
    iStar = new THREE.InstancedMesh(starGeom, starMat, numStars);
    
    for (let i = 0; i < numStars; i++) {
        
        let point = fiboPoints[i];
        
        dummyS.position.set(point.x, point.y, point.z);
            
        dummyS.rotation.set(
        
        Math.random() * Math.PI * 0.15,
        Math.random() * Math.PI * 0.15,
        Math.random() * Math.PI * 0.15
        
        );
        
        let rand = 0.1 * getRandomIntBetween(1, 20);
        
        dummyS.scale.set(1 + rand, 1 + rand, 1 + rand);
        
        dummyS.updateMatrix();
        iStar.setMatrixAt(counterS, dummyS.matrix);
        counterS++;
        
    }
    
    iStar.instanceMatrix.needsUpdate = true;
    scene.add(iStar);
    
    }

    function render() {

    renderer.render(scene, camera);
    requestAnimationFrame(render);
    animate();
    animateInstances();
    
    }

    function animate() {
    
    // MOUSE MOVEMENT ANIM
    
    if (iStardust && iStar) {
        
        let distX = mouse.x - rotX;
        let distY = mouse.y - rotY;
        
        rotX = rotX + (distX * speed);
        rotY = rotY + (distY * speed);
        iStardust.rotation.set(rotY, rotX, 0);
        
        iStar.rotation.set(-0.5 * rotY, 0, 0);
        
    }
    
    }

    function animateInstances() {
    
    
    let t = clock.getDelta();
    let t2 = clock.getElapsedTime();
    
    if (iStar) {
        
        for (let i = 0; i < counterS; i++) {
        
        iStar.getMatrixAt(i, mat4S);
        mat4S.decompose(dummyS.position, dummyS.quaternion, dummyS.scale);
        dummyS.rotation.x += t * 0.35;
        dummyS.rotation.z += t * 0.35;
        dummyS.updateMatrix();
        iStar.setMatrixAt(i, dummyS.matrix);
        iStar.instanceMatrix.needsUpdate = true;
        
        }
        
    }

    if (dreamball) {

        dreamball.position.x = Math.sin(t2 * 0.7) * 400;
        dreamball.position.y = Math.cos(t2 * 0.5) * 300;
        dreamball.position.z = -Math.cos(t2 * 0.3) * 200;

    }

    if (iHand) {

        for (let i = 0; i < counter; i++) {

        iHand.getMatrixAt(i, mat4);
        mat4.decompose(dummy.position, dummy.quaternion, dummy.scale);
        dummy.lookAt(dreamball.position);
        dummy.updateMatrix();
        iHand.setMatrixAt(i, dummy.matrix);
        iHand.instanceMatrix.needsUpdate = true;

        }

        iHand.position.z = -30 * Math.abs(mouse.x);

    }

    }

    // *** UTILS ***

    function InstancedFiboMesh(count, radius, geometry, material) {
    
    this.count = count;
    this.radius = radius;
    this.geometry = geometry;
    this.material = material;
    this.fibonacciSpherePoints = getFibonacciSpherePoints(this.count, this.radius);
    
    let iMesh = new THREE.InstancedMesh(this.geometry, this.material, this.count);
    let dummy = new THREE.Object3D();
    
    for (let i = 0; i < this.count; i++) {
    
        let point = this.fibonacciSpherePoints[i];
        dummy.position.set(point.x, point.y, point.z);
        dummy.lookAt(scene.position);
        dummy.updateMatrix();
        iMesh.setMatrixAt(i, dummy.matrix);

    }
    
    return iMesh;
    
    }

    function StarGeometry(radius = 10, numArms = 10, spikeFactor = 0.5, depth = 15) {

    this.radius = radius;
    this.numArms = numArms;
    this.spikeFactor = spikeFactor;
    this.depth = depth;

    const extrudeSettings = {

        steps: 1,
        depth: this.depth,
        bevelEnabled: false,
        bevelThickness: 6,
        bevelSize: 2,
        bevelOffset: 0,
        bevelSegments: 6

    };

    let points = [];

    for (let i = 0; i < numArms * 2; i ++) {

        let l = i % 2 == 1 ? this.radius : (this.radius - this.spikeFactor * this.radius);
        let a = i / numArms * Math.PI;
        points.push(new THREE.Vector2(Math.cos(a) * l, Math.sin(a) * l));

    }

    const starShape = new THREE.Shape(points);
    const starGeom = new THREE.ExtrudeGeometry(starShape, extrudeSettings);

    return starGeom;

    }

    function getFibonacciSpherePoints(samples, radius, randomize) {


    samples = samples || 1;
    radius = radius || 1;
    randomize = randomize || true;

    let random = 1;

    if (randomize === true) {
        random = Math.random() * samples;
    }

    let points = [];
    let offset = 2 / samples;
    let increment = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < samples; i++) {

        let y = ((i * offset) - 1) + (offset / 2);
        let distance = Math.sqrt(1 - Math.pow(y, 2));
        let phi = ((i + random) % samples) * increment;
        let x = Math.cos(phi) * distance;
        let z = Math.sin(phi) * distance;

        x = x * radius;
        y = y * radius;
        z = z * radius;

        let point = {
        'x': x,
        'y': y,
        'z': z
        }

        points.push(point);

    }

    return points;

    }

    // EVENTS

    function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    }

    function onMouseMove(event) {

    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    }

    function onMouseClick(event) {

    // event.preventDefault();
    // event.stopPropagation();
    changeMaterials();
    
    }