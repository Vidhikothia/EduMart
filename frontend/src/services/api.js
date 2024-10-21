import axios from 'axios';

// Create an instance of Axios with a base URL for your API
const API = axios.create({
  baseURL: 'http://localhost:5000', // Change this to your actual backend URL
});

// Export for use in different components
export default API;
