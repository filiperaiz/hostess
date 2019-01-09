const pathUrl = 'https://demo.hostess.digital/agenda';
const config = {
  headers: { 'Content-Type': 'application/json' }
};

const userNameInput = $('#userName');
const userCpfInput = $('#userCpf');
const userFoneInput = $('#userFone');

const getSelectProcedures = $('#selectProcedures');
const getSelectSpecialities = $('#selectSpecialities');
const getSelectProfessionals = $('#selectProfessionals');
const getSelectAgreement = $('#selectAgreement');
const getSelectDateHour = $('#selectDateHour');
const getModalSelectDateHour = $('#modalSelectDateHour');
const buttonShowModal = $('#btnMoreDatetime');
const buttonModalConfirm = $('#btnModalConfirm');
const buttonActivePush = $('#onPushNotification');
const modalDate = $('#modalDate');
const hostessForm = $('#hostess_form');
const onSave = $('#onSave');
const reschedule = $('#reschedule');

let tokenPush = ''

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

userNameInput.keypress(() => {
  if (userNameInput.val().length < 4) {
    userNameInput.addClass('is-invalid');
  } else {
    userNameInput.removeClass('is-invalid');
  }
});

userCpfInput.keypress(() => {
  userCpfInput.mask('000.000.000-00');

  if (userCpfInput.val().length < 14) {
    userCpfInput.addClass('is-invalid');
  } else {
    userCpfInput.removeClass('is-invalid');
  }
});

userFoneInput.keypress(() => {
  userFoneInput.mask('(00) 00000-0000');
  if (userFoneInput.val().length < 14) {
    userFoneInput.addClass('is-invalid');
  } else {
    userFoneInput.removeClass('is-invalid');
  }
});

const init = () => {
  getSelectProfessionals.prop('disabled', true);
  getSelectSpecialities.prop('disabled', true);
  getSelectDateHour.prop('disabled', true);
  buttonShowModal.prop('disabled', true);
  document.getElementById('section-secondary').style.display = 'none';

  let navigatorType = getMobileOperatingSystem();

  if (navigatorType == 'ios') {
    document.getElementById('boxPushNotification').style.display = 'none';
  }

  const getProcedures = () =>
    axios.get(`${pathUrl}/get-procedure-service-type-json/`, config);
  const getAgreement = () =>
    axios.get(`${pathUrl}/medical-agreements/`, config);
  const getSpecialities = () => axios.get(`${pathUrl}/expertises/`, config);

  const optionProcedures = getSelectProcedures[0];
  const optionAgreement = getSelectAgreement[0];
  const optionSpecialities = getSelectSpecialities[0];

  axios.all([getProcedures(), getAgreement(), getSpecialities()]).then(
    axios.spread(function(procedures, agreements, specialities) {
      procedures.data.map((option, index) => {
        optionProcedures[index + 1] = new Option(
          `${option.label}`,
          `${option.value}`
        );
      });

      agreements.data.map((option, index) => {
        optionAgreement[index + 1] = new Option(
          `${option.nome}`,
          `${option.id}`
        );
      });

      specialities.data.map((option, index) => {
        optionSpecialities[index + 1] = new Option(
          `${option.titulo}`,
          `${option.id}`
        );
      });
    })
  );
};

const getProfessionals = (params) => {
  const paramsUrl = params ? `professionals/${params}` : 'professionals/';
  const options = getSelectProfessionals[0];

  axios.get(`${pathUrl}/${paramsUrl}`, config).then(response => {
    response.data.map((option, index) => {
      options[index + 1] = params
        ? new Option(`${option[1]}`, `${option[0]}`)
        : new Option(`${option.nome}`, `${option.id}`);
    });
  });
};

const disableSelectProfessionals = () => {
  (getSelectProcedures.val() && getSelectAgreement.val()) === ''
    ? (getSelectProfessionals.prop('disabled', true),
      getSelectSpecialities.prop('disabled', true))
    : (getSelectProfessionals.prop('disabled', false),
      getSelectSpecialities.prop('disabled', false));

  if ((getSelectProcedures.val() && getSelectAgreement.val()) !== '') {
    getProfessionals();
  }
};

getSelectProcedures.change(() => {
  disableSelectProfessionals();
});

getSelectAgreement.change(() => {
  getSelectAgreement.val() === ''
    ? getSelectAgreement.addClass('is-invalid')
    : getSelectAgreement.removeClass('is-invalid');

  disableSelectProfessionals();
});

getSelectSpecialities.change(() => {
  let getIdSpec = getSelectSpecialities.val();
  getIdSpec !== ''
    ? getProfessionals(`expertise/${getIdSpec}/`)
    : getProfessionals();
});

getSelectProfessionals.change(() => {
  const options = getSelectDateHour[0];
  const paramUrl = `/agenda-json/professional/${getSelectProfessionals.val()}/procedure-service-type/${getSelectProcedures.val()}`;

  if (getSelectProfessionals.val() !== '') {
    axios.get(`${pathUrl}/${paramUrl}`, config).then(response => {
      response.data.agenda.map((option, index) => {
        options[index + 1] = new Option(`${option.label}`, `${option.value}`);
      });
    });
  }

  getSelectProfessionals.val() === ''
    ? (getSelectDateHour.prop('disabled', true),
      buttonShowModal.prop('disabled', true))
    : (getSelectDateHour.prop('disabled', false),
      buttonShowModal.prop('disabled', false));
});

buttonShowModal.click(() => {
  $('#datepicker').datepicker({
    minDate: new Date(),
    dateFormat: 'dd/mm/yy',
    dayNames: [
      'Domingo',
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado'
    ],
    dayNamesMin: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    monthNames: [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro'
    ],
    monthNamesShort: [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez'
    ],
    nextText: 'Próximo',
    prevText: 'Anterior',
    onSelect: function(dateSelected) {
      let arrayDateSelected = dateSelected.split('/');
      let daySelected = arrayDateSelected[0];
      let monthSelected = arrayDateSelected[1];
      let yearSelected = arrayDateSelected[2];

      const paramsUrl = `calendar-times-json/professional/${getSelectProfessionals.val()}/procedure-service-type/${getSelectProcedures.val()}/year/${yearSelected}/month/${monthSelected}/day/${daySelected}/`;

      axios.get(`${pathUrl}/${paramsUrl}`, config).then(response => {
        const options = getModalSelectDateHour[0];

        if (response.data.time_ranges.available.length > 0) {
          document.getElementById('error').style.display = 'none';
          document.getElementById('select-time').style.display = 'block';

          response.data.time_ranges.available.map((option, index) => {
            options[index + 1] = new Option(
              `${option}`,
              `${yearSelected}-${monthSelected}-${daySelected} ${option}`
            );
          });
        } else {
          document.getElementById('select-time').style.display = 'none';
          document.getElementById('error').style.display = 'block';
          document.getElementById('error').innerHTML =
            'Nenhum horário disponível para esta data';

          setTimeout(() => {
            document.getElementById('error').style.display = 'none';
          }, 5000);
        }
      });
    }
  });
});

buttonModalConfirm.click(() => {
  modalDate.modal('hide');

  let data = getModalSelectDateHour.val();
  let array = data.split(' ');
  let hour = array[1];
  let date = array[0].split('-');
  let formatDate = `${date[2]}/${date[1]}/${date[0]}`;

  if (getModalSelectDateHour.val() !== '') {
    getSelectDateHour.prop('disabled', true);

    document.getElementById('other-hour').style.display = 'block';

    document.getElementById('otherHourList').innerHTML = `
        <ul class="list-group">
          <li class="list-group-item">Horario: <b>${hour}</b></li>
          <li class="list-group-item">Data: <b>${formatDate}</b></li>
        </ul>
      `;
  } else {
    getSelectDateHour.prop('disabled', false);
    document.getElementById('other-hour').style.display = 'none';
  }
});

reschedule.click(() => {
  hostessForm[0].reset();
  document.getElementById('section-primary').style.display = 'block';
  document.getElementById('section-secondary').style.display = 'none';

});

buttonActivePush.click(async () => {
  try {
    const messaging = firebase.messaging();
    await messaging.requestPermission();

    onSave.prop('disabled', true);
    tokenPush = await messaging.getToken();

    if (tokenPush !== '') {
      console.log(tokenPush);
      onSave.prop('disabled', false);
    }

    return tokenPush;
  } catch (error) {
    console.error(error);
  }
})

const saveSchedule = () => {
  const forms = document.getElementsByClassName('hostess_form');

  const validation = Array.prototype.filter.call(forms, function(form) {
    if (form.checkValidity()) {
      const arrayDadosForm = hostessForm.serializeArray();

      let finalDate = arrayDadosForm[7].value !== '' ? arrayDadosForm[7].value : arrayDadosForm[8].value;
          
      let formData = {
          "professional_id": arrayDadosForm[5].value,
          "customer_name": arrayDadosForm[0].value,
          "procedure_servicetype_id": arrayDadosForm[3].value,
          "medical_agreement_id": arrayDadosForm[4].value,
          "cpf": arrayDadosForm[1].value.replace(/\D/g, ''),
          "date": finalDate,
          "phone": arrayDadosForm[2].value.replace(/\D/g, ''),
          "token_push": tokenPush
        };

      axios.post(`${pathUrl}/api/scheduled_service/`,formData, config).then(response => {
       
        window.localStorage.setItem('dataUser', JSON.stringify(response.data));

        document.getElementById('confirm-list').innerHTML = `
        <li class="list-group-item">Dr(a): <b>${response.data.professional}</b></li>
        <li class="list-group-item">Consulta: <b>${response.data.date}</b></li>
        <li class="list-group-item">Atendimento: <b>${response.data.service_desk_date}</b></li>
      `;

        document.getElementById('section-primary').style.display = 'none';
        document.getElementById('section-secondary').style.display = 'block';
      })
      .catch(function (error) {
        document.getElementById('section-primary').style.display = 'none';
        document.getElementById('section-secondary').style.display = 'block';
      });

      event.preventDefault();
      event.stopPropagation();
    } else {
      getMobileOperatingSystem();
      console.log('Invalido');
      document.getElementById('errorForm').style.display = 'block';
      document.getElementById(
        'errorForm'
      ).innerHTML = `Preencha todos os campos sinalizados em vermelho, eles são obrigatórios`;

      setTimeout(() => {
        document.getElementById('errorForm').style.display = 'none';
      }, 10000);

      event.preventDefault();
      event.stopPropagation();
    }

    form.classList.add('was-validated');
  });
};

init();
