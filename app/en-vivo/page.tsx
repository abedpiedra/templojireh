"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";

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

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function EnVivoPage() {
  const [liveData, setLiveData] = useState<LiveData>({ isLive: false });
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("todos");
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  // Generate default years (current year down to 2023)
  const currentYear = new Date().getFullYear();
  const defaultYears = Array.from({ length: currentYear - 2022 }, (_, i) => currentYear - i);
  const [availableYears, setAvailableYears] = useState<number[]>(defaultYears);
  const carouselRef = useRef<HTMLDivElement>(null);

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
        const videoList = videosJson.videos || [];
        setVideos(videoList);
        setFilteredVideos(videoList);

        // Extract available years from videos and combine with default years
        if (videoList.length > 0) {
          const yearsFromVideos = videoList.map((v: Video) => new Date(v.publishedAt).getFullYear());
          const allYears = new Set([...yearsFromVideos, ...defaultYears]);
          const years = Array.from(allYears) as number[];
          setAvailableYears(years.sort((a: number, b: number) => b - a));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Verificar cada 30 segundos si hay transmisión en vivo
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
  }, []);

  useEffect(() => {
    applyFilters();
  }, [activeFilter, selectedYear, selectedMonth, videos]);

  const applyFilters = () => {
    const now = new Date();
    let filtered = [...videos];

    switch (activeFilter) {
      case "semana":
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = videos.filter((v) => new Date(v.publishedAt) >= oneWeekAgo);
        break;
      case "mes":
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = videos.filter((v) => new Date(v.publishedAt) >= oneMonthAgo);
        break;
      case "fecha":
        filtered = videos.filter((v) => {
          const date = new Date(v.publishedAt);
          const matchesYear = date.getFullYear() === selectedYear;
          const matchesMonth = selectedMonth === null || date.getMonth() === selectedMonth;
          return matchesYear && matchesMonth;
        });
        break;
      default:
        filtered = videos;
    }

    setFilteredVideos(filtered);
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    if (filter !== "fecha") {
      setSelectedMonth(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 320; // Width of one card + gap
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const filters: { key: FilterType; label: string }[] = [
    { key: "todos", label: "Todos" },
    { key: "semana", label: "Esta semana" },
    { key: "mes", label: "Este mes" },
    { key: "fecha", label: "Por fecha" },
  ];

  return (
    <>
      <Header />
      <PageHeader title="En Vivo" breadcrumb="En Vivo" />

      {/* Live Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-16">
              <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
              <p className="text-gray-500">Cargando...</p>
            </div>
          ) : liveData.isLive ? (
            <div className="max-w-4xl mx-auto">
              <div className="bg-red-600 text-white px-4 py-2 rounded-t-xl flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                <span className="font-bold">EN VIVO AHORA</span>
              </div>
              <div className="bg-black rounded-b-xl overflow-hidden">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${liveData.videoId}?autoplay=1`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg mt-4">
                <h2 className="text-2xl font-bold text-dark mb-2">
                  {liveData.title}
                </h2>
                <p className="text-gray-600">{liveData.description}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-200 flex items-center justify-center">
                <i className="fas fa-video-slash text-4xl text-gray-400"></i>
              </div>
              <h2 className="text-2xl font-bold text-dark mb-2">
                No hay transmisión en vivo
              </h2>
              <p className="text-gray-500 mb-6">
                Vuelve pronto o revisa nuestras transmisiones anteriores
              </p>
              <a
                href="https://www.youtube.com/@TemploJirehTV?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
              >
                <i className="fab fa-youtube"></i> Suscribirse al Canal
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Previous Streams */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <p className="section-subtitle">Archivo</p>
            <h2 className="section-title">Transmisiones Anteriores</h2>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => handleFilterChange(filter.key)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === filter.key
                    ? "bg-primary text-white"
                    : "bg-white text-gray-600 shadow hover:bg-primary hover:text-white"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Year and Month selectors */}
          {activeFilter === "fecha" && (
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <div className="flex items-center gap-2">
                <label className="text-gray-600 font-medium">Año:</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                >
                  {availableYears.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-gray-600 font-medium">Mes:</label>
                <select
                  value={selectedMonth ?? ""}
                  onChange={(e) => setSelectedMonth(e.target.value === "" ? null : Number(e.target.value))}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                >
                  <option value="">Todos los meses</option>
                  {MONTHS.map((month, index) => (
                    <option key={index} value={index}>{month}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {filteredVideos.length === 0 ? (
            <div className="text-center py-12">
              <i className="fab fa-youtube text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">No hay videos en este período</p>
            </div>
          ) : (
            <div className="relative">
              {/* Navigation Buttons */}
              {filteredVideos.length > 3 && (
                <>
                  <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors -ml-4 hidden md:flex"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors -mr-4 hidden md:flex"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </>
              )}

              {/* Carousel */}
              <div
                ref={carouselRef}
                className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {filteredVideos.map((video) => (
                  <a
                    key={video.videoId}
                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 w-[300px] snap-start card group cursor-pointer"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-white text-xl">
                          <i className="fab fa-youtube"></i>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-primary text-xs mb-1">
                        <i className="fas fa-calendar mr-1"></i>
                        {formatDate(video.publishedAt)}
                      </p>
                      <h3 className="font-semibold text-dark text-sm line-clamp-2">
                        {video.title}
                      </h3>
                    </div>
                  </a>
                ))}
              </div>

              {/* Scroll indicator for mobile */}
              <div className="flex justify-center mt-4 md:hidden">
                <p className="text-gray-400 text-sm">
                  <i className="fas fa-arrows-alt-h mr-2"></i>
                  Desliza para ver más
                </p>
              </div>
            </div>
          )}

          <div className="text-center mt-10">
            <a
              href="https://www.youtube.com/@TemploJirehTV/streams"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              <i className="fab fa-youtube"></i> Ver Todos en YouTube
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
