import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { PerfilInvestidor } from "./PerfilInvestidor";
import { Usuario } from "./Usuario";

@Entity("ResultadoUsuario") // nome da tabela no Supabase
export class ResultadoUsuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idUsuario: number;

  @Column()
  idPerfil: number;

  @Column()
  pontuacaoTotal: number;

  @CreateDateColumn()
  dataClassificacao: Date;

  @ManyToOne(() => PerfilInvestidor, p => p.resultados)
  @JoinColumn({ name: "idPerfil" })
  perfil: PerfilInvestidor;

  @OneToOne(() => Usuario, u => u.resultados)
  @JoinColumn({ name: "idUsuario" }) 
  usuario: Usuario;
}
