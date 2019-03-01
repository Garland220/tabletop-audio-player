import { Sound, SoundCategory, SoundData, SoundDataHash } from './';


export class SoundState {
    private categories: SoundCategory[] = [];
    private importedSounds: Sound[] = [];
    // private soundState: SoundDataHash = {};
    // private musicState: MusicData;

    private version: number = 0;

    public get Categories(): SoundCategory[] {
        return this.categories;
    }
    public set Categories(value: SoundCategory[]) {
        this.categories = value;
    }

    public get ImportedSounds(): Sound[] {
        return this.importedSounds;
    }

    // public get SoundState(): SoundDataHash {
    //     return this.soundState;
    // }

    // public get MusicState(): MusicData {
    //     return this.musicState;
    // }

    constructor(data?: SoundState) {
        if (data) {
            // this.importedSounds = data.importedSounds;
            // this.soundState = data.soundState;
            // this.musicState = data.musicState;

            if (data.categories) {
                this.categories.length = 0;
                for (let i = 0; i < data.categories.length; i += 1) {
                    this.categories.push(new SoundCategory(data.categories[i]));
                }
            }
        }
    }

    public Save(): string {
        return JSON.stringify({
            categories: this.categories
        });
    }

    // public Play(sound: Sound): void {
    //     if (sound && sound.ID && this.soundState[sound.ID]) {
    //         const soundData = this.soundState[sound.ID];

    //         if (soundData.isMusic) {
    //             this.musicState.Sound = soundData.Sound;
    //             this.musicState.Active = true;
    //         }
    //         else if (soundData.Loop) {
    //             soundData.Active = true;
    //         }
    //     }
    // }

    // public Stop(sound: Sound): void {
    //     if (sound && sound.ID && this.soundState[sound.ID]) {
    //         const soundData = this.soundState[sound.ID];

    //         if (soundData.isMusic) {
    //             this.musicState.Sound = soundData.Sound;
    //             this.musicState.Active = false;
    //         }
    //         else {
    //             soundData.Active = false;
    //         }
    //     }
    // }

    // public ChangeVolume(sound: Sound, volume: number) {
    //     const soundData = this.Get(sound);

    //     if (soundData) {
    //         soundData.options.volume = volume;
    //     }
    // }

    // public Get(sound: Sound): any {
    //     if (sound && sound.ID && this.soundState[sound.ID]) {
    //         return this.soundState[sound.ID];
    //     }

    //     return null
    // }

    // public Add(sound: Sound, options: any): void {
    //     this.importedSounds.push(sound);
    //     this.soundState[sound.ID] = new SoundData(sound);
    // }

    // public Remove(sound: Sound): void {
    //     const index = this.importedSounds.indexOf(sound);
    //     if (index !== -1) {
    //         this.importedSounds.splice(index, 1);
    //     }

    //     if (this.soundState[sound.ID]) {
    //         this.soundState[sound.ID] = undefined;
    //         delete this.soundState[sound.ID];
    //     }
    // }
}
