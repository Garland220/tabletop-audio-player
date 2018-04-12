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

    public get ID(): number {
        return this.id;
    }

    public get Name(): string {
        return this.name;
    }

    public get Description(): string {
        return this.description;
    }

    public get Attribution(): string {
        return this.attribution;
    }

    public get ImageURL(): string {
        return this.imageURL;
    }

    public get IconURL(): string {
        return this.iconURL;
    }

    // public get Tags(): Tag[] {
    //     return this.tags;
    // }

    public get Loop(): boolean {
        return this.loop;
    }

    public get Deleted(): boolean {
        return this.deleted;
    }

    public get Public(): boolean {
        return this.public;
    }

    public get Music(): boolean {
        return this.music;
    }

    public get Owner(): User {
        return this.owner;
    }

    constructor() {
        super();
    }
}
