-- CreateTable
CREATE TABLE "Equipe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cidade" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Participante" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "equipeId" INTEGER NOT NULL,
    CONSTRAINT "Participante_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "Equipe" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Esporte" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "modalidade" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "horario" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Participacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "participanteId" INTEGER NOT NULL,
    "equipeId" INTEGER NOT NULL,
    "esporteId" INTEGER NOT NULL,
    CONSTRAINT "Participacao_participanteId_fkey" FOREIGN KEY ("participanteId") REFERENCES "Participante" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Participacao_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "Equipe" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Participacao_esporteId_fkey" FOREIGN KEY ("esporteId") REFERENCES "Esporte" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Resultado" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "equipeId" INTEGER NOT NULL,
    "esporteId" INTEGER NOT NULL,
    "pontos" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Resultado_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "Equipe" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Resultado_esporteId_fkey" FOREIGN KEY ("esporteId") REFERENCES "Esporte" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Participante_cpf_key" ON "Participante"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Participacao_participanteId_esporteId_key" ON "Participacao"("participanteId", "esporteId");

-- CreateIndex
CREATE UNIQUE INDEX "Resultado_equipeId_esporteId_key" ON "Resultado"("equipeId", "esporteId");
