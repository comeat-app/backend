-- CreateTable
CREATE TABLE "public"."contas" (
    "conta_id" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "data_nascimento" TIMESTAMP(3) NOT NULL,
    "telefone" TEXT,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3),

    CONSTRAINT "contas_pkey" PRIMARY KEY ("conta_id")
);

-- CreateTable
CREATE TABLE "public"."detalhes_contas" (
    "detalhes_conta_id" TEXT NOT NULL,
    "conta_id" TEXT NOT NULL,
    "cep" TEXT,
    "email_verificado" BOOLEAN NOT NULL DEFAULT false,
    "telefone_verificado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "detalhes_contas_pkey" PRIMARY KEY ("detalhes_conta_id")
);

-- CreateTable
CREATE TABLE "public"."conta_tokens" (
    "conta_token_id" TEXT NOT NULL,
    "conta_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conta_tokens_pkey" PRIMARY KEY ("conta_token_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contas_cpf_key" ON "public"."contas"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "contas_telefone_key" ON "public"."contas"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "contas_email_key" ON "public"."contas"("email");

-- CreateIndex
CREATE UNIQUE INDEX "detalhes_contas_conta_id_key" ON "public"."detalhes_contas"("conta_id");

-- AddForeignKey
ALTER TABLE "public"."detalhes_contas" ADD CONSTRAINT "detalhes_contas_conta_id_fkey" FOREIGN KEY ("conta_id") REFERENCES "public"."contas"("conta_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."conta_tokens" ADD CONSTRAINT "conta_tokens_conta_id_fkey" FOREIGN KEY ("conta_id") REFERENCES "public"."contas"("conta_id") ON DELETE CASCADE ON UPDATE CASCADE;
