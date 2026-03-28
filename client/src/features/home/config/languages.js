export const LANGUAGES = [
  { value: 'javascript', label: 'JS', full: 'JavaScript', color: '#F7DF1E', extension: 'js' },
  { value: 'typescript', label: 'TS', full: 'TypeScript', color: '#3178C6', extension: 'ts' },
  { value: 'python', label: 'PY', full: 'Python', color: '#3776AB', extension: 'py' },
  { value: 'rust', label: 'RS', full: 'Rust', color: '#CE422B', extension: 'rs' },
  { value: 'go', label: 'GO', full: 'Go', color: '#00ADD8', extension: 'go' },
  { value: 'java', label: 'JV', full: 'Java', color: '#ED8B00', extension: 'java' },
  { value: 'cpp', label: 'C++', full: 'C++', color: '#00599C', extension: 'cpp' },
  { value: 'csharp', label: 'C#', full: 'C#', color: '#9B4F96', extension: 'cs' },
]

const DEFAULT_LANGUAGE = LANGUAGES[0]

const LANGUAGE_BY_VALUE = Object.fromEntries(
  LANGUAGES.map((language) => [language.value, language]),
)

export function getLanguageMeta(language) {
  return LANGUAGE_BY_VALUE[language] || DEFAULT_LANGUAGE
}

export function getEditorFilename(language, basename = 'main') {
  return `${basename}.${getLanguageMeta(language).extension}`
}
