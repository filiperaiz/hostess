const pathUrl = 'https://demo.hostess.digital/agenda';
//const pathUrl = `${window.location.origin}/agenda`;

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
const modalDate = $('#modalDate');
const hostessForm = $('#hostess_form');
const reschedule = $('#reschedule');
const selectClick = $('.select-click');

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

const navigatorType = getMobileOperatingSystem();

const init = () => {
  userCpfInput.mask('000.000.000-00');
  userFoneInput.mask('(00) 00000-0000');
  getSelectProfessionals.prop('disabled', true);
  getSelectDateHour.prop('disabled', true);
  buttonShowModal.prop('disabled', true);

  const getProcedures = () =>
    axios.get(`${pathUrl}/get-procedure-service-type-json/`, config);
  const getAgreement = () =>
    axios.get(`${pathUrl}/medical-agreements/`, config);
  const getProfessionals = () => axios.get(`${pathUrl}/professionals/`, config);

  const optionProcedures = getSelectProcedures[0];
  const optionAgreement = getSelectAgreement[0];
  const optionProfessionals = getSelectProfessionals[0];

  axios.all([getProfessionals(), getProcedures(), getAgreement()]).then(
    axios.spread(function(professionals, procedures, agreements) {
      professionals.data.map((option, index) => {
        optionProfessionals[index + 1] = new Option(
          `${option.tratamento}${option.nome} | ${option.especialidade.join(', ')}`,
          `${option.id}`
        );
      });
    
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

    })
  );

  // Ativa dropdown de busca
  getSelectProcedures.select2({
    placeholder: 'Selecione um procedimento',
    allowClear: true
  });

  getSelectAgreement.select2({
    placeholder: 'Selecione um convênio',
    allowClear: true
  });

  getSelectProfessionals.select2({
    placeholder: 'Selecione um profissional',
    allowClear: true
  });  
};

const disableSelectProfessionals = () => {
  (getSelectProcedures.val() && getSelectAgreement.val()) === ''
  ? getSelectProfessionals.prop('disabled', true)
  : getSelectProfessionals.prop('disabled', false);
};

userNameInput.keypress(() => {
  userNameInput.val().length < 4 ? userNameInput.addClass('is-invalid') : userNameInput.removeClass('is-invalid');
});

userCpfInput.keypress(() => {
  userCpfInput.val().length < 14 ? userCpfInput.addClass('is-invalid') : userCpfInput.removeClass('is-invalid');
});

userFoneInput.keypress(() => {
  userFoneInput.val().length < 14 ? userFoneInput.addClass('is-invalid') : userFoneInput.removeClass('is-invalid');
});

selectClick.click(function() {
  $(".select2-search__field").attr("placeholder", "Selecione ou digite aqui");
});

getSelectProcedures.change(() => {
  disableSelectProfessionals();
});

getSelectAgreement.change(() => {
  disableSelectProfessionals();
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
  
  getSelectProfessionals.val() === '' ? (getSelectDateHour.prop('disabled', true), buttonShowModal.prop('disabled', true)) : (getSelectDateHour.prop('disabled', false), buttonShowModal.prop('disabled', false));
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
      const arrayDateSelected = dateSelected.split('/');
      const daySelected = arrayDateSelected[0];
      const monthSelected = arrayDateSelected[1];
      const yearSelected = arrayDateSelected[2];

      const paramsUrl = `calendar-times-json/professional/${getSelectProfessionals.val()}/procedure-service-type/${getSelectProcedures.val()}/year/${yearSelected}/month/${monthSelected}/day/${daySelected}/`;

      axios.get(`${pathUrl}/${paramsUrl}`, config).then(response => {
        const options = getModalSelectDateHour[0];

        if (response.data.time_ranges.available.length > 0) {
          document.getElementById('error').style.display = 'none';
          document.getElementById('select-time').style.display = 'block';

          response.data.time_ranges.available.map((option, index) => {
            options[index + 1] = new Option( `${option}`, `${yearSelected}-${monthSelected}-${daySelected} ${option}` );
          });

        } else {
          document.getElementById('select-time').style.display = 'none';
          document.getElementById('error').style.display = 'block';
          document.getElementById('error').innerHTML = 'Nenhum horário disponível para esta data';

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

  const data = getModalSelectDateHour.val();
  const array = data.split(' ');
  const hour = array[1];
  const date = array[0].split('-');
  const formatDate = `${date[2]}/${date[1]}/${date[0]}`;

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
  window.location.reload();
});

const activePush = async () => {
  try {
    const messaging = firebase.messaging();
    await messaging.requestPermission();
    const token = await messaging.getToken();

    return token;
  } catch (error) {
    console.error(error);
    return '';
  }
};

const saveSchedule = async () => {
  event.preventDefault();
  event.stopPropagation();

  const tokenPush = navigatorType !== 'ios' ? await activePush() : '';

  const forms = document.getElementsByClassName('hostess_form');

  const validation = Array.prototype.filter.call(forms, function(form) {
    if (form.checkValidity()) {
      const formData = hostessForm.serializeArray();

      const finalDate = formData[6].value !== '' ? formData[6].value : formData[7].value;

      const formParams = {
        customer_name: formData[0].value,
        cpf: formData[1].value.replace(/\D/g, ''),
        phone: formData[2].value.replace(/\D/g, ''),
        procedure_servicetype_id: formData[3].value,
        medical_agreement_id: formData[4].value,
        professional_id: formData[5].value,
        date: finalDate,
        token_push: tokenPush
      };

      axios.post(`${pathUrl}/api/scheduled_service/`, formParams, config).then(response => {
          const data = response.data;

          document.getElementById('confirm-list').innerHTML = `
            <ul class="list-group">
              <li class="list-group-item">Dr(a): <b>${ data.professional }</b></li>
              <li class="list-group-item">Consulta: <b>${data.date}</b></li>
              <li class="list-group-item">Atendimento: <b>${ data.service_desk_date }</b></li>
            </ul>
          `;
    
          document.getElementById('section-primary').style.display = 'none';
          document.getElementById('section-secondary').style.display = 'block';

          if (navigatorType == 'ios') {
            document.getElementById('ios').style.display = 'block';
          }

          if (navigatorType == 'android') {
            document.getElementById('android').style.display = 'block';
          }


        })
        .catch(function(error) {
          console.log(error);
        });
    } else {
      document.getElementById('errorForm').style.display = 'block';
      document.getElementById('errorForm').innerHTML = `Preencha todos os campos sinalizados em vermelho, eles são obrigatórios`;

      setTimeout(() => {
        document.getElementById('errorForm').style.display = 'none';
      }, 10000);
    }

    form.classList.add('was-validated');
  });
};

init();
