import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Usuario } from "./Usuario";
import { Pergunta } from "./Pergunta";
import { Opcao } from "./Opcao";

@Entity("RespostaUsuario")
export class RespostaUsuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idUsuario: number;

  @Column()
  idPergunta: number;

  @Column()
  idOpcao: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  dataResposta: Date;

  @ManyToOne(() => Usuario, u => u.respostas)
  @JoinColumn({ name: "idUsuario" }) // nome exato da coluna
  usuario: Usuario;

  @ManyToOne(() => Pergunta, p => p.respostas)
  @JoinColumn({ name: "idPergunta" }) // nome exato da coluna
  pergunta: Pergunta;

  @ManyToOne(() => Opcao, o => o.respostas)
  @JoinColumn({ name: "idOpcao" }) // nome exato da coluna
  opcao: Opcao;
}
