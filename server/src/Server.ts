import * as fs from 'fs';
import * as util from 'util';

import { Configuration } from './Shared';
import { ClientController } from './Clients';
import { DatabaseController, HttpController, SocketController } from './Networking';

const colors = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",
    fg: {
        Black: "\x1b[30m",
        Red: "\x1b[31m",
        Green: "\x1b[32m",
        Yellow: "\x1b[33m",
        Blue: "\x1b[34m",
        Magenta: "\x1b[35m",
        Cyan: "\x1b[36m",
        White: "\x1b[37m",
        Crimson: "\x1b[38m"
    },
    bg: {
        Black: "\x1b[40m",
        Red: "\x1b[41m",
        Green: "\x1b[42m",
        Yellow: "\x1b[43m",
        Blue: "\x1b[44m",
        Magenta: "\x1b[45m",
        Cyan: "\x1b[46m",
        White: "\x1b[47m",
        Crimson: "\x1b[48m"
    }
};


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
        return Server.database;
    }

    public static get HTTP(): HttpController {
        return Server.http;
    }

    public static get Sockets(): SocketController {
        return Server.sockets;
    }

    public static Broadcast(message: string): void {
        Server.Log(colors.fg.Blue + 'BROADCAST:', `"${message}"` + colors.fg.White);

        if (Server.sockets) {
            Server.sockets.IO.send('broadcast', message);
        }
    }

    public static Log(...args: any[]): void {
        // args.unshift(colors.fg.Green);
        console.log.apply(console, args);
    }

    public static Warn(...args: any[]): void {
        args.unshift(colors.fg.Yellow + '[WARNING]');
        args.push(colors.fg.White);
        console.warn.apply(console, args);
    }

    public static Error(...args: any[]): void {
        args.unshift(colors.fg.Red + '[ERROR]');
        args.push(colors.fg.White);
        console.error.apply(console, args);
    }

    public static Start(config: any): void {
        Server.Log('Server is starting up...');
        Server.Configuration = new Configuration(config);
        Server.database = new DatabaseController(this, Server.Configuration);

        Server.database.Open().then((connection) => {
            Server.http = new HttpController(this, Server.Configuration);
            return Server.http.Open();
        }).then((http) => {
            Server.sockets = new SocketController(this, Server.Configuration);
            return Server.sockets.Open();
        }).catch((error) => {
            Server.Error(`Startup failed with error: ${error}`);
        });
    }

    public static CleanUp(): void {
        Server.Log('Doing pre-exit cleanup.');

        Server.DB.Close();
        Server.HTTP.Close();
        Server.Sockets.Close();
        Server.database = undefined;
        Server.sockets = undefined;
        Server.http = undefined;

        Server.Log('Cleanup complete.');
    }

    public static Stop(restart: boolean = false): void {
        if (Server.closing) {
            return;
        }

        Server.Broadcast(restart ? 'Server is restarting.' : 'Server is shutting down.');

        Server.Log('Stopping server...');
        Server.closing = true;

        Server.CleanUp();

        if (restart) {
            Server.Log('Server will restart.');
            // This is where my restart code would go... IF I HAD ANY!
        }

        Server.Log('Exiting...');
        process.exit(0); // kill process
    }
}

process.on('SIGINT', (signal) => {
    Server.Stop();
});
process.on('warning', (warning) => {
    Server.Warn(warning);
});
process.on(<any>'uncaughtException', (reason: string, location: string) => {
    Server.Error(reason, location);
});

