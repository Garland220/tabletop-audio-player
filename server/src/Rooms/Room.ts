import { Entity, Column, ManyToOne, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

import { Server } from '../';
import { Client, ClientHash, ClientController } from '../Clients';
import { Sound, SoundGroup } from '../Sounds';
import { User } from '../Users';


@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    private id: number;

    @Column({ length: 100 })
    private name: string;

    @Column('text')
    private description: string | null;

    @Column('text')
    private styleCSS: string | null;

    @Column()
    private password: string | null;

    @Column()
    private customURL: string | null;

    @Column()
    private imageURL: string | null;

    @Column('double')
    private roomVolumeModifier: number = 1.0;

    @Column()
    private ownerPassword: string | null;

    @OneToOne(type => SoundGroup, soundGroup => soundGroup, {
        cascadeInsert: true,
        cascadeRemove: true
    })
    @JoinColumn()
    private soundGroup: SoundGroup;

    @ManyToOne(type => User, user => user, {})
    @JoinColumn()
    private owner: User;

    @Column()
    private deleted: boolean = false;

    @Column()
    private public: boolean = false;

    @Column()
    private blockGuests: boolean = false;

    private clientCount: number = 0;
    private clientList: string[] = [];

    private lastActivity: Date;
    private active: boolean = false;

    public get ID(): number {
        return this.id;
    }

    public get Name(): string {
        return this.name;
    }
    public set Name(value: string) {
        this.name = name;
    }

    public get Channel(): string {
        if (this.customURL) {
            return this.customURL;
        }
        return this.id.toString();
    }

    public get Count(): number {
        return this.clientCount;
    }

    public get Active(): boolean {
        return this.active;
    }
    public set Active(value: boolean) {
        this.active = value;
    }

    public get HasPassword(): boolean {
        return !!this.password;
    }

    constructor(owner: User, name: string) {
        this.owner = owner;
        this.name = name;
    }

    public Kick(client: Client): void {
        if (!(client instanceof Client)) {
            Server.Log(`Attempted to kick invalid client from '${this.name} (${this.id})'`);
            return;
        }

        Server.Log(`${client.Name} has been kicked.`);
        this.Leave(client);
    }

    public CanJoin(client: Client, password: string): boolean {
        if (!client || !(client instanceof Client)) {
            return false;
        }
        if (this.clientList.indexOf(client.ID) !== -1) {
            return false;
        }
        if (this.blockGuests && client.IsGuest) {
            return false;
        }
        if (this.password) {
            return this.TryPassword(password);
        }
        return true;
    }

    public Join(client: Client, password: string): void {
        if (!(client instanceof Client)) {
            Server.Log(`Invalid client attempted to join room '${this.name} (${this.id})'`);
            return;
        }

        if (this.CanJoin(client, password)) {
            this.clientCount += 1;
            this.clientList.push(client.ID);
            client.Room = this;
            client.Socket.join(this.Channel);

            Server.Log(`${client.Name} joined room '${this.name} (${this.id})'`);

        } else {
            Server.Log(`${client.Name} failed to join room '${this.name} (${this.id})'`);
        }
    }

    public Leave(client: Client): void {
        if (!(client instanceof Client)) {
            Server.Log(`Invalid client attempted to leave room '${this.name} (${this.id})'`);
            return;
        }

        const id = client.ID;
        if (this.clientList.indexOf(id) !== -1) {
            this.clientCount -= 1;
            this.clientList.splice(this.clientList.indexOf(id), 1);
            client.Room = null;
            client.Socket.leave(this.Channel);
        }

        Server.Log(`${client.Name} left room '${this.name} (${this.id})'`);
    }

    public Client(id: string): Client {
        if (ClientController.Get(id)) {
            return ClientController.Get(id);
        }
        return null;
    }

    public List(): string[] {
        return this.clientList;
    }

    public ListNames(): string[] {
        return this.clientList.map((id, index) => {
            return this.Client(id).Name;
        });
    }

    public TryPassword(password: string): boolean {
        return (this.password === password);
    }
}
