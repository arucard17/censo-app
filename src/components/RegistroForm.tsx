import { useState, type FormEvent } from 'react'
import {
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

interface RegistroFormProps {
  onSubmit: (payload: RegistroPayload) => Promise<void>
  onCancel: () => void
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

export function RegistroForm({ onSubmit, onCancel }: RegistroFormProps) {
  const [data, setData] = useState<RegistroPayload>(emptyRegistroPayload)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const setNum = (name: keyof RegistroPayload, value: number) => {
    setData((d) => ({ ...d, [name]: value }))
  }

  const toggleArray = (
    field: 'serviciosPublicos' | 'necesidades',
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
      await onSubmit({
        ...data,
        nombre: data.nombre.trim(),
        email: data.email.trim(),
        celular: data.celular.trim(),
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
