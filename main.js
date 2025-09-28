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
  const imageResultElement = document.getElementById("irelia-result-image");

  if (!questionOne || !questionTwo) {
    alert("As duas perguntas precisam estar preenchidas...")
    return;
  }
  if (questionOne === questionTwo) {
    document.getElementById("label-result").innerHTML = "Meu deus...";
    document.getElementById("question-result-value").innerHTML = "As duas perguntas são iguais seu noxiano burro!";
    imageResultElement.src = "assets/angry-irelia.png";
    
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
    imageResultElement.src = "assets/happy-irelia.png";

  }, 2000);
}

main();