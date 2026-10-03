local dbReady = false

local function db() return dbReady and GetResourceState('oxmysql') == 'started' end

CreateThread(function()
    if GetResourceState('oxmysql') ~= 'started' then return end
    exports.oxmysql:query_async([[
        CREATE TABLE IF NOT EXISTS `vexxd_pausemenu_announcements` (
            `id`      INT AUTO_INCREMENT PRIMARY KEY,
            `title`   VARCHAR(120) NOT NULL,
            `body`    TEXT NOT NULL,
            `tag`     VARCHAR(40) DEFAULT 'Update',
            `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ]])
    dbReady = true
end)

local function getAnnouncements()
    if not db() then return nil end
    local rows = exports.oxmysql:query_async(
        'SELECT `title`, `body`, `tag`, DATE_FORMAT(`created`, "%Y.%m.%d") AS `date` FROM `vexxd_pausemenu_announcements` ORDER BY `id` DESC LIMIT 6', {})
    if not rows or #rows == 0 then return nil end
    return rows
end

lib.callback.register('vexxd_pausemenu:server:getData', function(src)
    local job, grade = Bridge.GetJob(src)
    return {
        name    = Bridge.GetName(src),
        id      = src,
        job     = job or 'Unemployed',
        grade   = grade,
        cash    = Bridge.GetMoney(src, 'cash'),
        bank    = Bridge.GetMoney(src, 'bank'),
        phone   = Bridge.GetPhone(src),
        gang    = Bridge.GetGang(src),
        players = #GetPlayers(),
        announcements = getAnnouncements(),
    }
end)

RegisterNetEvent('vexxd_pausemenu:server:disconnect', function()
    DropPlayer(source, 'You left through the pause menu.')
end)

local function isAdmin(src)
    if IsPlayerAceAllowed(src, 'vexxd_pausemenu.admin') then return true end
    return Bridge.IsAdmin(src) == true
end

lib.addCommand('announce', {
    help = 'Post an announcement to the pause menu',
    params = {
        { name = 'tag', type = 'string', help = 'Short tag, e.g. Update' },
        { name = 'title', type = 'string', help = 'Headline (use quotes)' },
        { name = 'body', type = 'string', help = 'Body text (use quotes)' },
    },
}, function(source, args)
    if not isAdmin(source) then return end
    if not db() then
        TriggerClientEvent('ox_lib:notify', source, { type = 'error', description = 'oxmysql is not running, so announcements cannot be saved.' })
        return
    end
    exports.oxmysql:insert_async(
        'INSERT INTO `vexxd_pausemenu_announcements` (`title`, `body`, `tag`) VALUES (?, ?, ?)',
        { args.title, args.body, args.tag })
    TriggerClientEvent('ox_lib:notify', source, { type = 'success', description = 'Announcement posted.' })
end)

lib.addCommand('delannounce', {
    help = 'Delete the most recent pause menu announcement',
}, function(source)
    if not isAdmin(source) or not db() then return end
    exports.oxmysql:query_async('DELETE FROM `vexxd_pausemenu_announcements` ORDER BY `id` DESC LIMIT 1', {})
    TriggerClientEvent('ox_lib:notify', source, { type = 'success', description = 'Latest announcement removed.' })
end)
