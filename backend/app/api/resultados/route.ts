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

// GET /api/resultados?esporteId=...
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const esporteId = searchParams.get("esporteId");
    const resultados = await prisma.resultado.findMany({
        where: esporteId ? { esporteId: Number(esporteId) } : undefined,
        orderBy: { id: "asc" },
    });
    return cors(NextResponse.json(resultados));
}

// POST /api/resultados — upsert (cria ou atualiza)
export async function POST(req: NextRequest) {
    const { equipeId, esporteId, pontos } = await req.json();
    const resultado = await prisma.resultado.upsert({
        where: { equipeId_esporteId: { equipeId: Number(equipeId), esporteId: Number(esporteId) } },
        update: { pontos: Number(pontos) },
        create: { equipeId: Number(equipeId), esporteId: Number(esporteId), pontos: Number(pontos) },
    });
    return cors(NextResponse.json(resultado, { status: 201 }));
}
