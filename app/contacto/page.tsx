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
    // Aquí iría la lógica para enviar el formulario
    alert("Mensaje enviado correctamente. Nos pondremos en contacto pronto.");
    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      asunto: "",
      mensaje: "",
    });
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
                  icon: "fa-map-marker-alt",
                  title: "Dirección",
                  lines: ["Presidente Alessandri #0498", "La Granja, Santiago"],
                },
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
                      <option value="visita">Planificar una Visita</option>
                      <option value="voluntario">Quiero ser Voluntario</option>
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
                <button type="submit" className="w-full btn-primary py-4">
                  <i className="fas fa-paper-plane mr-2"></i> Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Service Times */}
      <section className="bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4">
            {[
              {
                icon: "fa-sun",
                title: "Servicio Dominical",
                time: "Domingos 10:00 AM",
              },
              {
                icon: "fa-book-bible",
                title: "Estudio Bíblico",
                time: "Miércoles 7:00 PM",
              },
              {
                icon: "fa-praying-hands",
                title: "Oración",
                time: "Viernes 7:00 PM",
              },
              { icon: "fa-users", title: "Jóvenes", time: "Sábados 6:00 PM" },
            ].map((item, i) => (
              <div
                key={i}
                className="text-white text-center py-10 px-6 border-r border-white/20 last:border-r-0"
              >
                <i className={`fas ${item.icon} text-4xl mb-4`}></i>
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-sm opacity-90">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="h-[400px] bg-gray-300">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095919355!2d-74.00425878428698!3d40.74076904379132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ0JzI3LjYiTiA3NMKwMDAnMDcuNyJX!5e0!3m2!1sen!2sus!4v1234567890"
          className="w-full h-full border-0"
          loading="lazy"
        ></iframe>
      </section>

      <Footer />
    </>
  );
}
