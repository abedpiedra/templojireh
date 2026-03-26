"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const asuntoTexto = formData.asunto || "Consulta general";
    const mensaje = `*Mensaje desde la web de Templo Jireh*%0A%0A*Nombre:* ${formData.nombre}%0A*Email:* ${formData.email}%0A*Teléfono:* ${formData.telefono || "No proporcionado"}%0A*Asunto:* ${asuntoTexto}%0A%0A*Mensaje:*%0A${formData.mensaje}`;

    const whatsappUrl = `https://wa.me/56957268552?text=${mensaje}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <Header />
      <PageHeader title="Contacto" breadcrumb="Contacto" />

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              {[
                {
                  icon: "fa-phone",
                  title: "Teléfono",
                  lines: ["+56 9 5726 8552"],
                },
                {
                  icon: "fa-envelope",
                  title: "Email",
                  lines: ["jirehchurch52@gmail.com"],
                },
                {
                  icon: "fa-clock",
                  title: "Horarios de Servicio",
                  lines: ["Domingos: 11:15 AM", "Martes y Jueves: 8:00 PM"],
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-lg p-6 flex gap-5"
                >
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <i className={`fas ${item.icon} text-white text-xl`}></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark mb-1">
                      {item.title}
                    </h4>
                    {item.lines.map((line, j) => (
                      <p key={j} className="text-gray-600 text-sm">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
              {/* Map */}
              <div className="bg-white rounded-xl shadow-lg p-4 overflow-hidden">
                <div className="flex gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-map-marker-alt text-white"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark">Dirección</h4>
                    <p className="text-gray-600 text-sm">
                      Presidente Alessandri #0498, La Granja
                    </p>
                  </div>
                </div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3326.1980729433344!2d-70.63261024089293!3d-33.52223546442555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662da85b6889b65%3A0x227e972b26c2563c!2sTemplo%20Jireh!5e0!3m2!1ses-419!2scl!4v1774500116488!5m2!1ses-419!2scl"
                  className="w-full h-[200px] rounded-lg border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-dark mb-6">
                Envíanos un Mensaje
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) =>
                        setFormData({ ...formData, nombre: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) =>
                        setFormData({ ...formData, telefono: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Asunto
                    </label>
                    <select
                      value={formData.asunto}
                      onChange={(e) =>
                        setFormData({ ...formData, asunto: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="informacion">Información General</option>
                      <option value="oracion">Petición de Oración</option>
                      <option value="visita">Solicitud de Evento</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Mensaje
                  </label>
                  <textarea
                    value={formData.mensaje}
                    onChange={(e) =>
                      setFormData({ ...formData, mensaje: e.target.value })
                    }
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors resize-none"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full btn-primary py-4 flex items-center justify-center gap-2"
                >
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
