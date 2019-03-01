import { Entity, BaseEntity, Column, ManyToOne, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class Tag extends BaseEntity {
    @PrimaryGeneratedColumn()
    private id: number;

    @Column({ length: 100 })
    private name: string;

    private version: number = 0;

    constructor() {
        super();
    }
}