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

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.theme.set(LOOK)

    return next(e)
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

    return <Text color="#ff8fc7">♡ pink and cute ♡</Text>
  })
}
