
export class HardwareInfo {
    private cpuCores: number = 0; // navigator.hardwareConcurrency
    private memory: number = 0; // window.performance.memory.jsHeapSizeLimit (bytes)
    private memoryUsed: number = 0; // window.performance.memory.usedJSHeapSize (bytes)
    private videoCard: string = '';
    private os: string = ''; // window.navigator.platform || windows.navigator.oscpu
    private userAgent: string = ''; // window.navigator.userAgent
    private language: string = 'en-US'; // window.navigator.language

    public get CPUCores(): number {
        return this.cpuCores;
    }

    public get Memory(): number {
        return this.memory;
    }

    public get MemoryUsed(): number {
        return this.memoryUsed;
    }
    public set MemoryUsed(memory: number) {
        this.memoryUsed = memory;
    }

    public get OS(): string {
        return this.os;
    }

    public get UserAgent(): string {
        return this.userAgent;
    }

    public get Language(): string {
        return this.language;
    }

    constructor(cores: number = 0, memory: number = 0, videoCard: string = '', os: string = '', userAgent: string = '', language: string = 'en-US') {
        this.cpuCores = cores;
        this.memory = memory;
        this.videoCard = videoCard;
        this.os = os;
        this.userAgent = userAgent;
        this.language = language;
    }

    public toJSON() {
        let json: any = {};

        for (let key in this) {
            if (this.hasOwnProperty(key)) {
                json[key] = this[key];
            }
        }

        return json;
    }

    public toString(): string {
        return JSON.stringify(this);
    }

    public print(): string {
        return JSON.stringify(this, null, 4);
    }
}
