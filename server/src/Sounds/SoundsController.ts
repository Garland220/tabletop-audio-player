import { Request, Response } from 'express';

import { Hash } from '../Shared';
import { Server } from '../';
import { Sound } from './';


export class SoundController {
    // Dictionaries
    private static data: Hash<Sound> = {};
    private static array: Sound[] = [];
    private static count: number = 0;

    public static get List(): Hash<Sound> {
        return SoundController.data;
    }

    public static get Count(): number {
        return SoundController.count;
    }

    public static get Array(): Sound[] {
        if (!SoundController.array || SoundController.array.length === 0) {
            SoundController.array = Object.keys(SoundController.data).map(function(soundId: string) {
                return SoundController.data[<any>soundId];
            });
        }

        return SoundController.array;
    }

    public static Add(sound: Sound): void {
        if (!(sound instanceof Sound)) {
            Server.Error('(SoundController :: Add)', 'Argument is not an instance of `Sound`');
            return;
        }

        if (!SoundController.data[sound.ID]) {
            SoundController.data[sound.ID] = sound;
            SoundController.count += 1;
        }
    }

    public static Remove(sound: Sound): void {
        if (!(sound instanceof Sound)) {
            Server.Error('(SoundController :: Remove)', 'Argument is not an instance of `Sound`');
            return;
        }

        if (SoundController.data[sound.ID]) {
            SoundController.data[sound.ID] = null;
            delete SoundController.data[sound.ID];
            SoundController.count -= 1;
        }
    }

    public static Get(soundId: number): Sound {
        if (SoundController.data[soundId]) {
            return SoundController.data[soundId];
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

            Server.Log('(SoundController :: LoadAll)', `Loaded ${sounds.length} sounds from database.`);
        }).catch((error) => {
            Server.Error('(SoundController :: LoadAll)', error);
        });
    }

    public static Load(soundId: number): Promise<any> {
        return Sound.findOneById(soundId).then((sound) => {
            if (sound && sound.ID) {
                SoundController.Add(sound);
            }
        }).catch((error) => {
            Server.Error('(SoundController :: Load)', error);
        });
    }

    public static ListAll(req: Request, res: Response): void {
        const soundList = SoundController.Array.map((sound: any) => {
            return {
                id: sound.id,
                name: sound.name,
            }
        });

        res.json(soundList);
    }
}
