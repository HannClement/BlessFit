// var shareImageButton = document.querySelector('#share-image-button');
// var createPostArea = document.querySelector('#create-post');
// var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
// var sharedMomentsArea = document.querySelector('#shared-moments');

// function openCreatePostModal() {
//   createPostArea.style.display = 'block';
//   if (deferredPrompt) {
//     deferredPrompt.prompt();

//     deferredPrompt.userChoice.then(function(choiceResult) {
//       console.log(choiceResult.outcome);

//       if (choiceResult.outcome === 'dismissed') {
//         console.log('User cancelled installation');
//       } else {
//         console.log('User added to home screen');
//       }
//     });

//     deferredPrompt = null;
//   }

  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker.getRegistrations()
  //     .then(function(registrations) {
  //       for (var i = 0; i < registrations.length; i++) {
  //         registrations[i].unregister();
  //       }
  //     })
  // }
// }

// function closeCreatePostModal() {
//   createPostArea.style.display = 'none';
// }

// shareImageButton.addEventListener('click', openCreatePostModal);

// closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

// Currently not in use, allows to save assets in cache on demand otherwise
// function onSaveButtonClicked(event) {
//   console.log('clicked');
//   if ('caches' in window) {
//     caches.open('user-requested')
//       .then(function(cache) {
//         cache.add('https://httpbin.org/get');
//         cache.add('/src/images/sf-boat.jpg');
//       });
//   }
// }

function clearCards() {
  var dataCardsElement = document.getElementById('dataCards');
  dataCardsElement.innerHTML = "";
}

function createCard(data) {
  var classPertama = document.createElement('div');
  classPertama.className = 'col-10 d-flex mx-auto mb-2 justify-content-center spacingColumn';

  for (var i = 0; i < data.length; i++) {
    if (i > 0 && i % 2 === 0) {
      document.getElementById('dataCards').appendChild(classPertama);
      classPertama = document.createElement('div');
      classPertama.className = 'col-10 d-flex mx-auto mb-2 justify-content-center spacingColumn';
    }

    var classKedua = document.createElement('div');
    classKedua.className = 'col-6';

    var card = document.createElement('div');
    card.className = 'card';

    var cardImage = document.createElement('img');
    cardImage.src = data[i].image;
    cardImage.className = 'rounded imgFit';
    card.appendChild(cardImage);

    var cardText = document.createElement('div');
    cardText.className = 'card-img-overlay fw-bolder';

    var cardTitle = document.createElement('h4');
    cardTitle.className = 'card-title position-absolute bottom-0 start-1 text-white';
    cardTitle.textContent = data[i].title;
    cardText.appendChild(cardTitle);

    card.appendChild(cardText);
    classKedua.appendChild(card);
    classPertama.appendChild(classKedua);
  }

  document.getElementById('dataCards').appendChild(classPertama);
}

function updateUI(data) {
  clearCards();
  createCard(data);
}

var url = 'https://ambwtes1clement-default-rtdb.firebaseio.com/trainings.json';
var networkDataReceived = false;

fetch(url)
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    networkDataReceived = true;
    console.log('From web', data);
    var dataArray = [];
    for (var key in data) {
      dataArray.push(data[key]);
    }
    updateUI(dataArray);
  })
  .catch(function(error) {
    console.error('Error fetching data from web:', error);
  });

  if ('indexedDB' in window) {
    readAllData('posts')
    .then(function(data) {
      if (!networkDataReceived) {
        console.log('From cache', data);
        updateUI(data);
      }
    })
    .catch(function(error) {
    console.error('Error reading data from cache:', error);
  });
}
