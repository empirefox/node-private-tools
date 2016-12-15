import { Table, Column, PrimaryGeneratedColumn } from "typeorm";

@Table('phone')
export class Phone {

  @PrimaryGeneratedColumn() id: number;

  @Column() phone: string;

  @Column() province: string;

  @Column() city: string;

  @Column() isp: string;

  @Column() code: string;

  @Column() zip: string;
}
