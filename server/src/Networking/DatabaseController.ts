// import 'pg';
import 'reflect-metadata';

import { createConnection, Connection } from 'typeorm';

import { Configuration } from '../';

import { Sound, SoundGroup } from '../Sounds';
import { User } from '../Users';
import { Room } from '../Rooms';

export class DatabaseController {
    private connection: Connection;
    private config: Configuration;
    private server: any

    public get Connection(): Connection {
        return this.connection;
    }

    constructor(server: any, config: Configuration) {
        this.config = config;
        this.server = server
    }

    public Open(): Promise<any> {
        if (this.connection) {
            return;
        }

        this.server.Log('Starting database...');

        return createConnection({
            type: this.config.Connection.type,
            host: this.config.Connection.host,
            port: this.config.Connection.port,
            username: this.config.Connection.username,
            password: this.config.Connection.password,
            database: this.config.Connection.database,
            entities: [User, Sound, SoundGroup, Room]
        }).then((connection) => {
            this.server.Log('Database connected.');
            this.connection = connection;
            return this.connection;
        }).catch((error) => {
            this.server.Log(`Database startup error: ${error}`);
        });
    }

    public Close(): void {
        if (!this.connection) {
            return;
        }

        this.server.Log('Stopping database...');

        this.connection.close();
        this.connection = undefined;
        this.config = undefined;

        this.server.Log('Database connection closed.');
        this.server = undefined;
    }
}
