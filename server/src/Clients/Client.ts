import * as SocketIO from 'socket.io';

import { Server } from '../';
import { User } from '../Users';
import { Room } from '../Rooms';
import { ClientController } from './';


declare type IPAddress = string;

export class Client {
    private socket: SocketIO.Socket;
    private address: IPAddress;

    private connectedOn: Date;

    private user: User | null;
    private room: Room | null;

    private deleted: boolean = false;

    public get ID(): string {
        return this.socket.id;
    }

    public get Name(): string {
        if (this.IsRegistered) {
            return (this.user.Name ? this.user.Name : 'User') + ` (${this.address})`;
        }
        return `Guest (${this.Address}) `;
    }

    public get Socket(): SocketIO.Socket {
        return this.socket;
    }

    public get Address(): IPAddress {
        return this.address;
    }

    public get ConnectedOn(): Date {
        return this.connectedOn;
    }

    public get User(): User {
        return this.user;
    }

    public get Room(): Room {
        return this.room;
    }
    public set Room(value: Room) {
        this.room = value;
    }

    public get Deleted(): boolean {
        return this.deleted;
    }

    public get IsRegistered(): boolean {
        return !!this.user;
    }

    public get IsGuest(): boolean {
        return !this.user;
    }

    public get IsAdmin(): boolean {
        if (this.IsGuest) {
            return false;
        }
        return this.user.IsAdmin;
    }

    constructor(socket: SocketIO.Socket, user?: User) {
        this.connectedOn = new Date();
        this.address = socket.client.conn.remoteAddress;
        this.socket = socket;

        this.user = user || null;
        this.room = null;

        ClientController.Add(this);
    }

    public Join(room: Room, password: string) {
        if (room) {
            room.Join(this, password);
        }
    }

    public Disconnect(close: boolean = false): void {
        Server.Log(`${this.Name} has been manually disconnected.`);
        this.socket.disconnect(close);
    }

    public OnConnect(): void {
        Server.Log(`${this.Name} connected.`);

        Server.ActiveUsers += 1;
    }

    public OnDisconnect(): void {
        Server.Log(`${this.Name} disconnected.`);

        Server.ActiveUsers -= 1;
        if (this.room) {
            this.room.Leave(this);
        }
        this.Delete();
    }

    public Message(message: string): void {
        if (!this.socket) {
            return;
        }

        this.socket.send('message', message);
    }

    public Send(...args:any[]): void {
        if (!this.socket) {
            return;
        }

        this.OnBeforeSend();

        this.socket.send(args);

        this.OnAfterSend();
    }

    public OnBeforeSend(): void {

    }

    public OnAfterSend(): void {

    }

    public CheckActive(): boolean {
        return true;
    }

    public Delete(): void {
        ClientController.Remove(this.ID);
        this.connectedOn = undefined;
        this.address = undefined;
        this.socket = undefined;
        this.user = undefined;
        this.deleted = true;
    }
}
