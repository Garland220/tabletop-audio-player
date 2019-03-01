import { Application, Request, Response } from 'express';
import { Promise } from 'bluebird';

import { Server } from '../';
import { Hash } from '../Shared';
import { Room } from '../Rooms';
import { Sound, SoundData, SoundCategory, SoundState } from '../Sounds';


export class RoomController {
    private static rooms: Hash<Room> = {};
    private static roomArray: Room[] = [];
    private static roomCount: number = 0;

    public static get List(): Hash<Room> {
        return RoomController.rooms;
    }

    public static get Count(): number {
        return RoomController.roomCount;
    }

    public static get Array(): Room[] {
        if (!RoomController.roomArray || RoomController.roomArray.length === 0) {
            RoomController.roomArray = Object.keys(RoomController.rooms).map((id: string) => {
                return RoomController.rooms[<any>id];
            });
        }
        return RoomController.roomArray;
    }

    public static ValidID(id: number): boolean {
        // TODO: Add additional verification
        if (id) {
            if (RoomController.List[id]) {
                return true;
            }
        }
        Server.Error('(RoomController :: Add)', `ID '${id}' is not valid`);
        return false
    }

    public static VerifyID(req: Request, res: Response) {
        return new Promise((resolve, reject) => {
            const id = req.params['id'];
            if (RoomController.ValidID(id)) {
                resolve(id);
            }
            reject('Room not found');
        }).catch((error) => {
            res.status(404).send(error);
        });
    }

    public static Add(room: Room): void {
        if (!(room instanceof Room)) {
            Server.Error('(RoomController :: Add)', 'Argument is not an instance of `Room`', room);
            return;
        }

        if (!RoomController.rooms[room.ID]) {
            RoomController.rooms[room.ID] = room;
            RoomController.roomCount += 1;
        }
    }

    public static Remove(room: Room): void {
        if (!(room instanceof Room)) {
            Server.Error('(RoomController :: Remove)', 'Argument is not an instance of `Room`', room);
            return;
        }

        if (RoomController.rooms[room.ID]) {
            RoomController.rooms[room.ID] = null;
            delete RoomController.rooms[room.ID];
            RoomController.roomCount -= 1;
        }
    }

    public static New(req: Request, res: Response): void {
        res.render('channel/edit', { channel: {} });
    }

    public static View(req: Request, res: Response): void {
        RoomController.VerifyID(req, res).then((id: number) => {
            Room.findOneById(id).then((room: Room) => {
                if (!room) {
                    res.status(404).send('That room was not found.');
                }
                res.render('channel/view', { channel: room });
            });
        }).catch((error) => {
            Server.Error('(RoomController :: View)', error);
            res.status(500).send(error);
        });
    }

    public static Payload(req: Request, res: Response): void {
        RoomController.VerifyID(req, res).then((id: number) => {
            let room = RoomController.List[id];
            res.send(room.StateJSON);
        }).catch((error) => {
            Server.Error('(RoomController :: Payload)', error);
            res.status(500).send(error);
        });
    }

    public static PayloadTest(req: Request, res: Response): void {
        let room = new Room(null, 'Test Room');
        let category1 = new SoundCategory({ name: 'TEST1' });
        let category2 = new SoundCategory({ name: 'TEST2' });
        let category3 = new SoundCategory({ name: 'TEST3' });
        let sound1 = new Sound();
        let sound2 = new Sound();

        sound1.ID = 1;
        sound1.Name = 'test123';

        sound2.ID = 2;
        sound2.Name = 'test321';

        category1.Name = 'TEST1';
        category2.Name = 'TEST2';

        category1.Add(sound1);
        category1.Add(sound2);

        category3.Add(sound2);

        room.SoundState.Categories = [
            category1,
            category2,
            category3
        ];

        let result = JSON.stringify(JSON.parse(room.Test()), undefined, 4);
        // Server.Log(result);
        Server.Log(JSON.stringify(room.SoundState, undefined, 4));
        res.send(result);
    }

    public static Clients(req: Request, res: Response): void {
        RoomController.VerifyID(req, res).then((id: number) => {
            Room.findOneById(id).then((room: Room) => {
                if (room) {
                    res.json(room.Clients);
                }
            }).catch((error) => {
                Server.Error('(RoomController :: Clients)', error);
                res.status(500).send(error);
            });
        });
    }

    public static Edit(req: Request, res: Response): void {
        RoomController.VerifyID(req, res).then((id: number) => {
            Room.findOneById(id).then((room) => {
                res.render('channel/edit', { channel: room });
            });
        }).catch((error) => {
            Server.Error('(RoomController :: Edit)', error);
            res.status(500).send(error);
        });
    }

    public static Save(req: Request, res: Response): void {
        const id = req.params['id'];
        const name = req.body['name'];
        const url = req.body['picture'];
        const description = req.body['description'];
        const json = req.body['audioLibrary'];

        if (id) {
            RoomController.VerifyID(req, res).then((id: number) => {
                let room = RoomController.List[id];
                room.Name = name;
                room.ImageURL = url;
                room.Description = description;
                room.StateJSON = json;

                return room.save();
            }).catch((error) => {
                Server.Error('(RoomController :: Save)', error);
                res.status(500).send(error);
            });
        }
        else {
            let room = new Room(null, name, description);
            room.save();
        }
    }

    public static Control(req: Request, res: Response): void {
        RoomController.VerifyID(req, res).then((id: number) => {
            Room.findOneById(id).then((room: Room) => {
                res.render('channel/admin', { channel: room });
            }).catch((error) => {
                Server.Error('(RoomController :: Control)', error);
                res.status(500).send(error);
            });
        });
    }

    public static ListAll(req: Request, res: Response): void {
        const roomList = RoomController.Array.map((room: any) => {
            return {
                id: room.id,
                name: room.name,
            }
        });

        res.json(roomList);
    }

    public static LoadAll(): Promise<any> {
        return Room.find().then((rooms) => {
            for (let index in rooms) {
                let room = rooms[index];

                if (room && room.ID) {
                    RoomController.Add(room);
                }
            }

            Server.Log('(RoomController :: LoadAll)', `Loaded ${rooms.length} rooms from database.`);
            return rooms;
        }).catch((error) => {
            throw new Error(`(RoomController :: LoadAll) ${error}`);
        });
    }

    public static Load(roomId: number): Promise<any> {
        return Room.findOneById(roomId).then((room) => {
            if (room && room.ID) {
                RoomController.Add(room);
            }
        }).catch((error) => {
            throw new Error(`(RoomController :: Load) ${error}`);
        });
    }
}
