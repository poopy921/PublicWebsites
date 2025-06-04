"use strict";
class RandomIntervalPlayer {
    constructor(min, max) {
        this.intervalId = null;
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
    }
    playRandomAudio() {
        if (this.fileList.length === 0)
            return;
        const randomIndex = Math.floor(Math.random() * this.fileList.length);
        const audio = new Audio(this.fileList[randomIndex]);
        audio.play().catch(err => console.error("Playback failed:", err));
    }
    getRandomInterval() {
        return Math.floor(Math.random() * (this.maxInterval - this.minInterval + 1)) + this.minInterval;
    }
    stop() {
        if (this.intervalId) {
            clearTimeout(this.intervalId);
            this.intervalId = null;
        }
    }
    reset() {
        if (this.intervalId) {
            clearTimeout(this.intervalId);
            this.intervalId = null;
        }
        this.scheduleNextPlayback();
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
    updateNotifierElement.innerHTML = "Updated!";
    silenceIntervalDisplayElement.innerHTML = "Current silence intervals: " + minIntervalElement.value + " - " + maxIntervalElement.value;
    window.setTimeout(() => {
        updateNotifierElement.innerHTML = "";
    }, 3000);
});
fileClearButton.addEventListener("click", () => {
    audioPlayer.fileList = [];
    audioPlayer.nameList = [];
    filePoolDisplay.innerHTML = "";
    fileInput.value = "";
});
