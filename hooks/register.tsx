import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

const MAX = 9
const commands = atom({ plugin: 'spectra-buttons', key: 'commands' } as const, [] as string[])

// `/spectra-<skill>` 後面可帶一個參數（change 名、gl-<id>-…、#<id>）；只收 ASCII token，
// 避免把句子後面的中文一起吃進去
const PATTERN = /(?<![\w/])\/(spectra-[a-z][a-z-]*)(?:[ \t]+(#?[A-Za-z0-9][\w.\-/#]*))?/g

export const extractCommands = (text: string): string[] => {
  const seen = new Set<string>()
  for (const m of text.matchAll(PATTERN)) {
    const arg = m[2]?.replace(/[.,;:]+$/, '')
    seen.add(arg ? `/${m[1]} ${arg}` : `/${m[1]}`)
  }
  return [...seen].slice(0, MAX)
}

export const register: Register = on => {
  on('turn.complete', async ($, e, next) => {
    if (!e.agentId) await update($, commands, () => extractCommands(e.answer))
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const list = await read($, commands)
    if (e.props.hasSurvey || e.props.isWorking || list.length === 0) return next(e)

    const { Box, Button, Text } = $.ui.resolve(e)

    return (
      <Box flexDirection="row" flexWrap="wrap" columnGap={2}>
        <Text dimColor>spectra:</Text>
        {list.map((cmd, n) => (
          <Button
            key={`cmd-${n}`}
            hotkey={String(n + 1)}
            plain
            onPress={() => void $.prompt.fill({ text: cmd })}
          >
            {cmd}
          </Button>
        ))}
        <Button key="dismiss" role="dismiss" dimColor onPress={() => void update($, commands, () => [])}>
          ✕
        </Button>
      </Box>
    )
  })
}
