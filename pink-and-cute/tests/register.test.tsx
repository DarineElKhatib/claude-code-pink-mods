import { expect, test } from 'claude-code/testing'

const ROW = {
  plugin: 'pink-and-cute',
  component: 'ToolUse',
  requestId: 't1',
} as const

const props = (tool: string, isErrored: boolean) => ({
  tool_use_id: 't1',
  tool,
  input: {},
  isRunning: false,
  isErrored,
  isInterrupted: false,
})

test('a tool row gets its sticker, and a sad face only when it failed', async $ => {
  for (const surface of ['terminal', 'desktop'] as const) {
    const fine = await $.ui.mount({ ...ROW, surface, props: props('Edit', false) })
    expect(await fine.find({ type: 'Text', text: /🎀/ })).toBeDefined()
    expect(await fine.find({ type: 'Text', text: /oopsie/ })).toBeUndefined()
    await fine.unmount()

    const failed = await $.ui.mount({ ...ROW, surface, props: props('mcp__x__y', true) })
    expect(await failed.find({ type: 'Text', text: /✨/ })).toBeDefined()
    expect(await failed.find({ type: 'Text', text: /oopsie/ })).toBeDefined()
    await failed.unmount()
  }
})

test('the mood follows a tool call and its failure', async ($, on) => {
  const moods: (string | undefined)[] = []
  on('ui.status', (_, e) => {
    moods.push(e.text)

    return { value: undefined }
  })
  on('tool.call', (_, e) =>
    e.tool === 'Bash' ? { result: {}, isError: true, text: 'no' } : { result: {} },
  )

  await $.tool.call({ tool: 'Read', file_path: '/a' })
  await $.tool.call({ tool: 'Bash', command: 'false' })

  expect(moods).toEqual(['reading ✿', 'thinking ♡', 'running ✿', '(╥﹏╥) oopsie'])
})
