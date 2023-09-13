import api from '../lib/axios';

export default {
	createExpense(data) {
		return api.post('/api/mongo/report/create', data)
	},
	getExpenseByInternalId(id) {
		return api.post('/api/mongo/report', { "id_busqueda": id })
	},
	getCategorieById(id) {
		return api.get(`/api/mongo/categories/one/${id}`)
	},
	filterExpenses(ord, entity, starDate, finishDate, estatus) {
		return api.get(`api/mongo/report/filter/employee/${ord}/${entity}/${starDate}/${finishDate}/${estatus}`)
	}
}