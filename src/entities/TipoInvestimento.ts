import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Usuario } from "./Usuario";
import { Investimento } from "./Investimento";

@Entity("TipoInvestimento")
export class TipoInvestimento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ nullable: true })
  descricao?: string;

  @Column()
  idUsuario: number;

  @CreateDateColumn()
  dataCriacao: Date;

  @ManyToOne(() => Usuario, u => u.tiposInvestimento, { onDelete: "CASCADE" })
  @JoinColumn({ name: "idUsuario" })
  usuario: Usuario;

  @OneToMany(() => Investimento, i => i.tipoInvestimento)
  investimentos: Investimento[];
}
