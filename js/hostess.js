const getProcedureField = $('#proceduresSelect');
const getProfessionalsField = $('#professionalsSelect');
const getSpecialitiesField = $('#specialitiesSelect');
const getAgreementsField = $('#agreementSelect');
const getdateConfirmField = $('#dateConfirm');
const getDateField = $('#dateSelect');
const cpf = document.querySelector('#cpf');
const phone = document.querySelector('#phone_number');
const name = document.querySelector('#name');
const cpfField = $('#cpf');
const phoneField = $('#phone_number');
const nameField = $('#name');
const modal = $('#modalDate');

let auxProfessional;
let auxSpecialities;
let cont = 0;
let btn_more_datetime = $('#btnMoreDatetime');
let btnSubmit = $('#btnSubmit');
let btnSearch = $('#search');
let modal_datetime = $('#modal-datetime')[0];
let dateSelected;
let procSelected = '';
let profSelected = '';
let monthExt;
let dayToday = new Date();
let monthToday = dayToday.getMonth() + 1;
let yearToday = dayToday.getFullYear();
let array_disabled = [];
let newDate, newDay, newMonth, newYear;
let arraySplitDate = [];
let save_schedule = $('#save_schedule');
let reschedule = $('#reschedule');
let contFormComplete = 0;
let form = $('.schedule-form');
let arrayDadosForm = [];
let confirmSchedule = $('.schedule-confirm');

// btn_more_datetime.click(() => {
//     getProfessionalsField.change();
// });

reschedule.click(() => {
  console.log('teste reschedule');
  form[0].reset();
  form[0].style.display = 'block';
  confirmSchedule[0].style.display = 'none';
});

save_schedule.click(() => {
  contFormComplete = 0;

  if (getProcedureField.val() === '') {
    getProcedureField.addClass('required');
  } else {
    contFormComplete++;
  }
  if (getProfessionalsField.val() === '') {
    getProfessionalsField.addClass('required');
  } else {
    contFormComplete++;
  }
  // if(getSpecialitiesField.val() === '') {
  //     getSpecialitiesField.addClass("required");
  // } else {
  //     contFormComplete ++;
  // }
  if (getAgreementsField.val() === '') {
    getAgreementsField.addClass('required');
  } else {
    contFormComplete++;
  }
  if (getDateField.val() === '') {
    getDateField.addClass('required');
  } else {
    contFormComplete++;
  }
  if (cpf.value.length < 14) {
    $('#cpf').addClass('required');
  } else {
    contFormComplete++;
  }
  if (phone.value.length < 14) {
    $('#phone_number').addClass('required');
  } else {
    contFormComplete++;
  }
  if (name.value.length < 7) {
    $('#name').addClass('required');
  } else {
    contFormComplete++;
  }

  if (parseInt(contFormComplete) >= 7) {
    arrayDadosForm = form.serializeArray();
    console.log(arrayDadosForm);

    //Descomentar a partir dessa linha
    let formData = `
           {
               "professional_id": ${arrayDadosForm[2].value},
               "customer_name": "${arrayDadosForm[5].value}",
               "procedure_servicetype_id": ${arrayDadosForm[0].value},
               "medical_agreement_id": ${arrayDadosForm[3].value},
               "date": "${arrayDadosForm[4].value}",
               "cpf": "${arrayDadosForm[6].value.replace(/\D/g, '')}",
               "phone": "${arrayDadosForm[7].value.replace(/\D/g, '')}"
           }
       `;
    console.log(formData);
    axios({
      method: 'post',
      url: `${window.location.origin}/agenda/api/scheduled_service/`,
      data: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => {
      console.log(response);
      $('#confirm_infos').html(
        `<p class="title-info">Olá ${
          response.data.customer_name
        },</p><p class="content"> Seu agendamento para ${
          response.data.procedure_servicetype
        } com o Dr(a). ${response.data.professional} para ${
          response.data.date
        } foi realizado com sucesso. </br></br>Ao chegar para seu atendimento às ${
          response.data.service_desk_date
        }, realize seu check-in no Totem, informando seu número de telefone cadastrado ou seu CPF.</p>`
      );
      form[0].style.display = 'none';
      confirmSchedule[0].style.display = 'block';
    });
  }
});

getProcedureField.change(() => {
  if (getProcedureField.val() === '') {
    getProcedureField.addClass('required');
  } else {
    getProcedureField.removeClass('required');
  }

  getProfessionalsField.val('');
  getProfessionalsField.prop('disabled', true);
});

cpfField.keypress(() => {
  if (cpf.value.length < 14) {
    $('#cpf').addClass('required');
  } else {
    $('#cpf').removeClass('required');
  }
});

phoneField.keypress(() => {
  if (phone.value.length < 14) {
    $('#phone_number').addClass('required');
  } else {
    $('#phone_number').removeClass('required');
  }
});

nameField.keypress(() => {
  if (name.value.length < 7) {
    $('#name').addClass('required');
  } else {
    $('#name').removeClass('required');
  }
});

getAgreementsField.change(() => {
  if (getAgreementsField.val() === '') {
    getAgreementsField.addClass('required');
  } else {
    getAgreementsField.removeClass('required');
  }
});

getDateField.change(() => {
  if (getDateField.val() === '') {
    getDateField.addClass('required');
  } else {
    if (getDateField.val() === 'others') {
      console.log('teste');
      modal.addClass('show');
      $('#modalDate').modal();
    }
    getDateField.removeClass('required');
  }
});

btnSearch.click(() => {
  dateSelect.style.color = '#888686';
});

getProcedureField.change(() => {
  if ($('#proceduresSelect').val() === '') {
    getProfessionalsField.prop('disabled', true);
    procSelected = $('#proceduresSelect').val();
  } else {
    getProfessionalsField.prop('disabled', false);
    procSelected = $('#proceduresSelect').val();
  }
});

getProfessionalsField.change(() => {
  $('#datepicker').datepicker('destroy');
  array_disabled = [];
  if ($('#professionalsSelect').val() === '') {
    getDateField.prop('disabled', true);
    btn_more_datetime.prop('disabled', true);
  }

  if (getProfessionalsField.val() === '') {
    getProfessionalsField.addClass('required');
  } else {
    profSelected = getProfessionalsField.val();
    procSelected = getProcedureField.val();
    getProfessionalsField.removeClass('required');
  }

  getDateField.prop('disabled', true);
  btn_more_datetime.prop('disabled', true);

  axios({
    method: 'get',
    url: `${
      window.location.origin
    }/agenda/calendar-json/professional/${profSelected}/procedure-service-type/${procSelected}/year/${yearToday}/month/${monthToday}/`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(response => {
    console.log('beforeShowDay');
    console.log(response);
    for (var i = 0; i < response.data.dates[0].disabled.length; i++) {
      array_disabled.push(response.data.dates[0].disabled[i]);
    }
    let last_date_aux = response.data.last_date.split('-');
    let last_day = parseInt(last_date_aux[0]);
    let last_month = parseInt(last_date_aux[1]);
    let last_year = parseInt(last_date_aux[2]);
    console.log(last_date_aux);
    console.log(new Date(last_date_aux[2], last_date_aux[1], last_date_aux[0]));

    console.log(array_disabled);

    $('#datepicker').datepicker({
      minDate: new Date(),
      // maxDate: new Date(last_year, last_month, last_day),
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
      onSelect: function(date) {
        console.log('date: ', date);
        dateSelected = date;

        getdateConfirmField
          .find('option')
          .remove()
          .end();

        console.log('teste search');

        getDateField.prop('disabled', true);

        console.log(dateSelected);
        let arrayDateSelected = dateSelected.split('/');
        let daySelected = arrayDateSelected[0];
        let monthSelected = arrayDateSelected[1];
        let yearSelected = arrayDateSelected[2];

        let week = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
        let yearWeek = parseInt(yearSelected, 10);
        let monthWeek = parseInt(monthSelected, 10) - 1;
        let dayWeek = parseInt(daySelected, 10);
        let dateWeek = new Date(yearWeek, monthWeek, dayWeek);
        let getDayWeek = dateWeek.getDay();

        let getWeekSelected = week[getDayWeek];

        switch (parseInt(monthSelected)) {
          case 1:
            monthExt = 'Jan';
            break;
          case 2:
            monthExt = 'Fev';
            break;
          case 3:
            monthExt = 'Mar';
            break;
          case 4:
            monthExt = 'Abr';
            break;
          case 5:
            monthExt = 'Mai';
            break;
          case 6:
            monthExt = 'Jun';
            break;
          case 7:
            monthExt = 'Jul';
            break;
          case 8:
            monthExt = 'Ago';
            break;
          case 9:
            monthExt = 'Set';
            break;
          case 10:
            monthExt = 'Out';
            break;
          case 11:
            monthExt = 'Nov';
            break;
          case 12:
            monthExt = 'Dez';
            break;
        }

        console.log('getProcedureField');
        console.log(getProcedureField);

        if (
          getProcedureField.val() + '' !== '' &&
          getProfessionalsField.val() + '' !== ''
        ) {
          procSelected = getProcedureField.val();
          profSelected = getProfessionalsField.val();
        }

        console.log(
          `${
            window.location.origin
          }/agenda/calendar-times-json/professional/${profSelected}/procedure-service-type/${procSelected}/year/${yearSelected}/month/${monthSelected}/day/${daySelected}/`
        );

        axios({
          method: 'get',
          url: `${
            window.location.origin
          }/agenda/calendar-times-json/professional/${profSelected}/procedure-service-type/${procSelected}/year/${yearSelected}/month/${monthSelected}/day/${daySelected}/`,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(response => {
          console.log(response);
          getDateField
            .find('option')
            .remove()
            .end();
          // .append('<option value="">-------------</option>')
          // .val('');
          dateSelect.style.color = 'transparent';

          for (var i = 0; i < response.data.time_ranges.available.length; i++) {
            dateSelect.options[dateSelect.options.length] = new Option(
              `${getWeekSelected} ${daySelected}/${monthExt} ${
                response.data.time_ranges.available[i]
              }`,
              `${yearSelected}-${monthSelected}-${daySelected} ${
                response.data.time_ranges.available[i]
              }`
            );
            dateConfirm.options[dateConfirm.options.length] = new Option(
              `${getWeekSelected} ${daySelected}/${monthExt} ${
                response.data.time_ranges.available[i]
              }`,
              `${yearSelected}-${monthSelected}-${daySelected} ${
                response.data.time_ranges.available[i]
              }`
            );
          }

          getDateField.prop('disabled', false);
        });
      },
      beforeShowDay: function(date) {
        // console.log(date);
        var date = formatDate(date);
        // console.log(date);
        if (array_disabled.includes(date + '')) {
          // console.log("if: ", date+"");
          return [false, 'ui-state-disabled'];
        } else {
          // console.log("else: ", date+"");
          return [true, 'default'];
        }
      }
    });

    getDateField.prop('disabled', false);
    btn_more_datetime.prop('disabled', false);
  });
  // else {
  //     getDateField.prop("disabled", false );
  // }
});

$(document).ready(function() {
  $('#cpf').mask('000.000.000-00');

  if ($('#proceduresSelect').val() === '') {
    getProfessionalsField.prop('disabled', true);
  }
  if ($('#professionalsSelect').val() === '') {
    getDateField.prop('disabled', true);
    btn_more_datetime.prop('disabled', true);
  }

  let specialitiesSelect = document.getElementById('specialitiesSelect');
  let professionalsSelect = document.getElementById('professionalsSelect');
  let proceduresSelect = document.getElementById('proceduresSelect');
  let agreementSelect = document.getElementById('agreementSelect');
  let dateSelect = document.getElementById('dateSelect');
  let dateConfirm = document.getElementById('dateSelect');

  axios({
    method: 'get',
    url: `${window.location.origin}/agenda/get-procedure-service-type-json/`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(response => {
    console.log('procedures: ');
    console.log(response);
    for (var i = 0; i < response.data.length; i++) {
      proceduresSelect.options[proceduresSelect.options.length] = new Option(
        `${response.data[i].label}`,
        `${response.data[i].value}`
      );
    }
  });

  getProfessionalsField.change(() => {
    let getValueProf = $('#professionalsSelect').val();
    if (cont > 0) {
      $('#specialitiesSelect')
        .find('option')
        .remove()
        .end()
        .append('<option value="">-------------</option>')
        .val('');
      axios({
        method: 'get',
        url: `${window.location.origin}/agenda/expertises/`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(response => {
        for (var i = 0; i < response.data.length; i++) {
          specialitiesSelect.options[
            specialitiesSelect.options.length
          ] = new Option(
            `${response.data[i].titulo}`,
            `${response.data[i].id}`
          );
        }
      });
    }
    if (getValueProf + '' === '') {
      $('#dateSelect')
        .find('option')
        .remove()
        .end()
        .append('<option value="">-------------</option>')
        .val('');
    }

    $('#dateSelect')
      .find('option')
      .remove()
      .end()
      .append('<option value="">-------------</option>')
      .val('');

    let getIdProf = getProfessionalsField.val();
    let getIdProc = getProcedureField.val();
    console.log(getIdProc);
    let date = new Date();
    let year_current = date.getFullYear();
    let month_current = date.getMonth() + 1;
    if (parseInt(month_current) < 10) {
      month_current = `0${month_current}`;
    }
    console.log(
      `${
        window.location.origin
      }/agenda/calendar-json/professional/${getIdProf}/procedure-service-type/${getIdProc}/year/${year_current}/month/${month_current}/`
    );
    axios({
      method: 'get',
      url: `${
        window.location.origin
      }/agenda/agenda-json/professional/${getIdProf}/procedure-service-type/${getIdProc}/`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => {
      console.log('data/hora response aa:');
      console.log(response);
      console.log('--------------------');
      for (var i = 0; i < response.data.agenda.length; i++) {
        dateSelect.options[dateSelect.options.length] = new Option(
          `${response.data.agenda[i].label}`,
          `${response.data.agenda[i].value}`
        );
      }
      getDateField.prop('disabled', false);
      btn_more_datetime.prop('disabled', false);
    });
    cont++;
  });

  getSpecialitiesField.change(() => {
    $('#professionalsSelect')
      .find('option')
      .remove()
      .end()
      .append('<option value="">-------------</option>')
      .val('');

    let getIdSpec = getSpecialitiesField.val();
    if (getIdSpec + '' === '') {
      axios({
        method: 'get',
        url: `${window.location.origin}/agenda/professionals`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(response => {
        console.log(response);
        for (var i = 0; i < response.data.length; i++) {
          professionalsSelect.options[
            professionalsSelect.options.length
          ] = new Option(`${response.data[i].nome}`, `${response.data[i].id}`);
        }
      });
    } else {
      console.log(getIdSpec);

      axios({
        method: 'get',
        url: `${
          window.location.origin
        }/agenda/professionals/expertise/${getIdSpec}/`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(response => {
        console.log(response);
        for (var i = 0; i < response.data.length; i++) {
          professionalsSelect.options[
            professionalsSelect.options.length
          ] = new Option(`${response.data[i][1]}`, `${response.data[i][0]}`);
        }
      });
    }
  });

  const getSpecialities = () => {
    return axios.get(`${window.location.origin}/agenda/expertises/`);
  };

  const getProfessionals = () => {
    return axios.get(`${window.location.origin}/agenda/professionals/`);
  };
  const getAgreements = () => {
    return axios.get(`${window.location.origin}/agenda/medical-agreements/`);
  };
  axios.all([getSpecialities(), getProfessionals(), getAgreements()]).then(
    axios.spread(function(specialities, professionals, agreements) {
      let specialitiesAux = specialities.data;
      let professionalsAux = professionals.data;
      let agreementsAux = agreements.data;
      console.log(agreements);

      for (var i = 0; i < specialitiesAux.length; i++) {
        specialitiesSelect.options[
          specialitiesSelect.options.length
        ] = new Option(
          `${specialitiesAux[i].titulo}`,
          `${specialitiesAux[i].id}`
        );
        //specialitiesSelectLg.options[specialitiesSelectLg.options.length] = new Option(`${specialitiesAux[i].titulo}`, `${specialitiesAux[i].id}`);
      }
      for (var i = 0; i < professionalsAux.length; i++) {
        professionalsSelect.options[
          professionalsSelect.options.length
        ] = new Option(
          `${professionalsAux[i].nome}`,
          `${professionalsAux[i].id}`
        );
        //professionalsSelectLg.options[professionalsSelectLg.options.length] = new Option(`${professionalsAux[i].nome}`, `${professionalsAux[i].id}`);
      }
      for (var i = 0; i < agreementsAux.length; i++) {
        agreementSelect.options[agreementSelect.options.length] = new Option(
          `${agreementsAux[i].nome}`,
          `${agreementsAux[i].id}`
        );
        //agreementSelectLg.options[agreementSelectLg.options.length] = new Option(`${agreementsAux[i].nome}`, `${agreementsAux[i].id}`);
      }
    })
  );
});
const formatDate = date => {
  var d = date,
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};
