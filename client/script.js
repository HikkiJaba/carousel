var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 150;

var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
renderer.setClearColor(0x000000, 0);
document.getElementById("main-container").appendChild(renderer.domElement);

var light = new THREE.DirectionalLight(0xffffff);
light.position.set(1, 1, 1).normalize();
scene.add(light);

var ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.update();

var rotationGroup = new THREE.Group();
scene.add(rotationGroup); 

function rotateModelAroundCenter(model) {
    var boundingBox = new THREE.Box3().setFromObject(model);
    var center = new THREE.Vector3();
    boundingBox.getCenter(center);
    model.position.copy(center.negate()); 
}

var currentModel;

function loadModel(path, scaleFactor) {
    if (currentModel) {
        scene.remove(currentModel);
    }
    var loader = new THREE.OBJLoader();
    loader.load(
        path,
        function (obj) {
            var geometry = obj.children[0].geometry;

            var box = new THREE.Box3().setFromObject(obj);
            var size = new THREE.Vector3();
            box.getSize(size);

            var scale = Math.min(20.0 * 10 / size.x, 20.0 * 10 / size.y, 20.0 * 10 / size.z);

            obj.position.y = -100;

            obj.scale.set(scale, scale, scale);

            scene.add(obj);
            currentModel = obj;
        },
        function (xhr) {},
        function (error) {
            console.error("Произошла ошибка при загрузке модели", error);
        }
    );
}

var ledCheckbox = document.getElementById('ledCheckbox'); 
var fancyEffectCheckbox = document.getElementById('fancyEffectCheckbox');
var kineticCheckbox = document.getElementById('kineticCheckbox');

ledCheckbox.addEventListener('change', function () {
    updateModelBasedOnCheckboxes();
});

fancyEffectCheckbox.addEventListener('change', function () {
    updateModelBasedOnCheckboxes();
});

kineticCheckbox.addEventListener('change', function () {
    updateModelBasedOnCheckboxes();
});




function loadAdditionalModel(path, scaleFactor) {
    console.log("Loading additional model from path:", path);

    var loader = new THREE.OBJLoader();
    loader.load(
        path,
        function(obj) {
            console.log("Model loaded successfully");
            var geometry = obj.children[0].geometry;

            var box = new THREE.Box3().setFromObject(obj);
            var size = new THREE.Vector3();
            box.getSize(size);

            var scale = Math.min(10.0 * 10 / size.x, 10.0 * 10 / size.y, 10.0 * 10 / size.z);

            obj.position.y = -100;

            obj.scale.set(scale, scale, scale);

            obj.userData.isAdditionalModel = true;
            obj.name = 'additionalModel';

            scene.add(obj);
        },
        function(xhr) {
        },
        function(error) {
        }
    );
}




function updateModelBasedOnCheckboxes() {
    var additionalModel = scene.getObjectByName('additionalModel');
    var fancyEffectCheckbox = document.getElementById('fancyEffectCheckbox');
    var ledCheckbox = document.getElementById('ledCheckbox');
    var kineticCheckbox = document.getElementById('kineticCheckbox');
    while (rotationGroup.children.length > 0) {
        var child = rotationGroup.children[0];
        rotationGroup.remove(child);
        scene.remove(child);
    }
    
    console.log("Checking checkboxes:", fancyEffectCheckbox.checked, ledCheckbox.checked, kineticCheckbox.checked);

        if (fancyEffectCheckbox.checked && ledCheckbox.checked) {
            if (additionalModel) {
                rotationGroup.remove(additionalModel);
                scene.remove(additionalModel);
            }
            loadAdditionalModel('./obj/lightkar.obj', 0.5);
            if (kineticCheckbox.checked) {
                anime(additionalModel);
            }
        } else if (fancyEffectCheckbox.checked) {
            if (additionalModel) {
                rotationGroup.remove(additionalModel);
                scene.remove(additionalModel);
            }
            loadAdditionalModel('./obj/kar.obj', 0.5);
        } else  {
            if (additionalModel) {
                rotationGroup.remove(additionalModel);
                scene.remove(additionalModel);
            }
        }
}

function anime() {
    var kineticCheckbox = document.getElementById('kineticCheckbox');
    var additionalModel = scene.getObjectByName('additionalModel');
    if (kineticCheckbox.checked && additionalModel) {
        additionalModel.rotation.y -= 0.01;
    }
}










loadModel("./obj/telokar.obj", 0.8);

function observePanel(panelId) {
    var panel = document.getElementById(panelId);
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.attributeName === "class") {
                var isVisible = panel.classList.contains('show');
                if (isVisible) {
                    loadModel('./obj/flex1.obj', 1);
                }
            }
        });
    });

    observer.observe(panel, { attributes: true });
}

observePanel("options-size");

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    anime();
}

document.addEventListener('DOMContentLoaded', function () {
    var fancyEffectCheckbox = document.getElementById('fancyEffectCheckbox');
    var ledCheckbox = document.getElementById('ledCheckbox');

    fancyEffectCheckbox.addEventListener('change', updateModelBasedOnCheckboxes);
    ledCheckbox.addEventListener('change', updateModelBasedOnCheckboxes);

    ledCheckbox.addEventListener('change', function () {
        updateModelBasedOnCheckboxes();
    });

    fancyEffectCheckbox.addEventListener('change', function () {
        if (this.checked) {
            loadAdditionalModel('./obj/kar.obj', 0.5); 
        } else {
            var additionalModel = scene.getObjectByName('additionalModel');
            if (additionalModel) {
                scene.remove(additionalModel);
            }
        }
    });
});



document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.querySelector('.burger-menu');
    const aside = document.querySelector('aside');
    const iconButtons = document.querySelectorAll('.icon-btn');
    const optionsPanel = document.querySelector('.options-panel');

    burgerMenu.addEventListener('click', function() {
        this.classList.toggle('open');
        aside.classList.toggle('open');
        optionsPanel.classList.remove('show');
        iconButtons.forEach(btn => {
            btn.classList.remove('active-icon-btn');
        });
    });

    iconButtons.forEach(button => {
        button.addEventListener('click', function() {
            iconButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                optionsPanel.classList.remove('show');
            } else {
                this.classList.add('active');
                optionsPanel.classList.add('show');
            }
        });
    });
});

function toggleOptionsPanel(panelId) {
    var panel = document.getElementById('options-' + panelId);
    var isOpen = panel.classList.contains('show');

    var allPanels = document.querySelectorAll('.options-panel');
    allPanels.forEach(function(panel) {
        panel.classList.remove('show');
    });

    if (isOpen) {
        panel.classList.remove('show');
    } else {
        panel.classList.add('show');
    }
}

const iconBtns = document.querySelectorAll('.icon-btn');

iconBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        iconBtns.forEach(b => b.classList.remove('active-icon-btn'));
        this.classList.add('active-icon-btn');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var audio = document.getElementById('audio');
    var playButton = document.getElementById('play-button');

    playButton.addEventListener('click', function() {
        if (audio.paused) {
            audio.play().then(function() {
                playButton.classList.remove('play');
                playButton.classList.add('pause');
                console.log('Аудио воспроизводится');
            }).catch(function(error) {
                console.error('Ошибка воспроизведения аудио:', error);
            });
        } else {
            audio.pause();
            playButton.classList.remove('pause');
            playButton.classList.add('play');
            console.log('Аудио на паузе');
        }
    });

    // Пытаемся запустить аудио при загрузке страницы
    audio.play().then(function() {
        playButton.classList.remove('play');
        playButton.classList.add('pause');
        console.log('Аудио воспроизводится при загрузке страницы');
    }).catch(function(error) {
        console.error('Автозапуск аудио не удался:', error);
    });
});

setTimeout(() => {
    document.querySelector('#main-container>canvas').style.cursor = 'grab'
}, 100);

animate();
