import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Formulario } from "./Formulario";
import { Opcao } from "./Opcao";
import { RespostaUsuario } from "./RespostaUsuario";

@Entity("Pergunta")
export class Pergunta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  texto: string;

  @Column()
  idFormulario: number;

  @ManyToOne(() => Formulario, f => f.perguntas)
  @JoinColumn({ name: "idFormulario" })
  formulario: Formulario;

  @OneToMany(() => Opcao, o => o.pergunta, { cascade: true })
  opcoes: Opcao[];

  @OneToMany(() => RespostaUsuario, r => r.pergunta)
  respostas: RespostaUsuario[];
}
