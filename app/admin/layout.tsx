import type { Metadata } from "next";
import "./admin.css";

/**
 * Layout de l administration — bloc B11.
 *
 * admin.css est importe ICI et nulle part ailleurs. Depuis le layout racine il
 * s appliquerait a tout le site, pages publiques comprises.
 *
 * Ce layout n herite d AUCUN chrome public : loader, curseur, nav, chatbot et
 * scroll inertiel vivent dans app/(site)/layout.tsx, qui n est pas un ancetre
 * de /admin. C est toute la raison d etre du route group introduit juste avant.
 *
 * noindex, nofollow sur TOUTES les pages /admin, connexion comprise. Ce n est
 * pas une mesure de securite — c est l authentification qui protege — mais il
 * n y a aucune raison d exposer une administration a un moteur de recherche.
 */
export const metadata: Metadata = {
  title: "Administration — Nawa Corps",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="admin">{children}</div>;
}
