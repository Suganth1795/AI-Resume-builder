// Central API config — reads from VITE_API_URL env variable
// Development: http://127.0.0.1:8000
// Production:  https://<your-render-app>.onrender.com
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default API_URL;
