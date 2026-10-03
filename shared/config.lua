Config = {}

-- 'auto' detects QBox, then QBCore, then ESX. Or force one: 'qbx', 'qb', 'esx'
Config.Framework = 'auto'

-- ============================================================
-- SERVER IDENTITY
-- ============================================================
Config.Server = {
    name     = 'Your Server Name',
    tagline  = 'Pause Menu',
    logo     = '',        -- optional image URL shown top-left. Leave '' for initials.
    maxSlots = 64,      -- shown next to the online count
}

-- ============================================================
-- STAT CHIPS (the row across the top)
-- ============================================================
Config.Stats = {
    id      = true,   -- server ID
    cash    = true,
    bank    = true,
    job     = true,
    phone   = true,   -- phone number, if your framework stores one
    gang    = false,  -- QBCore and QBox only
    time    = true,   -- in-game date and time
    weather = true,
}

-- ============================================================
-- BUTTONS (left column)
-- ============================================================
-- action can be:
--   'map'        - opens the vanilla pause map
--   'settings'   - opens the vanilla settings menu
--   'disconnect' - leaves the server
--   'close'      - just closes the menu
--   'url'        - opens a link (needs `url`)
--   'event'      - triggers a client event (needs `event`, optional `args`)
Config.Buttons = {
    {
        label  = 'Resume',
        sub    = 'Back to the city',
        icon   = 'play',
        action = 'close',
        size   = 'small',
    },
    {
        label  = 'World Map',
        sub    = 'Locations, blips and waypoints',
        icon   = 'map',
        action = 'map',
        size   = 'large',
        -- optional artwork behind the tile, any image URL
        image  = '',
    },
    {
        label  = 'Settings',
        sub    = 'Graphics, audio and keybinds',
        icon   = 'settings',
        action = 'settings',
        size   = 'large',
        image  = '',
    },
    {
        label   = 'Disconnect',
        sub     = 'Leave the city',
        icon    = 'power',
        action  = 'disconnect',
        size    = 'small',
        danger  = true,
        confirm = 'Leave the city?',
    },
}

-- ============================================================
-- LINK CARDS (middle column)
-- ============================================================
Config.Links = {
    {
        title   = 'Join our Discord',
        sub     = 'Announcements, support and giveaways',
        cta     = 'Join community',
        url     = 'https://discord.gg/yourinvite',
        icon    = 'discord',
        accent  = '#5865f2',
        members = '',   -- e.g. '4,200 members'. Leave '' to hide.
    },
    {
        title  = 'Watch our trailers',
        sub    = 'New updates and showcases',
        cta    = 'Subscribe',
        url    = 'https://youtube.com/@yourchannel',
        icon   = 'youtube',
        accent = '#ef4444',
    },
}

-- ============================================================
-- ANNOUNCEMENTS (right column)
-- ============================================================
-- Shown until you post one in game with /announce (needs oxmysql).
Config.Announcements = {
    {
        date  = '2026.01.01',
        title = 'Welcome to the city',
        body  = 'This is where your server news goes. Edit these in shared/config.lua, or post new ones in game with /announce.',
        tag   = 'New',
    },
    {
        date  = '2026.01.01',
        title = 'Join our Discord',
        body  = 'Get support, read the rules and keep up with every update.',
        tag   = 'Info',
    },
}

-- ============================================================
-- BANNER (the wide strip along the bottom)
-- ============================================================
Config.Banner = {
    enabled = false,          -- set true to show it
    title   = '2.0 is live!',
    sub     = 'New jobs, new cars and a fresh wipe of the leaderboards',
    cta     = 'Read more',
    url     = '',             -- link to copy, or use `event` instead
    event   = nil,            -- client event to trigger instead of a link
    image   = '',             -- optional background image URL
    accent  = '#3fcf6e',
}

-- ============================================================
-- APPEARANCE
-- ============================================================
Config.UI = {
    accent     = '#ef4444',   -- main accent colour
    background = '',          -- optional background image URL
}

-- ============================================================
-- BEHAVIOUR
-- ============================================================
Config.Behaviour = {
    freezePlayer   = false,   -- true stops the player moving while the menu is open
    refreshSeconds = 10,      -- how often money/job refresh from the server while open.
                              -- The clock and weather update every 2s on their own at no cost.
}
