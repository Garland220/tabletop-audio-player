import { Hash } from '../Shared';
import { Server } from '../';
import { Client } from './';


export class ClientController {
    // Dictionaries
    private static clients: Hash<Client> = {};
    private static clientCount: number = 0;

    public static get List(): Hash<Client> {
        return ClientController.clients;
    }

    public static get Count(): number {
        return ClientController.clientCount;
    }

    public static get Array(): Client[] {
        return Object.keys(ClientController.clients).map(function(id: string) {
            return ClientController.clients[<any>id];
        });
    }

    public static Add(client: Client): void {
        if (!(client instanceof Client)) {
            return;
        }

        if (!ClientController.clients[client.ID]) {
            ClientController.clients[client.ID] = client;
            ClientController.clientCount += 1;
        }
    }

    public static Remove(id: string): void {
        if (id && ClientController.clients[id]) {
            ClientController.clients[id] = null;
            delete ClientController.clients[id];
            ClientController.clientCount -= 1;
        }
    }

    public static Get(id: string): Client {
        if (id && ClientController.clients[id]) {
            return ClientController.clients[id];
        }
        return null;
    }
}
