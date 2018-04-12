import { Server } from '../';
import { Sound } from './';


export class SoundHash {
    [id: number]: Sound;
}

export class SoundController {
    // Dictionaries
    private static sounds: SoundHash = {};
    private static soundArray: Sound[] = [];
    private static soundCount: number = 0;

    public static get List(): SoundHash {
        return SoundController.sounds;
    }

    public static get Count(): number {
        return SoundController.soundCount;
    }

    public static get Array(): Sound[] {
        if (!SoundController.soundArray || SoundController.soundArray.length === 0) {
            SoundController.soundArray = Object.keys(SoundController.sounds).map(function(soundId: string) {
                return SoundController.sounds[<any>soundId];
            });
        }
        return SoundController.soundArray;
    }

    public static Add(sound: Sound): void {
        if (!(sound instanceof Sound)) {
            console.error('SoundController :: Add', 'Argument is not an instance of `Sound`');
            return;
        }

        if (!SoundController.sounds[sound.ID]) {
            SoundController.sounds[sound.ID] = sound;
            SoundController.soundCount += 1;
        }
    }

    public static Remove(sound: Sound): void {
        if (!(sound instanceof Sound)) {
            console.error('SoundController :: Remove', 'Argument is not an instance of `Sound`');
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

    public static LoadAll(): Promise<any> {
        return Sound.find().then((sounds) => {
            for (let index in sounds) {
                let sound = sounds[index];

                if (sound && sound.ID) {
                    SoundController.Add(sound);
                }
            }
        }).catch((err) => {
            console.error('SoundController :: LoadAll', err);
        });
    }

    public static Load(soundId: number): Promise<any> {
        return Sound.findOneById(soundId).then((sound) => {
            if (sound && sound.ID) {
                SoundController.Add(sound);
            }
        }).catch((err) => {
            console.error('SoundController :: Load', err);
        });
    }
}
