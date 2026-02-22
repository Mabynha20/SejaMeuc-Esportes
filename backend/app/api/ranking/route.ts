import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { Prisma } from "@prisma/client";

function cors(res: NextResponse) {
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return res;
}

export async function OPTIONS() {
    return cors(new NextResponse(null, { status: 204 }));
}

type EquipeComResultados = Prisma.EquipeGetPayload<{
    include: { resultados: true };
}>;

export async function GET() {
    const equipes: EquipeComResultados[] = await prisma.equipe.findMany({
        include: { resultados: true },
        orderBy: { id: "asc" },
    });

    const ranking = equipes
        .map((e) => ({
            equipeId: e.id,
            nome: e.nome,
            totalPontos: e.resultados.reduce(
                (sum: number, r: { pontos: number | null }) => sum + (r.pontos ?? 0),
                0
            ),
        }))
        .sort((a, b) => b.totalPontos - a.totalPontos);

    return cors(NextResponse.json(ranking));
}