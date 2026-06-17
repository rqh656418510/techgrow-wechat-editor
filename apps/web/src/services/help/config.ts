function isEnvFlagEnabled(flag: string | undefined, defaultValue: boolean): boolean {
  if (flag === `false` || flag === `0`)
    return false
  if (flag === `true` || flag === `1`)
    return true
  return defaultValue
}

/** 是否在帮助菜单中展示「语法帮助」 */
export function isHelpMarkdownEnabled(): boolean {
  return isEnvFlagEnabled(import.meta.env.VITE_HELP_MARKDOWN_ENABLED, false)
}

/** 是否在帮助菜单中展示「反馈」 */
export function isHelpFeedbackEnabled(): boolean {
  return isEnvFlagEnabled(import.meta.env.VITE_HELP_FEEDBACK_ENABLED, false)
}

/** 是否在帮助菜单中展示「版本历史」 */
export function isHelpReleasesEnabled(): boolean {
  return isEnvFlagEnabled(import.meta.env.VITE_HELP_RELEASES_ENABLED, false)
}

/** 是否在帮助菜单中展示「关于」 */
export function isHelpAboutEnabled(): boolean {
  return isEnvFlagEnabled(import.meta.env.VITE_HELP_ABOUT_ENABLED, false)
}

/** 是否在帮助菜单中展示「赞赏」 */
export function isHelpFundEnabled(): boolean {
  return isEnvFlagEnabled(import.meta.env.VITE_HELP_FUND_ENABLED, false)
}

/** 是否在 UI 中展示帮助菜单 */
export function isHelpMenuEnabled(): boolean {
  return isHelpMarkdownEnabled()
    || isHelpFeedbackEnabled()
    || isHelpReleasesEnabled()
    || isHelpAboutEnabled()
    || isHelpFundEnabled()
}
