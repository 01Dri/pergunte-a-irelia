const globalAudio = new Audio();
const OPTIONS_LIMIT = 3
var questionsAdded = 0;

document.addEventListener("DOMContentLoaded", () => {
    updateMoreOptionsButtonStateToAllow();
});

async function getNumSkins() {
  const response = await fetch("https://ddragon.leagueoflegends.com/cdn/15.19.1/data/en_US/champion/Irelia.json");
  const data = await response.json();
  return data.data["Irelia"].skins.filter(x => {
    return x.num !== 4 && x.num !== 5;
  });
}

async function main() {

  // Colocar algum ester egg para a mel   
  const skins = await getNumSkins();
  const randomSkin = getRandomValue(skins);
  const imageUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Irelia_${randomSkin.num}.jpg`;
  document.getElementById("splashArt").src = imageUrl;
  document.getElementById("splashArt").onload = () => {
    extractAndApplyColors(document.getElementById("splashArt"));
  };
}

function extractAndApplyColors(imgElement) {
  new Vibrant(imgElement, { quality: 10 }).getPalette((err, palette) => {
  const vibrantColor = palette.Vibrant ? palette.Vibrant.getHex() : '#ff3366';
  const darkVibrantColor = palette.DarkVibrant ? palette.DarkVibrant.getHex() : '#e6005c';
  const mutedColor = palette.Muted ? palette.Muted.getHex() : '#a0a0a0';
  const lightMutedColor = palette.LightMuted ? palette.LightMuted.getHex() : '#e0e0e0';
  document.documentElement.style.setProperty('--primary-pink', vibrantColor);
  document.documentElement.style.setProperty('--accent-pink', darkVibrantColor);
  document.documentElement.style.setProperty('--text-muted', mutedColor);
  document.documentElement.style.setProperty('--text-light', lightMutedColor);
  document.documentElement.style.setProperty('--focus-glow', darkVibrantColor);
  });
}


function getRandomValue(values) {
  const randomIndex = Math.floor(Math.random() * values.length);
  const randomValue = values[randomIndex];
  return randomValue;
}

function showResultContainer(label, text) {
  const containerResultElement = document.getElementById("question-result-container");
  containerResultElement.setAttribute("style", "visibility: visible;");
  document.getElementById("label-result").innerHTML = label;
  document.getElementById("question-result-value").innerHTML = text;
}

function closePopup() {
  globalAudio.pause();
  globalAudio.currentTime = 0;
  const popupOverlay = document.getElementById('popupOverlay');
  popupOverlay.classList.remove('show');
  setTimeout(() => {
    popupOverlay.style.display = 'none';
  }, 300); 
}

document.addEventListener("DOMContentLoaded", () => {
    const closePopupButton = document.getElementById("close-popup");
    closePopupButton.addEventListener("click", closePopup);
});

function question(event) {
  event.preventDefault();
  const questionOne = document.getElementById("question-one").value;
  const questionTwo = document.getElementById("question-two").value;
  const imageErrorResultElement = document.getElementById("irelia-result-error-image");
  const imageSuccessResultElement = document.getElementById("irelia-result-success-image");
  const imageMelDri = document.getElementById("mel-dri-result-image");
  imageErrorResultElement.src = "";
  imageSuccessResultElement.src = "";
  imageMelDri.src = "";

  if (!questionOne || !questionTwo) {
    alert("As duas perguntas precisam estar preenchidas...")
    return;
  }

  if (questionOne == 'mel' && questionTwo == 'dri') {
    playAudio("assets/ionio.mp3", 0.10);
    showMessageOnPopup("De Dri:", "Eu te amo muitooo!!")
    showPopup();
    imageErrorResultElement.src = "";
    imageSuccessResultElement.src = "";
    imageMelDri.src = "assets/mel_dri.jpg";
    return;
  }
  if (questionOne === questionTwo) {
    showMessageOnPopup("Meu deus...", "As duas perguntas são iguais seu noxiano burro!")
    imageSuccessResultElement.src = "";
    imageErrorResultElement.src = "assets/angry-irelia.png";
    showPopup();
    return;
  }
  
  showMessageOnPopup("Pensando...", "");
  showPopup();
  playAudio("assets/r_irelia.mp3", 0.10)
  setTimeout(() => {
    let questions = [questionOne, questionTwo];
    questions = questions.concat(getMoreQuestionsValue())
    const questionResult = getRandomValue(questions);
    showMessageOnPopup("A Irelia escolheu", questionResult)
    imageSuccessResultElement.src = "assets/happy-irelia.png";
    imageErrorResultElement.src = "";
  }, 2000);
}

function showMessageOnPopup(title, message) {
    document.getElementById("label-result").innerHTML = title;
    document.getElementById("question-result-value").innerHTML = message;
}

function showPopup() {
  const popupOverlay = document.getElementById('popupOverlay');
  popupOverlay.style.display = 'flex';
  setTimeout(() => {
    popupOverlay.classList.add('show');
  }, 10);
}

function showQuestionMorePopup() {
  var mainsQuestions = getMainQuestions();
  if (mainsQuestions.length != 2) {
    return;
  }
  const popupOverlay = document.getElementById('popupMoreOverlay');
  popupOverlay.style.display = 'flex';
  setTimeout(() => {
    popupOverlay.classList.add('show');
  }, 10);
}

function addMoreOptionField() {
  console.log(canAddMoreOptions())
  if (!canAddMoreOptions()) {
    return;
  }
  const container = document.getElementById("more-question-result-container");
  const actionContainer = container.querySelector(".more-question-action-container");
  actionContainer.insertAdjacentHTML("beforebegin", `
    <div class="question-input">
      <input class="question-more" placeholder="Opção" required>
    </div>
  `);
  questionsAdded += 1;
  updateMoreOptions();
}



function closeMoreQuestionPopup() {
  updateMoreOptions();
  const popupOverlay = document.getElementById("popupMoreOverlay");
  popupOverlay.style.display = 'none';
}

function getMoreQuestionsValue() {
    return  [...document.querySelectorAll(".question-more")]
    .map(input => input.value);
}

function updateMoreOptions() {
  const questionValuesSpan = document.getElementById("more-questions-values")
  const questionsMore = getMoreQuestionsValue();
  questionValuesSpan.innerHTML = "Opções extras: " + questionsMore.join(",")
}

function canAddMoreOptions() {
  var mainsQuestions = getMainQuestions();
  if (mainsQuestions.length != 2) {
    return false;
  }
  if (questionsAdded === OPTIONS_LIMIT) {
    return false;
  }
  return true;
}

function getMainQuestions() {
  const questionOne = document.getElementById("question-one").value;
  const questionTwo = document.getElementById("question-two").value;
  if (questionOne == ""  || questionTwo == "")  {
    return [];
  }
  return [questionOne, questionTwo]
}

function updateMoreOptionsButtonStateToDisable() {
    const btn = document.getElementById("more_options_btn");
    btn.classList.remove("cursor-allowed");
    btn.classList.add("cursor-blocked");
}

function updateMoreOptionsButtonStateToAllow() {
    const btn = document.getElementById("more_options_btn");
    btn.classList.remove("cursor-blocked");
    btn.classList.add("cursor-allowed");
}

function playAudio(src, vol) {
  globalAudio.pause();
  globalAudio.currentTime = 0;
  globalAudio.src = src;
  globalAudio.volume = vol
  globalAudio.play();
}


main();