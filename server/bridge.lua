Bridge = {}

local function started(res) return GetResourceState(res) == 'started' end

local function detect()
    local forced = (Config.Framework or 'auto'):lower()
    if forced ~= 'auto' then return forced end
    if started('qbx_core') then return 'qbx' end
    if started('qb-core') then return 'qb' end
    if started('es_extended') then return 'esx' end
    return nil
end

Bridge.name = detect()

if Bridge.name == 'qb' or Bridge.name == 'qbx' then
    local Core
    pcall(function() Core = exports['qb-core']:GetCoreObject() end)

    local function getPlayer(src)
        if Core then return Core.Functions.GetPlayer(src) end
        if Bridge.name == 'qbx' then
            local ok, p = pcall(function() return exports.qbx_core:GetPlayer(src) end)
            if ok and p then return p end
        end
        return nil
    end

    function Bridge.GetName(src)
        local p = getPlayer(src)
        local ci = p and p.PlayerData.charinfo
        if ci then
            local name = ((ci.firstname or '') .. ' ' .. (ci.lastname or '')):gsub('^%s+', ''):gsub('%s+$', '')
            if name ~= '' then return name end
        end
        return GetPlayerName(src) or 'Unknown'
    end

    function Bridge.GetJob(src)
        local p = getPlayer(src)
        local job = p and p.PlayerData.job
        if not job then return nil end
        return job.label or job.name, type(job.grade) == 'table' and job.grade.name or nil
    end

    function Bridge.GetGang(src)
        local p = getPlayer(src)
        local gang = p and p.PlayerData.gang
        if not gang or gang.name == 'none' then return nil end
        return gang.label or gang.name
    end

    function Bridge.GetPhone(src)
        local p = getPlayer(src)
        local ci = p and p.PlayerData.charinfo
        return ci and ci.phone and tostring(ci.phone) or nil
    end

    function Bridge.GetMoney(src, account)
        local p = getPlayer(src)
        return p and p.PlayerData.money and p.PlayerData.money[account] or 0
    end

    function Bridge.IsAdmin(src)
        if Bridge.name == 'qbx' then
            local ok, has = pcall(function() return exports.qbx_core:HasPermission(src, 'admin') end)
            if ok and has then return true end
        end
        if Core and Core.Functions.HasPermission then
            local ok, has = pcall(Core.Functions.HasPermission, src, 'admin')
            if ok and has then return true end
        end
        return IsPlayerAceAllowed(src, 'admin')
    end

elseif Bridge.name == 'esx' then
    local ESX = exports['es_extended']:getSharedObject()

    local function getPlayer(src) return ESX.GetPlayerFromId(src) end

    function Bridge.GetName(src)
        local x = getPlayer(src)
        local name = x and x.getName and x.getName()
        if name and name ~= '' then return name end
        return GetPlayerName(src) or 'Unknown'
    end

    function Bridge.GetJob(src)
        local x = getPlayer(src)
        local job = x and x.job
        if not job then return nil end
        return job.label or job.name, job.grade_label
    end

    function Bridge.GetGang() return nil end

    function Bridge.GetPhone(src)
        local x = getPlayer(src)
        local phone = x and x.get and x.get('phoneNumber')
        return phone and tostring(phone) or nil
    end

    function Bridge.GetMoney(src, account)
        local x = getPlayer(src)
        local a = x and x.getAccount(account == 'cash' and 'money' or account)
        return a and a.money or 0
    end

    function Bridge.IsAdmin(src)
        local x = getPlayer(src)
        local group = x and x.getGroup and x.getGroup()
        return group == 'admin' or group == 'superadmin'
    end

else
    print('^1[vexxd_pausemenu] No supported framework found (qbx_core, qb-core or es_extended). The resource will not work.^0')
    function Bridge.GetName(src) return GetPlayerName(src) or 'Unknown' end
    function Bridge.GetJob() return nil end
    function Bridge.GetGang() return nil end
    function Bridge.GetPhone() return nil end
    function Bridge.GetMoney() return 0 end
    function Bridge.IsAdmin(src) return IsPlayerAceAllowed(src, 'admin') end
end
