import { Entity, BaseEntity, Column, ManyToOne, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    private id: number;

    @Column({ length: 100 })
    private name: string;

    @Column()
    private password: string;

    @Column({ length: 100 })
    private email: string;

    @Column()
    private created: Date;

    @Column()
    private admin: boolean = false;

    public get ID(): number {
        return this.id;
    }

    public get Name(): string {
        return this.name;
    }
    public set Name(value: string) {
        this.name = value;
    }

    public get Email(): string {
        return this.email;
    }

    public get IsAdmin(): boolean {
        return this.admin;
    }

    constructor(email: string, password: string, name: string) {
        super();

        this.name = name;
        this.email = email;
        this.password = password;
        this.created = new Date();
    }

    public TryPassword(password: string): boolean {
        return (this.password === password);
    }
}
