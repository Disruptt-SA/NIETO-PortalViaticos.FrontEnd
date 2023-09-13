import axios from 'axios'

const url_api = import.meta.env.VITE_APP_URL_API_LOCAL
//const url_api = import.meta.env.VITE_APP_URL_API_PROD

const api = axios.create({
	baseURL: url_api
})

export default api
