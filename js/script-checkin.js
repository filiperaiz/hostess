const pathUrl = 'https://demo.hostess.digital/agenda';
const config = {
  headers: { 'Content-Type': 'application/json' }
};

const buttonTryAgain = $('#tryagain');
const userCpfInput = $('#userCpf');

userCpfInput.keypress(() => {
  userCpfInput.mask('000.000.000-00');

  if (userCpfInput.val().length < 14) {
    userCpfInput.addClass('is-invalid');
  } else {
    userCpfInput.removeClass('is-invalid');
  }
});

const getLocation = () => {
  if (navigator.geolocation) {
    console.log('Navegador com suporte a geolocalizão!');
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    const dataUser = JSON.parse(window.localStorage.getItem('dataUser'));
    // alert(dataUser.cpf);
  } else {
    console.log('Navegador sem suporte a geolocalizão!');
    endPreloader();
  }
};

const geoSuccess = pos => {
  // localização do Hospital Gatrovita
  const baseLocale = {
    latitude: 55.755826,
    longitude: 37.6173
  };

  const distance = geoDistance(
    baseLocale.latitude,
    baseLocale.longitude,
    pos.coords.latitude,
    pos.coords.longitude,
    'K'
  );

  if (!distance) {
    autoCheckIn();
  } else {
    endPreloader();
  }
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

  if (dist < 0.3) {
    result = true;
  }

  return result;
};

const autoCheckIn = () => {
  const dataUser = JSON.parse(window.localStorage.getItem('dataUser'));
  postCheckin(dataUser.cpf);
};

const clickCheckIn = () => {
  const forms = document.getElementsByClassName('hostess_form');
  const validation = Array.prototype.filter.call(forms, function(form) {
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

  const params = {
    text_query: cpf
  };

  axios
    .post(`${pathUrl}/api/check-in/`, params, config)
    .then(response => {
      if (response.data.status == 'error') {
        document.getElementById('preloader').style.display = 'none';
        document.getElementById('result').innerHTML = response.data.message;
        document.getElementById('section-secondary').style.display = 'block';
        document.getElementById('tryagain').style.display = 'block';
      }

      if (response.data.status == 'single' || response.data.status == 'multiple') {
        document.getElementById('preloader').style.display = 'none';
        document.getElementById('result').innerHTML = `Seu check-in foi realizado com sucesso, aguarde ser chamado`;
        document.getElementById('section-secondary').style.display = 'block';
      }
    });
};

const startPreloader = () => {
  document.getElementById('section-secondary').style.display = 'none';
  document.getElementById(
    'preloader'
  ).innerHTML = `<img src="/img/loading.svg" alt="">`;
  document.getElementById('preloader').style.display = 'block';
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
getLocation();
startPreloader();






// const config2 = {
//   headers: {
//     'Content-Type': 'application/json' ,
//     'Authorization':'key=AAAAI_H5rS4:APA91bFQrNgvHlUVA1YPFVHoaPs52ZGBso-Ibbl4PhdDm0nj_OUiIrbPgkG0rKCKVcsjnjanF2zJEzyPoW5DbBBAKBUIC0PT0br-ct0kPZ_rrKg3hhGQbjZtUmWWW9zx-X8OXANwQKzw'
//   }
// };

// let push = {
//     "notification": {
//         "title": "Push Teste",
//         "body": "Push teste funcionando =D",
//         "click_action": "https://pwaraiz.netlify.com",
//         "icon": "https://pwaraiz.netlify.com/img/icons/icon-152x152.png"
//     },
//     "to": "ecKMXIOv9aU:APA91bEhSGghrYJkBuhuKgPG91OvtO80Ec44ZXsmmrRID_7tKHSJwe5V37THjNKeLe4VKqJWeRp1Pe4hEivGVQfP-iUQ46NVYIVONY3PQIm6kazGjqS4d1gNudaQ3--oO1lbw5mniE9q"
// }

// axios.post(`https://fcm.googleapis.com/fcm/send`, push, config2).then(response => {
//  console.log(response);
// });
