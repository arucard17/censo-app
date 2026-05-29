import { useState, type FormEvent, type ReactNode } from 'react'
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
import { captureGpsPosition } from '../lib/geolocation'

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

function NumberField({
  label,
  name,
  value,
  onChange,
}: {
  label: string
  name: keyof RegistroPayload
  value: number
  onChange: (name: keyof RegistroPayload, value: number) => void
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type="number"
        min={0}
        step={1}
        name={name}
        value={value}
        onChange={(e) => onChange(name, parseInt(e.target.value, 10) || 0)}
      />
    </label>
  )
}

function RadioQuestion({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string
  name: string
  options: readonly string[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <fieldset className="survey-question">
      <legend>{legend}</legend>
      <div className="radio-group">
        {options.map((opt) => (
          <label key={opt} className="radio">
            <input
              type="radio"
              name={name}
              checked={value === opt}
              onChange={() => onChange(opt)}
            />
            {opt}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function RegistroForm({ onSubmit, onCancel }: RegistroFormProps) {
  const [data, setData] = useState<RegistroPayload>(emptyRegistroPayload)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const validation = validateRegistro(data)
    if (validation) {
      setError(validation)
      return
    }
    setError(null)
    setSaving(true)
    try {
      const gps = await captureGpsPosition()
      await onSubmit({
        ...data,
        nombre: data.nombre.trim(),
        email: data.email.trim(),
        celular: data.celular.trim(),
        acueductoSugerencias: data.acueductoSugerencias.trim(),
        gpsLatitude: gps?.latitude ?? null,
        gpsLongitude: gps?.longitude ?? null,
        gpsAccuracy: gps?.accuracy ?? null,
        gpsCapturedAt: gps?.capturedAt ?? null,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="registro-form" onSubmit={(e) => void handleSubmit(e)}>
      {error && <p className="form-error">{error}</p>}

      <CollapsibleSection title="Información Vivienda">
        <fieldset>
          <legend>Identificación</legend>
          <label className="field">
            <span>Nombre *</span>
            <input
              required
              value={data.nombre}
              onChange={(e) => setData({ ...data, nombre: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Correo electrónico</span>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Número de celular *</span>
            <input
              required
              value={data.celular}
              onChange={(e) => setData({ ...data, celular: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Sector</span>
            <select
              value={data.sector}
              onChange={(e) =>
                setData({
                  ...data,
                  sector: e.target.value as RegistroPayload['sector'],
                })
              }
            >
              {SECTORES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Estrato</span>
            <select
              value={data.estrato}
              onChange={(e) =>
                setData({
                  ...data,
                  estrato: Number(e.target.value) as RegistroPayload['estrato'],
                })
              }
            >
              {ESTRATOS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </fieldset>

        <fieldset>
          <legend>Vivienda</legend>
          <label className="field">
            <span>Tipo de vivienda</span>
            <select
              value={data.tipoVivienda}
              onChange={(e) =>
                setData({
                  ...data,
                  tipoVivienda: e.target
                    .value as RegistroPayload['tipoVivienda'],
                })
              }
            >
              {TIPOS_VIVIENDA.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Dominio vivienda</span>
            <select
              value={data.dominioVivienda}
              onChange={(e) =>
                setData({
                  ...data,
                  dominioVivienda: e.target
                    .value as RegistroPayload['dominioVivienda'],
                })
              }
            >
              {DOMINIO_VIVIENDA.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
        </fieldset>

        <fieldset>
          <legend>Servicios públicos</legend>
          <div className="checkbox-group">
            {SERVICIOS_PUBLICOS.map((s) => (
              <label key={s} className="checkbox">
                <input
                  type="checkbox"
                  checked={data.serviciosPublicos.includes(s)}
                  onChange={() => toggleArray('serviciosPublicos', s)}
                />
                {s}
              </label>
            ))}
          </div>
          <label className="field">
            <span>Otro (servicios)</span>
            <input
              value={data.serviciosPublicosOtro}
              onChange={(e) =>
                setData({ ...data, serviciosPublicosOtro: e.target.value })
              }
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Composición del hogar</legend>
          <label className="field">
            <span>Arraigo</span>
            <select
              value={data.arraigo}
              onChange={(e) =>
                setData({
                  ...data,
                  arraigo: e.target.value as RegistroPayload['arraigo'],
                })
              }
            >
              {ARRAIGO.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Etnia</span>
            <select
              value={data.etnia}
              onChange={(e) =>
                setData({
                  ...data,
                  etnia: e.target.value as RegistroPayload['etnia'],
                })
              }
            >
              {ETNIA.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>
          <NumberField
            label="Núm. personas"
            name="numPersonas"
            value={data.numPersonas}
            onChange={setNum}
          />
          <NumberField
            label="Hombres (18-59 A.)"
            name="hombres1859"
            value={data.hombres1859}
            onChange={setNum}
          />
          <NumberField
            label="Mujer (18-59 A.)"
            name="mujeres1859"
            value={data.mujeres1859}
            onChange={setNum}
          />
          <NumberField
            label="Hombre mayor (60 A.)"
            name="hombres60"
            value={data.hombres60}
            onChange={setNum}
          />
          <NumberField
            label="Mujer mayor (60 A.)"
            name="mujeres60"
            value={data.mujeres60}
            onChange={setNum}
          />
          <NumberField label="Niños" name="ninos" value={data.ninos} onChange={setNum} />
          <NumberField label="Niñas" name="ninas" value={data.ninas} onChange={setNum} />
          <NumberField
            label="Discapacitados"
            name="discapacitados"
            value={data.discapacitados}
            onChange={setNum}
          />
          <NumberField
            label="Desplazados"
            name="desplazados"
            value={data.desplazados}
            onChange={setNum}
          />
          <NumberField
            label="Reinsertados"
            name="reinsertados"
            value={data.reinsertados}
            onChange={setNum}
          />
          <NumberField label="LGTBI+" name="lgtbi" value={data.lgtbi} onChange={setNum} />
        </fieldset>

        <fieldset>
          <legend>Personas que estudian</legend>
          <NumberField
            label="En la Escuela"
            name="estudianEscuela"
            value={data.estudianEscuela}
            onChange={setNum}
          />
          <NumberField
            label="En el Colegio"
            name="estudianColegio"
            value={data.estudianColegio}
            onChange={setNum}
          />
          <NumberField
            label="En la Universidad"
            name="estudianUniversidad"
            value={data.estudianUniversidad}
            onChange={setNum}
          />
        </fieldset>

        <fieldset>
          <legend>Personas que trabajan</legend>
          <NumberField
            label="En la Vereda"
            name="trabajanVereda"
            value={data.trabajanVereda}
            onChange={setNum}
          />
          <NumberField
            label="En Buga"
            name="trabajanBuga"
            value={data.trabajanBuga}
            onChange={setNum}
          />
          <NumberField
            label="En Otro"
            name="trabajanOtro"
            value={data.trabajanOtro}
            onChange={setNum}
          />
        </fieldset>

        <fieldset>
          <legend>Movilidad</legend>
          <label className="field">
            <span>Desplazamiento</span>
            <select
              value={data.desplazamiento}
              onChange={(e) =>
                setData({
                  ...data,
                  desplazamiento: e.target
                    .value as RegistroPayload['desplazamiento'],
                })
              }
            >
              {DESPLAZAMIENTO.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
        </fieldset>

        <fieldset>
          <legend>Necesidades en la comunidad</legend>
          <div className="checkbox-group">
            {NECESIDADES.map((n) => (
              <label key={n} className="checkbox">
                <input
                  type="checkbox"
                  checked={data.necesidades.includes(n)}
                  onChange={() => toggleArray('necesidades', n)}
                />
                {n}
              </label>
            ))}
          </div>
          <label className="field">
            <span>Otra necesidad</span>
            <input
              value={data.necesidadesOtro}
              onChange={(e) =>
                setData({ ...data, necesidadesOtro: e.target.value })
              }
            />
          </label>
        </fieldset>
      </CollapsibleSection>

      <CollapsibleSection title="Información Acueducto" defaultOpen>
        <RadioQuestion
          legend="1. ¿Qué tan satisfecho se encuentra con el servicio de suministro de agua que presta actualmente el Acueducto de Sonsito?"
          name="acueductoSatisfaccionServicio"
          options={ACUEDUCTO_SATISFACCION}
          value={data.acueductoSatisfaccionServicio}
          onChange={(v) => setAcueductoRadio('acueductoSatisfaccionServicio', v)}
        />
        <RadioQuestion
          legend="2. ¿Cómo califica la calidad del agua suministrada para consumo doméstico?"
          name="acueductoCalidadAgua"
          options={ACUEDUCTO_CALIFICACION}
          value={data.acueductoCalidadAgua}
          onChange={(v) => setAcueductoRadio('acueductoCalidadAgua', v)}
        />
        <RadioQuestion
          legend="3. ¿Cómo califica la atención recibida cuando presenta solicitudes, inquietudes o reportes al acueducto?"
          name="acueductoAtencion"
          options={ACUEDUCTO_CALIFICACION}
          value={data.acueductoAtencion}
          onChange={(v) => setAcueductoRadio('acueductoAtencion', v)}
        />
        <RadioQuestion
          legend="4. ¿Considera que la Junta Directiva y la Administración del Acueducto mantienen informada a la comunidad sobre las actividades, proyectos y gestiones realizadas?"
          name="acueductoInformacionComunidad"
          options={ACUEDUCTO_FRECUENCIA}
          value={data.acueductoInformacionComunidad}
          onChange={(v) => setAcueductoRadio('acueductoInformacionComunidad', v)}
        />
        <RadioQuestion
          legend="5. ¿Cómo califica las gestiones realizadas para el mejoramiento de la infraestructura del acueducto y de las vías de acceso relacionadas con el servicio?"
          name="acueductoGestionesInfraestructura"
          options={ACUEDUCTO_CALIFICACION}
          value={data.acueductoGestionesInfraestructura}
          onChange={(v) =>
            setAcueductoRadio('acueductoGestionesInfraestructura', v)
          }
        />
        <RadioQuestion
          legend="6. ¿Qué tan importante considera el proyecto de diseño y modernización del acueducto regional que beneficiará a Sonsito, La Unidad, El Manantial y el Parque Nacional Regional El Vínculo?"
          name="acueductoImportanciaModernizacion"
          options={ACUEDUCTO_IMPORTANCIA}
          value={data.acueductoImportanciaModernizacion}
          onChange={(v) =>
            setAcueductoRadio('acueductoImportanciaModernizacion', v)
          }
        />
        <RadioQuestion
          legend="7. ¿Cómo califica la gestión realizada por la Junta Directiva para lograr la formulación y gestión de los diseños de las nuevas redes de alcantarillado ante la Administración Municipal, con el propósito de mejorar el saneamiento básico de la comunidad?"
          name="acueductoGestionAlcantarillado"
          options={ACUEDUCTO_CALIFICACION}
          value={data.acueductoGestionAlcantarillado}
          onChange={(v) => setAcueductoRadio('acueductoGestionAlcantarillado', v)}
        />
        <RadioQuestion
          legend="8. ¿Considera que los recursos económicos aportados por la comunidad están siendo administrados con transparencia?"
          name="acueductoTransparenciaRecursos"
          options={ACUEDUCTO_ACUERDO}
          value={data.acueductoTransparenciaRecursos}
          onChange={(v) => setAcueductoRadio('acueductoTransparenciaRecursos', v)}
        />

        <fieldset className="survey-question">
          <legend>
            9. ¿Qué aspectos considera que deben mejorarse prioritariamente en el
            Acueducto de Sonsito? (Puede marcar varias opciones)
          </legend>
          <div className="checkbox-group">
            {ACUEDUCTO_ASPECTOS_MEJORAR.map((item) => (
              <label key={item} className="checkbox">
                <input
                  type="checkbox"
                  checked={data.acueductoAspectosMejorar.includes(item)}
                  onChange={() => toggleArray('acueductoAspectosMejorar', item)}
                />
                {item}
              </label>
            ))}
          </div>
          <label className="field">
            <span>Otro</span>
            <input
              value={data.acueductoAspectosMejorarOtro}
              onChange={(e) =>
                setData({ ...data, acueductoAspectosMejorarOtro: e.target.value })
              }
            />
          </label>
        </fieldset>

        <RadioQuestion
          legend="10. ¿Estaría dispuesto a participar en jornadas comunitarias, reuniones, veedurías ciudadanas o actividades de apoyo al acueducto?"
          name="acueductoParticipacion"
          options={ACUEDUCTO_PARTICIPACION}
          value={data.acueductoParticipacion}
          onChange={(v) => setAcueductoRadio('acueductoParticipacion', v)}
        />

        <fieldset className="survey-question">
          <legend>
            11. En una escala de 1 a 10, donde 1 es muy malo y 10 es excelente,
            ¿qué calificación le otorga a la gestión realizada por la Junta Directiva
            del Acueducto Rural Aguas Sonsito durante el último año?
          </legend>
          <label className="field field-inline">
            <span>Calificación (1–10)</span>
            <input
              type="number"
              min={0}
              max={10}
              step={1}
              placeholder="—"
              value={data.acueductoCalificacionJunta || ''}
              onChange={(e) => {
                const raw = e.target.value
                setData({
                  ...data,
                  acueductoCalificacionJunta: raw === '' ? 0 : parseInt(raw, 10) || 0,
                })
              }}
            />
          </label>
        </fieldset>

        <fieldset className="survey-question">
          <legend>
            12. ¿Qué sugerencias o recomendaciones tiene para mejorar el servicio y
            la gestión del Acueducto Rural Aguas Sonsito?
          </legend>
          <label className="field">
            <span>Sugerencias</span>
            <textarea
              rows={4}
              value={data.acueductoSugerencias}
              onChange={(e) =>
                setData({ ...data, acueductoSugerencias: e.target.value })
              }
            />
          </label>
        </fieldset>
      </CollapsibleSection>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Guardando ubicación y registro…' : 'Guardar registro'}
        </button>
      </div>
    </form>
  )
}
