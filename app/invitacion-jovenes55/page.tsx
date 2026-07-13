import type { Metadata } from "next";
import InvitationJovenes55Client from "./InvitationJovenes55Client";
import "./styles.css";

export const metadata: Metadata = {
  title: "Invitación Jóvenes 55",
  description:
    "Invitación digital para la reunión de jóvenes por aniversario 55 de Templo Jireh.",
  alternates: {
    canonical: "/invitacion-jovenes55",
  },
  openGraph: {
    title: "Invitación Jóvenes 55 | Templo Jireh",
    description:
      "Jóvenes, celebremos a Cristo juntos en gratitud por 55 años de la fidelidad de Dios.",
    url: "https://templojireh.cl/invitacion-jovenes55",
    siteName: "Templo Jireh",
    locale: "es_CL",
    type: "website",
    images: [
      {
        url: "/invitacion-jovenes55/assets/logos/aniversario-55.png",
        width: 1024,
        height: 1024,
        alt: "55 años Templo Jireh",
      },
    ],
  },
};

export default function InvitacionJovenes55Page() {
  return <InvitationJovenes55Client />;
}
