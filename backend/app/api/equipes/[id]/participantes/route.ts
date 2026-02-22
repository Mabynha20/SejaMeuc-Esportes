import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

function cors(res: NextResponse) {
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return res;
}

export async function OPTIONS() {
    return cors(new NextResponse(null, { status: 204 }));
}

// GET /api/equipes/[id]/participantes
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const participantes = await prisma.participante.findMany({
        where: { equipeId: Number(id) },
        orderBy: { id: "asc" },
    });
    return cors(NextResponse.json(participantes));
}

// POST /api/equipes/[id]/participantes
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { nome, cpf } = await req.json();
    if (!nome?.trim() || !cpf?.trim()) {
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
        data: { nome: nome.trim(), cpf: cpfClean, equipeId: Number(id) },
    });
    return cors(NextResponse.json(participante, { status: 201 }));
}
