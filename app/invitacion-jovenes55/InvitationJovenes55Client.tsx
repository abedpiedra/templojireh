"use client";

import type { CSSProperties, FormEvent } from "react";
import { useEffect, useState } from "react";

const ASSET_BASE = "/invitacion-jovenes55/assets";
const STORAGE_KEY = "templo-jireh-confirmaciones-demo";
const EVENT_DATE = new Date("2026-08-21T20:00:00-04:00");
const EVENT_END_DATE = new Date(EVENT_DATE.getTime() + 2 * 60 * 60 * 1000);
const EVENT_LOCATION = "Templo Jireh, Presidente Alessandri #0498, La Granja";
const SPOTIFY_PLAYLIST_URL = "https://open.spotify.com/";

const BACKGROUND_IMAGES = [
  `${ASSET_BASE}/images/reunion-jovenes-ambiente.jpg`,
  `${ASSET_BASE}/images/culto-jovenes-templo.jpg`,
  `${ASSET_BASE}/images/adoracion-jovenes-manos.jpg`,
  `${ASSET_BASE}/images/adoracion-iglesia-cercana.jpg`,
];

type AttendanceValue = "yes" | "no" | "";

type CountdownState = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  status: string;
};

type FormErrors = {
  churchName?: string;
  willAttend?: string;
  estimatedYouth?: string;
};

function padTime(value: number) {
  return String(value).padStart(2, "0");
}

function getCountdown(): CountdownState {
  const remaining = EVENT_DATE.getTime() - Date.now();

  if (remaining <= 0) {
    return {
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
      status: "La reunión ya comenzó.",
    };
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days: padTime(days),
    hours: padTime(hours),
    minutes: padTime(minutes),
    seconds: padTime(seconds),
    status: "Viernes 21 de agosto, 20:00 hrs.",
  };
}

function shuffleImages() {
  return [...BACKGROUND_IMAGES].sort(() => Math.random() - 0.5);
}

function formatCalendarDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeCalendarText(text: string) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function buildCalendarFile() {
  const now = new Date();
  const title = "Reunión de Jóvenes - Aniversario 55 Templo Jireh";
  const description =
    "Una reunión especial de adoración, Palabra y comunión en gratitud al Señor.";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Templo Jireh//Invitacion Jovenes//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:jovenes-templo-jireh-20260821T200000@templo-jireh",
    `DTSTAMP:${formatCalendarDate(now)}`,
    `DTSTART:${formatCalendarDate(EVENT_DATE)}`,
    `DTEND:${formatCalendarDate(EVENT_END_DATE)}`,
    `SUMMARY:${escapeCalendarText(title)}`,
    `DESCRIPTION:${escapeCalendarText(description)}`,
    `LOCATION:${escapeCalendarText(EVENT_LOCATION)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join("\r\n");
}

export default function InvitationJovenes55Client() {
  const [countdown, setCountdown] = useState<CountdownState>({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    status: "",
  });
  const [images, setImages] = useState(BACKGROUND_IMAGES);
  const [churchName, setChurchName] = useState("");
  const [willAttend, setWillAttend] = useState<AttendanceValue>("");
  const [estimatedYouth, setEstimatedYouth] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [formStatus, setFormStatus] = useState("");
  const [calendarUrl, setCalendarUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setImages(shuffleImages());
    setCountdown(getCountdown());
    const timer = window.setInterval(() => setCountdown(getCountdown()), 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (willAttend === "no") {
      setEstimatedYouth("0");
    } else if (willAttend === "yes" && estimatedYouth === "0") {
      setEstimatedYouth("");
    }
  }, [willAttend, estimatedYouth]);

  useEffect(() => {
    return () => {
      if (calendarUrl) {
        URL.revokeObjectURL(calendarUrl);
      }
    };
  }, [calendarUrl]);

  const pageStyle = {
    "--page-bg-image": `url("${images[1] || images[0]}")`,
    "--purpose-bg-image": `url("${images[2] || images[0]}")`,
    "--details-bg-image": `url("${images[3] || images[0]}")`,
    "--confirmation-bg-image": `url("${images[0]}")`,
  } as CSSProperties;

  const clearCalendarUrl = () => {
    if (calendarUrl) {
      URL.revokeObjectURL(calendarUrl);
      setCalendarUrl("");
    }
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};
    const estimated = Number.parseInt(estimatedYouth, 10);

    if (!churchName.trim()) {
      nextErrors.churchName = "Escribe el nombre de la iglesia que nos visita.";
    }

    if (!willAttend) {
      nextErrors.willAttend = "Selecciona si nos acompañarán este día.";
    }

    if (
      willAttend === "yes" &&
      (!Number.isInteger(estimated) || estimated <= 0)
    ) {
      nextErrors.estimatedYouth = "Ingresa un estimado de jóvenes mayor a 0.";
    }

    setErrors(nextErrors);
    return {
      isValid: Object.keys(nextErrors).length === 0,
      data: {
        churchName: churchName.trim(),
        willAttend,
        estimatedYouth: willAttend === "no" ? 0 : estimated,
      },
    };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus("");
    clearCalendarUrl();

    const { isValid, data } = validateForm();
    if (!isValid) {
      setFormStatus("Revisa los campos marcados antes de enviar.");
      return;
    }

    setIsSubmitting(true);

    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      stored.push({
        ...data,
        submittedAt: new Date().toISOString(),
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

      setChurchName("");
      setWillAttend("");
      setEstimatedYouth("");
      setErrors({});

      if (data.willAttend === "yes") {
        const calendarFile = new Blob([buildCalendarFile()], {
          type: "text/calendar;charset=utf-8",
        });
        setCalendarUrl(URL.createObjectURL(calendarFile));
        setFormStatus(
          "Confirmación recibida. Gracias por responder. Puedes agregar la reunión a tu calendario.",
        );
      } else {
        setFormStatus("Respuesta recibida. Gracias por avisarnos.");
      }
    } catch {
      setFormStatus("No se pudo enviar la confirmación. Inténtalo nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="invitationPage" id="inicio" style={pageStyle}>
      <section className="hero" aria-labelledby="hero-title">
        <img src={images[0]} alt="" className="hero-bg" aria-hidden="true" />
        <div className="hero-copy">
          <p className="kicker">Jóvenes Templo Jireh · Aniversario 55 años</p>
          <h1 id="hero-title">Jóvenes, celebremos a Cristo juntos</h1>
          <p className="hero-text">
            Una reunión especial de adoración, Palabra y comunión en gratitud
            al Señor.
          </p>

          <div className="hero-meta" aria-label="Datos principales del evento">
            <span>21 de agosto</span>
            <span>Templo Jireh</span>
            <span>20:00 hrs</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Identidad de Templo Jireh">
          <a
            className="anniversary-card"
            href={SPOTIFY_PLAYLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir playlist de aniversario en Spotify"
          >
            <img
              src={`${ASSET_BASE}/logos/aniversario-55.png`}
              alt="55 años Templo Jireh, 55 años de la fidelidad de Dios"
              className="anniversary-logo"
            />
            <p>
              <span>Aniversario 55 años</span>
              <strong>55 años de la fidelidad de Dios</strong>
            </p>
            <span className="spotify-cta" aria-hidden="true">
              Click en la imagen
            </span>
          </a>
        </div>
      </section>

      <section
        className="purpose-section"
        id="proposito"
        aria-labelledby="purpose-title"
      >
        <div className="purpose-content">
          <div className="section-heading">
            <p className="section-label">Propósito del encuentro</p>
            <h2 id="purpose-title">
              Una noche para celebrar la fidelidad de Dios
            </h2>
          </div>
          <p>
            Nos reunimos como jóvenes para adorar a Cristo, escuchar su Palabra
            y dar gracias al Señor por estos 55 años en los que ha sostenido
            fielmente a su iglesia.
          </p>
        </div>
        <div className="purpose-scripture">
          <blockquote>“Eben-Ezer Hasta aquí nos ayudó Jehová.”</blockquote>
          <cite>1 Samuel 7:12</cite>
        </div>
      </section>

      <section
        className="details-section"
        id="detalles"
        aria-labelledby="details-title"
      >
        <div className="section-heading">
          <p className="section-label">Cuenta regresiva</p>
          <h2 id="details-title">Falta poco para reunirnos</h2>
        </div>

        <div
          className="countdown countdown-section-card"
          aria-label="Cuenta regresiva para la reunión"
        >
          <p className="countdown-label">Faltan</p>
          <div className="countdown-grid">
            <span>
              <strong>{countdown.days}</strong>
              <small>DÍAS</small>
            </span>
            <span>
              <strong>{countdown.hours}</strong>
              <small>HORAS</small>
            </span>
            <span>
              <strong>{countdown.minutes}</strong>
              <small>MIN</small>
            </span>
            <span>
              <strong>{countdown.seconds}</strong>
              <small>SEG</small>
            </span>
          </div>
          <p className="countdown-status">{countdown.status}</p>
        </div>

        <div className="map-card">
          <div className="map-copy">
            <p className="section-label">Cómo llegar</p>
            <h3>Templo Jireh</h3>
            <p>Presidente Alessandri #0498, La Granja</p>
            <a
              className="map-link"
              href="https://www.google.com/maps/search/?api=1&query=Templo%20Jireh%20Presidente%20Alessandri%200498%20La%20Granja"
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir en Google Maps
            </a>
          </div>
          <iframe
            title="Mapa de Templo Jireh"
            src="https://www.google.com/maps?q=Templo%20Jireh%20Presidente%20Alessandri%200498%20La%20Granja&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <section
        className="confirmation-section"
        id="confirmacion"
        aria-labelledby="form-title"
      >
        <div className="confirmation-copy">
          <p className="section-label">Confirma tu asistencia</p>
          <h2 id="form-title">Ayúdanos a preparar este día</h2>
          <p>
            Cuéntanos si podrán acompañarnos y cuántos jóvenes vendrían
            aproximadamente. Esto nos ayuda a prepararles un buen recibimiento.
          </p>
        </div>

        <form className="confirmation-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="churchName">¿De qué iglesia nos visitan?</label>
            <input
              type="text"
              id="churchName"
              name="churchName"
              autoComplete="organization"
              placeholder="Ej: Iglesia Cristiana..."
              value={churchName}
              onChange={(event) => setChurchName(event.target.value)}
              required
            />
            <p className="field-error">{errors.churchName}</p>
          </div>

          <fieldset className="field fieldset">
            <legend>¿Nos acompañarán este día?</legend>
            <div className="radio-group">
              <label
                className={`radio-option ${
                  willAttend === "yes" ? "is-selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="willAttend"
                  value="yes"
                  checked={willAttend === "yes"}
                  onChange={() => setWillAttend("yes")}
                  required
                />
                <span>Sí, participaremos</span>
              </label>
              <label
                className={`radio-option ${
                  willAttend === "no" ? "is-selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="willAttend"
                  value="no"
                  checked={willAttend === "no"}
                  onChange={() => setWillAttend("no")}
                  required
                />
                <span>No podremos asistir</span>
              </label>
            </div>
            <p className="field-error">{errors.willAttend}</p>
          </fieldset>

          <div className="field">
            <label htmlFor="estimatedYouth">
              ¿Cuántos jóvenes vendrían aproximadamente?
            </label>
            <input
              type="number"
              id="estimatedYouth"
              name="estimatedYouth"
              inputMode="numeric"
              min="1"
              step="1"
              placeholder="Ej: 15"
              value={estimatedYouth}
              onChange={(event) => setEstimatedYouth(event.target.value)}
              disabled={willAttend === "no"}
              required={willAttend !== "no"}
            />
            <p className="field-help">
              Si no nos acompañan, este campo quedará en 0.
            </p>
            <p className="field-error">{errors.estimatedYouth}</p>
          </div>

          <button className="button button-submit" type="submit">
            {isSubmitting ? "Enviando..." : "Enviar confirmación"}
          </button>
          <p className="form-status" role="status" aria-live="polite">
            {formStatus}
          </p>
          {calendarUrl ? (
            <a
              className="calendar-link"
              href={calendarUrl}
              download="reunion-jovenes-templo-jireh.ics"
            >
              Agregar al calendario
            </a>
          ) : null}
        </form>
      </section>
    </main>
  );
}
