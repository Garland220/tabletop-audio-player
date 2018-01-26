import { Entity, Column, ManyToMany, ManyToOne, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

import { Sound, SoundData } from './';


export class SoundDataHash {
    [id: string]: SoundData;
}

@Entity()
export class SoundGroup {
    @PrimaryGeneratedColumn()
    private id: number;

    @ManyToOne(type => Sound, sound => sound, {})
    @JoinColumn()
    private music: Sound;

    @Column()
    private musicActive: boolean = false;

    @Column('double')
    private musicVolume: number = 1.0;

    @ManyToMany(type => Sound, sound => sound, {})
    @JoinColumn()
    private importedSounds: Sound[];

    @Column('simple-json')
    private soundState: SoundDataHash = {};

    constructor() {

    }

    public Play(sound: Sound): void {
        if (sound && sound.ID && this.soundState[sound.ID]) {
            const soundData = this.soundState[sound.ID];

            if (soundData.Sound.Music) {
                this.music = soundData.Sound;
                this.musicActive = true;
            } else if (soundData.Sound.Loop) {
                soundData.Active = true;
            }
        }
    }

    public Stop(sound: Sound): void {
        if (sound && sound.ID && this.soundState[sound.ID]) {
            const soundData = this.soundState[sound.ID];

            if (soundData.Sound.Music) {
                this.music = soundData.Sound;
                this.musicActive = false;
            } else {
                soundData.Active = false;
            }
        }
    }

    public ChangeVolume(sound: Sound, volume: number) {
        const soundData = this.Get(sound);

        if (soundData) {
            soundData.options.volume = volume;
        }
    }

    public Get(sound: Sound): any {
        if (sound && sound.ID && this.soundState[sound.ID]) {
            return this.soundState[sound.ID];
        }
        return null
    }

    public Add(sound: Sound, options: any): void {
        this.importedSounds.push(sound);
        this.soundState[sound.ID] = new SoundData(sound, options);
    }

    public Remove(sound: Sound): void {
        const index = this.importedSounds.indexOf(sound);
        if (index !== -1) {
            this.importedSounds.splice(index, 1);
        }

        if (this.soundState[sound.ID]) {
            this.soundState[sound.ID] = undefined;
            delete this.soundState[sound.ID];
        }
    }
}
