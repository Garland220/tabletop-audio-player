import { Entity, Column, ManyToOne, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    private id: number;

    @Column({ length: 100 })
    private name: string;

    constructor() {

    }
}