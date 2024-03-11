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

    card.addEventListener('click', function(event) {
      var clickedId = data[i].id;
        window.location.href = 'detail.html?id=' + clickedId;
    });
    

    var linkPage = document.createElement('a');
    linkPage.href = 'detail.html?id=' + data[i].id;

    var cardImage = document.createElement('img');
    cardImage.src = data[i].image;
    cardImage.className = 'rounded imgFit';
    linkPage.appendChild(cardImage);

    var cardText = document.createElement('div');
    cardText.className = 'card-img-overlay fw-bolder';

    var cardTitle = document.createElement('h4');
    cardTitle.className = 'card-title position-absolute bottom-0 start-1 text-white';
    cardTitle.textContent = data[i].title;
    cardText.appendChild(cardTitle);

    linkPage.appendChild(cardText);
    card.appendChild(linkPage);
    classKedua.appendChild(card);
    classPertama.appendChild(classKedua);
  }
  document.getElementById('dataCards').appendChild(classPertama);
}

function updateUI(data) {
  clearCards();
  createCard(data);
}

if (window.location.pathname.includes('detail.html')) {
  var urlParams = new URLSearchParams(window.location.search);
  var detailId = urlParams.get('id');

  console.log('Detail ID:', detailId);
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
    readAllData('trainings')
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
