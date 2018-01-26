

export class Configuration {
    // Web Listener Port
    private port: number = 8080;

    // Encironment name
    private environment: string = 'development';

    // Connection settings
    private maxConnections: number = -1; // -1 is unlimited

    private connection = {
        type: 'postgres',
        host: 'localhost',
        port: '3306',
        username: '',
        password: '',
        database: ''
    }

    public get SocketPort(): number {
        return this.port;
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
            this.port = data.port;
            this.environment = data.environment;
            this.maxConnections = data.maxConnections;
        }
    }
}
