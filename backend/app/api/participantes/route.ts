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

// GET /api/participantes?equipeId=1
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const equipeId = url.searchParams.get("equipeId");
    const where = equipeId ? { where: { equipeId: Number(equipeId) } } : {};
    const participantes = await prisma.participante.findMany({
      ...(where as any),
      orderBy: { id: "asc" },
    });
    return cors(NextResponse.json(participantes));
  } catch (err) {
    console.error('GET /api/participantes error:', err);
    return cors(NextResponse.json({ error: 'Internal Server Error', details: String(err) }, { status: 500 }));
  }
}

// POST /api/participantes
export async function POST(req: NextRequest) {
  try {
    const { nome, cpf, equipeId } = await req.json();
    if (!nome?.trim() || !cpf?.trim() || !equipeId) {
      return cors(NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 }));
    }
    const cpfClean = cpf.replace(/\D/g, "");
    if (cpfClean.length !== 11) {
      return cors(NextResponse.json({ error: "CPF deve ter 11 dígitos." }, { status: 400 }));
    }
    const existing = await prisma.participante.findUnique({ where: { cpf: cpfClean } });
    if (existing) {
      return cors(NextResponse.json({ error: "CPF já cadastrado no sistema." }, { status: 409 }));
    }
    const participante = await prisma.participante.create({
      data: { nome: nome.trim(), cpf: cpfClean, equipeId: Number(equipeId) },
    });
    return cors(NextResponse.json(participante, { status: 201 }));
  } catch (err) {
    console.error('POST /api/participantes error:', err);
    return cors(NextResponse.json({ error: 'Internal Server Error', details: String(err) }, { status: 500 }));
  }
}
