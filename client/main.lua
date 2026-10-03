local Wait                         = Wait
local DisableControlAction         = DisableControlAction
local IsDisabledControlJustPressed = IsDisabledControlJustPressed
local IsPauseMenuActive            = IsPauseMenuActive
local SetPauseMenuActive           = SetPauseMenuActive
local GetGameTimer                 = GetGameTimer
local IsNuiFocused                 = IsNuiFocused
local SendNUIMessage               = SendNUIMessage

local GetPauseMenuStateSafe = GetPauseMenuState
local SetFrontendActiveSafe = SetFrontendActive

local open = false
local refreshing = false
local allowVanilla = false
local allowVanillaUntil = 0
local suppressUntil = 0
local vanillaSeen = false

local function vanillaOpening()
    if IsPauseMenuActive() then return true end
    if GetPauseMenuStateSafe then
        local st = GetPauseMenuStateSafe()
        return st ~= nil and st ~= 0
    end
    return false
end

local function killVanilla()
    SetPauseMenuActive(false)
    if SetFrontendActiveSafe then SetFrontendActiveSafe(false) end
end

local WEATHER_NAMES = {
    [`CLEAR`] = 'Clear', [`EXTRASUNNY`] = 'Sunny', [`CLOUDS`] = 'Cloudy', [`OVERCAST`] = 'Overcast',
    [`RAIN`] = 'Rain', [`CLEARING`] = 'Clearing', [`THUNDER`] = 'Thunder', [`SMOG`] = 'Smog',
    [`FOGGY`] = 'Foggy', [`XMAS`] = 'Snow', [`SNOW`] = 'Snow', [`SNOWLIGHT`] = 'Light snow',
    [`BLIZZARD`] = 'Blizzard', [`HALLOWEEN`] = 'Halloween', [`NEUTRAL`] = 'Neutral',
}

local function clockData()
    local _, nextWeather = GetWeatherTypeTransition()
    return {
        time    = ('%02d:%02d'):format(GetClockHours(), GetClockMinutes()),
        date    = ('%04d.%02d.%02d'):format(GetClockYear(), GetClockMonth() + 1, GetClockDayOfMonth()),
        weather = WEATHER_NAMES[nextWeather] or 'Clear',
    }
end

local function playerPayload(server)
    return {
        name = server.name, job = server.job, grade = server.grade,
        cash = server.cash, bank = server.bank, id = server.id,
        phone = server.phone, gang = server.gang, avatar = server.avatar,
    }
end

local function fullPayload(server)
    local c = clockData()
    return {
        config = {
            server = Config.Server, stats = Config.Stats, buttons = Config.Buttons,
            links = Config.Links, banner = Config.Banner, ui = Config.UI,
            announcements = server.announcements or Config.Announcements,
        },
        player = playerPayload(server),
        session = {
            players = server.players, maxSlots = Config.Server.maxSlots,
            time = c.time, date = c.date, weather = c.weather,
        },
    }
end

local function closeMenu(handingOff)
    if not open then return end
    open = false
    SetNuiFocus(false, false)
    SendNUIMessage({ action = 'close' })

    if Config.Behaviour.freezePlayer then
        FreezeEntityPosition(PlayerPedId(), false)
    end

    if handingOff then
        suppressUntil = 0
        return
    end

    suppressUntil = GetGameTimer() + 900

    CreateThread(function()
        local untilT = suppressUntil
        while GetGameTimer() < untilT and not allowVanilla do
            if vanillaOpening() then killVanilla() end
            Wait(0)
        end
    end)
end

local function openMenu()
    if open then return end

    local server = lib.callback.await('vexxd_pausemenu:server:getData', false)
    if not server then return end

    open = true
    SetNuiFocus(true, true)
    SendNUIMessage({ action = 'open', data = fullPayload(server) })

    if Config.Behaviour.freezePlayer then
        FreezeEntityPosition(PlayerPedId(), true)
    end

    if refreshing then return end
    refreshing = true

    CreateThread(function()
        local serverEvery = math.max(5, tonumber(Config.Behaviour.refreshSeconds) or 10) * 1000
        local lastServer = GetGameTimer()
        local lastClock = nil

        while open do
            Wait(2000)
            if not open then break end

            local c = clockData()
            local stamp = c.time .. c.weather
            if stamp ~= lastClock then
                lastClock = stamp
                SendNUIMessage({ action = 'clock', data = c })
            end

            if GetGameTimer() - lastServer >= serverEvery then
                lastServer = GetGameTimer()
                local fresh = lib.callback.await('vexxd_pausemenu:server:getData', false)
                if fresh and open then
                    SendNUIMessage({ action = 'player', data = playerPayload(fresh), players = fresh.players })
                end
            end
        end
        refreshing = false
    end)
end

CreateThread(function()
    local frame = 0
    while true do
        if allowVanilla then
            if IsPauseMenuActive() then
                vanillaSeen = true
            elseif vanillaSeen or GetGameTimer() > allowVanillaUntil then
                allowVanilla, vanillaSeen = false, false
                suppressUntil = GetGameTimer() + 500
            end
            Wait(100)
        else
            DisableControlAction(0, 200, true)
            DisableControlAction(0, 199, true)

            local pressed = IsDisabledControlJustPressed(0, 200) or IsDisabledControlJustPressed(0, 199)
            local vanilla
            if pressed then
                vanilla = vanillaOpening()
            else
                vanilla = IsPauseMenuActive()
                if not vanilla and GetPauseMenuStateSafe then
                    frame = frame + 1
                    if frame % 2 == 0 then
                        local st = GetPauseMenuStateSafe()
                        vanilla = st ~= nil and st ~= 0
                    end
                end
            end

            if pressed or vanilla then
                local suppressed = GetGameTimer() < suppressUntil

                local otherUiOpen = not open and IsNuiFocused()

                if vanilla then killVanilla() end

                if not suppressed and not otherUiOpen then
                    if pressed and open then
                        closeMenu()
                    elseif not open then
                        openMenu()
                    end
                end
            end

            Wait(0)
        end
    end
end)

function openVanilla(menuHash)
    closeMenu(true)
    allowVanilla, vanillaSeen = true, false
    allowVanillaUntil = GetGameTimer() + 3000

    CreateThread(function()
        Wait(100)
        for _ = 1, 5 do
            if IsPauseMenuActive() then return end
            ActivateFrontendMenu(menuHash, false, -1)
            Wait(150)
        end
    end)
end
RegisterNUICallback('close', function(_, cb)
    closeMenu()
    cb('ok')
end)

RegisterNUICallback('action', function(data, cb)
    local action = data.action

    if action == 'close' then
        closeMenu()

    elseif action == 'map' then
        openVanilla(`FE_MENU_VERSION_MP_PAUSE`)

    elseif action == 'settings' then
        openVanilla(`FE_MENU_VERSION_LANDING_MENU`)

    elseif action == 'disconnect' then
        closeMenu()
        TriggerServerEvent('vexxd_pausemenu:server:disconnect')

    elseif action == 'url' and data.url then
        SendNUIMessage({ action = 'copied', url = data.url })

    elseif action == 'event' and data.event then
        closeMenu()
        TriggerEvent(data.event, data.args)
    end

    cb('ok')
end)

AddEventHandler('onResourceStop', function(res)
    if res == GetCurrentResourceName() and open then
        SetNuiFocus(false, false)
        FreezeEntityPosition(PlayerPedId(), false)
    end
end)
