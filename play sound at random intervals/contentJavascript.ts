
class RandomIntervalPlayer {
    audioInstances: Set<HTMLAudioElement>;
    fileList: string[];
    nameList: string[];
    intervalId: number | null = null;
    minInterval: number;
    maxInterval: number;
    constructor(min: number, max: number) {
        this.audioInstances = new Set<HTMLAudioElement>();
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
        playNotifierElement.innerHTML = "Scheduler is ACTIVE";
    }

    public playAudio(audio: HTMLAudioElement): void {
        audio.play();
        this.audioInstances.add(audio);
        audio.addEventListener('ended', () => {
            audioPlayer.audioInstances.delete(audio);
        })
    }

    private playRandomAudio(): void {
        if (this.fileList.length === 0) return;

        const randomIndex = Math.floor(Math.random() * this.fileList.length);
        const audio = new Audio(this.fileList[randomIndex]);
        this.playAudio(audio);
    }

    private getRandomInterval(): number {
        return Math.floor(Math.random() * (this.maxInterval - this.minInterval + 1)) + this.minInterval;
    }

    public stop(): void {
        audioPlayer.audioInstances.forEach(x => x.volume = 0);
        audioPlayer.audioInstances.clear();
        if (this.intervalId) {
            clearTimeout(this.intervalId);
            playNotifierElement.innerHTML = "Scheduler is NOT active";
            this.intervalId = null;
        }
    }

    public reset(): void {
        if (!this.intervalId) return;
        this.stop();
        this.scheduleNextPlayback();
    }

    public clear(): void {
        audioPlayer.fileList = [];
        audioPlayer.nameList = [];
        audioPlayer.stop();
    }

    public async addSampleFile(filename: string): Promise<string> {
        const r = await fetch("contentSamples/" + filename);
        const b = await r.blob();
        const f = new File([b], filename, {type: b.type});
        const dt = new DataTransfer();
        dt.items.add(f);
        audioPlayer.addFiles(dt.files);
        filePoolDisplay.innerHTML = audioPlayer.poolToListElement();
        return audioPlayer.fileList[0];
    }

}


const filePoolDisplay = document.getElementById("filePoolDisplay") as HTMLElement;
const fileInput = document.getElementById("fileInput") as HTMLInputElement;
const minIntervalElement = document.getElementById("minInterval") as HTMLInputElement;
const maxIntervalElement = document.getElementById("maxInterval") as HTMLInputElement;
const submitIntervalElement = document.getElementById("submitIntervals") as HTMLInputElement;
const fileClearButton = document.getElementById("clearButton") as HTMLInputElement;
const updateNotifierElement = document.getElementById("updateNotifier") as HTMLParagraphElement;
const silenceIntervalDisplayElement = document.getElementById("silenceIntervalDisplay") as HTMLParagraphElement;
const playNotifierElement = document.getElementById("playNotifier") as HTMLParagraphElement;
const loadSamplesButtonElement = document.getElementById("loadSamplesButton") as HTMLInputElement;
const cuteElement = document.getElementById("cute") as HTMLImageElement;

function displayIntervalUpdate(show: Boolean = true): void {
    silenceIntervalDisplayElement.innerHTML = "Current silence intervals: " + minIntervalElement.value + " - " + maxIntervalElement.value;
    if(show) {
        updateNotifierElement.innerHTML = "Updated!";
        window.setTimeout(() => {
            updateNotifierElement.innerHTML = "";
        }, 3000)
    }
}
displayIntervalUpdate(false);

cuteElement.addEventListener("click", async () => {
    audioPlayer.stop();
    minIntervalElement.value = "113";
    maxIntervalElement.value = "339";
    audioPlayer.minInterval = 113000;
    audioPlayer.maxInterval = 339000;
    displayIntervalUpdate();

    audioPlayer.clear();
    const a = new Audio(await audioPlayer.addSampleFile("06.Home for Two.mp3"));

    audioPlayer.playAudio(a);
});

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
    if(Number(minIntervalElement.value) < 0) {
        minIntervalElement.value = "0";
    }
    if(Number(minIntervalElement.value) > Number(maxIntervalElement.value)) {
        minIntervalElement.value = maxIntervalElement.value;
    }
});

maxIntervalElement.addEventListener("change", () => {
    if(Number(maxIntervalElement.value) < Number(minIntervalElement.value)) {
        maxIntervalElement.value = minIntervalElement.value;
    }
});

loadSamplesButtonElement.addEventListener("click", () => {
    audioPlayer.addSampleFile("cavemanbonk.mp3");
    audioPlayer.addSampleFile("metalpipe.mp3");
});