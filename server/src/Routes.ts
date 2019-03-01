import { Application, Request, Response } from 'express';

import { Server } from './Server';
import { RoomController } from './Rooms';
import { SoundController } from './Sounds';


const routes: any = {
    'get /channel/test': RoomController.PayloadTest,
    'get /channel/new': RoomController.New,
    'post /channel/create': RoomController.Save,
    'get /channel/list': RoomController.ListAll,
    'get /channel/:id/edit': RoomController.Edit,
    'post /channel/:id/edit': RoomController.Save,
    'get /channel/:id/control': RoomController.Control,
    'get /channel/:id/payload': RoomController.Payload,
    'get /channel/:id': RoomController.View,

    // 'get /sound/new': SoundController.new,
    'get /sound/list': SoundController.ListAll,
    // 'post /sound/import': SoundController.import,
    // 'get /sound/:id/edit': SoundController.edit,
    // 'post /sound/:id/edit': SoundController.save,
    // 'post /sound/:id': SoundController.view

    'get /library': library,
    'get /': home
}

function home(req: Request, res: Response) {
    res.render('index');
}

function library(req: Request, res: Response) {
    // Sound.find().then((err: Error, results: any) => {
    // res.status(200).render('library', { sounds: results });
    // });
}

export class Routes {
    public static MakeRoutes(express: Application): void {
        const keys = Object.keys(routes);
        Server.Log('Registering routes: ', keys);

        for (let key in keys) {
            key = keys[key];
            if (!routes.hasOwnProperty(key)) {
                continue;
            }

            let route = routes[key];
            let split = key.split(' ');

            if (split[0] === 'post') {
                express.post(split[1], route);
            } else {
                express.get(split.length === 1 ? split[0] : split[1], route);
            }
        }

        express.use(function(req: Request, res: Response) {
            res.status(404).render('errors/404.html', { title: '404: File Not Found' });
        });

        express.use(function(error: Error, req: Request, res: Response, next: any) {
            res.status(500).render('errors/500.html', { title: '500: Internal Server Error', error: error });
        });
    }
}
