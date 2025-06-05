"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class RandomIntervalPlayer {
    constructor(min, max) {
        this.intervalId = null;
        this.audioInstances = new Set();
        this.fileList = [];
        this.nameList = [];
        this.minInterval = min;
        this.maxInterval = max;
    }
    addFiles(files) {
        if (!files)
            return;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const url = URL.createObjectURL(file);
            this.nameList.push(file.name);
            this.fileList.push(url);
        }
        if (!this.intervalId) {
            this.scheduleNextPlayback();
        }
    }
    poolToListElement() {
        let ret = "<ul>";
        for (let i = 0; i < this.nameList.length; i++) {
            ret += "<li>" + this.nameList[i] + "</li>";
        }
        ret += "</ul>";
        return ret;
    }
    scheduleNextPlayback() {
        const delay = this.getRandomInterval();
        this.intervalId = window.setTimeout(() => {
            this.playRandomAudio();
            this.scheduleNextPlayback();
        }, delay);
        playNotifierElement.innerHTML = "Scheduler is ACTIVE";
    }
    playAudio(audio) {
        audio.play();
        this.audioInstances.add(audio);
        audio.addEventListener('ended', () => {
            audioPlayer.audioInstances.delete(audio);
        });
    }
    playRandomAudio() {
        if (this.fileList.length === 0)
            return;
        const randomIndex = Math.floor(Math.random() * this.fileList.length);
        const audio = new Audio(this.fileList[randomIndex]);
        this.playAudio(audio);
    }
    getRandomInterval() {
        return Math.floor(Math.random() * (this.maxInterval - this.minInterval + 1)) + this.minInterval;
    }
    stop() {
        audioPlayer.audioInstances.forEach(x => x.volume = 0);
        audioPlayer.audioInstances.clear();
        if (this.intervalId) {
            clearTimeout(this.intervalId);
            playNotifierElement.innerHTML = "Scheduler is NOT active";
            this.intervalId = null;
        }
    }
    reset() {
        if (!this.intervalId)
            return;
        this.stop();
        this.scheduleNextPlayback();
    }
    clear() {
        audioPlayer.fileList = [];
        audioPlayer.nameList = [];
        audioPlayer.stop();
    }
    addSampleFile(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield fetch("contentSamples/" + filename);
            const b = yield r.blob();
            const f = new File([b], filename, { type: b.type });
            const dt = new DataTransfer();
            dt.items.add(f);
            audioPlayer.addFiles(dt.files);
            filePoolDisplay.innerHTML = audioPlayer.poolToListElement();
            return audioPlayer.fileList[0];
        });
    }
}
const filePoolDisplay = document.getElementById("filePoolDisplay");
const fileInput = document.getElementById("fileInput");
const minIntervalElement = document.getElementById("minInterval");
const maxIntervalElement = document.getElementById("maxInterval");
const submitIntervalElement = document.getElementById("submitIntervals");
const fileClearButton = document.getElementById("clearButton");
const updateNotifierElement = document.getElementById("updateNotifier");
const silenceIntervalDisplayElement = document.getElementById("silenceIntervalDisplay");
const playNotifierElement = document.getElementById("playNotifier");
const loadSamplesButtonElement = document.getElementById("loadSamplesButton");
const cuteElement = document.getElementById("cute");
function displayIntervalUpdate(show = true) {
    silenceIntervalDisplayElement.innerHTML = "Current silence intervals: " + minIntervalElement.value + " - " + maxIntervalElement.value;
    if (show) {
        updateNotifierElement.innerHTML = "Updated!";
        window.setTimeout(() => {
            updateNotifierElement.innerHTML = "";
        }, 3000);
    }
}
displayIntervalUpdate(false);
cuteElement.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    audioPlayer.stop();
    minIntervalElement.value = "113";
    maxIntervalElement.value = "339";
    audioPlayer.minInterval = 113000;
    audioPlayer.maxInterval = 339000;
    displayIntervalUpdate();
    audioPlayer.clear();
    const a = new Audio(yield audioPlayer.addSampleFile("06.Home for Two.mp3"));
    audioPlayer.playAudio(a);
}));
cuteElement.addEventListener("mouseenter", () => {
    cuteElement.src = "contentSamples/extra lovable.png";
});
cuteElement.addEventListener("mouseleave", () => {
    cuteElement.src = "contentSamples/lovable.png";
});
const audioPlayer = new RandomIntervalPlayer(Number(minIntervalElement.value) * 1000, Number(maxIntervalElement.value) * 1000); // plays every 3–8 sec
fileInput.addEventListener("change", () => {
    audioPlayer.addFiles(fileInput.files);
    filePoolDisplay.innerHTML = audioPlayer.poolToListElement();
    fileInput.value = "";
});
submitIntervalElement.addEventListener("click", () => {
    audioPlayer.minInterval = Number(minIntervalElement.value) * 1000;
    audioPlayer.maxInterval = Number(maxIntervalElement.value) * 1000;
    audioPlayer.reset();
    displayIntervalUpdate();
});
fileClearButton.addEventListener("click", () => {
    audioPlayer.clear();
    filePoolDisplay.innerHTML = "";
});
minIntervalElement.addEventListener("change", () => {
    if (Number(minIntervalElement.value) < 0) {
        minIntervalElement.value = "0";
    }
    if (Number(minIntervalElement.value) > Number(maxIntervalElement.value)) {
        minIntervalElement.value = maxIntervalElement.value;
    }
});
maxIntervalElement.addEventListener("change", () => {
    if (Number(maxIntervalElement.value) < Number(minIntervalElement.value)) {
        maxIntervalElement.value = minIntervalElement.value;
    }
});
loadSamplesButtonElement.addEventListener("click", () => {
    audioPlayer.addSampleFile("cavemanbonk.mp3");
    audioPlayer.addSampleFile("metalpipe.mp3");
});
