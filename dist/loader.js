if(!window.cool_plugin_loaded){
    window.cool_plugin_loaded = false
}
if(!window.exports){
    exports  = {}
}
if(document.querySelectorAll('[data-cool-plugin]').length == 0){
    console.log('Loading Cool Plugins')
    tag = document.createElement('script')
    tag.setAttribute('type', 'module')
    tag.setAttribute('data-cool-plugin', 'true')
    tag.setAttribute('src', BF2042Portal.Plugins.getPlugin('1650e7b6-3676-4858-8c9c-95b9381b7f8c').getUrl('dist/main.js'))
    document.body.appendChild(tag);
}