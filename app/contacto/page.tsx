"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";

type Campo = "nombre" | "email" | "telefono" | "asunto" | "mensaje";

const datosContacto = [
  {
    icon: "fa-phone",
    title: "Teléfono",
    lines: ["+56 9 5726 8552"],
    href: "tel:+56957268552",
  },
  {
    icon: "fa-envelope",
    title: "Email",
    lines: ["jirehchurch52@gmail.com"],
    href: "mailto:jirehchurch52@gmail.com",
  },
  {
    icon: "fa-clock",
    title: "Horarios de servicio",
    lines: ["Domingos · 11:15", "Martes y jueves · 20:00"],
    href: null,
  },
];

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });
  const [tocados, setTocados] = useState<Partial<Record<Campo, boolean>>>({});

  // Validacion inline: se avisa al salir del campo, no al enviar
  const errores: Partial<Record<Campo, string>> = {};
  if (!formData.nombre.trim()) errores.nombre = "Necesitamos tu nombre.";
  if (!formData.email.trim()) errores.email = "Necesitamos tu email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
    errores.email = "Revisa el formato del email.";
  if (!formData.mensaje.trim()) errores.mensaje = "Escribe tu mensaje.";

  const mostrar = (campo: Campo) => (tocados[campo] ? errores[campo] : undefined);
  const completo = Object.keys(errores).length === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completo) {
      setTocados({ nombre: true, email: true, mensaje: true });
      return;
    }

    const asuntoTexto = formData.asunto || "Consulta general";
    const texto = [
      "*Mensaje desde la web de Templo Jireh*",
      "",
      `*Nombre:* ${formData.nombre}`,
      `*Email:* ${formData.email}`,
      `*Teléfono:* ${formData.telefono || "No proporcionado"}`,
      `*Asunto:* ${asuntoTexto}`,
      "",
      "*Mensaje:*",
      formData.mensaje,
    ].join("\n");

    // Se codifica el texto completo: asi no se rompe con &, # o saltos de linea
    window.open(
      `https://wa.me/56957268552?text=${encodeURIComponent(texto)}`,
      "_blank",
      "noopener",
    );
  };

  return (
    <>
      <Header />
      <PageHeader
        title="Contacto"
        breadcrumb="Contacto"
        description="Escríbenos, llámanos o visítanos. Respondemos por WhatsApp."
      />

      <section className="bg-canvas-sunken seccion">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            {/* Datos: cada uno accionable, junto a lo que afecta */}
            <div className="space-y-4">
              {datosContacto.map((item) => {
                const contenido = (
                  <>
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-tint">
                      <i className={`fas ${item.icon} text-primary`}></i>
                    </div>
                    <div>
                      <h2 className="type-title-3 text-dark">{item.title}</h2>
                      {item.lines.map((line) => (
                        <p key={line} className="type-footnote text-ink-secondary">
                          {line}
                        </p>
                      ))}
                    </div>
                  </>
                );
                return item.href ? (
                  <a
                    key={item.title}
                    href={item.href}
                    className="card card-interactive flex gap-4 p-5"
                  >
                    {contenido}
                  </a>
                ) : (
                  <div key={item.title} className="card flex gap-4 p-5">
                    {contenido}
                  </div>
                );
              })}

              <div className="card p-5">
                <a
                  href="https://maps.google.com/?q=Presidente+Alessandri+0498,+La+Granja"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pressable mb-4 flex gap-4"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-tint">
                    <i className="fas fa-map-marker-alt text-primary"></i>
                  </div>
                  <div>
                    <h2 className="type-title-3 text-dark">Dirección</h2>
                    <p className="type-footnote text-ink-secondary">
                      Presidente Alessandri #0498, La Granja
                    </p>
                  </div>
                </a>
                <iframe
                  title="Ubicación de Templo Jireh"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3326.1980729433344!2d-70.63261024089293!3d-33.52223546442555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662da85b6889b65%3A0x227e972b26c2563c!2sTemplo%20Jireh!5e0!3m2!1ses-419!2scl!4v1774500116488!5m2!1ses-419!2scl"
                  className="h-[220px] w-full rounded-control border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            {/* Formulario */}
            <div className="card p-6 md:p-8">
              <h2 className="type-title-2 text-dark">Envíanos un mensaje</h2>
              <p className="type-footnote text-ink-tertiary mt-1 mb-6">
                Se abrirá WhatsApp con el mensaje ya escrito para que lo
                revises antes de enviarlo.
              </p>

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="field-label" htmlFor="nombre">
                      Nombre
                    </label>
                    <input
                      id="nombre"
                      type="text"
                      className="field"
                      value={formData.nombre}
                      aria-invalid={Boolean(mostrar("nombre"))}
                      aria-describedby={mostrar("nombre") ? "err-nombre" : undefined}
                      onChange={(e) =>
                        setFormData({ ...formData, nombre: e.target.value })
                      }
                      onBlur={() => setTocados((t) => ({ ...t, nombre: true }))}
                    />
                    {mostrar("nombre") && (
                      <p id="err-nombre" className="type-caption text-primary mt-1.5">
                        {errores.nombre}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="field-label" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      inputMode="email"
                      className="field"
                      value={formData.email}
                      aria-invalid={Boolean(mostrar("email"))}
                      aria-describedby={mostrar("email") ? "err-email" : undefined}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      onBlur={() => setTocados((t) => ({ ...t, email: true }))}
                    />
                    {mostrar("email") && (
                      <p id="err-email" className="type-caption text-primary mt-1.5">
                        {errores.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="field-label" htmlFor="telefono">
                      Teléfono <span className="font-normal text-ink-tertiary">(opcional)</span>
                    </label>
                    <input
                      id="telefono"
                      type="tel"
                      inputMode="tel"
                      className="field"
                      value={formData.telefono}
                      onChange={(e) =>
                        setFormData({ ...formData, telefono: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="asunto">
                      Asunto
                    </label>
                    <select
                      id="asunto"
                      className="field"
                      value={formData.asunto}
                      onChange={(e) =>
                        setFormData({ ...formData, asunto: e.target.value })
                      }
                    >
                      <option value="">Consulta general</option>
                      <option value="Información general">Información general</option>
                      <option value="Petición de oración">Petición de oración</option>
                      <option value="Solicitud de evento">Solicitud de evento</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="field-label" htmlFor="mensaje">
                    Mensaje
                  </label>
                  <textarea
                    id="mensaje"
                    rows={5}
                    className="field resize-none"
                    value={formData.mensaje}
                    aria-invalid={Boolean(mostrar("mensaje"))}
                    aria-describedby={mostrar("mensaje") ? "err-mensaje" : undefined}
                    onChange={(e) =>
                      setFormData({ ...formData, mensaje: e.target.value })
                    }
                    onBlur={() => setTocados((t) => ({ ...t, mensaje: true }))}
                  ></textarea>
                  {mostrar("mensaje") && (
                    <p id="err-mensaje" className="type-caption text-primary mt-1.5">
                      {errores.mensaje}
                    </p>
                  )}
                </div>

                <button type="submit" className="btn-primary w-full py-4">
                  <i className="fab fa-whatsapp text-xl"></i> Enviar por WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
