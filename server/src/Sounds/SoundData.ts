import { Sound } from './';


export class SoundOptions {
    private volume: number = 1.0; // Volume modifier

    private delayMin: number = 0; // Miliseconds
    private delayMax: number = 0;  // Miliseconds

    private fadeIn: number = 0; // Miliseconds
    private fadeOut: number = 0; // Miliseconds

    private noLoop: boolean = false; // Disabled looping
    private forceLoop: boolean = false; // Forces looping

    private note: string; // Text to appear above sound button
}

export class SoundData {
    private active: boolean = false;

    private sound: Sound;
    private soundOptions: SoundOptions;

    public get Active(): boolean {
        return this.active;
    }
    public set Active(value: boolean) {
        this.active = value;
    }

    public get Sound(): Sound {
        return this.sound;
    }

    public get SoundOptions(): SoundOptions {
        return this.soundOptions;
    }

    constructor(sound: Sound, options: SoundOptions) {

    }
}
