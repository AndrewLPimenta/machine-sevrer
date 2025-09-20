import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Pergunta } from "./Pergunta";

@Entity("Formulario")
export class Formulario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  titulo: string;

  @Column({ nullable: true })
  descricao?: string;

  @CreateDateColumn()
  dataCriacao: Date;

  @OneToMany(() => Pergunta, p => p.formulario, { cascade: true })
  perguntas: Pergunta[];
}
