import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import {
  ACUEDUCTO_ACUERDO,
  ACUEDUCTO_ASPECTOS_MEJORAR,
  ACUEDUCTO_CALIFICACION,
  ACUEDUCTO_FRECUENCIA,
  ACUEDUCTO_IMPORTANCIA,
  ACUEDUCTO_PARTICIPACION,
  ACUEDUCTO_SATISFACCION,
  ARRAIGO,
  DESPLAZAMIENTO,
  DOMINIO_VIVIENDA,
  emptyRegistroPayload,
  ESTRATOS,
  ETNIA,
  NECESIDADES,
  SECTORES,
  SERVICIOS_PUBLICOS,
  TIPOS_VIVIENDA,
  validateRegistro,
  type RegistroPayload,
} from '../types/registro'
import { captureGpsPosition, type GpsReading } from '../lib/geolocation'
import {
  ChipMultiSelect,
  ChoiceGroup,
  NumberStepper,
  RatingScale,
  TextField,
} from './form/FormControls'

const ESTRATO_OPTIONS = ESTRATOS.map(String)

interface RegistroFormProps {
  onSubmit: (payload: RegistroPayload) => Promise<void>
  onCancel: () => void
}

type AcueductoRadioField =
  | 'acueductoSatisfaccionServicio'
  | 'acueductoCalidadAgua'
  | 'acueductoAtencion'
  | 'acueductoInformacionComunidad'
  | 'acueductoGestionesInfraestructura'
  | 'acueductoImportanciaModernizacion'
  | 'acueductoGestionAlcantarillado'
  | 'acueductoTransparenciaRecursos'
  | 'acueductoParticipacion'

function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: ReactNode
}) {
  return (
    <details className="form-collapsible" open={defaultOpen}>
      <summary>{title}</summary>
      <div className="form-collapsible-body">{children}</div>
    </details>
  )
}

export function RegistroForm({ onSubmit, onCancel }: RegistroFormProps) {
  const [data, setData] = useState<RegistroPayload>(emptyRegistroPayload)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [gpsReading, setGpsReading] = useState<GpsReading | null>(null)
  const [gpsLoading, setGpsLoading] = useState(true)
  const errorRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    let cancelled = false
    setGpsLoading(true)
    void captureGpsPosition().then((gps) => {
      if (cancelled) return
      setGpsReading(gps)
      setGpsLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const setNum = (name: keyof RegistroPayload, value: number) => {
    setData((d) => ({ ...d, [name]: value }))
  }

  const setAcueductoRadio = (field: AcueductoRadioField, value: string) => {
    setData((d) => ({ ...d, [field]: value as RegistroPayload[AcueductoRadioField] }))
  }

  const toggleArray = (
    field: 'serviciosPublicos' | 'necesidades' | 'acueductoAspectosMejorar',
    item: string,
  ) => {
    setData((d) => {
      const arr = d[field]
      const next = arr.includes(item)
        ? arr.filter((x) => x !== item)
        : [...arr, item]
      return { ...d, [field]: next }
    })
  }

  const showAcueducto = data.serviciosPublicos.includes('Agua')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const validation = validateRegistro(data)
    if (validation) {
      setError(validation)
      requestAnimationFrame(() => {
        errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
      return
    }
    setError(null)
    setSaving(true)
    try {
      await onSubmit({
        ...data,
        nombre: data.nombre.trim(),
        email: data.email.trim(),
        celular: data.celular.trim(),
        acueductoSugerencias: data.acueductoSugerencias.trim(),
        discapacidadEnfermedad: data.discapacidadEnfermedad.trim(),
        discapacidadTiempo: data.discapacidadTiempo.trim(),
        discapacidadCuidadorNombre: data.discapacidadCuidadorNombre.trim(),
        discapacidadCuidadorTelefono: data.discapacidadCuidadorTelefono.trim(),
        gpsLatitude: gpsReading?.latitude ?? null,
        gpsLongitude: gpsReading?.longitude ?? null,
        gpsAccuracy: gpsReading?.accuracy ?? null,
        gpsCapturedAt: gpsReading?.capturedAt ?? null,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar')
      requestAnimationFrame(() => {
        errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="registro-form" onSubmit={(e) => void handleSubmit(e)}>
      {error && (
        <p ref={errorRef} className="form-error" role="alert">
          {error}
        </p>
      )}

      {gpsLoading && (
        <p className="gps-status muted">Obteniendo ubicación…</p>
      )}
      {!gpsLoading && !gpsReading && (
        <p className="gps-status muted">
          No se obtuvo la ubicación. El registro se guardará sin coordenadas GPS.
        </p>
      )}

      <CollapsibleSection title="Información Vivienda">
        <fieldset>
          <legend>Identificación</legend>
          <TextField
            label="Nombre *"
            required
            autoComplete="name"
            enterKeyHint="next"
            value={data.nombre}
            onChange={(v) => setData({ ...data, nombre: v })}
          />
          <TextField
            label="Correo electrónico"
            type="email"
            autoComplete="email"
            enterKeyHint="next"
            value={data.email}
            onChange={(v) => setData({ ...data, email: v })}
          />
          <TextField
            label="Número de celular *"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            enterKeyHint="next"
            required
            value={data.celular}
            onChange={(v) => setData({ ...data, celular: v })}
          />
          <ChoiceGroup
            legend="Sector"
            name="sector"
            options={SECTORES}
            value={data.sector}
            onChange={(v) =>
              setData({ ...data, sector: v as RegistroPayload['sector'] })
            }
          />
          <ChoiceGroup
            legend="Estrato"
            name="estrato"
            options={ESTRATO_OPTIONS}
            value={String(data.estrato)}
            onChange={(v) =>
              setData({
                ...data,
                estrato: Number(v) as RegistroPayload['estrato'],
              })
            }
          />
        </fieldset>

        <fieldset>
          <legend>Vivienda</legend>
          <ChoiceGroup
            legend="Tipo de vivienda"
            name="tipoVivienda"
            options={TIPOS_VIVIENDA}
            value={data.tipoVivienda}
            onChange={(v) =>
              setData({
                ...data,
                tipoVivienda: v as RegistroPayload['tipoVivienda'],
              })
            }
          />
          <ChoiceGroup
            legend="Dominio vivienda"
            name="dominioVivienda"
            options={DOMINIO_VIVIENDA}
            value={data.dominioVivienda}
            onChange={(v) =>
              setData({
                ...data,
                dominioVivienda: v as RegistroPayload['dominioVivienda'],
              })
            }
          />
        </fieldset>

        <fieldset>
          <legend>Servicios públicos</legend>
          <ChipMultiSelect
            legend="Seleccione los servicios"
            options={SERVICIOS_PUBLICOS}
            selected={data.serviciosPublicos}
            onToggle={(item) => toggleArray('serviciosPublicos', item)}
          />
          <TextField
            label="Otro (servicios)"
            enterKeyHint="next"
            value={data.serviciosPublicosOtro}
            onChange={(v) => setData({ ...data, serviciosPublicosOtro: v })}
          />
        </fieldset>

        <fieldset>
          <legend>Composición del hogar</legend>
          <ChoiceGroup
            legend="Arraigo"
            name="arraigo"
            options={ARRAIGO}
            value={data.arraigo}
            onChange={(v) =>
              setData({ ...data, arraigo: v as RegistroPayload['arraigo'] })
            }
          />
          <ChoiceGroup
            legend="Etnia"
            name="etnia"
            options={ETNIA}
            value={data.etnia}
            onChange={(v) =>
              setData({ ...data, etnia: v as RegistroPayload['etnia'] })
            }
          />
          <div className="count-grid">
            <NumberStepper
              label="Núm. personas"
              value={data.numPersonas}
              onChange={(v) => setNum('numPersonas', v)}
            />
            <NumberStepper
              label="Hombres (18-59 A.)"
              value={data.hombres1859}
              onChange={(v) => setNum('hombres1859', v)}
            />
            <NumberStepper
              label="Mujer (18-59 A.)"
              value={data.mujeres1859}
              onChange={(v) => setNum('mujeres1859', v)}
            />
            <NumberStepper
              label="Hombre mayor (60 A.)"
              value={data.hombres60}
              onChange={(v) => setNum('hombres60', v)}
            />
            <NumberStepper
              label="Mujer mayor (60 A.)"
              value={data.mujeres60}
              onChange={(v) => setNum('mujeres60', v)}
            />
            <NumberStepper
              label="Niños"
              value={data.ninos}
              onChange={(v) => setNum('ninos', v)}
            />
            <NumberStepper
              label="Niñas"
              value={data.ninas}
              onChange={(v) => setNum('ninas', v)}
            />
            <NumberStepper
              label="Personas en condición de discapacidad"
              value={data.discapacitados}
              onChange={(v) => {
                setData((d) => {
                  const next = { ...d, discapacitados: v }
                  if (v === 0) {
                    return {
                      ...next,
                      discapacidadEnfermedad: '',
                      discapacidadTiempo: '',
                      discapacidadCuidadorNombre: '',
                      discapacidadCuidadorTelefono: '',
                    }
                  }
                  return next
                })
              }}
            />
            <NumberStepper
              label="Desplazados"
              value={data.desplazados}
              onChange={(v) => setNum('desplazados', v)}
            />
            <NumberStepper
              label="Reinsertados"
              value={data.reinsertados}
              onChange={(v) => setNum('reinsertados', v)}
            />
            <NumberStepper
              label="LGTBI+"
              value={data.lgtbi}
              onChange={(v) => setNum('lgtbi', v)}
            />
          </div>
          {data.discapacitados > 0 && (
            <div className="discapacidad-fields">
              <p className="discapacidad-fields-title">
                Datos de discapacidad ({data.discapacitados}{' '}
                {data.discapacitados === 1 ? 'persona' : 'personas'})
              </p>
              <TextField
                label="¿Qué enfermedad?"
                enterKeyHint="next"
                value={data.discapacidadEnfermedad}
                onChange={(v) => setData({ ...data, discapacidadEnfermedad: v })}
              />
              <TextField
                label="¿Hace cuánto tiempo?"
                enterKeyHint="next"
                value={data.discapacidadTiempo}
                onChange={(v) => setData({ ...data, discapacidadTiempo: v })}
              />
              <TextField
                label="Nombre del cuidador"
                autoComplete="name"
                enterKeyHint="next"
                value={data.discapacidadCuidadorNombre}
                onChange={(v) =>
                  setData({ ...data, discapacidadCuidadorNombre: v })
                }
              />
              <TextField
                label="Número teléfono del cuidador"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                enterKeyHint="next"
                value={data.discapacidadCuidadorTelefono}
                onChange={(v) =>
                  setData({ ...data, discapacidadCuidadorTelefono: v })
                }
              />
            </div>
          )}
        </fieldset>

        <fieldset>
          <legend>Personas que estudian</legend>
          <div className="count-grid">
            <NumberStepper
              label="En la Escuela"
              value={data.estudianEscuela}
              onChange={(v) => setNum('estudianEscuela', v)}
            />
            <NumberStepper
              label="En el Colegio"
              value={data.estudianColegio}
              onChange={(v) => setNum('estudianColegio', v)}
            />
            <NumberStepper
              label="En la Universidad"
              value={data.estudianUniversidad}
              onChange={(v) => setNum('estudianUniversidad', v)}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Personas que trabajan</legend>
          <div className="count-grid">
            <NumberStepper
              label="En la Vereda"
              value={data.trabajanVereda}
              onChange={(v) => setNum('trabajanVereda', v)}
            />
            <NumberStepper
              label="En Buga"
              value={data.trabajanBuga}
              onChange={(v) => setNum('trabajanBuga', v)}
            />
            <NumberStepper
              label="En Otro"
              value={data.trabajanOtro}
              onChange={(v) => setNum('trabajanOtro', v)}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Movilidad</legend>
          <ChoiceGroup
            legend="Desplazamiento"
            name="desplazamiento"
            options={DESPLAZAMIENTO}
            value={data.desplazamiento}
            onChange={(v) =>
              setData({
                ...data,
                desplazamiento: v as RegistroPayload['desplazamiento'],
              })
            }
          />
        </fieldset>

        <fieldset>
          <legend>Necesidades en la comunidad</legend>
          <ChipMultiSelect
            legend="Necesidades"
            options={NECESIDADES}
            selected={data.necesidades}
            onToggle={(item) => toggleArray('necesidades', item)}
          />
          <TextField
            label="Otra necesidad"
            enterKeyHint="done"
            value={data.necesidadesOtro}
            onChange={(v) => setData({ ...data, necesidadesOtro: v })}
          />
        </fieldset>
      </CollapsibleSection>

      {showAcueducto && (
      <CollapsibleSection title="Información Acueducto" defaultOpen>
        <ChoiceGroup
          clearable
          legend="1. ¿Qué tan satisfecho se encuentra con el servicio de suministro de agua que presta actualmente el Acueducto de Sonsito?"
          name="acueductoSatisfaccionServicio"
          options={ACUEDUCTO_SATISFACCION}
          value={data.acueductoSatisfaccionServicio}
          onChange={(v) => setAcueductoRadio('acueductoSatisfaccionServicio', v)}
        />
        <ChoiceGroup
          clearable
          legend="2. ¿Cómo califica la calidad del agua suministrada para consumo doméstico?"
          name="acueductoCalidadAgua"
          options={ACUEDUCTO_CALIFICACION}
          value={data.acueductoCalidadAgua}
          onChange={(v) => setAcueductoRadio('acueductoCalidadAgua', v)}
        />
        <ChoiceGroup
          clearable
          legend="3. ¿Cómo califica la atención recibida cuando presenta solicitudes, inquietudes o reportes al acueducto?"
          name="acueductoAtencion"
          options={ACUEDUCTO_CALIFICACION}
          value={data.acueductoAtencion}
          onChange={(v) => setAcueductoRadio('acueductoAtencion', v)}
        />
        <ChoiceGroup
          clearable
          legend="4. ¿Considera que la Junta Directiva y la Administración del Acueducto mantienen informada a la comunidad sobre las actividades, proyectos y gestiones realizadas?"
          name="acueductoInformacionComunidad"
          options={ACUEDUCTO_FRECUENCIA}
          value={data.acueductoInformacionComunidad}
          onChange={(v) => setAcueductoRadio('acueductoInformacionComunidad', v)}
        />
        <ChoiceGroup
          clearable
          legend="5. ¿Cómo califica las gestiones realizadas para el mejoramiento de la infraestructura del acueducto y de las vías de acceso relacionadas con el servicio?"
          name="acueductoGestionesInfraestructura"
          options={ACUEDUCTO_CALIFICACION}
          value={data.acueductoGestionesInfraestructura}
          onChange={(v) =>
            setAcueductoRadio('acueductoGestionesInfraestructura', v)
          }
        />
        <ChoiceGroup
          clearable
          legend="6. ¿Qué tan importante considera el proyecto de diseño y modernización del acueducto regional que beneficiará a Sonsito, La Unidad, El Manantial y el Parque Nacional Regional El Vínculo?"
          name="acueductoImportanciaModernizacion"
          options={ACUEDUCTO_IMPORTANCIA}
          value={data.acueductoImportanciaModernizacion}
          onChange={(v) =>
            setAcueductoRadio('acueductoImportanciaModernizacion', v)
          }
        />
        <ChoiceGroup
          clearable
          legend="7. ¿Cómo califica la gestión realizada por la Junta Directiva para lograr la formulación y gestión de los diseños de las nuevas redes de alcantarillado ante la Administración Municipal, con el propósito de mejorar el saneamiento básico de la comunidad?"
          name="acueductoGestionAlcantarillado"
          options={ACUEDUCTO_CALIFICACION}
          value={data.acueductoGestionAlcantarillado}
          onChange={(v) => setAcueductoRadio('acueductoGestionAlcantarillado', v)}
        />
        <ChoiceGroup
          clearable
          legend="8. ¿Considera que los recursos económicos aportados por la comunidad están siendo administrados con transparencia?"
          name="acueductoTransparenciaRecursos"
          options={ACUEDUCTO_ACUERDO}
          value={data.acueductoTransparenciaRecursos}
          onChange={(v) => setAcueductoRadio('acueductoTransparenciaRecursos', v)}
        />

        <ChipMultiSelect
          legend="9. ¿Qué aspectos considera que deben mejorarse prioritariamente en el Acueducto de Sonsito? (Puede marcar varias opciones)"
          options={ACUEDUCTO_ASPECTOS_MEJORAR}
          selected={data.acueductoAspectosMejorar}
          onToggle={(item) => toggleArray('acueductoAspectosMejorar', item)}
        />
        <TextField
          label="Otro"
          value={data.acueductoAspectosMejorarOtro}
          onChange={(v) => setData({ ...data, acueductoAspectosMejorarOtro: v })}
        />

        <ChoiceGroup
          clearable
          legend="10. ¿Estaría dispuesto a participar en jornadas comunitarias, reuniones, veedurías ciudadanas o actividades de apoyo al acueducto?"
          name="acueductoParticipacion"
          options={ACUEDUCTO_PARTICIPACION}
          value={data.acueductoParticipacion}
          onChange={(v) => setAcueductoRadio('acueductoParticipacion', v)}
        />

        <RatingScale
          legend="11. En una escala de 1 a 10, donde 1 es muy malo y 10 es excelente, ¿qué calificación le otorga a la gestión realizada por la Junta Directiva del Acueducto Rural Aguas Sonsito durante el último año?"
          value={data.acueductoCalificacionJunta}
          onChange={(v) => setData({ ...data, acueductoCalificacionJunta: v })}
        />

        <TextField
          label="12. Sugerencias o recomendaciones"
          multiline
          rows={4}
          enterKeyHint="done"
          value={data.acueductoSugerencias}
          onChange={(v) => setData({ ...data, acueductoSugerencias: v })}
        />
      </CollapsibleSection>
      )}

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar registro'}
        </button>
      </div>
    </form>
  )
}
