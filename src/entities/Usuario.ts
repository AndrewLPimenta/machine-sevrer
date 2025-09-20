import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, OneToOne } from "typeorm";
import { CategoriaGasto } from "./CategoriaGasto";
import { Gasto } from "./Gasto";
import { Investimento } from "./Investimento";
import { RespostaUsuario } from "./RespostaUsuario";
import { ResultadoUsuario } from "./ResultadoUsuario";
import { TipoInvestimento } from "./TipoInvestimento";

@Entity("Usuario")
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ unique: true })
  email: string;

  @Column()
  senhaHash: string;

  @CreateDateColumn()
  dataCriacao: Date;

  @OneToMany(() => CategoriaGasto, c => c.usuario)
  categoriasGasto: CategoriaGasto[];

  @OneToMany(() => Gasto, g => g.usuario)
  gastos: Gasto[];

  @OneToMany(() => Investimento, i => i.usuario)
  investimentos: Investimento[];

  @OneToMany(() => RespostaUsuario, r => r.usuario)
  respostas: RespostaUsuario[];

  @OneToOne(() => ResultadoUsuario, r => r.usuario)
  resultados: ResultadoUsuario;

  @OneToMany(() => TipoInvestimento, t => t.usuario)
  tiposInvestimento: TipoInvestimento[];
}
