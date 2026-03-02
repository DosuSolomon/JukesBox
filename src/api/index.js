import api from './client';

// Create a base44-compatible wrapper
const base44Wrapper = {
  // Entities - mimic base44.entities.Song structure
  entities: {
    Song: {
      list: (sort) => api.list('Song', sort),
      filter: (filters, sort) => api.filter('Song', filters, sort),
      get: (id) => api.get('Song', id),
      create: (data) => api.create('Song', data),
      update: (id, data) => api.update('Song', id, data),
      delete: (id) => api.delete('Song', id),
    },
    SongRequest: {
      list: (sort) => api.list('SongRequest', sort),
      filter: (filters, sort) => api.filter('SongRequest', filters, sort),
      get: (id) => api.get('SongRequest', id),
      create: (data) => api.create('SongRequest', data),
      update: (id, data) => api.update('SongRequest', id, data),
      delete: (id) => api.delete('SongRequest', id),
    },
  },
  
  // Auth - mimic base44.auth structure
  auth: {
    login: (email, password) => api.login(email, password),
    register: (email, password, name) => api.register(email, password, name),
    me: () => api.getCurrentUser(),
    logout: () => {
      api.setToken(null);
      localStorage.removeItem('auth_token');
    },
  },
  
  // App logs - mimic base44.appLogs structure
  appLogs: {
    logUserInApp: (pageName) => api.logUserActivity(pageName),
  },
};

// Export both the wrapper and the raw api client
export { api };
export default base44Wrapper;
