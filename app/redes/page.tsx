"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";

export default function RedesSocialesPage() {
  const [activeTab, setActiveTab] = useState<
    "todos" | "instagram" | "facebook"
  >("todos");

  const instagramAccounts = [
    {
      username: "templo_jireh",
      name: "Templo Jireh",
      url: "https://www.instagram.com/templo_jireh/",
      description: "Cuenta oficial de Templo Jireh",
    },
    {
      username: "jovenestj_",
      name: "Jóvenes Templo Jireh",
      url: "https://www.instagram.com/jovenestj_/",
      description: "Ministerio de jóvenes",
    },
  ];

  const facebookPage = {
    name: "Templo Jireh",
    username: "Jirehchurch0498",
    url: "https://www.facebook.com/Jirehchurch0498",
  };

  return (
    <>
      <Header />
      <PageHeader title="Redes Sociales" breadcrumb="Redes Sociales" />

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Instagram Section */}
          {(activeTab === "todos" || activeTab === "instagram") && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <i className="fab fa-instagram text-white text-xl"></i>
                </div>
                <h2 className="text-2xl font-bold text-dark">Instagram</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {instagramAccounts.map((account) => (
                  <div
                    key={account.username}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="bg-primary p-6 text-white">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                          <i className="fab fa-instagram text-3xl"></i>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{account.name}</h3>
                          <p className="opacity-90">@{account.username}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-gray-600 mb-4">
                        {account.description}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Visita nuestro perfil para ver las últimas publicaciones
                      </p>
                      <a
                        href={account.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-primary text-white text-center py-3 rounded-md font-medium hover:bg-primary-dark transition-colors"
                      >
                        <i className="fab fa-instagram mr-2"></i>
                        Ver en Instagram
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Facebook Section */}
          {(activeTab === "todos" || activeTab === "facebook") && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <i className="fab fa-facebook-f text-white text-xl"></i>
                </div>
                <h2 className="text-2xl font-bold text-dark">Facebook</h2>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header card */}
                <div className="bg-blue-600 p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <i className="fab fa-facebook-f text-3xl"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{facebookPage.name}</h3>
                      <p className="opacity-90">@{facebookPage.username}</p>
                    </div>
                  </div>
                </div>

                {/* Facebook Plugin - solo posts */}
                <div className="w-full">
                  <iframe
                    src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(facebookPage.url)}&tabs=timeline&width=800&height=500&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=false`}
                    width="100%"
                    height="500"
                    style={{
                      border: "none",
                      overflow: "hidden",
                      width: "100%",
                    }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  ></iframe>
                </div>

                <div className="p-4 border-t">
                  <a
                    href={facebookPage.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-blue-600 text-white text-center py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
                  >
                    <i className="fab fa-facebook-f mr-2"></i>
                    Ver en Facebook
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
