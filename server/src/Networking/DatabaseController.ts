import { Server } from '../';

import 'pg';
import 'reflect-metadata';

import { createConnection, Connection } from 'typeorm';

import { Configuration } from '../';

import { Sound, SoundGroup } from '../Sounds';
import { User } from '../Users';
import { Room } from '../Rooms';


export class DatabaseController {
    private connection: Connection;
    private config: Configuration;

    public get Connection(): Connection {
        return this.connection;
    }

    constructor(config: Configuration) {
        this.config = config;
    }

    public Open(): Promise<any> {
        if (this.connection) {
            return;
        }

        Server.Log('Starting database...');

        return createConnection({
            type: this.config.Connection.type,
            host: this.config.Connection.host,
            port: this.config.Connection.port,
            username: this.config.Connection.username,
            password: this.config.Connection.password,
            database: this.config.Connection.database,
            entities: [User, Sound, SoundGroup, Room]
        }).then((connection) => {
            Server.Log('Database connected.');
            this.connection = connection;
            return this.connection;
        }).catch((error) => {
            Server.Log(`Database startup error: ${error}`);
        });
    }

    public Close(): void {
        if (!this.connection) {
            return;
        }

        Server.Log('Stopping database...');

        this.connection.close();
        this.connection = undefined;
        this.config = undefined;

        Server.Log('Database connection closed.');
    }
}
