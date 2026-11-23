# claude-code-pink-mods

Two plugins that make Claude Code pink.

| Plugin | What it does |
| --- | --- |
| `pink-and-cute` | A pink look for the desktop and mobile apps. In the terminal: a "Pink and cute" colour theme to pick in `/theme`, cute spinner words, and a pink row above the prompt. Everywhere: a sticker on each tool call (🎀 edits, 🔍 searches, a sad face on a failure) and a mood line under the prompt that follows what Claude is doing. |
| `burn-meter-pink` | A pink recolour of [burn-meter](https://github.com/OneWave-AI/claude-code-mods/tree/main/burn-meter) by OneWave AI: the session cost meter with its fire in pinks, turning red near the limit. |

## Install

At the prompt of a Claude Code terminal session:

```
/plugin install pink-and-cute --marketplace DarineElKhatib/claude-code-pink-mods
/plugin install burn-meter-pink --marketplace DarineElKhatib/claude-code-pink-mods
```

Answer `y` to add the marketplace, then choose a scope (the user scope is first).

From a shell:

```
claude plugin install pink-and-cute --marketplace DarineElKhatib/claude-code-pink-mods
claude plugin install burn-meter-pink --marketplace DarineElKhatib/claude-code-pink-mods
```

In the desktop app, where `/plugin` does not run: click + next to the prompt box, then Plugins, Add marketplace with `DarineElKhatib/claude-code-pink-mods`, then Add plugin.

## After installing

- **Terminal theme:** run `/theme` and pick **Pink and cute**. If it is not in the list, copy `pink-and-cute/themes/pink-and-cute.json` to `~/.claude/themes/` and restart Claude Code once.
- **Terminal background:** Claude Code does not colour the terminal window itself. The theme is built on the dark preset, so a dark plum background such as `#24141c` in your terminal's profile suits it.
- **Burn meter:** if you already have the original `burn-meter` installed, disable it first. Both draw a row above the prompt and both answer `/burn`.

## Licence and credit

MIT, see [LICENSE](LICENSE).

`burn-meter-pink` is a modified copy of burn-meter from [claude-code-mods](https://github.com/OneWave-AI/claude-code-mods) by OneWave AI, used under its MIT licence, which is kept in [burn-meter-pink/LICENSE](burn-meter-pink/LICENSE). Only the colours and the plugin name were changed, and it does not receive the original's updates.
