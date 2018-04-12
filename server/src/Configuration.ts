

export class Configuration {
    // Web Listener Port
    private port: number = 8080;

    // Socket Listener Port
    private socketPort: number = 8081;

    // Environment name
    private environment: string = 'development';

    // Connection settings
    private maxConnections: number = -1; // -1 is unlimited
    private inactivityTime: number = -1; // -1 is unlimited

    private connection = {
        type: 'sqlite',
        host: 'localhost',
        port: '',
        username: '',
        password: '',
        database: 'database.db',
        synchronize: true,
        logging: false
    }

    public get SocketPort(): number {
        return this.socketPort;
    }

    public get WebPort(): number {
        return this.port;
    }

    public get Environment(): string {
        return this.environment;
    }

    public get Connection(): any {
        return this.connection;
    }

    constructor(data: any) {
        if (data) {
            if (data.port !== undefined) {
                this.port = data.port;
            }
            if (data.socketPort !== undefined) {
                this.socketPort = data.socketPort;
            }
            if (data.environment !== undefined) {
                this.environment = data.environment;
            }
            if (data.maxConnections !== undefined) {
                this.maxConnections = data.maxConnections;
            }
            if (data.connection !== undefined) {
                if (data.connection.type !== undefined) {
                    this.connection.type = data.connection.type;
                }
                if (data.connection.host !== undefined) {
                    this.connection.host = data.connection.host;
                }
                if (data.connection.port !== undefined) {
                    this.connection.port = data.connection.port;
                }
                if (data.connection.username !== undefined) {
                    this.connection.username = data.connection.username;
                }
                if (data.connection.password !== undefined) {
                    this.connection.password = data.connection.password;
                }
                if (data.connection.database !== undefined) {
                    this.connection.database = data.connection.database;
                }
            }
        }
    }
}
