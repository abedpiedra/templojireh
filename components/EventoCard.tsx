import Image from "next/image";

interface EventoCardProps {
  titulo: string;
  fecha: string;
  hora: string;
  lugar: string;
  descripcion: string;
  imagen?: string;
}

export default function EventoCard({
  titulo,
  fecha,
  hora,
  lugar,
  descripcion,
  imagen,
}: EventoCardProps) {
  const fechaObj = new Date(fecha);
  const dia = fechaObj.getDate();
  const mes = fechaObj.toLocaleDateString("es-ES", { month: "short" });

  return (
    <div className="card flex flex-col md:flex-row">
      <div className="p-6 flex-1 flex gap-6">
        <div className="bg-primary text-white px-5 py-4 rounded-lg text-center flex-shrink-0">
          <span className="text-3xl font-bold block">{dia}</span>
          <span className="text-sm uppercase">{mes}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-dark mb-2">{titulo}</h3>
          <p className="text-gray-600 text-sm mb-3">{descripcion}</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
            <span>
              <i className="fas fa-clock text-primary mr-1"></i> {hora}
            </span>
            <span>
              <i className="fas fa-map-marker-alt text-primary mr-1"></i>{" "}
              {lugar}
            </span>
          </div>
          <a href="#" className="btn-primary text-sm py-2 px-4">
            Más Información
          </a>
        </div>
      </div>
    </div>
  );
}
