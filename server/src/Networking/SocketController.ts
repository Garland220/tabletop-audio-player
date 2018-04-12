import * as SocketIO from 'socket.io';
import { Server as HttpServer } from 'http';

import { Configuration } from '../';
import { Client, ClientController } from '../Clients';
import { User, UserController } from '../Users';


export class SocketController {
    private io: SocketIO.Server;
    private http: HttpServer;
    private server: any;

    private config: Configuration;

    public get IO(): SocketIO.Server {
        return this.io;
    }

    constructor(server: any, config: Configuration) {
        this.http = server.HTTP.App;
        this.config = config;
        this.server = server;
    }

    public Open(): Promise<any> {
        return new Promise(() => {
            this.server.Log('Starting socket server...');

            this.io = SocketIO(this.http);

            this.io.on('connect', (socket: SocketIO.Socket) => {
                const handshakeData = socket.request;
                const channel = handshakeData._query['channelId'];
                const user = UserController.Get(handshakeData._query['userId']);
                const client = new Client(socket, user);

                // socket.on('join', server.joinChannel);
                // socket.on('setVolume', server.setVolume);
                // socket.on('setMusicVolume', server.setMusicVolume);
                // socket.on('play', server.play);
                // socket.on('stop', server.stop);
            }).on('disconnect', (socket: SocketIO.Socket) => {
                const client = ClientController.Get(socket.id);
                client.OnDisconnect();
            });

            this.server.Log(`Socket server listening on *:${this.config.SocketPort}`);
        }).catch((error) => {
            this.server.Error(`Socket startup error: ${error}`);
        });
    }

    public Close(): void {
        if (!this.io) {
            return;
        }

        this.server.Log('Stopping socket server...');

        this.io.close();
        this.io = undefined;
        this.http = undefined;
        this.config = undefined;

        this.server.Log('Socket server closed.');
    }
}
