import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Usuario } from "./Usuario";
import { Gasto } from "./Gasto";

@Entity("CategoriaGasto")
export class CategoriaGasto {
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

  @ManyToOne(() => Usuario, u => u.categoriasGasto, { onDelete: "CASCADE" })
  @JoinColumn({ name: "idUsuario" })
  usuario: Usuario;

  @OneToMany(() => Gasto, g => g.categoria)
  gastos: Gasto[];
}
