import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGastoTable1758431733555 implements MigrationInterface {
    name = 'CreateGastoTable1758431733555'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Remover constraints existentes temporariamente
        await queryRunner.query(`ALTER TABLE "CategoriaGasto" DROP CONSTRAINT IF EXISTS "CategoriaGasto_idUsuario_fkey"`);
        await queryRunner.query(`ALTER TABLE "TipoInvestimento" DROP CONSTRAINT IF EXISTS "TipoInvestimento_idUsuario_fkey"`);
        await queryRunner.query(`ALTER TABLE "Investimento" DROP CONSTRAINT IF EXISTS "Investimento_idTipoInvestimento_fkey"`);
        await queryRunner.query(`ALTER TABLE "Investimento" DROP CONSTRAINT IF EXISTS "Investimento_idUsuario_fkey"`);
        await queryRunner.query(`ALTER TABLE "Opcao" DROP CONSTRAINT IF EXISTS "Opcao_idPergunta_fkey"`);
        await queryRunner.query(`ALTER TABLE "Pergunta" DROP CONSTRAINT IF EXISTS "Pergunta_idFormulario_fkey"`);
        await queryRunner.query(`ALTER TABLE "RespostaUsuario" DROP CONSTRAINT IF EXISTS "RespostaUsuario_idOpcao_fkey"`);
        await queryRunner.query(`ALTER TABLE "RespostaUsuario" DROP CONSTRAINT IF EXISTS "RespostaUsuario_idPergunta_fkey"`);
        await queryRunner.query(`ALTER TABLE "RespostaUsuario" DROP CONSTRAINT IF EXISTS "RespostaUsuario_idUsuario_fkey"`);
        await queryRunner.query(`ALTER TABLE "ResultadoUsuario" DROP CONSTRAINT IF EXISTS "ResultadoUsuario_idPerfil_fkey"`);
        await queryRunner.query(`ALTER TABLE "ResultadoUsuario" DROP CONSTRAINT IF EXISTS "ResultadoUsuario_idUsuario_fkey"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."Formulario_titulo_key"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."PerfilInvestidor_nomePerfil_key"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."ResultadoUsuario_idUsuario_key"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."Usuario_email_key"`);

        // Criar tabela Gasto
        await queryRunner.query(`
            CREATE TABLE "Gasto" (
                "id" SERIAL NOT NULL,
                "idUsuario" integer NOT NULL,
                "valor" double precision NOT NULL,
                "descricao" character varying NOT NULL,
                "idCategoria" integer,
                "tipoPeriodo" character varying NOT NULL DEFAULT 'MENSAL',
                "dataGasto" TIMESTAMP NOT NULL,
                "dataCriacao" TIMESTAMP NOT NULL DEFAULT now(),
                "dataAtualizacao" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_5265188d5436429fbf6b370a7df" PRIMARY KEY ("id")
            )
        `);

        // Alterações em CategoriaGasto
        await queryRunner.query(`ALTER TABLE "CategoriaGasto" ALTER COLUMN "dataCriacao" TYPE TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "CategoriaGasto" ALTER COLUMN "dataCriacao" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "CategoriaGasto" ALTER COLUMN "nome" SET DEFAULT 'Sem Nome'`);
        await queryRunner.query(`UPDATE "CategoriaGasto" SET "nome" = 'Sem Nome' WHERE "nome" IS NULL`);
        await queryRunner.query(`ALTER TABLE "CategoriaGasto" ALTER COLUMN "nome" SET NOT NULL`);

        // Alterações em TipoInvestimento
        await queryRunner.query(`ALTER TABLE "TipoInvestimento" ALTER COLUMN "dataCriacao" TYPE TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "TipoInvestimento" ALTER COLUMN "dataCriacao" SET DEFAULT now()`);

        // Alterações em Investimento
        await queryRunner.query(`ALTER TABLE "Investimento" ALTER COLUMN "dataInvestimento" TYPE TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "Investimento" ALTER COLUMN "dataInvestimento" SET DEFAULT now()`);

        // Alterações em Formulario
        await queryRunner.query(`ALTER TABLE "Formulario" ALTER COLUMN "dataCriacao" TYPE TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "Formulario" ALTER COLUMN "dataCriacao" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Formulario" ADD CONSTRAINT "UQ_5c6c5f4f5be9fa93b7ac45fbd9d" UNIQUE ("titulo")`);

        // Alterações em Opcao e Pergunta
        await queryRunner.query(`ALTER TABLE "Opcao" ALTER COLUMN "texto" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Pergunta" ALTER COLUMN "texto" SET NOT NULL`);

        // Alterações em RespostaUsuario
        await queryRunner.query(`ALTER TABLE "RespostaUsuario" ALTER COLUMN "dataResposta" TYPE TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "RespostaUsuario" ALTER COLUMN "dataResposta" SET DEFAULT now()`);

        // Alterações em PerfilInvestidor
        await queryRunner.query(`ALTER TABLE "PerfilInvestidor" ALTER COLUMN "nomePerfil" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "PerfilInvestidor" ADD CONSTRAINT "UQ_8bff90a1bfa7ed1ef209e83d552" UNIQUE ("nomePerfil")`);

        // Alterações em ResultadoUsuario
        await queryRunner.query(`ALTER TABLE "ResultadoUsuario" ALTER COLUMN "dataClassificacao" TYPE TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "ResultadoUsuario" ALTER COLUMN "dataClassificacao" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "ResultadoUsuario" ADD CONSTRAINT "UQ_5cb1aafa1923760fd422b81d98e" UNIQUE ("idUsuario")`);

        // Alterações em Usuario
        await queryRunner.query(`ALTER TABLE "Usuario" ALTER COLUMN "nome" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Usuario" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Usuario" ADD CONSTRAINT "UQ_c2591f33cb2c9e689e241dda91f" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "Usuario" ALTER COLUMN "dataCriacao" TYPE TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "Usuario" ALTER COLUMN "dataCriacao" SET DEFAULT now()`);

        // Chaves estrangeiras
        await queryRunner.query(`ALTER TABLE "Gasto" ADD CONSTRAINT "FK_39c12d48afd488d69602f73ba7e" FOREIGN KEY ("idCategoria") REFERENCES "CategoriaGasto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Gasto" ADD CONSTRAINT "FK_c1df5df90b85259c2e7ccd5f629" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CategoriaGasto" ADD CONSTRAINT "FK_bf2b02c5ef362f1a8a7a905adc4" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "TipoInvestimento" ADD CONSTRAINT "FK_19ce750049d3ae83c0978348791" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Investimento" ADD CONSTRAINT "FK_5ece6e3ad37f1096e45bb4d4bdf" FOREIGN KEY ("idTipoInvestimento") REFERENCES "TipoInvestimento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Investimento" ADD CONSTRAINT "FK_418553634a0a1803ee2d717e551" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Opcao" ADD CONSTRAINT "FK_855a95cacfc4c86c59e98c830fe" FOREIGN KEY ("idPergunta") REFERENCES "Pergunta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Pergunta" ADD CONSTRAINT "FK_4fa17b6da75bfaca6c85723406c" FOREIGN KEY ("idFormulario") REFERENCES "Formulario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "RespostaUsuario" ADD CONSTRAINT "FK_96c69610e46db92890f279440fe" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "RespostaUsuario" ADD CONSTRAINT "FK_6e7d5994a81a42ba63d3f6135b4" FOREIGN KEY ("idPergunta") REFERENCES "Pergunta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "RespostaUsuario" ADD CONSTRAINT "FK_3a54e3652af1d8d77dc169fcb59" FOREIGN KEY ("idOpcao") REFERENCES "Opcao"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ResultadoUsuario" ADD CONSTRAINT "FK_3d0ab0b0932cb48255cf0b22bd2" FOREIGN KEY ("idPerfil") REFERENCES "PerfilInvestidor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ResultadoUsuario" ADD CONSTRAINT "FK_5cb1aafa1923760fd422b81d98e" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Aqui você pode manter a lógica de reversão original
        await queryRunner.query(`DROP TABLE "Gasto"`);
    }
}
