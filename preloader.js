window.addEventListener('DOMContentLoaded', function () {
    const preloaderOverlay = document.createElement('div');
    preloaderOverlay.classList.add('p-overlay');
    const preloaderCircle = document.createElement('div');
    const preloaderText = document.createElement('span');
    preloaderText.classList.add('p-text');
    preloaderCircle.appendChild(preloaderText);
    preloaderText.appendChild(document.createTextNode('Loading...'));
    preloaderCircle.classList.add('p-circle');
    preloaderOverlay.appendChild(preloaderCircle);

    document.body.appendChild(preloaderOverlay);
    app();
    window.onload = function () {
        preloaderOverlay.classList.add('done-preloading');
        new Promise(function (resolve, reject) {
            window.setTimeout(function () {
                // document.body.removeChild(preloaderOverlay);
                resolve();
            }, 500)

        }).then(function () {
                preloaderOverlay.parentNode.removeChild(preloaderOverlay);
        });
    }
});