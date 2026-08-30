import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { GUION_SIN_DESTELLO } from "@/lib/tema";

// Montserrat: la tipografia que define el manual de marca.
// Se carga con el pipeline de Next: sin salto de layout y con `display: swap`.
const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-brand",
  fallback: ["-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
});

// La barra del navegador toma el negro del isotipo: el chrome del sistema
// se integra con la pagina en lugar de cortarla.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#d6122f" },
    { media: "(prefers-color-scheme: dark)", color: "#121216" },
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
  // Iconos oficiales del kit de marca, en los tamanos que pide cada sistema
  icons: {
    icon: [
      // El SVG va primero: los navegadores modernos lo prefieren y se ve
      // nítido en cualquier tamaño. El .ico queda de respaldo.
      { url: "/icono.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icono-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/icono-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/icono-256x256.png", type: "image/png", sizes: "256x256" },
    ],
    apple: [{ url: "/apple-touch-icon-180x180.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
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
        url: "/og-image-1200x630.png",
        width: 1200,
        height: 630,
        alt: "Templo Jireh - Iglesia Cristiana Pentecostal de Chile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Templo Jireh | Iglesia Cristiana",
    description:
      "Iglesia cristiana evangélica en La Granja, Santiago de Chile.",
    images: ["/og-image-1200x630.png"],
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
  logo: "https://templojireh.cl/icono-256x256.png",
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
    <html
      lang="es"
      className={montserrat.variable}
      // El guion de tema toca esta clase antes de hidratar; sin esto React
      // avisa de una discrepancia que en realidad es intencional.
      suppressHydrationWarning
    >
      <head>
        {/* Antes que cualquier estilo: fija el tema para que no haya un
            destello claro al cargar de noche. */}
        <script dangerouslySetInnerHTML={{ __html: GUION_SIN_DESTELLO }} />
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
