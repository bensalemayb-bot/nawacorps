import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

/**
 * PATCH /api/admin/leads/[id] — change le statut d un lead.
 *
 * La garde passe AVANT la lecture du corps : un non-authentifie ne doit pas
 * meme obtenir la validation de son JSON, qui lui apprendrait la forme
 * attendue.
 */

const SchemaStatut = z.object({
  status: z.enum(["NEW", "CONTACTED", "QUOTED", "WON", "LOST"]),
});

export async function PATCH(req: Request, ctx: RouteContext<"/api/admin/leads/[id]">) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await ctx.params;

  let brut: unknown;
  try {
    brut = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête illisible." }, { status: 400 });
  }

  const analyse = SchemaStatut.safeParse(brut);
  if (!analyse.success) {
    return NextResponse.json(
      {
        error: "Statut invalide.",
        issues: analyse.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      },
      { status: 400 },
    );
  }

  const lead = await prisma.lead.update({
    where: { id },
    data: { status: analyse.data.status },
    select: { id: true, status: true },
  });

  return NextResponse.json({ ok: true, lead }, { status: 200 });
}
