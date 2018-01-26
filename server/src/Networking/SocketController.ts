import * as SocketIO from 'socket.io';
import { Server as HttpServer } from 'http';

import { Server, Configuration } from '../';
import { Client, ClientController } from '../Clients';
import { User, UserController } from '../Users';


export class SocketController {
    private io: SocketIO.Server;
    private http: HttpServer;

    private config: Configuration;

    public get IO(): SocketIO.Server {
        return this.io;
    }

    constructor(config: Configuration, http: HttpServer) {
        this.http = http;
        this.config = config;
    }

    public Open(): Promise<any> {
        return new Promise(() => {
            Server.Log('Starting socket server...');

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

            Server.Log(`Socket server listening on *:${this.config.SocketPort}`);
        }).catch((error) => {
            Server.Log(`Socket startup error: ${error}`);
        });
    }

    public Close(): void {
        if (!this.io) {
            return;
        }

        Server.Log('Stopping socket server...');

        this.io.close();
        this.io = undefined;
        this.http = undefined;
        this.config = undefined;

        Server.Log('Socket server closed.');
    }
}
