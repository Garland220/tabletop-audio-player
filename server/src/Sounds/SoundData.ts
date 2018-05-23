import { Sound, SoundController } from './';
import { Deserializer } from '../Shared';


export class SoundData {
    private active: boolean = false;
    private volume: number = 1.0; // Volume modifier

    private sound: Sound; // The sound

    private fadeIn: number = 0; // Miliseconds
    private fadeOut: number = 0; // Miliseconds

    private note: string = ''; // Text to appear above sound button
    private name: string = '';

    private delayMin: number = 0; // Miliseconds
    private delayMax: number = 0;  // Miliseconds

    private preload: boolean = false;

    private loop: boolean = false; // Disabled looping
    private forceLoop: boolean = false; // Forces looping

    public get Active(): boolean {
        return this.active;
    }
    public set Active(value: boolean) {
        this.active = value;
    }

    public get Volume(): number {
        return this.volume;
    }
    public set Volume(value: number) {
        if (value < 0) {
            value = 0;
        }
        else if (value > 1) {
            value = 1;
        }
        this.volume = value;
    }

    public get FadeIn(): number {
        return this.fadeIn;
    }
    public set FadeIn(value: number) {
        this.fadeIn = value;
    }

    public get FadeOut(): number {
        return this.fadeOut;
    }
    public set FadeOut(value: number) {
        this.fadeOut = value;
    }

    public get Sound(): Sound {
        return this.sound;
    }
    public set Sound(value: Sound) {
        this.sound = value;
    }

    public get Name(): string {
        return this.name;
    }
    public set Name(value: string) {
        this.name = value;
    }

    public get Note(): string {
        return this.note;
    }
    public set Note(value: string) {
        this.note = value;
    }

    public get DelayMin(): number {
        return this.delayMin;
    }
    public set DelayMin(value: number) {
        this.delayMin = value;
    }

    public get DelayMax(): number {
        return this.delayMax;
    }
    public set DelayMax(value: number) {
        this.delayMax = value;
    }

    public get Loop(): boolean {
        return this.loop;
    }
    public set Loop(value: boolean) {
        this.loop = value;
    }

    public get Preload(): boolean {
        return this.preload;
    }

    constructor(data?: any) {
        if (data) {
            Deserializer.extend(this, data);

            if (data.sound) {
                this.sound = SoundController.Get(data.sound.ID);
            }
        }
    }
}

export class SoundDataHash {
    [id: string]: SoundData;
}
