import { Entity, BaseEntity, Column, ManyToOne, OneToMany, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Tag } from '../Tags';
import { User } from '../Users';


@Entity()
export class Sound extends BaseEntity {
    @PrimaryGeneratedColumn()
    private id: number;

    @Column({ length: 100 })
    private name: string;

    @Column('text')
    private description: string | null;

    @Column('text')
    private attribution: string | null;

    @Column()
    private imageURL: string | null;

    @Column()
    private iconURL: string | null;

    // @OneToMany(type => Tag, tag => tag, {})
    // @JoinColumn()
    // private tags: Tag[] = [];

    @Column('double')
    private volume: number = 1.0;

    @Column()
    private loop: boolean = false;

    @Column()
    private deleted: boolean = false;

    @Column()
    private public: boolean = false;

    @Column()
    private music: boolean = false;

    @ManyToOne(type => User, user => user, {})
    @JoinColumn()
    private owner: User;

    private version: number = 0;

    public get ID(): number {
        return this.id;
    }
    public set ID(value: number) {
        this.id = value;
    }

    public get Owner(): User {
        return this.owner;
    }
    public set Owner(value: User) {
        this.owner = value;
    }

    public get Name(): string {
        return this.name;
    }
    public set Name(value: string) {
        this.name = value;
    }

    public get Description(): string {
        return this.description;
    }
    public set Description(value: string) {
        this.description = value;
    }

    public get Attribution(): string {
        return this.attribution;
    }
    public set Attribution(value: string) {
        this.attribution = value;
    }

    public get ImageURL(): string {
        return this.imageURL;
    }
    public set ImageURL(value: string) {
        this.imageURL = value;
    }

    public get IconURL(): string {
        return this.iconURL;
    }
    public set IconURL(value: string) {
        this.iconURL = value;
    }

    // public get Tags(): Tag[] {
    //     return this.tags;
    // }

    public get Loop(): boolean {
        return this.loop;
    }
    public set Loop(value: boolean) {
        this.loop = value;
    }

    public get isDeleted(): boolean {
        return this.deleted;
    }
    public set isDeleted(value: boolean) {
        this.deleted = value;
    }

    public get isPublic(): boolean {
        return this.public;
    }
    public set isPublic(value: boolean) {
        this.public = value;
    }

    public get isMusic(): boolean {
        return this.music;
    }
    public set isMusic(value: boolean) {
        this.music = value;
    }

    public get Version(): number {
        return this.version;
    }

    constructor() {
        super();
    }
}
