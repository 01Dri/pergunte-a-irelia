const globalAudio = new Audio();
const MAX_EXTRA_OPTIONS = 3
var currentNumExtraOptions = 0;

    // 4 (Gélida feia)
    // 5 (Lótus)
blacklist_skins = [4, 5];



function updateExtraOptionButtonVisibility() {
    const hasTwoOptions = getMainOptions().length === 2;
    handleVisibilityExtraOptionButton(hasTwoOptions);
}

document.addEventListener("DOMContentLoaded", () => {
    updateExtraOptionButtonVisibility();

    document.querySelectorAll("input, select, textarea").forEach(element => {
        element.addEventListener("input", updateExtraOptionButtonVisibility);
        element.addEventListener("change", updateExtraOptionButtonVisibility);
    });
});



async function main() {

  const skins = await getIreliaSkins();
  const randomSkin = getRandomValue(skins);
  const imageUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Irelia_${randomSkin.num}.jpg`;
  document.getElementById("splashArt").src = imageUrl;
  document.getElementById("splashArt").onload = () => {
    extractAndApplyColors(document.getElementById("splashArt"));
  };
}


//#region main logic

function askToIrelia(event) {
    event.preventDefault();
    hideMelDriImage();
    updateResultImages();
    const mainOptions = getMainOptions();
    if (mainOptions.length == 0) {
        alert("Preencha as opções principais para perguntar a Irelia...");
        return;
    } 
    if (mainOptions.length != 2) {
      alert("As duas opções precisam estar preenchidas...")
      return;
    }
    const optionOne = mainOptions[0].toLowerCase();
    const optionTwo = mainOptions[1].toLowerCase();
    const imageMelDri = document.getElementById("mel-dri-result-image");

    if (mainOptions.some(option => option == 'mel') && 
          mainOptions.some(option => option == 'dri')) {
        playAudio("assets/ionio.mp3", 0.10);
        showPopup("De Dri:", "Eu te amo muitooo!!");
        showMelDriImage();
        return;
    }

    if (optionOne === optionTwo) {
        showPopup("Meu deus...", "As duas opções são iguais seu noxiano burro!");
        updateResultImages("", "assets/new/angry-irelia-2.png");
        return;
    }
    showPopup("Pensando...", "");
    updateResultImages("assets/new/thinking.png", "");
    playAudio("assets/r_irelia.mp3", 0.10)
    setTimeout(() => {
        const options = getAllOptions();
        const optionResult = getRandomValue(options);
        showPopup("A Irelia escolheu", optionResult);
        updateResultImages("assets/new/happy-irelia-2.png", "");
        resetOptions();
    }, 2000)
}    


function getAllOptions() {

  var mainOptions = getMainOptions();
  var extraOptions = Array.from(getExtraOptions());
  extraOptions = extraOptions.filter(x => {
    return !mainOptions.some(mainOption => mainOption.toLowerCase() === x.toLowerCase());
  });
  return [...extraOptions, ...mainOptions];
}

function getMainOptions() {
  const optionOne = document.getElementById("option-one").value;
  const optionTwo = document.getElementById("option-two").value;
  if (optionOne == ""  || optionTwo == "")  {
    return [];
  }
  return [optionOne, optionTwo]
}

function getExtraOptions() {
  return new Set(
    [...document.querySelectorAll(".option-extra")]
      .map(input => input.value.toLowerCase().trim()).filter(x => x !== "")
  );  
}


function canAddExtraOptions() {
  var mainOptions = getMainOptions();
  if (mainOptions.length != 2) {
    return false;
  }
  if (currentNumExtraOptions === MAX_EXTRA_OPTIONS) {
    return false;
  }
  return true;
}


async function getIreliaSkins() {
  const response = await fetch("https://ddragon.leagueoflegends.com/cdn/15.19.1/data/en_US/champion/Irelia.json");
  const data = await response.json();
  return data.data["Irelia"].skins.filter(x => {
    return !blacklist_skins.includes(x.num);
  });
}


function getRandomValue(list) {
    const randomIndex = Math.floor(Math.random() * list.length);
    const randomValue = list[randomIndex];
    return randomValue;
}


function playAudio(src, vol) {
  globalAudio.pause();
  globalAudio.currentTime = 0;
  globalAudio.src = src;
  globalAudio.volume = vol
  globalAudio.play();
}


//#endregion main logic

//#region front end related functions

//#region extra options

function showExtraOptionsPopup() {
  var mainOptions = getMainOptions();
  if (mainOptions.length != 2) {
    return;
  }
  const popupOverlay = document.getElementById('popupExtraOverlay');
  popupOverlay.style.display = 'flex';
  setTimeout(() => {
    popupOverlay.classList.add('show');
  }, 10);
}


function updateExtraOptionField() {
  const element = document.getElementById("extra-options-values");
  const extraOptions = [...getExtraOptions()];
  element.innerHTML = "Opções extras: " + extraOptions.join(", ");
}

function closeExtraOptionsPopup() {
  updateExtraOptionField();
  const popupOverlay = document.getElementById("popupExtraOverlay");
  popupOverlay.style.display = 'none';
}

function handleVisibilityExtraOptionButton(enable) {
  const btn = document.getElementById("extra_options_btn");
  var cursorClassToAdd = enable ? "cursor-allowed" : "cursor-blocked";
  var cursorClassToRemove = enable ? "cursor-blocked" : "cursor-allowed";
  btn.classList.remove(cursorClassToRemove);
  btn.classList.add(cursorClassToAdd);
} 


function addExtraOption() {
  if (!canAddExtraOptions()) {
    return;
  }
  const container = document.getElementById("extra-option-result-container");
  const actionContainer = container.querySelector(".extra-option-action-container");
  actionContainer.insertAdjacentHTML("beforebegin", `
    <div class="option-input">
      <input class="option-extra" placeholder="Opção" required>
    </div>
  `);
  currentNumExtraOptions += 1;
  updateExtraOptionField();
}

//#endregion extra options

//#region general


function resetOptions() {
  const mainOptionOne = document.getElementById("option-one");
  const mainOptionTwo = document.getElementById("option-two");
  mainOptionOne.value = "";
  mainOptionTwo.value = "";
  const inputs = document.querySelectorAll(".option-extra");
  inputs.forEach(input => input.value = "");
  currentNumExtraOptions = 0;
  updateExtraOptionField();
  updateExtraOptionButtonVisibility();
}

function showMelDriImage() {
  const imageMelDri = document.getElementById("mel-dri-result-image");
  const popupOverlay = document.getElementById("popupOverlay");
  imageMelDri.src = "assets/mel_dri.jpg";
  popupOverlay.classList.add("mel-dri-result");
}

function hideMelDriImage() {
  const imageMelDri = document.getElementById("mel-dri-result-image");
  const popupOverlay = document.getElementById("popupOverlay");
  imageMelDri.src = "";
  popupOverlay.classList.remove("mel-dri-result");
}

function updateResultImages(sucessImage = "", errorImage = "") {
  const resultImageElement = document.getElementById("irelia-result-success-image");
  const errorImageElement = document.getElementById("irelia-result-error-image");
  resultImageElement.src = sucessImage;
  errorImageElement.src = errorImage;
}


function showResultContainer(label, text) {
  const containerResultElement = document.getElementById("option-result-container");
  containerResultElement.setAttribute("style", "visibility: visible;");
  document.getElementById("label-result").innerHTML = label;
  document.getElementById("option-result-value").innerHTML = text;
}

function showPopup(title = null, message = null) {
  const popupOverlay = document.getElementById('popupOverlay');
  popupOverlay.style.display = 'flex';
  setTimeout(() => {
    popupOverlay.classList.add('show');
  }, 10);

  if (title !== null && message !== null) {
    showMessageOnPopup(title, message);
  }
}

function showMessageOnPopup(title, message) {
    document.getElementById("label-result").innerHTML = title;
    document.getElementById("option-result-value").innerHTML = message;
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


//#endregion general

//#endregion front end related functions
main();