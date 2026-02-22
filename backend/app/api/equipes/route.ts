import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// Helper para CORS
function cors(res: NextResponse) {
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return res;
}

export async function OPTIONS() {
    return cors(new NextResponse(null, { status: 204 }));
}

// GET /api/equipes
export async function GET() {
    const equipes = await prisma.equipe.findMany({ orderBy: { id: "asc" } });
    return cors(NextResponse.json(equipes));
}

// POST /api/equipes
export async function POST(req: NextRequest) {
    const { nome, cidade } = await req.json();
    if (!nome?.trim() || !cidade?.trim()) {
        return cors(NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 }));
    }
    const equipe = await prisma.equipe.create({ data: { nome: nome.trim(), cidade: cidade.trim() } });
    return cors(NextResponse.json(equipe, { status: 201 }));
}
