import * as fs from 'fs';
import * as util from 'util';

import { Configuration } from './';
import { ClientController } from './Clients';
import { DatabaseController, HttpController, SocketController } from './Networking';


export class Server {
    private static readonly debug: boolean = false;

    private static crashed: boolean = false;
    private static closing: boolean = false;

    private static activeUsers: number = 0;

    private static database: DatabaseController;
    private static http: HttpController;
    private static sockets: SocketController;


    public static Configuration: Configuration;

    public static get ActiveUsers(): number {
        return Server.activeUsers;
    }
    public static set ActiveUsers(value: number) {
        Server.activeUsers = value;
        // update listeners
    }

    public static get DB(): DatabaseController {
        return this.database;
    }

    public static get HTTP(): HttpController {
        return Server.http;
    }

    public static get Sockets(): SocketController {
        return Server.sockets;
    }

    public static Broadcast(message: string): void {
        if (Server.sockets) {
            Server.sockets.IO.send('broadcast', message);
        }
    }

    public static Log(...args:any[]): void {
        if (typeof (console) !== 'undefined') {
            console.log.apply(console, args);
        }
    }

    public static Config(config: Configuration): void {
        Server.Configuration = new Configuration(config);
    }

    public static Start(config:Configuration): void {
        Server.Log('Server is starting up...');
        Server.Config(config);

        const startup = new Promise(() => {
            Server.database = new DatabaseController(config);
            return Server.database.Open();
        }).then((connection) => {
            Server.http = new HttpController(config);
            return Server.http.Open();
        }).then((http) => {
            Server.sockets = new SocketController(config, Server.http.App);
            return Server.sockets.Open();
        }).catch((error) => {
            Server.Log(`Startup failed with error: ${error}`);
        });
    }

    public static Stop(restart: boolean = false): void {
        if (Server.closing) {
            return;
        }

        Server.Broadcast(restart ? 'Server is restarting.' : 'Server is shutting down.');

        Server.Log('Stopping server...');

        Server.closing = true;
        Server.DB.Close();
        Server.HTTP.Close();
        Server.Sockets.Close();
        Server.database = undefined;
        Server.sockets = undefined;
        Server.http = undefined;

        if (restart) {
            Server.Log('Server will restart.');
            // This is where my restart code would go... IF I HAD ANY!
        }

        Server.Log('done');
        process.exit(0); // kill process
    }
}