"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import VideoModal, { type VideoEnReproduccion } from "@/components/VideoModal";
import { etiquetaProximoServicio } from "@/lib/horarios";
import EstadoVacio from "@/components/EstadoVacio";
import BandaCta from "@/components/BandaCta";

interface LiveData {
  isLive: boolean;
  videoId?: string;
  title?: string;
  thumbnail?: string;
  description?: string;
}

interface Video {
  videoId: string;
  title: string;
  thumbnail: string;
  description: string;
  publishedAt: string;
}

type FilterType = "todos" | "semana" | "mes" | "fecha";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const filtros: { key: FilterType; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "semana", label: "Esta semana" },
  { key: "mes", label: "Este mes" },
  { key: "fecha", label: "Por fecha" },
];

export default function EnVivoPage() {
  const [liveData, setLiveData] = useState<LiveData>({ isLive: false });
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("todos");
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const defaultYears = useMemo(
    () => Array.from({ length: currentYear - 2022 }, (_, i) => currentYear - i),
    [currentYear],
  );
  const [availableYears, setAvailableYears] = useState<number[]>(defaultYears);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [enReproduccion, setEnReproduccion] =
    useState<VideoEnReproduccion | null>(null);
  const [proximo, setProximo] = useState<{
    nombre: string;
    cuando: string;
  } | null>(null);

  // La hora local solo existe en el navegador
  useEffect(() => {
    const etiqueta = etiquetaProximoServicio();
    if (etiqueta) setProximo({ nombre: etiqueta.nombre, cuando: etiqueta.cuando });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [liveRes, videosRes] = await Promise.all([
          fetch("/api/youtube/live"),
          fetch("/api/youtube/videos"),
        ]);

        const liveJson = await liveRes.json();
        const videosJson = await videosRes.json();

        setLiveData(liveJson);
        const videoList: Video[] = videosJson.videos || [];
        setVideos(videoList);

        if (videoList.length > 0) {
          const yearsFromVideos = videoList.map((v) =>
            new Date(v.publishedAt).getFullYear(),
          );
          const allYears = new Set<number>([...yearsFromVideos, ...defaultYears]);
          setAvailableYears(Array.from(allYears).sort((a, b) => b - a));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/youtube/live");
        const data = await res.json();
        setLiveData(data);
      } catch (error) {
        console.error("Error checking live status:", error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [defaultYears]);

  // El resultado se deriva del estado: una sola fuente de verdad
  const filteredVideos = useMemo(() => {
    const now = Date.now();
    switch (activeFilter) {
      case "semana": {
        const desde = now - 7 * 24 * 60 * 60 * 1000;
        return videos.filter((v) => new Date(v.publishedAt).getTime() >= desde);
      }
      case "mes": {
        const desde = now - 30 * 24 * 60 * 60 * 1000;
        return videos.filter((v) => new Date(v.publishedAt).getTime() >= desde);
      }
      case "fecha":
        return videos.filter((v) => {
          const date = new Date(v.publishedAt);
          return (
            date.getFullYear() === selectedYear &&
            (selectedMonth === null || date.getMonth() === selectedMonth)
          );
        });
      default:
        return videos;
    }
  }, [videos, activeFilter, selectedYear, selectedMonth]);

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    if (filter !== "fecha") setSelectedMonth(null);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("es-CL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const scroll = (direction: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;
    // El desplazamiento se mide en tarjetas visibles, no en pixeles fijos
    const card = el.firstElementChild as HTMLElement | null;
    const amount = card ? card.offsetWidth + 24 : 320;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Header />
      <PageHeader
        title="Transmisiones"
        breadcrumb="Transmisiones"
        description="El culto en vivo cuando estamos al aire, y el archivo completo cuando no."
      />

      <section className="bg-canvas-sunken seccion">
        <div className="container mx-auto px-4">
          {loading ? (
            // Esqueleto con la forma del contenido que viene, no un spinner suelto
            <div className="mx-auto max-w-4xl">
              <div className="aspect-video animate-pulse rounded-card bg-fill/30" />
              <div className="mt-4 h-6 w-2/3 animate-pulse rounded-full bg-fill/30" />
              <div className="mt-2 h-4 w-1/3 animate-pulse rounded-full bg-fill/20" />
            </div>
          ) : liveData.isLive ? (
            <div className="mx-auto max-w-4xl">
              <div className="overflow-hidden rounded-card shadow-floating">
                <div className="flex items-center gap-2 bg-primary px-4 py-2.5 text-white">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white"></span>
                  </span>
                  <span className="type-caption font-bold uppercase tracking-[0.08em]">
                    En vivo ahora
                  </span>
                </div>
                <div className="aspect-video bg-black">
                  <iframe
                    title={liveData.title || "Transmisión en vivo"}
                    src={`https://www.youtube.com/embed/${liveData.videoId}?autoplay=1`}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              <div className="card mt-4 p-6">
                <h2 className="type-title-2 text-ink">{liveData.title}</h2>
                {liveData.description && (
                  <p className="type-footnote text-ink-secondary mt-2 whitespace-pre-line">
                    {liveData.description}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="card mx-auto max-w-xl p-10 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-canvas-sunken">
                <i className="fas fa-video-slash text-xl text-ink-tertiary"></i>
              </div>
              <h2 className="type-title-2 text-ink">
                No hay transmisión en este momento
              </h2>
              {proximo ? (
                <p className="type-body text-ink-secondary mt-2">
                  La próxima reunión es{" "}
                  <strong className="text-ink">{proximo.nombre}</strong>,{" "}
                  {proximo.cuando}. Mientras tanto, puedes ver el archivo más
                  abajo.
                </p>
              ) : (
                <p className="type-footnote text-ink-secondary mt-2">
                  Mientras tanto, revisa el archivo más abajo.
                </p>
              )}
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a
                  href="https://www.youtube.com/@TemploJirehTV?sub_confirmation=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <i className="fab fa-youtube"></i> Avísame cuando transmitan
                </a>
                <a href="#archivo" className="btn-ghost">
                  Ver transmisiones anteriores
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="archivo" className="seccion scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="mb-6 max-w-xl">
            <p className="section-subtitle">Archivo</p>
            <h2 className="section-title mb-0">Transmisiones anteriores</h2>
            {filteredVideos.length > 0 && (
              <p className="type-footnote text-ink-tertiary mt-2">
                {filteredVideos.length}{" "}
                {filteredVideos.length === 1 ? "transmisión" : "transmisiones"}
                {activeFilter !== "todos" && " en este período"}
              </p>
            )}
          </div>

          {/* Control segmentado: el estado activo es evidente */}
          {/* Cuatro opciones caben en dos filas: en una tira horizontal
              la última quedaba cortada contra el borde y parecía un error */}
          <div
            role="tablist"
            aria-label="Filtrar transmisiones"
            className="mb-5 flex flex-wrap gap-2"
          >
            {filtros.map((filter) => {
              const activo = activeFilter === filter.key;
              return (
                <button
                  key={filter.key}
                  type="button"
                  role="tab"
                  aria-selected={activo}
                  onPointerDown={() => handleFilterChange(filter.key)}
                  onClick={() => handleFilterChange(filter.key)}
                  className={`pressable flex min-h-[44px] items-center rounded-full px-5 type-footnote font-medium ${
                    activo
                      ? "bg-dark text-white shadow-raised"
                      : "bg-canvas-sunken text-ink-secondary hover:text-ink"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          {/* Los controles de fecha aparecen junto al filtro que los activa */}
          {activeFilter === "fecha" && (
            <div className="mb-8 flex flex-wrap gap-4 animate-rise-in">
              <div>
                <label className="field-label" htmlFor="anio">
                  Año
                </label>
                <select
                  id="anio"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="field"
                >
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label" htmlFor="mes">
                  Mes
                </label>
                <select
                  id="mes"
                  value={selectedMonth ?? ""}
                  onChange={(e) =>
                    setSelectedMonth(
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                  className="field"
                >
                  <option value="">Todos los meses</option>
                  {MESES.map((month, index) => (
                    <option key={month} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {filteredVideos.length === 0 ? (
            <EstadoVacio
              icono="fab fa-youtube"
              texto="No hay transmisiones en este período."
              compacto
            >
              {activeFilter !== "todos" && (
                <button
                  type="button"
                  onPointerDown={() => handleFilterChange("todos")}
                  onClick={() => handleFilterChange("todos")}
                  className="btn-ghost"
                >
                  Ver todas
                </button>
              )}
            </EstadoVacio>
          ) : (
            <div className="relative">
              {filteredVideos.length > 3 && (
                <>
                  <button
                    type="button"
                    aria-label="Anterior"
                    onPointerDown={() => scroll("left")}
                    className="pressable material-thick absolute left-0 top-1/2 z-10 -ml-5 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full shadow-floating md:flex"
                  >
                    <i className="fas fa-chevron-left text-ink"></i>
                  </button>
                  <button
                    type="button"
                    aria-label="Siguiente"
                    onPointerDown={() => scroll("right")}
                    className="pressable material-thick absolute right-0 top-1/2 z-10 -mr-5 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full shadow-floating md:flex"
                  >
                    <i className="fas fa-chevron-right text-ink"></i>
                  </button>
                </>
              )}

              <div
                ref={carouselRef}
                className="snap-row no-scrollbar -mx-4 flex gap-6 overflow-x-auto px-4 pb-4"
              >
                {filteredVideos.map((video) => (
                  <button
                    key={video.videoId}
                    type="button"
                    onClick={() =>
                      setEnReproduccion({
                        id: video.videoId,
                        titulo: video.title,
                      })
                    }
                    className="card card-interactive snap-item w-[300px] flex-shrink-0 text-left"
                  >
                    <div className="relative h-44 overflow-hidden bg-canvas-sunken">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                      <span className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur">
                        <i className="fas fa-play text-xs"></i>
                      </span>
                    </div>
                    <div className="p-4">
                      <p className="type-caption text-primary mb-1">
                        {formatDate(video.publishedAt)}
                      </p>
                      <h3 className="type-footnote font-semibold text-ink line-clamp-2">
                        {video.title}
                      </h3>
                    </div>
                  </button>
                ))}
              </div>

              <p className="type-caption text-ink-tertiary mt-2 text-center md:hidden">
                Desliza para ver más
              </p>
            </div>
          )}

          <div className="mt-10 flex justify-center">
            <a
              href="https://www.youtube.com/@TemploJirehTV/streams"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              <i className="fab fa-youtube text-red-600"></i> Ver todas en YouTube
            </a>
          </div>
        </div>
      </section>

      <VideoModal
        video={enReproduccion}
        onClose={() => setEnReproduccion(null)}
      />

      <Footer />
    </>
  );
}
