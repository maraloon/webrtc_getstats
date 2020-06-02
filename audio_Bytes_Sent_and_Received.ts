// Это можно запустить в консоли для наглядности. Повключать/выключать микрофон и посмотреть на сколько увеличивается значение
let localPC = janusPluginHandles[0].webrtcStuff.pc;
let remotePC = janusPluginHandles[1].webrtcStuff.pc;

let videoSender = localPC.getSenders().find(s => s.track.kind === 'video');
let audioSender = localPC.getSenders().find(s => s.track.kind === 'audio');
let videoReceiver = remotePC.getReceivers().find(s => s.track.kind === 'video');
let audioReceiver = remotePC.getReceivers().find(s => s.track.kind === 'audio');


// Cколько байтов для аудио отправлено ВСЕГО
// когда микро включен, каждую секунду значение увеличивается. У меня было на 4000-4100,
// но думаю это значение индивидуально, надо смотреть че на тестовом браузере
// например 0, 4013, 8050 ...
// когда микро выключен, то всё-равно каждую секунду значение увеличивается, но на меньшее значение -
// у меня было то ровно на 150, то на ~1750, так же надо смотреть че на тестовом браузере
// например 8050, 8200, 8350 ...
let audioBytesSent = () =>
    audioSender.getStats().then(stats => Array.from(stats.values())
        .find(s => s.type === 'outbound-rtp')
        .bytesSent)

// сколько байтов для аудио получено ВСЕГО
let audioBytesReceived = () =>
    audioReceiver.getStats().then(stats => Array.from(stats.values())
        .find(s => s.type === 'inbound-rtp')
        .bytesReceived)

let prevValue;
let f = setInterval(async () => {
    let currentValue = await audioBytesSent();
    let bytesInSec = currentValue - prevValue;
    console.log("Всего байт отправлено: " + currentValue + "; Отправлено байт/сек: " + bytesInSec);
    prevValue = currentValue;
}, 1000);

// И остановить
clearInterval(f);



// Примерный псевдокод теста
function test() {
    // микрофон включен
    browser1.microOn();
    // собираем несколько значений из audioBytesSent, проверяем что разница текущего и предыдущего
    // адекватна для аудиопотока, например > 2000
    let audioBytesSentValues: number[];
    setInterval(()=> {
        audioBytesSentValues.push(audioBytesSent());
    }, 1000);
    browser1.isTrue(audioBytesSentValues[1] - audioBytesSentValues[0] > 2000);
    browser1.isTrue(audioBytesSentValues[2] - audioBytesSentValues[1] > 2000);
    // так же смотрим, что получает второй браузер
    let audioBytesReceivedValues: number[];
    setInterval(() => {
        audioBytesReceivedValues.push(audioBytesReceived());
    }, 1000);
    browser2.isTrue(audioBytesReceivedValues[1] - audioBytesReceivedValues[0] > 2000);
    browser2.isTrue(audioBytesReceivedValues[2] - audioBytesReceivedValues[1] > 2000);

    // микрофон выключен
    browser1.microOff();
    // собираем несколько значений из audioBytesSent, проверяем что разница текущего и предыдущего
    // маленькая, например <2000
    let audioBytesSentValues: number[];
    setInterval(() => {
        audioBytesSentValues.push(audioBytesSent());
    }, 1000);
    browser1.isTrue(audioBytesSentValues[1] - audioBytesSentValues[0] < 2000);
    browser1.isTrue(audioBytesSentValues[2] - audioBytesSentValues[1] < 2000);
    // так же смотрим, что получает второй браузер
    let audioBytesReceivedValues: number[];
    setInterval(() => {
        audioBytesReceivedValues.push(audioBytesReceived());
    }, 1000);
    browser2.isTrue(audioBytesReceivedValues[1] - audioBytesReceivedValues[0] < 2000);
    browser2.isTrue(audioBytesReceivedValues[2] - audioBytesReceivedValues[1] < 2000);
}
