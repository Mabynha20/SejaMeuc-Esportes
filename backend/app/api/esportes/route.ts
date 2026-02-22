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

// GET /api/esportes
export async function GET() {
    const esportes = await prisma.esporte.findMany({ orderBy: { id: "asc" } });
    return cors(NextResponse.json(esportes));
}

// POST /api/esportes
export async function POST(req: NextRequest) {
    const { modalidade, nome, data, horario } = await req.json();
    if (!modalidade?.trim() || !nome?.trim() || !data?.trim() || !horario?.trim()) {
        return cors(NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 }));
    }
    const existing = await prisma.esporte.findFirst({
        where: { nome: nome.trim(), data: data.trim(), horario: horario.trim() },
    });
    if (existing) {
        return cors(NextResponse.json({ error: "Já existe esporte com mesmo nome, data e horário." }, { status: 409 }));
    }
    const esporte = await prisma.esporte.create({
        data: { modalidade: modalidade.trim(), nome: nome.trim(), data: data.trim(), horario: horario.trim() },
    });
    return cors(NextResponse.json(esporte, { status: 201 }));
}
