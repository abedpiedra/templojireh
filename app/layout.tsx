import type { Metadata, Viewport } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

// Nunito Sans: humanista, con eje optico real (opsz), asi la letra cambia de
// forma segun el tamano en vez de escalarse igual en todos los niveles.
// Se carga con el pipeline de Next: sin salto de layout y con `display: swap`.
const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-brand",
  // Next no tiene metricas de ajuste para esta variable; el respaldo se
  // declara a mano y se evita el aviso de override.
  adjustFontFallback: false,
  fallback: ["-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
});

// La barra del navegador toma el negro del isotipo: el chrome del sistema
// se integra con la pagina en lugar de cortarla.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#101012" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "Templo Jireh",
    template: "%s | Templo Jireh",
  },
  description:
    "Templo Jireh - Iglesia cristiana evangélica en La Granja, Santiago de Chile. Cultos, sermones, jóvenes cristianos y escuela dominical. Pastor Luis Luengo. ¡Te esperamos!",
  keywords: [
    "Templo Jireh",
    "Jireh",
    "Iglesia Jireh",
    "Jireh Templo",
    "iglesia cristiana",
    "iglesia evangélica",
    "iglesia La Granja",
    "templo cristiano Santiago",
    "sermones cristianos",
    "jóvenes cristianos",
    "culto dominical",
    "escuela dominical",
    "Pastor Luis Luengo",
  ],
  authors: [{ name: "Templo Jireh" }],
  creator: "Templo Jireh",
  publisher: "Templo Jireh",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  metadataBase: new URL("https://templojireh.cl"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Templo Jireh | Iglesia Cristiana en La Granja",
    description:
      "Iglesia cristiana evangélica en La Granja, Santiago. Cultos, sermones y comunidad cristiana. ¡Te esperamos!",
    url: "https://templojireh.cl",
    siteName: "Templo Jireh",
    locale: "es_CL",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Templo Jireh Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Templo Jireh | Iglesia Cristiana",
    description:
      "Iglesia cristiana evangélica en La Granja, Santiago de Chile.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "pendiente", // Reemplazar con el código de verificación de Google
  },
};

// JSON-LD Structured Data para la Iglesia
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Church",
  name: "Templo Jireh",
  alternateName: ["Iglesia Jireh", "Jireh Templo", "Jireh"],
  description:
    "Iglesia cristiana evangélica comprometida con llevar el mensaje de esperanza y salvación.",
  url: "https://templojireh.cl",
  logo: "https://templojireh.cl/logo.png",
  image: "https://templojireh.cl/iglesia.png",
  telephone: "+56957268552",
  email: "jirehchurch52@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Presidente Alessandri #0498",
    addressLocality: "La Granja",
    addressRegion: "Región Metropolitana",
    postalCode: "8780392",
    addressCountry: "CL",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -33.5225,
    longitude: -70.6225,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "10:00",
      closes: "13:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Thursday"],
      opens: "20:00",
      closes: "21:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Friday",
      opens: "20:00",
      closes: "21:30",
    },
  ],
  sameAs: [
    "https://www.facebook.com/Jirehchurch0498",
    "https://www.youtube.com/@TemploJirehTV",
    "https://www.instagram.com/templo_jireh/",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={nunitoSans.variable}>
      <head>
        {/* Iconografia servida desde el propio dominio: sin CDN de terceros
            bloqueando el primer pintado. */}
        <link
          rel="stylesheet"
          href="/vendor/fontawesome/css/all.min.css"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
