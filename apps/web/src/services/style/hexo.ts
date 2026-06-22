const ALERT_HEADING = /^!!! (\S+) (.+)$/
const ALERT_BODY_INDENT = /^ {4}(.*)$/

const ALERT_TYPE_MAP: Record<string, string> = {
  info: `NOTE`,
  note: `TIP`,
  warning: `WARNING`,
}

const DEFAULT_ALERT_TYPE = `TIP`

function mapAlertType(type: string): string {
  return ALERT_TYPE_MAP[type] ?? DEFAULT_ALERT_TYPE
}

/** 去掉 Markdown 加粗标记 **，使文本不再加粗显示 */
export function removeBoldMarkers(content: string): string {
  return content.replace(/\*\*/g, ``)
}

/** 将相对路径 ../../../ 替换为 Hexo 站点地址 */
export function replaceHexoRelativeUrls(content: string): string {
  return content.split(`../../../`).join(`https://www.techgrow.cn/`)
}

/**
 * 将 pymdown 风格提示块转换为 GitHub 风格引用块：
 * - `!!! info` → `> [!NOTE]`
 * - `!!! note` → `> [!TIP]`
 * - `!!! warning` → `> [!WARNING]`
 * - 其他 `!!! xxx` → `> [!TIP]`
 */
export function convertAlertBlocks(content: string): string {
  const lines = content.split(`\n`)
  const result: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const headingMatch = lines[i].match(ALERT_HEADING)
    if (!headingMatch) {
      result.push(lines[i])
      continue
    }

    const alertType = headingMatch[1]
    const title = headingMatch[2]
    result.push(`> [!${mapAlertType(alertType)}] ${title}`)

    while (i + 1 < lines.length) {
      const bodyMatch = lines[i + 1].match(ALERT_BODY_INDENT)
      if (!bodyMatch)
        break

      i++
      result.push(`> ${bodyMatch[1]}`)
    }
  }

  return result.join(`\n`)
}

/** 删除含 Hexo 标记 <!-- more -->、<!-- toc --> 的整行 */
export function removeHexoMarkerLines(content: string): string {
  return content
    .split(`\n`)
    .filter(line => !/^\s*<!--\s*(?:more|toc)\s*-->\s*$/.test(line))
    .join(`\n`)
}

/** 去掉代码块语言标识前的空格，如 ``` sh → ```sh */
export function normalizeCodeFenceLanguage(content: string): string {
  return content.replace(/^(\s*```)[ \t]+(\S+)/gm, `$1$2`)
}

/** 依次应用 Hexo 风格所需的 Markdown 转换 */
export function applyHexoStyleMarkdown(content: string): string {
  let result = content
  result = removeBoldMarkers(result)
  result = replaceHexoRelativeUrls(result)
  result = convertAlertBlocks(result)
  result = removeHexoMarkerLines(result)
  result = normalizeCodeFenceLanguage(result)
  return result
}
