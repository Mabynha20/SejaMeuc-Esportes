import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

function cors(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }));
}

// GET /api/participacoes?esporteId=1
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const esporteId = url.searchParams.get("esporteId");
  const where = esporteId ? { where: { esporteId: Number(esporteId) } } : {};
  const participacoes = await prisma.participacao.findMany({
    ...(where as any),
    orderBy: { id: "asc" },
  });
  return cors(NextResponse.json(participacoes));
}

// POST /api/participacoes
export async function POST(req: NextRequest) {
  const { participanteId, equipeId, esporteId } = await req.json();
  if (!participanteId || !equipeId || !esporteId) {
    return cors(NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 }));
  }
  const existing = await prisma.participacao.findUnique({ where: { participanteId_esporteId: { participanteId: Number(participanteId), esporteId: Number(esporteId) } } }).catch(() => null);
  if (existing) {
    return cors(NextResponse.json({ error: "Participação já registrada para este participante nesse esporte." }, { status: 409 }));
  }
  const participacao = await prisma.participacao.create({
    data: { participanteId: Number(participanteId), equipeId: Number(equipeId), esporteId: Number(esporteId) },
  });
  return cors(NextResponse.json(participacao, { status: 201 }));
}
