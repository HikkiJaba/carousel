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

            // Создаем стандартный материал для модели
            var material = new THREE.MeshStandardMaterial({ color: 0xffffff });
            obj.children[0].material = material;

            scene.add(obj);
            currentModel = obj;
        },
        function (xhr) {},
        function (error) {
            console.error("Произошла ошибка при загрузке модели", error);
        }
    );
}

function loadAdditionalModel(path, scaleFactor, callback) {
    var loader = new THREE.OBJLoader();
    var additionalModel = scene.getObjectByName('additionalModel');
    if (additionalModel) {
        rotationGroup.remove(additionalModel);
        scene.remove(additionalModel);
        console.log("Old additional model removed before loading new one");
    }
    loader.load(
        path,
        function(obj) {
            var box = new THREE.Box3().setFromObject(obj);
            var size = new THREE.Vector3();
            box.getSize(size);

            var scale = Math.min(10.0 * 10 / size.x, 10.0 * 10 / size.y, 10.0 * 10 / size.z);

            obj.position.y = -100;

            obj.scale.set(scale, scale, scale);

            obj.userData.isAdditionalModel = true;
            obj.name = 'additionalModel';

            var material = new THREE.MeshStandardMaterial({ color: 0xffffff });
            obj.children[0].material = material;

            callback(obj);
        },
        function(xhr) {},
        function(error) {
            console.error("Error loading additional model:", error);
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


var costumeColorInput = document.getElementById('costumeColor');
var skirtColorInput = document.getElementById('skirtColor');

costumeColorInput.addEventListener('input', function() {
    updateModelColors();
    updateModelBasedOnCheckboxes();
});

skirtColorInput.addEventListener('input', function() {
    updateModelColors();
    updateModelBasedOnCheckboxes();
});


function updateModelColors() {
    var costumeColor = new THREE.Color(costumeColorInput.value);
    var skirtColor = new THREE.Color(skirtColorInput.value);

    // Обновление цвета костюма
    if (currentModel) {
        var currentModelMaterial = currentModel.children[0].material;
        if (currentModelMaterial) {
            currentModelMaterial.color = costumeColor;
            currentModelMaterial.needsUpdate = true; // Обновление материала
        }
    }

    // Обновление цвета юбки
    var additionalModel = scene.getObjectByName('additionalModel');
    if (additionalModel) {
        var additionalModelMaterial = additionalModel.children[0].material;
        if (additionalModelMaterial) {
            additionalModelMaterial.color = skirtColor;
            additionalModelMaterial.needsUpdate = true; // Обновление материала
        }
    }
}



function updateModelBasedOnCheckboxes() {
    var fancyEffectCheckbox = document.getElementById('fancyEffectCheckbox');
    var ledCheckbox = document.getElementById('ledCheckbox');

    var additionalModel = scene.getObjectByName('additionalModel');

    // Удаление старой модели юбки
    if (additionalModel) {
        rotationGroup.remove(additionalModel);
        scene.remove(additionalModel);
        console.log("Old additional model removed");
    }

    if (fancyEffectCheckbox.checked && !ledCheckbox.checked) {
        loadAdditionalModel('./obj/kar.obj', 0.5, function(obj) {
            rotationGroup.add(obj);
            scene.add(rotationGroup);
            // Обновление цвета юбки
            updateModelColors();
        });
    }
}




function anime() {
    var kineticCheckbox = document.getElementById('kineticCheckbox');
    var additionalModel = scene.getObjectByName('additionalModel');
    if (kineticCheckbox.checked && additionalModel) {
        additionalModel.rotation.y -= 0.00001;
        requestAnimationFrame(anime);
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

    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.name === 'mirrorBase') {
                const mirrorShapeDiv = document.getElementById('mirrorShape-div');
                mirrorShapeDiv.style.display = this.value === 'yes' ? 'block' : 'none';
            } else if (this.name === 'skirt') {
                const skirtOptions = document.getElementById('skirtOptions');
                skirtOptions.style.display = this.checked ? 'block' : 'none';
            }
        });
    });
});

function submitForm() {
    document.getElementById('userInfoForm').submit();
}

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
document.addEventListener('DOMContentLoaded', function() {
    // Получение элементов для первого шага
    var mirrorBaseCheckbox = document.getElementById('mirrorBaseCheckbox');
    var mirrorShapeDiv = document.getElementById('mirrorShape-div');
    var mirrorOptions = mirrorShapeDiv ? mirrorShapeDiv.querySelectorAll('.mirror-option') : [];
    var mirrorShapeInput = document.getElementById('mirrorShape');

    // Показ/скрытие блока формы зеркала при изменении состояния чекбокса
    mirrorBaseCheckbox.addEventListener('change', function() {
        if (mirrorShapeDiv) {
            mirrorShapeDiv.style.display = mirrorBaseCheckbox.checked ? 'block' : 'none';
        }
    });

    // Обработка выбора формы зеркала
    mirrorOptions.forEach(function(option) {
        option.addEventListener('click', function() {
            mirrorOptions.forEach(function(opt) {
                opt.classList.remove('selected');
                opt.style.backgroundColor = 'transparent';
            });
            option.classList.add('selected');
            mirrorShapeInput.value = option.getAttribute('data-value');
        });
    });

    // Получение всех блоков с опциями кроя (включая шаги 2 и 3)
    var cutOptions = document.querySelectorAll('[id^="cutOptions"]');

    cutOptions.forEach(function(cutOption) {
        var options = cutOption.querySelectorAll('.mirror-option');
        var input = cutOption.querySelector('input[type="hidden"]');
        
        // Обработка выбора типа кроя или юбки
        options.forEach(function(option) {
            option.addEventListener('click', function() {
                options.forEach(function(opt) {
                    opt.classList.remove('selected');
                    opt.style.backgroundColor = 'transparent';
                });
                option.classList.add('selected');
                input.value = option.getAttribute('data-value');
            });
        });
    });
});


document.getElementById("userInfoForm").addEventListener("submit", function(event) {
    event.preventDefault();
  
    // Получаем данные из формы
    var formData = new FormData(this);
  
    // Получаем цвета костюма и юбки
    var costumeColor = document.getElementById("costumeColor").value;
    var skirtColor = document.getElementById("skirtColor").value;
  
    // Получаем значения чекбоксов
    var mirrorBaseCheckbox = document.getElementById("mirrorBaseCheckbox").checked;
    var fancyEffectCheckbox = document.getElementById("fancyEffectCheckbox").checked;
    var ledCheckbox = document.getElementById("ledCheckbox").checked;
    var kineticCheckbox = document.getElementById("kineticCheckbox").checked;
  
    // Создаем объект с данными
    var data = {
      fullName: formData.get('fullName'),
      address: formData.get('address'),
      phoneNumber: formData.get('phoneNumber'),
      costumeColor: costumeColor,
      skirtColor: skirtColor,
      mirrorBaseCheckbox: mirrorBaseCheckbox,
      mirrorShape: formData.get('mirrorShape'),
      mirrorShape2: formData.get('mirrorShape2'),
      mirrorShape3: formData.get('mirrorShape3'),
      fancyEffectCheckbox: fancyEffectCheckbox,
      ledCheckbox: ledCheckbox,
      kineticCheckbox: kineticCheckbox
    };
  
    // Отправляем данные на сервер в виде JSON
    fetch('http://localhost:5550/formdata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.ok) {
        console.log("Данные успешно отправлены");
      } else {
        console.error("Ошибка при отправке данных");
      }
    })
    .catch(error => {
      console.error("Ошибка при отправке данных:", error);
    });
});


  document.getElementById("openModalBtn").addEventListener("click", function() {
    var modal = document.getElementById("myModal");
    modal.style.display = "block"; 
  });
  
 
  document.getElementsByClassName("close")[0].addEventListener("click", function() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
  });
  
 
  window.addEventListener("click", function(event) {
    var modal = document.getElementById("myModal");
    if (event.target == modal) {
      modal.style.display = "none"; 
    }
  });
  
