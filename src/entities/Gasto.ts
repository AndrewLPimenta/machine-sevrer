import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { CategoriaGasto } from "./CategoriaGasto";
import { Usuario } from "./Usuario";

@Entity("Gasto")
export class Gasto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idUsuario: number;

  @Column("float")
  valor: number;

  @Column()
  descricao: string;

  @Column({ nullable: true })
  idCategoria?: number;

  @Column({ default: "MENSAL" })
  tipoPeriodo: string;

  @Column({ type: "timestamp" })
  dataGasto: Date;

  @CreateDateColumn()
  dataCriacao: Date;

  @UpdateDateColumn()
  dataAtualizacao: Date;

  @ManyToOne(() => CategoriaGasto, c => c.gastos, { nullable: true })
  @JoinColumn({ name: "idCategoria" })
  categoria?: CategoriaGasto;

  @ManyToOne(() => Usuario, u => u.gastos, { onDelete: "CASCADE" })
  @JoinColumn({ name: "idUsuario" })
  usuario: Usuario;
}
