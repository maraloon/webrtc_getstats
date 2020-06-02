// Это можно запустить в консоли для наглядности. Повключать/выключать микрофон и посмотреть на значение
let localPC = janusPluginHandles[0].webrtcStuff.pc;
let remotePC = janusPluginHandles[1].webrtcStuff.pc;

let localAudio = localPC.getSenders().find(s => s.track.kind === 'video');
let audioSender = localPC.getSenders().find(s => s.track.kind === 'audio');
let videoReceiver = remotePC.getReceivers().find(s => s.track.kind === 'video');
let audioReceiver = remotePC.getReceivers().find(s => s.track.kind === 'audio');

// Case 5. Громкость в dB
let audioLevel = () =>
    audioSender.getStats()
        .then(stats => Array.from(stats.values())
            .find(s => s.type === 'media-source')
            .audioLevel)

let f = setInterval(async () => {
    console.log(await audioLevel());
}, 1000);

// И для остановки интервала
clearInterval(f);


// Примерный псевдокод теста
function test() {
    // микрофон включен
    browser1.microOn();
    browser1.isTrue(audioLevel() > 0);

    // микрофон выключен
    browser1.microOff();
    browser1.isTrue(audioLevel() === 0);
}
