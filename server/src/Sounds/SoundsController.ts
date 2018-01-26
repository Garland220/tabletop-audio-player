import { Server } from '../';
import { Sound } from './';


export class SoundHash {
    [id: number]: Sound;
}

export class SoundController {
    // Dictionaries
    private static sounds: SoundHash = {};
    private static soundCount: number = 0;

    public static get List(): SoundHash {
        return SoundController.sounds;
    }

    public static get Count(): number {
        return SoundController.soundCount;
    }

    public static get Array(): Sound[] {
        return Object.keys(SoundController.sounds).map(function(soundId: string) {
            return SoundController.sounds[<any>soundId];
        });
    }

    public static Add(sound: Sound): void {
        if (!(sound instanceof Sound)) {
            return;
        }

        if (!SoundController.sounds[sound.ID]) {
            SoundController.sounds[sound.ID] = sound;
            SoundController.soundCount += 1;
        }
    }

    public static Remove(sound: Sound): void {
        if (!(sound instanceof Sound)) {
            return;
        }

        if (SoundController.sounds[sound.ID]) {
            SoundController.sounds[sound.ID] = null;
            delete SoundController.sounds[sound.ID];
            SoundController.soundCount -= 1;
        }
    }

    public static Get(soundId: number): Sound {
        if (SoundController.sounds[soundId]) {
            return SoundController.sounds[soundId];
        }
        return null;
    }
}
