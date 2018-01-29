import * as path from 'path';

import { Server as HttpServer } from 'http';
import * as express from 'express';

import { Routes, Configuration } from '../';

const nunjuck = require('express-nunjucks');


export class HttpController {
    private http: HttpServer;
    private express: express.Application;
    private config: Configuration;
    private server: any;

    public get Express(): express.Application {
        return this.express;
    }

    public get App(): HttpServer {
        return this.http;
    }

    constructor(server: any, config: Configuration) {
        this.config = config;
        this.server = server;
    }

    public Open(): Promise<any> {
        return new Promise((resolve) => {
            this.server.Log('Starting Web server...');
            this.express = express();
            this.http = new HttpServer(<any>this.express);

            this.express.set('views', path.join(__dirname, '../../views'));

            nunjuck(this.express, {
                autoescape: true,
                throwOnUndefined: this.config.Environment === 'development',
                watch: this.config.Environment !== 'development',
                noCache: this.config.Environment !== 'development'
            });

            Routes.MakeRoutes(this.express);

            this.http.listen(this.config.WebPort, () => {
                this.server.Log(`Web server listening on *:${this.config.WebPort}`);
                return resolve(this.http);
            });
        }).catch((error) => {
            this.server.Log(`Web startup error: ${error}`);
        });
    }

    public Close(): void {
        if (!this.http) {
            return;
        }

        this.server.Log('Stopping web server...');

        this.http.close();
        this.http = undefined;
        this.express = undefined;
        this.config = undefined;

        this.server.Log('Web server closed.');
    }
}
