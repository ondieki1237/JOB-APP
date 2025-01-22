const API_CONFIG = {
  baseURL: 'http://localhost:5000/api', // Your backend service is running on port 5000
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export default API_CONFIG;
