import { useId, useState } from 'react'

type EnterKeyHint = 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send'

export function TextField({
  label,
  value,
  onChange,
  type = 'text',
  inputMode,
  autoComplete,
  enterKeyHint,
  required,
  multiline,
  rows = 4,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'tel'
  inputMode?: 'text' | 'tel' | 'email' | 'numeric' | 'decimal'
  autoComplete?: string
  enterKeyHint?: EnterKeyHint
  required?: boolean
  multiline?: boolean
  rows?: number
}) {
  const id = useId()
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      {multiline ? (
        <textarea
          id={id}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          id={id}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          enterKeyHint={enterKeyHint}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  )
}

export function ChoiceGroup({
  legend,
  name,
  options,
  value,
  onChange,
  clearable = false,
}: {
  legend: string
  name: string
  options: readonly string[]
  value: string
  onChange: (value: string) => void
  clearable?: boolean
}) {
  return (
    <fieldset className="survey-question choice-group">
      <legend>{legend}</legend>
      <div className="choice-list" role="radiogroup" aria-label={legend}>
        {options.map((opt) => {
          const selected = value === opt
          return (
            <button
              key={opt}
              type="button"
              name={name}
              className={`choice-option${selected ? ' choice-option--selected' : ''}`}
              aria-pressed={selected}
              onClick={() => onChange(selected && clearable ? '' : opt)}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export function ChipMultiSelect({
  legend,
  options,
  selected,
  onToggle,
}: {
  legend: string
  options: readonly string[]
  selected: string[]
  onToggle: (item: string) => void
}) {
  return (
    <fieldset className="survey-question chip-group">
      <legend>{legend}</legend>
      <div className="chip-list">
        {options.map((item) => {
          const on = selected.includes(item)
          return (
            <button
              key={item}
              type="button"
              className={`chip${on ? ' chip--selected' : ''}`}
              aria-pressed={on}
              onClick={() => onToggle(item)}
            >
              {item}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export function NumberStepper({
  label,
  value,
  onChange,
  min = 0,
  max = 1000,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}) {
  const id = useId()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  const clamp = (n: number) => Math.min(max, Math.max(min, n))

  const commitDraft = () => {
    setEditing(false)
    const parsed = parseInt(draft, 10)
    if (!Number.isNaN(parsed)) onChange(clamp(parsed))
  }

  return (
    <div className="stepper field-stepper">
      <span className="stepper-label" id={id}>
        {label}
      </span>
      <div className="stepper-controls" aria-labelledby={id}>
        <button
          type="button"
          className="stepper-btn"
          aria-label={`Disminuir ${label}`}
          disabled={value <= min}
          onClick={() => onChange(clamp(value - 1))}
        >
          −
        </button>
        {editing ? (
          <input
            className="stepper-input"
            type="text"
            inputMode="numeric"
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value.replace(/\D/g, ''))}
            onBlur={commitDraft}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitDraft()
            }}
          />
        ) : (
          <button
            type="button"
            className="stepper-value"
            aria-label={`Editar ${label}`}
            onClick={() => {
              setDraft(String(value))
              setEditing(true)
            }}
          >
            {value}
          </button>
        )}
        <button
          type="button"
          className="stepper-btn"
          aria-label={`Aumentar ${label}`}
          disabled={value >= max}
          onClick={() => onChange(clamp(value + 1))}
        >
          +
        </button>
      </div>
    </div>
  )
}

export function RatingScale({
  legend,
  value,
  onChange,
}: {
  legend: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <fieldset className="survey-question rating-field">
      <legend>{legend}</legend>
      <div className="rating-scale" role="radiogroup" aria-label={legend}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
          const selected = value === n
          return (
            <button
              key={n}
              type="button"
              className={`rating-cell${selected ? ' rating-cell--selected' : ''}`}
              aria-pressed={selected}
              onClick={() => onChange(selected ? 0 : n)}
            >
              {n}
            </button>
          )
        })}
      </div>
      <p className="rating-hint muted">
        {value ? `Seleccionado: ${value}` : 'Toque un número del 1 al 10'}
      </p>
    </fieldset>
  )
}
