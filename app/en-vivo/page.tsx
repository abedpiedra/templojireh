'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'

interface LiveData {
  isLive: boolean
  videoId?: string
  title?: string
  thumbnail?: string
  description?: string
}

interface Video {
  videoId: string
  title: string
  thumbnail: string
  description: string
  publishedAt: string
}

export default function EnVivoPage() {
  const [liveData, setLiveData] = useState<LiveData>({ isLive: false })
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [liveRes, videosRes] = await Promise.all([
          fetch('/api/youtube/live'),
          fetch('/api/youtube/videos')
        ])

        const liveJson = await liveRes.json()
        const videosJson = await videosRes.json()

        setLiveData(liveJson)
        setVideos(videosJson.videos || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Verificar cada 30 segundos si hay transmisión en vivo
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/youtube/live')
        const data = await res.json()
        setLiveData(data)
      } catch (error) {
        console.error('Error checking live status:', error)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

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
                <span className="animate-pulse w-3 h-3 bg-white rounded-full"></span>
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
                <h2 className="text-2xl font-bold text-dark mb-2">{liveData.title}</h2>
                <p className="text-gray-600">{liveData.description}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-200 flex items-center justify-center">
                <i className="fas fa-video-slash text-4xl text-gray-400"></i>
              </div>
              <h2 className="text-2xl font-bold text-dark mb-2">No hay transmisión en vivo</h2>
              <p className="text-gray-500 mb-6">Vuelve pronto o revisa nuestras transmisiones anteriores</p>
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
          <div className="text-center mb-12">
            <p className="section-subtitle">Archivo</p>
            <h2 className="section-title">Transmisiones Anteriores</h2>
          </div>

          {videos.length === 0 ? (
            <div className="text-center py-12">
              <i className="fab fa-youtube text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">No hay videos disponibles</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video) => (
                <a
                  key={video.videoId}
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card group cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
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
                  <div className="p-5">
                    <p className="text-primary text-sm mb-2">
                      <i className="fas fa-calendar mr-1"></i>
                      {formatDate(video.publishedAt)}
                    </p>
                    <h3 className="font-semibold text-dark line-clamp-2">{video.title}</h3>
                  </div>
                </a>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <a
              href="https://www.youtube.com/@TemploJirehTV/videos"
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
  )
}
