import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

function cors(res: NextResponse) {
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return res;
}

export async function OPTIONS() {
    return cors(new NextResponse(null, { status: 204 }));
}

// GET /api/esportes/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const esporte = await prisma.esporte.findUnique({ where: { id: Number(id) } });
    if (!esporte) return cors(NextResponse.json({ error: "Não encontrado." }, { status: 404 }));
    return cors(NextResponse.json(esporte));
}

// PUT /api/esportes/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { modalidade, nome, data, horario } = await req.json();
    if (!modalidade?.trim() || !nome?.trim() || !data?.trim() || !horario?.trim()) {
        return cors(NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 }));
    }
    const existing = await prisma.esporte.findFirst({
        where: { nome: nome.trim(), data: data.trim(), horario: horario.trim(), NOT: { id: Number(id) } },
    });
    if (existing) {
        return cors(NextResponse.json({ error: "Já existe esporte com mesmo nome, data e horário." }, { status: 409 }));
    }
    const esporte = await prisma.esporte.update({
        where: { id: Number(id) },
        data: { modalidade: modalidade.trim(), nome: nome.trim(), data: data.trim(), horario: horario.trim() },
    });
    return cors(NextResponse.json(esporte));
}

// DELETE /api/esportes/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await prisma.esporte.delete({ where: { id: Number(id) } });
    return cors(NextResponse.json({ ok: true }));
}
