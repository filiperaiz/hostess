const prod = true;
const urlProduction = 'http://gastrovita.hostess.digital:81/agenda';
const urlDevelopment = 'http://127.0.0.1:4000';

const pathUrl = prod ? urlProduction : urlDevelopment

const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

export const Service = {
  getProcedure(id) {
    return axios.get(`${pathUrl}/${id}`, config);
  },
  
  getProfessionals(id) {
    return axios.get(`${pathUrl}/${id}`, config);
  },
  
  getProcedure(id) {
    return axios.get(`${pathUrl}/${id}`, config);
  },

  getProcedure(id) {
    return axios.get(`${pathUrl}/${id}`, config);
  },

  postScheduledService() {
    return axios.post(`${pathUrl}/${id}`, {}, config);
  }
};
