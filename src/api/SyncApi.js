import api from '../lib/axios';

export default {
	syncEmployees() {
		return api.post('/api/mongo/employees/new', {})
	},
	syncReports() {
		return api.post('/api/mongo/reports/new', {})
	},
	syncSubsidiaries() {
		return api.post('/api/mongo/sub/new', {})
	},
	syncCurrencys() {
		return api.post('/api/mongo/currencys/new', {})
	},
	syncLocations() {
		return api.get('/api/mongo/locations/new')
	},
	syncDepartments() {
		return api.get('/api/mongo/deparments/new')
	},
	syncCategories() {
		return api.get('/api/mongo/categories/new')
	},
	syncNexus() {
		return api.post('/api/mongo/nexus/news', {})
	},
	syncTaxes() {
		return api.post('/api/mongo/taxes/news', {})
	},
	syncViajes(id_employee) {
		return api.get(`/api/mongo/consulta/viajes/${id_employee}`)
	},
	syncViajesFacturas(id_employee, code) {
		return api.get(`/api/mongo/consulta/facturas/${id_employee}/${code}`)
	},
	getListReports() {
		return api.get('/api/mongo/report/list')
	}
}