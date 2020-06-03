// Это можно запустить в консоли для наглядности. Повключать/выключать камеру и посмотреть на сколько увеличивается значение
let localPC = janusPluginHandles[0].webrtcStuff.pc;
let remotePC = janusPluginHandles[1].webrtcStuff.pc;

let videoSender = localPC.getSenders().find(s => s.track.kind === 'video');
let audioSender = localPC.getSenders().find(s => s.track.kind === 'audio');
let videoReceiver = remotePC.getReceivers().find(s => s.track.kind === 'video');
let audioReceiver = remotePC.getReceivers().find(s => s.track.kind === 'audio');


let localVideo = () =>
    videoSender.getStats().then(stats => Array.from(stats.values())
        .find(s => s.type === 'media-source'));

let remoteVideo = () =>
    videoReceiver.getStats().then(stats => Array.from(stats.values())
        .find(s => s.type === 'track'));

let f = setInterval(async () => {
    let localVideo = await localVideo();
    console.log(localVideo.width, localVideo.height, localVideo.framesPerSecond);
}, 1000);

// И остановить
clearInterval(f);



// Примерный псевдокод теста
function test() {
    // камера включена
    browser1.cameraOn();
    browser1.isTrue(localVideo().width === 640);
    browser1.isTrue(localVideo().height === 480);
    browser1.isTrue(localVideo().framesPerSecond > 10);
    // смотрим, что видит второй браузер
    browser2.isTrue(remoteVideo().width === 640);
    browser2.isTrue(remoteVideo().height === 480);
    browser2.isTrue(remoteVideo().framesPerSecond > 10);

    // камера выключена
    browser1.cameraOff();
    browser1.isTrue(localVideo().width === 4);
    browser1.isTrue(localVideo().height === 3);
    browser1.isTrue(localVideo().framesPerSecond === 1);
    // смотрим, что видит второй браузер
    browser2.isTrue(remoteVideo().width === 4);
    browser2.isTrue(remoteVideo().height === 3);
    browser2.isTrue(remoteVideo().framesPerSecond === 1);
}
