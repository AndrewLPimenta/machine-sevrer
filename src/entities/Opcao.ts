import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Pergunta } from "./Pergunta";
import { RespostaUsuario } from "./RespostaUsuario";

@Entity("Opcao")
export class Opcao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  texto: string;

  @Column()
  pontuacao: number;

  @Column()
  idPergunta: number;

  @ManyToOne(() => Pergunta, pergunta => pergunta.opcoes)
  @JoinColumn({ name: "idPergunta" })
  pergunta: Pergunta;

  @OneToMany(() => RespostaUsuario, r => r.opcao)
  respostas: RespostaUsuario[];
}
