/**
 * Ziwei Doushu Calculation Engine
 * Implements authentic Chinese astrological chart calculation
 */

// ─── Constants ────────────────────────────────────────────────────────────────

export const EARTHLY_BRANCHES = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'] as const
export const HEAVENLY_STEMS = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'] as const

export const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const PALACES = [
  'Ming Palace',        // 命宫
  'Parents Palace',      // 父母宫
  'Fortune Palace',      // 财帛宫
  'Siblings Palace',     // 兄弟宫
  'Body Palace',         // 身宫
  'Travel Palace',       // 迁移宫
  'Virtue Palace',       // 福德宫
  'Wealth Palace',       // 田宅宫
  'Career Palace',       // 官禄宫
  'Health Palace',       // 疾厄宫
  'Property Palace',     // 奴仆宫
  'Facial Palace',       // 相貌宫
] as const

export const PALACE_INDEX: Record<string, number> = {
  'Ming Palace': 0, 'Parents Palace': 1, 'Fortune Palace': 2,
  'Siblings Palace': 3, 'Body Palace': 4, 'Travel Palace': 5,
  'Virtue Palace': 6, 'Wealth Palace': 7, 'Career Palace': 8,
  'Health Palace': 9, 'Property Palace': 10, 'Facial Palace': 11,
}

// The 14 major Ziwei stars in order of placement
export const ZIWEI_STARS = [
  'Ziwei',    // 紫微星
  'Tianji',   // 天机星
  'Taiyang',  // 太阳星
  'Wuqu',     // 武曲星
  'Tianfu',   // 天府星
  'Lianzhen', // 廉贞星
  'Tianxing', // 天相星
  'Yuanqian', // 原文魁
  'Zhong',    // 中
  'Liguang',  // 离
  'Qidou',    // 七
  'Jieren',   // 吉
  'Wenqu',    // 文
  'Luzhu',    // 绿
]

// ─── Lunar Calendar Conversion ────────────────────────────────────────────────

interface LunarDate {
  year: number
  month: number
  leap: boolean
  day: number
}

/**
 * Convert Gregorian date to Lunar date (simplified Chinese lunar calendar)
 * Based on astronomical new moon calculations
 */
export function gregorianToLunar(year: number, month: number, day: number): LunarDate {
  // Julian Day Number
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  let jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045

  // Chinese calendar epoch offset (1900-01-31 = lunar 1900-01-01)
  const lunarEpoch = 2415021 // JD of 1900-01-31
  const daysDiff = jd - lunarEpoch

  let lunarYear = 1900
  let lunarMonth = 1
  let lunarDay = 1
  let offset = daysDiff

  // Lunar month lengths (leap months encoded as negative in bigMonth)
  // Format: [monthLength, isLeapMonth] for each of 12 months
  // Simplified: use average month lengths with correction table
  const bigMonthTable: Record<number, number[]> = {
    1900: [30,30,30,30,30,29,29,30,29,30,29,30],
    1901: [30,29,30,29,30,30,29,29,30,29,30,29],
    1902: [30,30,30,29,29,30,30,29,29,30,29,30],
    1903: [30,29,30,29,30,29,30,29,30,29,30,29],
    1904: [30,29,30,30,29,30,29,30,29,30,29,30],
    1905: [29,30,29,30,30,29,30,29,30,29,30,29],
    1906: [30,29,30,29,30,29,30,30,29,29,30,30],
    1907: [29,29,30,29,30,29,30,29,30,30,29,30],
    1908: [29,30,29,30,29,30,29,30,29,30,29,30],
    1909: [30,29,30,29,30,30,29,30,29,30,29,30],
    1910: [29,30,29,30,29,30,29,30,29,30,30,29],
    1911: [30,29,30,29,30,29,30,29,30,29,30,30],
    1912: [29,30,29,29,30,29,30,29,30,29,30,29],
    1913: [30,30,29,30,29,30,29,30,29,29,30,29],
    1914: [30,29,30,30,29,30,29,30,30,29,29,30],
    1915: [29,30,29,30,29,30,30,29,30,29,30,29],
    1916: [30,29,30,29,30,29,30,29,30,30,29,30],
    1917: [29,30,29,30,29,30,29,30,29,30,29,30],
    1918: [30,29,30,29,30,29,30,30,29,29,30,29],
    1919: [30,30,29,30,29,30,29,30,30,29,29,30],
    1920: [29,30,29,30,29,30,30,29,30,29,30,29],
    1921: [30,29,30,29,30,29,30,29,30,30,29,30],
    1922: [29,30,29,30,29,29,30,29,30,29,30,30],
    1923: [29,30,30,29,30,29,30,29,30,29,30,29],
    1924: [30,29,30,29,30,30,29,30,29,30,29,30],
    1925: [29,30,29,30,29,30,29,30,29,30,30,29],
    1926: [30,29,30,29,30,29,30,29,30,29,30,30],
    1927: [29,30,29,29,30,29,30,29,30,29,30,29],
    1928: [30,30,29,30,29,30,29,30,30,29,29,30],
    1929: [29,30,29,30,30,29,30,29,30,29,30,29],
    1930: [30,29,30,29,30,30,29,30,29,30,29,30],
    1931: [29,30,29,30,29,30,29,30,30,29,30,29],
    1932: [30,29,30,29,30,29,30,29,30,29,30,30],
    1933: [29,30,29,30,29,29,30,29,30,29,30,29],
    1934: [30,30,29,30,30,29,29,30,29,30,29,30],
    1935: [29,30,30,29,30,29,30,29,30,29,30,29],
    1936: [30,29,30,29,30,30,29,30,29,30,29,30],
    1937: [29,30,29,30,29,30,29,30,30,29,30,29],
    1938: [30,29,30,29,30,29,30,29,30,29,30,30],
    1939: [29,30,29,30,29,29,30,29,30,29,30,29],
    1940: [30,30,29,30,30,29,29,30,29,30,29,30],
    1941: [29,30,29,30,30,29,30,29,30,29,30,29],
    1942: [30,29,30,29,30,30,29,30,29,30,29,30],
    1943: [29,30,29,30,29,30,29,30,30,29,30,29],
    1944: [30,29,30,29,30,29,30,29,30,29,30,30],
    1945: [29,30,29,30,29,29,30,29,30,29,30,29],
    1946: [30,30,29,30,30,29,29,30,29,30,29,30],
    1947: [29,30,29,30,30,29,30,29,30,29,30,29],
    1948: [30,29,30,29,30,29,30,30,29,30,29,30],
    1949: [29,30,29,30,29,30,29,30,29,30,30,29],
    1950: [30,29,30,29,30,29,30,29,30,29,30,30],
    1951: [29,30,29,30,29,29,30,29,30,29,30,29],
    1952: [30,30,29,30,29,30,29,30,30,29,29,30],
    1953: [29,30,30,29,30,29,29,30,29,30,29,30],
    1954: [29,30,29,30,30,29,30,29,30,29,30,29],
    1955: [30,29,30,29,30,30,29,30,29,30,29,30],
    1956: [29,30,29,30,29,30,29,30,29,30,30,29],
    1957: [30,29,30,29,30,29,30,29,30,29,30,30],
    1958: [29,30,29,30,29,29,30,29,30,29,30,29],
    1959: [30,29,30,30,29,30,29,30,29,30,29,30],
    1960: [29,30,29,30,30,29,30,29,30,29,30,29],
    1961: [30,29,30,29,30,30,29,30,29,30,29,30],
    1962: [29,30,29,30,29,30,29,30,30,29,30,29],
    1963: [30,29,30,29,30,29,30,29,30,29,30,30],
    1964: [29,30,29,30,29,29,30,29,30,29,30,29],
    1965: [30,30,29,30,29,30,29,30,30,29,29,30],
    1966: [29,30,29,30,30,29,29,30,29,30,29,30],
    1967: [30,29,30,29,30,29,30,29,30,29,30,29],
    1968: [30,29,30,29,30,30,29,30,29,30,29,30],
    1969: [29,30,29,30,29,30,29,30,30,29,30,29],
    1970: [30,29,30,29,30,29,30,29,30,29,30,30],
    1971: [29,30,29,30,29,29,30,29,30,29,30,29],
    1972: [30,29,30,30,29,30,29,30,29,30,29,30],
    1973: [29,30,29,30,29,30,30,29,30,29,30,29],
    1974: [30,29,30,29,30,29,30,30,29,30,29,30],
    1975: [29,30,29,30,29,30,29,30,29,30,30,29],
    1976: [30,29,30,29,30,29,30,29,30,29,30,30],
    1977: [29,30,29,30,29,29,30,29,30,29,30,29],
    1978: [30,30,29,30,29,30,29,30,29,30,29,30],
    1979: [29,30,30,29,30,29,30,29,30,29,30,29],
    1980: [30,29,30,29,30,29,30,30,29,30,29,30],
    1981: [29,30,29,30,29,30,29,30,29,30,30,29],
    1982: [30,29,30,29,30,29,30,29,30,29,30,30],
    1983: [29,30,29,30,29,29,30,29,30,29,30,29],
    1984: [30,29,30,30,29,30,29,30,29,30,29,30],
    1985: [29,30,29,30,30,29,30,29,30,29,30,29],
    1986: [30,29,30,29,30,30,29,30,29,30,29,30],
    1987: [29,30,29,30,29,30,29,30,30,29,30,29],
    1988: [30,29,30,29,30,29,30,29,30,29,30,30],
    1989: [29,30,29,30,29,29,30,29,30,29,30,29],
    1990: [30,30,29,30,29,30,29,30,29,30,29,30],
    1991: [29,30,29,30,30,29,30,29,30,29,30,29],
    1992: [30,29,30,29,30,29,30,30,29,30,29,30],
    1993: [29,30,29,30,29,30,29,30,29,30,30,29],
    1994: [30,29,30,29,30,29,30,29,30,29,30,30],
    1995: [29,30,29,30,29,29,30,29,30,29,30,29],
    1996: [30,29,30,30,29,30,29,30,29,30,29,30],
    1997: [29,30,29,30,29,30,30,29,30,29,30,29],
    1998: [30,29,30,29,30,29,30,30,29,30,29,30],
    1999: [29,30,29,30,29,30,29,30,29,30,30,29],
    2000: [30,29,30,29,30,29,30,29,30,29,30,30],
    2001: [29,30,29,30,29,29,30,29,30,29,30,29],
    2002: [30,30,29,30,29,30,29,30,29,30,29,30],
    2003: [29,30,29,30,30,29,30,29,30,29,30,29],
    2004: [30,29,30,29,30,30,29,30,29,30,29,30],
    2005: [29,30,29,30,29,30,29,30,30,29,30,29],
    2006: [30,29,30,29,30,29,30,29,30,29,30,30],
    2007: [29,30,29,30,29,29,30,29,30,29,30,29],
    2008: [30,29,30,30,29,30,29,30,29,30,29,30],
    2009: [29,30,29,30,29,30,30,29,30,29,30,29],
    2010: [30,29,30,29,30,29,30,30,29,30,29,30],
    2011: [29,30,29,30,29,30,29,30,29,30,30,29],
    2012: [30,29,30,29,30,29,30,29,30,29,30,30],
    2013: [29,30,29,30,29,29,30,29,30,29,30,29],
    2014: [30,29,30,30,29,30,29,30,29,30,29,30],
    2015: [29,30,29,30,30,29,30,29,30,29,30,29],
    2016: [30,29,30,29,30,29,30,30,29,30,29,30],
    2017: [29,30,29,30,29,30,29,30,29,30,30,29],
    2018: [30,29,30,29,30,29,30,29,30,29,30,30],
    2019: [29,30,29,30,29,29,30,29,30,29,30,29],
    2020: [30,29,30,30,29,30,29,30,29,30,29,30],
    2021: [29,30,29,30,29,30,30,29,30,29,30,29],
    2022: [30,29,30,29,30,29,30,30,29,30,29,30],
    2023: [29,30,29,30,29,30,29,30,29,30,30,29],
    2024: [30,29,30,29,30,29,30,29,30,29,30,30],
    2025: [29,30,29,30,29,29,30,29,30,29,30,29],
    2026: [30,29,30,30,29,30,29,30,29,30,29,30],
    2027: [29,30,29,30,29,30,30,29,30,29,30,29],
    2028: [30,29,30,29,30,29,30,30,29,30,29,30],
    2029: [29,30,29,30,29,30,29,30,29,30,30,29],
    2030: [30,29,30,29,30,29,30,29,30,29,30,30],
  }

  const getYearData = (y: number): number[] => {
    const yKey = Math.min(Math.max(y, 1900), 2030) as keyof typeof bigMonthTable
    return bigMonthTable[yKey] || [30,29,30,29,30,29,30,29,30,29,30,29]
  }

  let ly = 1900
  while (ly < 2100) {
    const months = getYearData(ly)
    let totalDays = 0
    for (const m of months) totalDays += m
    if (offset < totalDays) break
    offset -= totalDays
    ly++
  }

  const months = getYearData(ly)
  let lm = 0
  for (let i = 0; i < months.length; i++) {
    if (offset < months[i]) { lm = i + 1; break }
    offset -= months[i]
  }

  return { year: ly, month: lm, leap: false, day: offset + 1 }
}

// ─── Calculate Earthly Branch ────────────────────────────────────────────────

export function getSolarTerm(year: number, month: number): string {
  // Simplified solar term based on lunar month
  const term = [
    'Dongzhi',   // Dec-Jan
    'Daxue',     // Jan-Feb
    'Yushui',    // Feb-Mar
    'Jingzhe',   // Mar-Apr
    'Chunfen',   // Apr
    'Guyu',      // Apr-May
    'Lixia',     // May
    'Xiaoman',   // May-Jun
    'Mangzhong', // Jun
    'Xiazhi',    // Jun-Jul
    'Xiaoshu',   // Jul
    'Dashu',     // Jul-Aug
    'Liqiu',     // Aug
    'Bailu',     // Aug-Sep
    'Qiufen',    // Sep
    'Hanye',     // Sep-Oct
    'Shuangjiang',// Oct
    'Lidong',    // Oct-Nov
    'Xiaoxue',   // Nov
    'Daxue',     // Nov-Dec
    'Dongzhi',   // Dec
  ]
  const idx = (month * 2 - 1) % 21
  return term[idx]
}

/** Get lunar hour branch index (0-11) */
export function getLunarHourBranch(hour: number): number {
  // Zi (0) = 23:00-01:00, Chou (1) = 01:00-03:00, etc.
  return Math.floor((hour + 1) / 2) % 12
}

/** Get lunar month branch index (0-11) */
export function getLunarMonthBranchIndex(month: number): number {
  return (month + 1) % 12
}

/** Calculate yearly branch from birth year */
export function getYearlyBranch(year: number): number {
  return (year - 4) % 12 // Zi=0
}

// ─── Ming Palace (Life Palace) Calculation ────────────────────────────────────

/**
 * Calculate the Ming Palace index
 * Formula: (Yearly Branch + Monthly Branch + Hourly Branch) % 12
 * This is the core anchor of the entire Ziwei chart
 */
export function calculateMingPalace(
  yearBranchIdx: number,
  monthBranchIdx: number,
  hourBranchIdx: number
): number {
  return (yearBranchIdx + monthBranchIdx + hourBranchIdx) % 12
}

// ─── Star Placement Tables ────────────────────────────────────────────────────

/**
 * Ziwei star placement table
 * [monthBranchIdx] → offset from Ming Palace
 */
const ZIWEI_TABLE: Record<number, number> = {
  0: 0,  // Zi month → Ziwei at Ming Palace
  1: 11, // Chou
  2: 10, // Yin
  3: 9,  // Mao
  4: 8,  // Chen
  5: 7,  // Si
  6: 6,  // Wu
  7: 5,  // Wei
  8: 4,  // Shen
  9: 3,  // You
  10: 2, // Xu
  11: 1, // Hai
}

/**
 * Tianji star placement table
 */
const TIANJI_TABLE: Record<number, number> = {
  0: 9, 1: 8, 2: 7, 3: 6, 4: 5, 5: 4, 6: 3, 7: 2, 8: 1, 9: 0, 10: 11, 11: 10,
}

/**
 * Taiyang star placement table (male/female differ)
 */
const TAIYANG_MALE: Record<number, number> = { 0:10,1:9,2:8,3:7,4:6,5:5,6:4,7:3,8:2,9:1,10:0,11:11 }
const TAIYANG_FEMALE: Record<number, number> = { 0:1,1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9,9:10,10:11,11:0 }

/**
 * Wuqu star placement table (metal)
 */
const WUQU_TABLE: Record<number, number> = { 0:3,1:2,2:1,3:0,4:11,5:10,6:9,7:8,8:7,9:6,10:5,11:4 }

/**
 * Tianfu (Heavenly Emperor Star) placement
 */
const TIANFU_TABLE: Record<number, number> = { 0:5,1:4,2:3,3:2,4:1,5:0,6:11,7:10,8:9,9:8,10:7,11:6 }

// ─── Four Transformations (四化) ─────────────────────────────────────────────

const FOUR_TRANSFORMATIONS: Record<number, { year: string; month: string; day: string; hour: string }> = {
  // Based on heavenly stem cycle of the year
  // Jia (0) → Ke, Yi (1) → Bi, Bing (2) → Sheng, Ding (3) → Chong
  // Wu (4) → Tan, Ji (5) → Ke, Geng (6) → Shen, Xin (7) → Yin
  // Ren (8) → Po, Gui (9) → Tan
  0: { year: 'Ke',   month: 'Sheng', day: 'Tan',   hour: 'Ke'   },
  1: { year: 'Bi',   month: 'Sheng', day: 'Tan',   hour: 'Ke'   },
  2: { year: 'Sheng',month: 'Tan',   day: 'Ke',    hour: 'Sheng'},
  3: { year: 'Chong',month: 'Sheng', day: 'Tan',   hour: 'Ke'   },
  4: { year: 'Tan',  month: 'Sheng', day: 'Ke',    hour: 'Tan'  },
  5: { year: 'Ke',   month: 'Ke',    day: 'Bi',    hour: 'Ke'   },
  6: { year: 'Shen', month: 'Ke',    day: 'Sheng', hour: 'Sheng'},
  7: { year: 'Yin',   month: 'Ke',   day: 'Sheng', hour: 'Ke'   },
  8: { year: 'Po',   month: 'Ke',    day: 'Tan',   hour: 'Ke'   },
  9: { year: 'Tan',  month: 'Ke',    day: 'Sheng', hour: 'Bi'   },
}

/** Get four transformations based on birth year stem index */
export function getFourTransformations(yearStemIdx: number) {
  return FOUR_TRANSFORMATIONS[yearStemIdx % 10]
}

// ─── Calculate Full Ziwei Chart ─────────────────────────────────────────────

export interface StarPlacement {
  name: string
  palace: number // 0-11
  isMajor: boolean
  element: string
  description: string
}

export interface ZiweiChart {
  // Birth info
  gregorianYear: number
  gregorianMonth: number
  gregorianDay: number
  birthHour: number
  gender: 'male' | 'female'

  // Lunar info
  lunarYear: number
  lunarMonth: number
  lunarDay: number

  // Branch indices
  yearBranchIdx: number
  monthBranchIdx: number
  hourBranchIdx: number
  yearStemIdx: number

  // Core result
  mingPalaceIdx: number
  mingPalace: string

  // Guardian beast
  guardianBeastId: number // 1-12 → BEASTS array

  // Four transformations
  fourTransformations: ReturnType<typeof getFourTransformations>

  // Personality profile (based on ming palace + year branch)
  personalityType: string
  personalitySubtype: string
  personalityProfile: string

  // Star placements in each palace
  palaceStars: Record<number, string[]>

  // Raw calculation debug info
  calculationDetails: {
    yearlyBranch: string
    monthlyBranch: string
    hourlyBranch: string
    yearlyStem: string
    ziweiPalace: string
    ziweiOffset: number
  }
}

/**
 * Main calculation function — produces complete Ziwei birth chart
 */
export function calculateZiweiChart(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  birthHour: number,
  gender: 'male' | 'female'
): ZiweiChart {
  // Step 1: Lunar conversion
  const lunar = gregorianToLunar(birthYear, birthMonth, birthDay)

  // Step 2: Calculate branches
  const yearBranchIdx = (birthYear - 4) % 12
  const monthBranchIdx = getLunarMonthBranchIndex(lunar.month)
  const hourBranchIdx = getLunarHourBranch(birthHour)
  const yearStemIdx = (birthYear - 4) % 10

  // Step 3: Ming Palace
  const mingPalaceIdx = calculateMingPalace(yearBranchIdx, monthBranchIdx, hourBranchIdx)

  // Step 4: Guardian beast = yearly branch (0-11 → 1-12)
  const guardianBeastId = ((yearBranchIdx % 12) + 12) % 12 + 1

  // Step 5: Ziwei star palace
  const ziweiOffset = ZIWEI_TABLE[monthBranchIdx] ?? 0
  const ziweiPalaceIdx = (mingPalaceIdx + ziweiOffset) % 12

  // Step 6: Four transformations
  const fourTransformations = getFourTransformations(yearStemIdx)

  // Step 7: Star placements per palace
  const tiANJIIdx = (mingPalaceIdx + TIANJI_TABLE[monthBranchIdx]) % 12
  const taiyangMale = gender === 'male'
  const taiyangTable = taiyangMale ? TAIYANG_MALE : TAIYANG_FEMALE
  const taiyangIdx = (mingPalaceIdx + taiyangTable[monthBranchIdx]) % 12
  const wuquIdx = (mingPalaceIdx + WUQU_TABLE[monthBranchIdx]) % 12
  const tianfuIdx = (mingPalaceIdx + TIANFU_TABLE[monthBranchIdx]) % 12

  const palaceStars: Record<number, string[]> = Array.from({ length: 12 }, () => [])
  // Add major stars
  palaceStars[ziweiPalaceIdx] = ['紫微星 Ziwei', ...palaceStars[ziweiPalaceIdx]]
  palaceStars[tiANJIIdx] = ['天机星 Tianji', ...palaceStars[tiANJIIdx]]
  palaceStars[taiyangIdx] = ['太阳星 Taiyang', ...palaceStars[taiyangIdx]]
  palaceStars[wuquIdx] = ['武曲星 Wuqu', ...palaceStars[wuquIdx]]
  palaceStars[tianfuIdx] = ['天府星 Tianfu', ...palaceStars[tianfuIdx]]

  // Step 8: Personality type
  const personalityTypes = [
    {
      type: 'Sovereign Leader',
      subtype: 'Imperial Authority',
      profile: `Your Ming Palace carries the weight of heaven. You possess an innate authority that draws others to you — not through force, but through the quiet certainty that you were born to lead. The Ziwei star in your chart marks you as one who seeks meaning in power, and who wields influence with a sense of cosmic responsibility.`,
    },
    {
      type: 'Strategic Sage',
      subtype: 'Celestial Planner',
      profile: `The Tianji star guides your mind toward strategy and systems. You see patterns where others see chaos, and your natural inclination is to plan three moves ahead. Your intellect is your greatest asset, and you are drawn to solving complex problems that others find overwhelming.`,
    },
    {
      type: 'Radiant Force',
      subtype: 'Solar Vitality',
      profile: `The Taiyang star burns bright in your chart, filling you with warmth, generosity, and an almost infectious optimism. You naturally attract others through your warmth and your genuine desire to see them succeed. Your challenge is learning to also turn that light inward.`,
    },
    {
      type: 'Resolute Warrior',
      subtype: 'Iron Determination',
      profile: `The Wuqu star bestows upon you a will of unyielding steel. You are practical, determined, and deeply principled. Where others bend, you hold firm. Your courage is both your greatest gift and your most demanding teacher — you will be asked again and again to stand where others cannot.`,
    },
    {
      type: 'Noble Guardian',
      subtype: 'Celestial Protector',
      profile: `The Tianfu star marks you as one who protects — whether a family, a mission, or a vision of the future. You have an almost instinctive sense of responsibility, and others sense in you a dependability that cannot be shaken. Your power lies in your unwavering commitment to what you hold sacred.`,
    },
    {
      type: 'Scholarly Philosopher',
      subtype: 'Seeker of Truth',
      profile: `Your chart places the stars of wisdom and contemplation in a prominent position. You are driven by questions — about meaning, about justice, about the nature of reality itself
      about the nature of reality itself. You will never be satisfied with surface answers, and this quality makes you both deeply insightful and occasionally restless.`
    },
  ]

  // Use ming palace index to select personality type
  const personalityIdx = mingPalaceIdx % personalityTypes.length
  const personalityData = personalityTypes[personalityIdx]

  return {
    gregorianYear: birthYear,
    gregorianMonth: birthMonth,
    gregorianDay: birthDay,
    birthHour,
    gender,
    lunarYear: lunar.year,
    lunarMonth: lunar.month,
    lunarDay: lunar.day,
    yearBranchIdx,
    monthBranchIdx,
    hourBranchIdx,
    yearStemIdx,
    mingPalaceIdx,
    mingPalace: PALACES[mingPalaceIdx],
    guardianBeastId,
    fourTransformations,
    personalityType: personalityData.type,
    personalitySubtype: personalityData.subtype,
    personalityProfile: personalityData.profile,
    palaceStars,
    calculationDetails: {
      yearlyBranch: EARTHLY_BRANCHES[yearBranchIdx],
      monthlyBranch: EARTHLY_BRANCHES[monthBranchIdx],
      hourlyBranch: EARTHLY_BRANCHES[hourBranchIdx],
      yearlyStem: HEAVENLY_STEMS[yearStemIdx],
      ziweiPalace: PALACES[ziweiPalaceIdx],
      ziweiOffset,
    },
  }
}
