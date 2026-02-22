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

// PUT /api/participantes/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { nome, cpf } = await req.json();
    if (!nome?.trim() || !cpf?.trim()) {
        return cors(NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 }));
    }
    const cpfClean = cpf.replace(/\D/g, "");
    if (cpfClean.length !== 11) {
        return cors(NextResponse.json({ error: "CPF deve ter 11 dígitos." }, { status: 400 }));
    }
    const existing = await prisma.participante.findFirst({
        where: { cpf: cpfClean, NOT: { id: Number(id) } },
    });
    if (existing) {
        return cors(NextResponse.json({ error: "CPF já cadastrado." }, { status: 409 }));
    }
    const participante = await prisma.participante.update({
        where: { id: Number(id) },
        data: { nome: nome.trim(), cpf: cpfClean },
    });
    return cors(NextResponse.json(participante));
}

// DELETE /api/participantes/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await prisma.participante.delete({ where: { id: Number(id) } });
    return cors(NextResponse.json({ ok: true }));
}
