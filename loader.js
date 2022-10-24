console.log('Loading Cool Plugins')
if(!window.exports){
    exports  = {}
}
tag = document.createElement('script')
tag.setAttribute('type', 'module')
tag.setAttribute('src', BF2042Portal.Plugins.getPlugin('1650e7b6-3676-4858-8c9c-95b9381b7f8c').getUrl('main.js'))
document.body.appendChild(tag);