import { Sound, SoundState, SoundGroup, SoundData, SoundDataHash } from './';


export class SoundCategory {
    private name: string = '';
    private description: string = '';

    private backgroundImage: string = '';
    private backgroundColor: number = 0x007AAA;
    private fontColor: number = 0xFFFFFF;

    private hidden: boolean = false;
    private singleActiveSound: boolean = false;

    private sounds: SoundData[] = [];

    public get Name(): string {
        return this.name;
    }
    public set Name(value: string) {
        this.name = value;
    }

    public get Description(): string {
        return this.name;
    }
    public set Description(value: string) {
        this.description = value;
    }

    public get BackgroundImage(): string {
        return this.backgroundImage;
    }
    public set BackgroundImage(value: string) {
        this.backgroundImage = value;
    }

    public get BackgroundColor(): number {
        return this.backgroundColor;
    }
    public set BackgroundColor(value: number) {
        this.backgroundColor = value;
    }

    public get BackgroundColorString(): string {
        return this.backgroundColor.toString(16);
    }
    public set BackgroundColorString(value: string) {
        this.backgroundColor = parseInt(value, 16);
    }

    public get FontColor(): number {
        return this.fontColor;
    }
    public set FontColor(value: number) {
        this.fontColor = value;
    }

    public get FontColorString(): string {
        return this.fontColor.toString(16);
    }
    public set FontColorString(value: string) {
        this.fontColor = parseInt(value, 16);
    }

    public get Hidden(): boolean {
        return this.hidden;
    }
    public set Hidden(value: boolean) {
        this.hidden = value;
    }

    public get SingleActiveSound(): boolean {
        return this.singleActiveSound;
    }
    public set SingleActiveSound(value: boolean) {
        this.singleActiveSound = value;
    }

    public get Sounds(): SoundData[] {
        return this.sounds;
    }

    constructor(data?: SoundCategory) {
        if (data) {
            this.name = data.name;
            this.description = data.description;

            this.backgroundImage = data.backgroundImage;
            this.backgroundColor = data.backgroundColor;
            this.fontColor = data.fontColor;

            this.hidden = data.hidden;
            this.singleActiveSound = data.singleActiveSound;

            if (data.sounds) {
                for (let i = 0; i < data.sounds.length; i += 1) {
                    this.sounds.push(new SoundData(data.sounds[i]));
                }
            }
        }
    }

    public Add(sound: Sound) {
        let data = new SoundData({
            loop: sound.Loop,
        });
        data.Loop = ;
        data.Name = sound.Name;
    }

    public Remove(sound: Sound) {

    }

    public Move(soundData: SoundData) {

    }
}
