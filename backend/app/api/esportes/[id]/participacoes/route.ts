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

// GET /api/esportes/[id]/participacoes
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const participacoes = await prisma.participacao.findMany({
        where: { esporteId: Number(id) },
        orderBy: { id: "asc" },
    });
    return cors(NextResponse.json(participacoes));
}

// POST /api/esportes/[id]/participacoes — adiciona array de participanteIds
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { participanteIds } = await req.json() as { participanteIds: number[] };
    const esporteId = Number(id);

    const results = [];
    for (const pid of participanteIds) {
        const participante = await prisma.participante.findUnique({ where: { id: pid } });
        if (!participante) continue;
        const existing = await prisma.participacao.findUnique({
            where: { participanteId_esporteId: { participanteId: pid, esporteId } },
        });
        if (existing) continue;
        const p = await prisma.participacao.create({
            data: { participanteId: pid, equipeId: participante.equipeId, esporteId },
        });
        results.push(p);
    }
    return cors(NextResponse.json(results, { status: 201 }));
}
