// Guardian types
export interface GuardianNarrative {
  opening: string
  coreNature: string
  lifePattern: string
  innerConflict: string
  guidance: string
}

export interface GuardianSkill {
  id: string
  name: string
  type: 'Passive' | 'Triggered' | 'Cyclic'
  description: string
  animationPreset: string
}

export interface Guardian {
  id: number
  name: string
  cnName: string
  zodiac: string
  branch: string
  palace: string
  element: string
  tagline: string
  color: string
  glowColor: string
  icon: string
  desc: string
  personality: string
  strength: string
  growthEdge: string
  skills: [string, string, string] // [passiveId, triggeredId, cyclicId]
  narrative: GuardianNarrative
}

// Animation preset → CSS class mapping
export const SKILL_ANIMATION_MAP: Record<string, string> = {
  'pulse-gold':    'skill-pulse-gold',
  'align-glow':    'skill-align-glow',
  'slow-rise':     'skill-slow-rise',
  'center-pulse':  'skill-center-pulse',
  'wave-soft':     'skill-wave-soft',
  'rotate-slow':   'skill-rotate-slow',
  'tension-sharp': 'skill-tension-sharp',
  'flash-cut':     'skill-flash-cut',
  'pulse-red':     'skill-pulse-red',
  'slow-glow':     'skill-slow-glow',
  'fade-in':       'skill-fade-in',
  'rise-gradual':  'skill-rise-gradual',
  'ember':         'skill-ember',
  'ignite':        'skill-ignite',
  'flare-reset':   'skill-flare-reset',
  'blink-soft':    'skill-blink-soft',
  'shift':         'skill-shift',
  'fade-toggle':   'skill-fade-toggle',
  'throb':         'skill-throb',
  'shake':         'skill-shake',
  'zoom-out':      'skill-zoom-out',
  'tilt':          'skill-tilt',
  'fracture':      'skill-fracture',
  'break':         'skill-break',
  'coil':          'skill-coil',
  'tighten':       'skill-tighten',
  'release':       'skill-release',
  'pulse-blue':    'skill-pulse-blue',
  'wave-chaos':    'skill-wave-chaos',
  'settle':        'skill-settle',
  'horizon':       'skill-horizon',
  'jump':          'skill-jump',
  'lift':          'skill-lift',
  'outline':       'skill-outline',
  'scale':         'skill-scale',
  'reframe':       'skill-reframe',
}

// Parse raw JSON (skills.json) → typed GuardianSkill[]
interface RawSkill {
  id: string
  name: string
  type: string
  description: string
  ui: { icon: string; animationPreset: string }
}

export function parseSkills(data: unknown): GuardianSkill[] {
  return (data as RawSkill[]).map(s => ({
    id: s.id,
    name: s.name,
    type: s.type as GuardianSkill['type'],
    description: s.description,
    animationPreset: s.ui.animationPreset,
  }))
}
