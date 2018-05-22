import { Sound, SoundData, SoundDataHash } from './';


export class SoundGroup {
    private active: boolean = false;
    private sounds: SoundData[];

    public get Sounds(): SoundData[] {
        return this.sounds;
    }
    public set Sounds(value: SoundData[]) {
        this.sounds = value;
    }

    constructor() {

    }
}
