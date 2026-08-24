import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

/**
 * PATCH /api/admin/services/[id] — prix, visibilite, ordre.
 *
 * COHERENCE IMPOSEE : un service « sur devis » ne peut pas porter de prix. Si
 * le priceType FINAL vaut QUOTE, priceCents est force a null — quoi qu ait
 * envoye le formulaire.
 *
 * « Final » et non « envoye » : le type peut venir de la requete OU rester
 * celui de la base quand la requete n y touche pas. Ne regarder que le corps
 * laisserait passer un prix pose sur un service deja QUOTE, et ce prix
 * remonterait tel quel dans le prompt du chatbot, qui n a le droit de citer
 * que des montants du catalogue. La coherence se joue ici, pas a l affichage.
 */

const SchemaService = z
  .object({
    priceCents: z.number().int().min(0).max(100_000_00).nullable().optional(),
    priceType: z.enum(["FIXED", "FROM", "QUOTE"]).optional(),
    visible: z.boolean().optional(),
    sortOrder: z.number().int().min(0).max(9999).optional(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: "Aucun champ à modifier." });

export async function PATCH(req: Request, ctx: RouteContext<"/api/admin/services/[id]">) {
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

  const analyse = SchemaService.safeParse(brut);
  if (!analyse.success) {
    return NextResponse.json(
      {
        error: "Données invalides.",
        issues: analyse.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      },
      { status: 400 },
    );
  }

  const actuel = await prisma.service.findUnique({ where: { id }, select: { priceType: true } });
  if (!actuel) {
    return NextResponse.json({ error: "Service introuvable." }, { status: 404 });
  }

  const donnees = { ...analyse.data };
  const typeFinal = donnees.priceType ?? actuel.priceType;
  if (typeFinal === "QUOTE") {
    donnees.priceCents = null;
  }

  const service = await prisma.service.update({
    where: { id },
    data: donnees,
    select: { id: true, name: true, priceType: true, priceCents: true, visible: true, sortOrder: true },
  });

  return NextResponse.json({ ok: true, service }, { status: 200 });
}
