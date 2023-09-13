import api from '../lib/axios';

export default {
	login(data) {
		return api.post('/api/mongo/login', data)
	},
	getEmployeeById() {
		const _id = localStorage.getItem('USER_ID')
		if (_id != null) {
			return api.get(`/api/mongo/employee/${_id}`)
		}
		return
	},
	getSubsidiarieById(id) {
		if (id != null) {
			return api.get(`/api/mongo/sub/${id}`)
		}
		return
	}
}