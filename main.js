function app() {
  var applicationServerPublicKey = 'BKoboDcuKVYSMUQvEx-iNN808Sc7gQCD3oDmc2Bx44eyruSuyo8djhWqfA0Lt2JaLJ6C9OW1CFlWc8bFp2eE1FU';
  const pushButton = document.querySelector('.js-push-btn');

  let isSubscribed = false;
  let swRegistration = null;

  function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported');

    navigator.serviceWorker.register('sw.js')
      .then(function (swReg) {
        console.log('Service Worker is registered', swReg);

        swRegistration = swReg;
        initializeUI();
      })
      .catch(function (error) {
        console.error('Service Worker Error', error);
      });

    function initializeUI() {
      pushButton.addEventListener('click', function () {
        pushButton.disabled = true;
        if (isSubscribed) {
          unsubscribeUser();
        } else {
          subscribeUser();
        }
      });

      // Set the initial subscription value
      swRegistration.pushManager.getSubscription()
        .then(function (subscription) {
          isSubscribed = !(subscription === null);

          if (isSubscribed) {
            console.log('User IS subscribed.');
          } else {
            console.log('User is NOT subscribed.');
          }
          updateBtn();
        });
    }

    function subscribeUser() {
      const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
      swRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey
        })
        .then(function (subscription) {
          console.log('User is subscribed.');

          isSubscribed = true;

          updateBtn();
        })
        .catch(function (err) {
          console.log('Failed to subscribe the user: ', err);
          updateBtn();
        });
    }

    function unsubscribeUser() {
      swRegistration.pushManager.getSubscription()
        .then(function (subscription) {
          if (subscription) {
            return subscription.unsubscribe();
          }
        })
        .catch(function (error) {
          console.log('Error unsubscribing', error);
        })
        .then(function () {

          console.log('User is unsubscribed.');
          isSubscribed = false;

          updateBtn();
        });
    }

    function updateBtn() {
      if (isSubscribed) {
        pushButton.textContent = 'Disable Push Messaging';
      } else {
        pushButton.textContent = 'Enable Push Messaging';
      }

      pushButton.disabled = false;
    }

  } else {
    console.warn('Push messaging is not supported');
    pushButton.textContent = 'Push Not Supported';
  }
};