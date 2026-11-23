import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Strawberry milk by day, plum by night. Red, green and amber keep their meaning.
const { theme } = makeColors({
  label: 'Pink and cute',
  roles: { accent: '#e0559b', danger: '#d13b4f', success: '#3f9b6b', warning: '#c98a1b', pro: '#a565d6' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#fbe4ee',
        'surface-1': '#fdeef4',
        'surface-2': '#fff6fa',
        'text-primary': '#3d1f2e',
        'text-secondary': '#63404f',
        'text-muted': '#7a5567',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#24141c',
        'surface-1': '#2c1a23',
        'surface-2': '#34202a',
        'surface-3': '#3b2530',
        'text-primary': '#fbe6ef',
        'text-secondary': '#e3c3d1',
        'text-muted': '#bf9aab',
      },
    },
  },
})

const LOOK: ThemeSetArgs = { colors: theme }

const WORDS = ['Twirling', 'Sparkling', 'Frosting', 'Daydreaming', 'Snuggling', 'Glittering', 'Blooming', 'Fluffing']

const PINK = '#ff8fc7'

// A sticker for the tool's row and a mood for the status line; any other tool gets OTHER.
const TOOLS = new Map<string, readonly [sticker: string, mood: string]>([
  ['Read', ['📖', 'reading']],
  ['Edit', ['🎀', 'typing']],
  ['Write', ['🎀', 'typing']],
  ['NotebookEdit', ['🎀', 'typing']],
  ['Grep', ['🔍', 'searching']],
  ['Glob', ['🔍', 'searching']],
  ['Bash', ['🐚', 'running']],
  ['WebFetch', ['🌐', 'browsing']],
  ['WebSearch', ['🌐', 'browsing']],
  ['Agent', ['🧸', 'delegating']],
])
const OTHER = ['✨', 'busy'] as const

const THINKING = 'thinking ♡'
const NAPPING = 'napping zzz'
const OOPSIE = '(╥﹏╥) oopsie'

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.theme.set(LOOK)
    $.ui.status(NAPPING)

    return next(e)
  })

  // The mood follows the main loop alone: a subagent's turns and calls leave it be.
  on('turn.start', ($, e, next) => {
    if (e.agentId === undefined) {
      $.ui.status(THINKING)
    }

    return next(e)
  })

  on('tool.call', async ($, e, next) => {
    if (e.agentId !== undefined) {
      return next(e)
    }

    $.ui.status(`${(TOOLS.get(e.tool) ?? OTHER)[1]} ✿`)
    const ran = await next(e)
    $.ui.status(ran.deny === undefined && ran.isError === true ? OOPSIE : THINKING)

    return ran
  })

  on('turn.complete', ($, e, next) => {
    if (e.agentId === undefined) {
      $.ui.status(NAPPING)
    }

    return next(e)
  })

  on('ui.render', { component: 'ToolUse' }, async ($, e, next) => {
    const row = await next(e)
    const { Box, Text } = $.ui.resolve(e)
    const stuck = (
      <Box>
        <Text>{(TOOLS.get(e.props.tool) ?? OTHER)[0]} </Text>
        {row}
      </Box>
    )

    // An Esc is no failure, so an interrupted call gets no sad face.
    if (!e.props.isErrored || e.props.isInterrupted) {
      return stuck
    }

    return (
      <Box flexDirection="column">
        {stuck}
        <Text color={PINK}>{OOPSIE}</Text>
      </Box>
    )
  })

  on('ui.render', { component: 'Spinner' }, ($, e, next) => {
    // The engine's word is fixed for the turn, so its length picks one word for the whole turn.
    const word = WORDS[e.props.word.length % WORDS.length] ?? e.props.word

    return next({ ...e, props: { ...e.props, word, suffix: ' ♡' } })
  })

  // The terminal draws no theme, so this row is its pink.
  on('ui.render', { component: 'AbovePrompt' }, ($, e, next) => {
    if (e.surface !== 'terminal' || e.props.hasSurvey) {
      return next(e)
    }

    const { Text } = $.ui.resolve(e)

    return <Text color={PINK}>♡ pink and cute ♡</Text>
  })
}
