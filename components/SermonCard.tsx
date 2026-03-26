import Image from 'next/image'

interface SermonCardProps {
  titulo: string
  fecha: string
  predicador: string
  descripcion: string
  imagen?: string
  video?: string
}

export default function SermonCard({ titulo, fecha, predicador, descripcion, imagen, video }: SermonCardProps) {
  const fechaFormateada = new Date(fecha).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="card flex flex-col md:flex-row">
      {video ? (
        <a href={video} target="_blank" rel="noopener noreferrer" className="relative w-full md:w-52 h-48 md:h-auto flex-shrink-0 group cursor-pointer">
          <Image
            src={imagen || 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600'}
            alt={titulo}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white text-xl">
              <i className="fas fa-play"></i>
            </div>
          </div>
        </a>
      ) : (
        <div className="relative w-full md:w-52 h-48 md:h-auto flex-shrink-0">
          <Image
            src={imagen || 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600'}
            alt={titulo}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-5 flex-1">
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-2">
          <span><i className="fas fa-calendar text-primary mr-1"></i> {fechaFormateada}</span>
          <span><i className="fas fa-user text-primary mr-1"></i> {predicador}</span>
        </div>
        <h3 className="text-xl font-semibold text-dark mb-2">{titulo}</h3>
        <p className="text-gray-600 text-sm mb-4">{descripcion}</p>
        {video && (
          <a href={video} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-gray-100 rounded text-sm text-gray-600 hover:bg-primary hover:text-white transition-colors">
            <i className="fas fa-play mr-1"></i> Ver
          </a>
        )}
      </div>
    </div>
  )
}
