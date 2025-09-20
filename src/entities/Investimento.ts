import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { TipoInvestimento } from "./TipoInvestimento";
import { Usuario } from "./Usuario";

@Entity("Investimento")
export class Investimento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idUsuario: number;

  @Column("float")
  valor: number;

  @Column({ nullable: true })
  descricao?: string;

  @Column({ nullable: true })
  idTipoInvestimento?: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  dataInvestimento: Date;

  @ManyToOne(() => TipoInvestimento, t => t.investimentos, { nullable: true })
  @JoinColumn({ name: "idTipoInvestimento" })
  tipoInvestimento?: TipoInvestimento;

  @ManyToOne(() => Usuario, u => u.investimentos, { onDelete: "CASCADE" })
  @JoinColumn({ name: "idUsuario" })
  usuario: Usuario;
}
