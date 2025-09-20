import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ResultadoUsuario } from "./ResultadoUsuario";

@Entity("PerfilInvestidor")
export class PerfilInvestidor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nomePerfil: string;

  @Column()
  descricao: string;

  @OneToMany(() => ResultadoUsuario, r => r.perfil)
  resultados: ResultadoUsuario[];
}
