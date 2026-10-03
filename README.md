# Vexxd Pause Menu

A custom pause menu for FiveM. Press ESC and players see your server's own menu instead of GTA's: character stats, action tiles, community links and announcements.

Works on **Qbox, QBCore and ESX**. Free to use.

Support: [discord.gg/TzNJ6Z92Y5](https://discord.gg/TzNJ6Z92Y5)

<img width="1887" height="998" alt="vexxd_pausemenu" src="https://github.com/user-attachments/assets/d05a87c3-e679-4760-86fb-d98c8b393e88" />


## Features

- Replaces the GTA pause menu on ESC, with the map and settings still one click away
- Character name, job and grade, cash, bank, phone, server ID, in-game time and weather
- Action tiles you define in the config: open the map, settings, a link, or any client event
- Community link cards for Discord, YouTube or anything else
- Announcements from the config, or posted in game by admins
- Optional bottom banner for events and updates
- One accent colour to match your server's branding
- Auto-detects your framework

## Requirements

- [ox_lib](https://github.com/overextended/ox_lib)
- Qbox, QBCore or ESX
- [oxmysql](https://github.com/overextended/oxmysql) (optional, only for posting announcements in game)

## Install

1. Download the latest release and put the `vexxd_pausemenu` folder in your resources.
2. Add to `server.cfg`, after your framework and ox_lib:
   ```
   ensure vexxd_pausemenu
   add_ace group.admin vexxd_pausemenu.admin allow
   ```
3. Open `shared/config.lua` and set your server name, links and announcements.
4. Restart the server.

The announcements table is created automatically when oxmysql is running.

## Config

Everything is in `shared/config.lua`.

| Section | What it controls |
|---|---|
| `Config.Framework` | `'auto'`, or force `'qbx'`, `'qb'` or `'esx'` |
| `Config.Server` | Name, tagline, logo and slot count |
| `Config.Stats` | Which stat chips show (ID, cash, bank, job, phone, gang, time, weather) |
| `Config.Buttons` | The action tiles on the left |
| `Config.Links` | The community cards in the middle |
| `Config.Announcements` | Announcements shown until you post one in game |
| `Config.Banner` | The wide strip along the bottom (off by default) |
| `Config.UI` | Accent colour and background image |
| `Config.Behaviour` | Freeze the player while open, refresh interval |

### Buttons

| Action | What it does |
|---|---|
| `close` | Closes the menu |
| `map` | Opens the GTA map |
| `settings` | Opens the GTA settings |
| `disconnect` | Leaves the server |
| `url` | Opens a link (needs `url`) |
| `event` | Triggers a client event (needs `event`, optional `args`) |

Add `confirm = 'Are you sure?'` to any button to ask first. `size` is `'small'` or `'large'`, and `image` puts artwork behind a tile.

```lua
{
    label  = 'Report a player',
    sub    = 'Opens the report menu',
    icon   = 'user',
    action = 'event',
    event  = 'my_reports:client:open',
    size   = 'small',
},
```

Icons: `play`, `map`, `settings`, `power`, `user`, `cash`, `bank`, `job`, `phone`, `gang`, `clock`, `weather`, `id`, `discord`, `youtube`.

## Announcements

Edit `Config.Announcements`, or post them in game (needs oxmysql). Once one is posted in game, those replace the config list.

| Command | Who | What |
|---|---|---|
| `/announce [tag] "[title]" "[body]"` | Admins | Post an announcement |
| `/delannounce` | Admins | Remove the most recent one |

Admins are anyone with the `vexxd_pausemenu.admin` ace or your framework's admin group.

## Notes

- The gang chip works on Qbox and QBCore.
- Link cards open in the player's browser. If that isn't possible the link is copied to their clipboard.
