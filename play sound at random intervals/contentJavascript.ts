
class RandomIntervalPlayer {
    fileList: string[];
    nameList: string[];
    intervalId: number | null = null;
    minInterval: number;
    maxInterval: number;
    constructor(min: number, max: number) {
        this.fileList = [];
        this.nameList = [];
        this.minInterval = min;
        this.maxInterval = max;
    }
    public addFiles(files: FileList | null): void {
        if(!files) return;
        for(let i = 0; i < files.length; i++) {
            const file = files[i];
            const url = URL.createObjectURL(file);
            this.nameList.push(file.name);
            this.fileList.push(url);
        }
        if (!this.intervalId) {
            this.scheduleNextPlayback();
        }
    }

    public poolToListElement(): string {
        let ret: string = "<ul>";
        for(let i = 0; i < this.nameList.length; i++) {
            ret += "<li>" + this.nameList[i] + "</li>";
        }
        ret += "</ul>"
        return ret;
    }

    private scheduleNextPlayback(): void {
        const delay = this.getRandomInterval();
        this.intervalId = window.setTimeout(() => {
            this.playRandomAudio();
            this.scheduleNextPlayback();
        }, delay);
    }

    private playRandomAudio(): void {
        if (this.fileList.length === 0) return;

        const randomIndex = Math.floor(Math.random() * this.fileList.length);
        const audio = new Audio(this.fileList[randomIndex]);
        audio.play().catch(err => console.error("Playback failed:", err));
    }

    private getRandomInterval(): number {
        return Math.floor(Math.random() * (this.maxInterval - this.minInterval + 1)) + this.minInterval;
    }

    stop(): void {
        if (this.intervalId) {
            clearTimeout(this.intervalId);
            this.intervalId = null;
        }
    }

    reset(): void {
        if (this.intervalId) {
            clearTimeout(this.intervalId);
            this.intervalId = null;
        }
        this.scheduleNextPlayback();
    }

}

const filePoolDisplay = document.getElementById("filePoolDisplay") as HTMLElement;
const fileInput = document.getElementById("fileInput") as HTMLInputElement;
const minIntervalElement = document.getElementById("minInterval") as HTMLInputElement;
const maxIntervalElement = document.getElementById("maxInterval") as HTMLInputElement;
const submitIntervalElement = document.getElementById("submitIntervals") as HTMLInputElement;
const fileClearButton = document.getElementById("clearButton") as HTMLInputElement;
const updateNotifierElement = document.getElementById("updateNotifier") as HTMLParagraphElement;

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
    window.setTimeout(() => {
        updateNotifierElement.innerHTML = "";
    }, 3000)
})

fileClearButton.addEventListener("click", () => {
    audioPlayer.fileList = [];
    audioPlayer.nameList = [];
    filePoolDisplay.innerHTML = "";
    fileInput.value = "";
})