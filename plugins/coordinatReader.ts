import {createTessWoker,loadWorker, doOCR} from './tessApi'


export async function startTess() {
    window.coolPlugins.tess = await createTessWoker();
    await loadWorker(window.coolPlugins.tess);
}
export function tessOCR(image: string | HTMLImageElement) {
    doOCR(window.coolPlugins.tess, image).then((text) => { console.log(text) });
}