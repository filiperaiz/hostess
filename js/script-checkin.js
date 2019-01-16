const pathUrl = 'https://demo.hostess.digital/agenda';
const config = {
  headers: { 'Content-Type': 'application/json' }
};

const buttonTryAgain = $('#tryagain');
const userCpfInput = $('#userCpf');

const init = () => {
  startPreloader();
  setTimeout(() => {
    getLocation();
  }, 3000);

  userCpfInput.mask('000.000.000-00');
};

userCpfInput.keypress(() => {
  if (userCpfInput.val().length < 14) {
    userCpfInput.addClass('is-invalid');
  } else {
    userCpfInput.removeClass('is-invalid');
  }
});

const getMobileOperatingSystem = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if (/windows phone/i.test(userAgent)) {
    return 'windows';
  }

  if (/android/i.test(userAgent)) {
    return 'android';
  }

  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'ios';
  }

  return 'desktop';
};

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
  } else {
    endPreloader();
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
  } else {
    document.getElementById('section-checkin-error').style.display = 'block';
  }

  endPreloader();
};

const geoError = error => {
  if (error.code) {
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
      document.getElementById(
        'errorForm'
      ).innerHTML = `Preencha seu cpf corretamente`;

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
    if (response.data.status == 'error') {
      document.getElementById('preloader').style.display = 'none';
      document.getElementById('result').innerHTML = response.data.message;
      document.getElementById('section-secondary').style.display = 'block';
      document.getElementById('tryagain').style.display = 'block';
    }

    if (
      response.data.status == 'single' ||
      response.data.status == 'multiple'
    ) {
      document.getElementById('preloader').style.display = 'none';
      document.getElementById(
        'result'
      ).innerHTML = `Seu check-in foi realizado com sucesso, aguarde ser chamado`;
      document.getElementById('section-secondary').style.display = 'block';
    }
  });
};

const startPreloader = () => {
  document.getElementById('preloader').style.display = 'block';
  document.getElementById('preloader').innerHTML = `<img src="/img/loading.svg" alt="">`;
  document.getElementById('section-secondary').style.display = 'none';
  document.getElementById('hostess_form').style.display = 'none';
};

const endPreloader = () => {
  document.getElementById('preloader').style.display = 'none';
  document.getElementById('hostess_form').style.display = 'block';
};

buttonTryAgain.click(() => {
  document.getElementById('tryagain').style.display = 'none';
  document.getElementById('hostess_form').style.display = 'block';
  document.getElementById('section-secondary').style.display = 'none';
});

// Init
init();
