async function getNumSkins() {
  const response = await fetch("https://ddragon.leagueoflegends.com/cdn/15.19.1/data/en_US/champion/Irelia.json");
  const data = await response.json();
  return data.data["Irelia"].skins.filter(x => {
    return x.num !== 4 && x.num !== 5;
  });
}

async function main() {
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
  imageErrorResultElement.src = "";
  imageSuccessResultElement.src = "";
  
  if (!questionOne || !questionTwo) {
    alert("As duas perguntas precisam estar preenchidas...")
    return;
  }
  if (questionOne === questionTwo) {
    document.getElementById("label-result").innerHTML = "Meu deus...";
    document.getElementById("question-result-value").innerHTML = "As duas perguntas são iguais seu noxiano burro!";
    imageSuccessResultElement.src = "";
    imageErrorResultElement.src = "assets/angry-irelia.png";
    const popupOverlay = document.getElementById('popupOverlay');
    popupOverlay.style.display = 'flex';
    setTimeout(() => {
        popupOverlay.classList.add('show');
    }, 10);
    return;
  }

  const popupOverlay = document.getElementById('popupOverlay');
  popupOverlay.style.display = 'flex';
  setTimeout(() => {
    popupOverlay.classList.add('show');
  }, 10);
  
  document.getElementById("label-result").innerHTML = "Pensando...";
  document.getElementById("question-result-value").innerHTML = "";
  var audio = new Audio('assets/r_irelia.mp3');
  audio.volume = 0.10
  audio.play();

  setTimeout(() => {
    const questions = [questionOne, questionTwo];
    const questionResult = getRandomValue(questions);
    document.getElementById("label-result").innerHTML = "A Irelia escolheu";
    document.getElementById("question-result-value").innerHTML = questionResult;
    imageSuccessResultElement.src = "assets/happy-irelia.png";
    imageErrorResultElement.src = "";
  }, 2000);
}

main();