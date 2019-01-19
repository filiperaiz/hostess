const pathUrl = 'https://demo.hostess.digital/agenda';
const config = {
  headers: { 'Content-Type': 'application/json' }
};

const buttonTryAgain = $('#tryagain');
const userCpfInput = $('#userCpf');

let geoId = 0; 
let km = 0;

buttonTryAgain.click(() => {
  window.location.reload(true)
});

const startPreloader = () => document.getElementById('preloader').style.display = 'block';
const endPreloader = () => document.getElementById('preloader').style.display = 'none';

const init = () => {
  startPreloader();

  setTimeout(() => {
    getLocation();
  }, 3000);

  userCpfInput.mask('000.000.000-00');
};

userCpfInput.keypress(() => {
  userCpfInput.val().length < 14 ? userCpfInput.addClass('is-invalid') : userCpfInput.removeClass('is-invalid');
});

const getLocation = () => {
  if (navigator.geolocation) {
    geoId = navigator.geolocation.watchPosition(geoSuccess, geoError, { enableHighAccuracy: true });
  } else {
    geoLocationError();
  }
};

const geoSuccess = pos => {
  // localização do Hospital Gatrovita
  const baseLocale = {
    latitude: -5.0913084,
    longitude: -42.806426
  };

  const distance = geoDistance(
    baseLocale.latitude,
    baseLocale.longitude,
    pos.coords.latitude,
    pos.coords.longitude,
    'K'
  );

  if (distance) {
    document.getElementById('section-primary').style.display = 'block';
    navigator.geolocation.clearWatch(geoId);
  } else {
    geoError({ code: 400, message: 'Wrong Geolocation' });
  }

  endPreloader();
};

const geoError = error => {
  let msg = '';
  let activeBtn = false;

  const messages = {
    msg1: 'Usuário negou a solicitação de Geolocalização, assim não sendo permitido a realização do check-in online',
    msg2: 'As informações de localização não estão disponíveis. Ative a sua localização e tente novamente',
    msg3: 'O pedido para obter a localização do usuário expirou.',
    msg4: 'Ocorreu um erro desconhecido.',
    msg5: `Você está a <strong>${km}km</strong> de distância do Hospital Gastrovita! <br><br> Tente novamente quando estiver dentro ou próximo do hospital.`,
  }

  switch (error.code) {
    case error.PERMISSION_DENIED:
      msg = messages.msg1
      break;
    case error.POSITION_UNAVAILABLE:
      msg = messages.msg2
      activeBtn = true;
      break;
    case error.TIMEOUT:
      msg = messages.msg3
      break;
    case error.UNKNOWN_ERROR:
      msg = messages.msg4
      break;
  }

  if (error.code == 400) {
    msg = messages.msg5;
    activeBtn = true;
  }

  if (error.code) {
    document.getElementById('section-secondary').style.display = 'block';
    document.getElementById('result-message').innerHTML = msg;

    if (activeBtn) {
      document.getElementById('tryagain').style.display = 'block';
    }
    endPreloader();
  }
};

const geoDistance = (lat1, lon1, lat2, lon2, unit) => {
  const radlat1 = (Math.PI * lat1) / 180;
  const radlat2 = (Math.PI * lat2) / 180;

  const theta = lon1 - lon2;
  const radtheta = (Math.PI * theta) / 180;

  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;

  if (unit == 'K') {
    dist = dist * 1.609344;
  }

  let result = false;

  km = Math.round(dist) / 1000

  if (dist < 0.2) {
    result = true;
  }

  return result;
};

const clickCheckIn = () => {
  const forms = document.getElementsByClassName('hostess_form');

  Array.prototype.filter.call(forms, function(form) {
    if (form.checkValidity()) {
      const cpf = document.getElementById('userCpf').value.replace(/\D/g, '');
      startPreloader();

      setTimeout(() => {
        postCheckin(cpf);
      }, 3000);
    } else {
      document.getElementById('errorForm').style.display = 'block';
      document.getElementById('errorForm').innerHTML = `Preencha seu cpf corretamente`;

      setTimeout(() => {
        document.getElementById('errorForm').style.display = 'none';
      }, 10000);
    }

    event.preventDefault();
    event.stopPropagation();
    form.classList.add('was-validated');
  });
};

const postCheckin = cpf => {
  document.getElementById('tryagain').style.display = 'none';

  const params = { text_query: cpf };

  axios.post(`${pathUrl}/api/check-in/`, params, config).then(response => {
    if (response.data.status !== 'error') {
      document.getElementById('result-message').innerHTML = `Seu check-in foi realizado com sucesso, aguarde ser chamado`;
    } else {
      document.getElementById('result-message').innerHTML = response.data.message;
      document.getElementById('tryagain').style.display = 'block';
    }

    document.getElementById('preloader').style.display = 'none';
    document.getElementById('section-secondary').style.display = 'block';
  });
};

const geoLocationError = () => {
  document.getElementById('section-secondary').style.display = 'block';
  document.getElementById('result-message').innerHTML = 'Seu navegador não possui suporte a Geolocalização';
  document.getElementById('tryagain').style.display = 'block';
  document.getElementById('preloader').style.display = 'none';
};

// Init
init();
