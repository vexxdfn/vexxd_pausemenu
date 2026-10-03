fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Vexxd Scripts'
description 'Custom Pause Menu - for ESX, QBCore and QBox discord.gg/TzNJ6Z92Y5 for support'
version '1.0.0'

shared_scripts {
    '@ox_lib/init.lua',
    'shared/config.lua'
}

client_scripts {
    'client/main.lua'
}

server_scripts {
    'server/bridge.lua',
    'server/main.lua'
}

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/style.css',
    'html/script.js',
    'html/fonts/*.ttf'
}

dependencies {
    'ox_lib'
}
