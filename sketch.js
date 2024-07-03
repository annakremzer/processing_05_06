let videos = [];
let currentVideoIndex = -1; // Початковий індекс -1, щоб почати з чорного екрану
let alpha = 0; // Прозорість відео
let fadeSpeed = 5; // Швидкість появи відео
let showLoading = false; // Показувати анімацію підрахування
let loadingProgress = 0; // Прогрес завантаження
let loadingComplete = false; // Завершення завантаження
let randomNumber; // Рандомне число

let sound1, sound2, finalSound; // Звукові змінні
let inactivityTimeout; // Таймаут для відсутності взаємодії
let inactivityTime = 60000; // Час відсутності взаємодії в мілісекундах (1 хвилина)
let sound2Playing = false; // Прапорець для відстеження відтворення другого звуку

let resultVideo; // Відео для показу результату

function preload() {
  // Завантажуємо всі відео
  videos[0] = [createVideo(['assets/01.mp4']), createVideo(['assets/01_02.mp4']), createVideo(['assets/01_03.mp4'])];
  videos[1] = [createVideo(['assets/02.mp4']), createVideo(['assets/02_02!.mp4']), createVideo(['assets/02_03.mp4'])];
  videos[2] = [createVideo(['assets/03.mp4']), createVideo(['assets/03_02.mp4']), createVideo(['assets/03_03.mp4'])];
  videos[3] = [createVideo(['assets/04.mp4']), createVideo(['assets/04_02.mp4']), createVideo(['assets/04_03.mp4'])];

  finalSound = loadSound('assets/final_sound.wav'); // Завантаження звуку для останнього тексту
  sound1 = loadSound('assets/sound_01.mp3'); // Завантаження першого звуку
  sound2 = loadSound('assets/sound_02.mp3'); // Завантаження другого звуку

  resultVideo = createVideo(['assets/result_video.mp4']); // Завантаження відео для показу результату
  resultVideo.hide(); // Сховати відео, щоб не показувалося автоматично

  // Сховати всі відео, щоб не показувалося автоматично
  for (let group of videos) {
    for (let video of group) {
      video.hide();
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0); // Початковий чорний екран
  resetInactivityTimer(); // Встановлення таймера при завантаженні сторінки

  // Додаємо обробники подій для перезавантаження таймера при взаємодії
  window.addEventListener('mousemove', resetInactivityTimer);
  window.addEventListener('mousedown', resetInactivityTimer);
  window.addEventListener('keydown', resetInactivityTimer);

  // Запускаємо перший звук для постійного відтворення
  sound1.loop();
  sound1.setVolume(1); // Гучність для першого звуку

  // Встановлюємо початкову гучність для другого звуку нижче
  sound2.setVolume(0.5); // Гучність для другого звуку
}

function draw() {
  background(0); // Постійно відображати чорний фон

  if (currentVideoIndex >= 0 && currentVideoIndex < videos.length) {
    if (alpha < 255) {
      alpha += fadeSpeed; // Збільшуємо прозорість
    }
    tint(255, alpha); // Налаштовуємо прозорість
    let videoGroup = videos[currentVideoIndex];
    let currentVideo = videoGroup[randomIndex]; // Використовуємо randomIndex для вибору відео
    image(currentVideo, 0, 0, width, height);
  } else if (showLoading && !loadingComplete) {
    drawLoadingIndicator(); // Малюємо індикатор підрахування
  } else if (loadingComplete) {
    showResult(); // Показуємо результат
  }
}

let randomIndex = 0; // Глобальний індекс для рандомного вибору відео

function mousePressed() {
  resetInactivityTimer(); // Скидаємо таймер при натисканні миші
  if (currentVideoIndex >= 0 && currentVideoIndex < videos.length) {
    let videoGroup = videos[currentVideoIndex];
    let currentVideo = videoGroup[randomIndex]; // Використовуємо randomIndex для зупинки поточного відео
    currentVideo.stop(); // Зупиняємо поточне відео
  }
  currentVideoIndex = (currentVideoIndex + 1) % (videos.length + 1); // Переходимо до наступного відео або повертаємось до чорного екрану
  alpha = 0; // Скидаємо прозорість для нового відео

  if (currentVideoIndex < videos.length) {
    randomIndex = int(random(0, 3)); // Вибираємо рандомне відео з трьох варіантів
    playVideo(currentVideoIndex, randomIndex); // Запускаємо наступне відео, якщо це не чорний екран
  } else {
    showLoading = true; // Показуємо індикатор підрахування
    loadingProgress = 0; // Скидаємо прогрес завантаження
    loadingComplete = false; // Скидаємо стан завершення завантаження
    fadeOutSound2(); // Плавно зупиняємо другий звук
    reduceVolumeSound1(); // Плавно зменшуємо гучність першого звуку при показі напису
  }
}

function playVideo(index, videoIndex) {
  randomNumber = int(random(20, 111)); // Генеруємо рандомне число перед початком відео
  let videoGroup = videos[index];
  let video = videoGroup[videoIndex]; // Використовуємо рандомний індекс для вибору відео
  video.loop(); // Запускаємо відео в циклі

  // Запускаємо другий звук з плавним збільшенням гучності, якщо він ще не грає
  if (!sound2Playing) {
    sound2.loop();
    sound2.setVolume(0.5); // Зменшена гучність для другого звуку
    sound2.fade(0.5, 2000); // Плавне збільшення гучності до 0.5 протягом 2 секунд
    sound2Playing = true;
  }
}

function fadeOutSound2() {
  if (sound2Playing) {
    sound2.fade(0.01, 20000); // Плавне зменшення гучності до майже нуля протягом 10 секунд
    setTimeout(() => {
      sound2.stop();
      sound2Playing = false;
    }, 20000); // Зупиняємо звук через 10 секунд
  }
}

function reduceVolumeSound1() {
  sound1.fade(0.01, 5000); // Плавне зменшення гучності до майже нуля протягом 5 секунд
}

function drawLoadingIndicator() {
  let x = width / 2;
  let y = height / 2;
  let barWidth = width * 0.6;
  let barHeight = 30;
  let progressWidth = (barWidth * loadingProgress) / 100;

  // Текст "LOADING..."
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(20);
  text("LOADING...", x, y - 40);

  // Контур смуги завантаження
  noFill();
  stroke(255);
  strokeWeight(2);
  rect(x - barWidth / 2, y - barHeight / 2, barWidth, barHeight, 20);

  // Прогрес завантаження
  noStroke();
  fill(255);
  rect(x - barWidth / 2, y - barHeight / 2, progressWidth, barHeight, 20);

  // Відсотки завантаження
  fill(255);
  textSize(20);
  text(int(loadingProgress) + " %", x + barWidth / 2 + 40, y);

  // Оновлюємо прогрес завантаження
  loadingProgress += 0.5; // Змінити швидкість завантаження за потребою
  if (loadingProgress >= 100) {
    loadingProgress = 100;
    loadingComplete = true; // Завершення завантаження
    finalSound.play(); // Відтворюємо звук при показі останнього тексту
  }
}

function showResult() {
  let x = width / 2;
  let y = height / 2;

  // Відтворюємо результат відео
  resultVideo.loop();
  image(resultVideo, 0, 0, width, height);

  // Показуємо текст поверх відео
  textAlign(CENTER, CENTER);
  fill(255);

  // Показуємо число і знак % на першому рядку
  textSize(60); // Збільшуємо розмір тексту
  text(randomNumber + " %", x, y - 30); // Розміщуємо вище центру

  // Показуємо "dein Liebesniveau" на другому рядку
  textSize(25); // Зменшуємо розмір тексту
  text("dein Liebesniveau", x, y + 20); // Розміщуємо нижче центру
}

function resetInactivityTimer() {
  clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(() => {
    location.reload(); // Перезавантажуємо сторінку після 1 хвилини відсутності взаємодії
  }, inactivityTime);
}
