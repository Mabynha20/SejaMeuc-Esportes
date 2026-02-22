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

// GET /api/equipes/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const equipe = await prisma.equipe.findUnique({ where: { id: Number(id) } });
    if (!equipe) return cors(NextResponse.json({ error: "Não encontrado." }, { status: 404 }));
    return cors(NextResponse.json(equipe));
}

// PUT /api/equipes/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { nome, cidade } = await req.json();
    if (!nome?.trim() || !cidade?.trim()) {
        return cors(NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 }));
    }
    const equipe = await prisma.equipe.update({
        where: { id: Number(id) },
        data: { nome: nome.trim(), cidade: cidade.trim() },
    });
    return cors(NextResponse.json(equipe));
}

// DELETE /api/equipes/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await prisma.equipe.delete({ where: { id: Number(id) } });
    return cors(NextResponse.json({ ok: true }));
}
