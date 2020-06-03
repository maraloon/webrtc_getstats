// Тут всё аналогично с аудио

// Это можно запустить в консоли для наглядности. Повключать/выключать камеру и посмотреть на сколько увеличивается значение
let localPC = janusPluginHandles[0].webrtcStuff.pc;
let remotePC = janusPluginHandles[1].webrtcStuff.pc;

let videoSender = localPC.getSenders().find(s => s.track.kind === 'video');
let audioSender = localPC.getSenders().find(s => s.track.kind === 'audio');
let videoReceiver = remotePC.getReceivers().find(s => s.track.kind === 'video');
let audioReceiver = remotePC.getReceivers().find(s => s.track.kind === 'audio');



let videoBytesSent = () =>
    videoSender.getStats().then(stats => Array.from(stats.values())
        .find(s => s.type === 'outbound-rtp')
        .bytesSent)


let videoBytesReceived = () =>
    videoReceiver.getStats().then(stats => Array.from(stats.values())
        .find(s => s.type === 'inbound-rtp')
        .bytesReceived)

let prevValue;
let f = setInterval(async () => {
    let currentValue = await videoBytesSent();
    let bytesInSec = currentValue - prevValue;
    console.log("Всего байт отправлено: " + currentValue + "; Отправлено байт/сек: " + bytesInSec);
    prevValue = currentValue;
}, 1000);

// И остановить
clearInterval(f);



// Примерный псевдокод теста
function test() {
    // камера включена
    browser1.cameraOn();
    // собираем несколько значений из videoBytesSent, проверяем что разница текущего и предыдущего
    // адекватная для видеопотока, например >10000
    let videoBytesSentValues: number[];
    setInterval(()=> {
        videoBytesSentValues.push(videoBytesSent());
    }, 1000);
    browser1.isTrue(videoBytesSentValues[1] - videoBytesSentValues[0] > 10000);
    browser1.isTrue(videoBytesSentValues[2] - videoBytesSentValues[1] > 10000);
    // так же смотрим, что получает второй браузер
    let videoBytesReceivedValues: number[];
    setInterval(() => {
        videoBytesReceivedValues.push(videoBytesReceived());
    }, 1000);
    browser2.isTrue(videoBytesReceivedValues[1] - videoBytesReceivedValues[0] > 10000);
    browser2.isTrue(videoBytesReceivedValues[2] - videoBytesReceivedValues[1] > 10000);

    // камера выключена
    browser1.cameraOff();
    // собираем несколько значений из videoBytesSent, проверяем что разница текущего и предыдущего
    // очень маленькая, например <1000
    let videoBytesSentValues: number[];
    setInterval(() => {
        videoBytesSentValues.push(videoBytesSent());
    }, 1000);
    browser1.isTrue(videoBytesSentValues[1] - videoBytesSentValues[0] < 1000);
    browser1.isTrue(videoBytesSentValues[2] - videoBytesSentValues[1] < 1000);
    // так же смотрим, что получает второй браузер
    let videoBytesReceivedValues: number[];
    setInterval(() => {
        videoBytesReceivedValues.push(videoBytesReceived());
    }, 1000);
    browser2.isTrue(videoBytesReceivedValues[1] - videoBytesReceivedValues[0] < 1000);
    browser2.isTrue(videoBytesReceivedValues[2] - videoBytesReceivedValues[1] < 1000);
}
