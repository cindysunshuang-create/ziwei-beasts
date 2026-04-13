import type { Guardian, GuardianSkill } from '../types/guardians'
import { SKILL_ANIMATION_MAP, parseSkills } from '../types/guardians'
import skillsData from '../data/skills.json'

const SKILLS: GuardianSkill[] = parseSkills(skillsData)

interface Props {
  guardian: Guardian
}

function skillById(id: string): GuardianSkill | undefined {
  return SKILLS.find(s => s.id === id)
}

function SkillBadge({ skill, index }: { skill: GuardianSkill; index: number }) {
  const animClass = SKILL_ANIMATION_MAP[skill.animationPreset] ?? 'skill-default'

  return (
    <div
      className={`guardian-skill-card skill-type-${skill.type.toLowerCase()}`}
      style={{ animationDelay: `${index * 0.4}s` }}
    >
      <div className="guardian-skill-header">
        <div className={`guardian-skill-icon-wrap ${animClass}`}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
            <circle cx="10" cy="10" r="3" fill="currentColor" opacity="0.8" />
          </svg>
        </div>
        <div className="guardian-skill-meta">
          <div className="guardian-skill-name">{skill.name}</div>
          <div className="guardian-skill-type">{skill.type}</div>
        </div>
      </div>
      <p className="guardian-skill-desc">{skill.description}</p>
    </div>
  )
}

export function GuardianSkills({ guardian }: Props) {
  const [passiveId, triggeredId, cyclicId] = guardian.skills
  const passive   = skillById(passiveId)
  const triggered = skillById(triggeredId)
  const cyclic    = skillById(cyclicId)

  if (!passive || !triggered || !cyclic) return null

  return (
    <div className="guardian-skills-section">
      <div className="guardian-skills-label">Your Guardian&apos;s Powers</div>
      <div className="guardian-skills-grid">
        <SkillBadge skill={passive}   index={0} />
        <SkillBadge skill={triggered} index={1} />
        <SkillBadge skill={cyclic}   index={2} />
      </div>
    </div>
  )
}
