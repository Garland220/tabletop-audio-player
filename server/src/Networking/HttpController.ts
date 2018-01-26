import * as path from 'path';

import { Server as HttpServer } from 'http';
import * as express from 'express';
import 'reflect-metadata';
import 'pg';

import { Server, Routes, Configuration } from '../';

const nunjuk = require('express-nunjucks');


export class HttpController {
    private http: HttpServer;
    private express: express.Application;
    private config: Configuration;

    public get Express(): express.Application {
        return this.express;
    }

    public get App(): HttpServer {
        return this.http;
    }

    constructor(config: Configuration) {
        this.config = config;
    }

    public Open(): Promise<any> {
        return new Promise(() => {
            Server.Log('Starting Web server...');
            this.express = express();
            this.http = new HttpServer(<any>this.express);

            this.express.set('views', path.join(__dirname, '../views'));
            nunjuk(this.express, {});

            Routes.MakeRoutes(this.express);

            this.http.listen(Server.Configuration.WebPort, () => {
                Server.Log(`Web server listening on *:${this.config.WebPort}`);
                return this.http;
            });
        }).catch((error) => {
            Server.Log(`Web startup error: ${error}`);
        });

    }

    public Close(): void {
        if (!this.http) {
            return;
        }

        Server.Log('Stopping web server...');

        this.http.close();
        this.http = undefined;
        this.express = undefined;
        this.config = undefined;

        Server.Log('Web server closed.');
    }
}
