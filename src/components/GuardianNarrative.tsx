import type { Guardian } from '../types/guardians'

interface Props {
  guardian: Guardian
}

interface NarrativeSection {
  key: keyof Guardian['narrative']
  title: string
}

const NARRATIVE_ORDER: NarrativeSection[] = [
  { key: 'opening',       title: 'The Encounter' },
  { key: 'coreNature',    title: 'Your Nature' },
  { key: 'lifePattern',   title: 'Your Pattern' },
  { key: 'innerConflict', title: 'The Hidden Wound' },
  { key: 'guidance',      title: 'The Invitation' },
]

export function GuardianNarrative({ guardian }: Props) {
  return (
    <div className="guardian-narrative">
      {NARRATIVE_ORDER.map((section, i) => (
        <div
          key={section.key}
          className="narrative-section"
          style={{ animationDelay: `${i * 0.5}s` }}
        >
          <div className="narrative-section-label">{section.title}</div>
          <p className="narrative-section-text">
            {guardian.narrative[section.key]}
          </p>
        </div>
      ))}
    </div>
  )
}
