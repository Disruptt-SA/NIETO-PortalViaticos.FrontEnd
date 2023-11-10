import { ref } from 'vue'
import { defineStore } from 'pinia'
import SyncApi from '../api/SyncApi'
import TaxesApi from '../api/TaxesApi'
import ExpensesApi from '../api/ExpensesApi'

export const useSyncStore = defineStore('sync', () => {
	//VARIABLES
	const employees = ref()
	const reports = ref()
	const subsidiaries = ref()
	const currencys = ref()

	const locations = ref()
	const departments = ref()
	const categories = ref()
	const nexus = ref()
	const taxes = ref()
	const tax = ref()
	const taxesCodes = ref()
	const viajes = ref()
	const viajesFacturas = ref()

	//FUNCIONES
	const syncEmployees = async () => {
		try {
			const { data } = await SyncApi.syncEmployees()
			employees.value = data.Employees
		} catch (error) {
			console.log('error', error)
		}
	}

	const syncReports = async () => {
		try {
			await SyncApi.syncReports()
			const { data } = await SyncApi.getListReports()
			reports.value = data.Reports
		} catch (error) {
			console.log('error', error)
		}
	}

	const filterExpenses = async (ord, entity, starDate, finishDate, estatus) => {
		try {
			const { data } = await ExpensesApi.filterExpenses(ord, entity, starDate, finishDate, estatus)
			reports.value = data.Reports
			console.log("reports_filters", reports.value)
		} catch (error) {
			console.log('error', error)
		}
	}

	const syncSubsidiaries = async () => {
		try {
			const { data } = await SyncApi.syncSubsidiaries()
			subsidiaries.value = data.Subsidiarias
		} catch (error) {
			console.log('error', error)
		}
	}

	const syncCurrencys = async () => {
		try {
			const { data } = await SyncApi.syncCurrencys()
			currencys.value = data.Monedas
		} catch (error) {
			console.log('error', error)
		}
	}

	const syncLocations = async () => {
		try {
			const { data } = await SyncApi.syncLocations()
			locations.value = data.Ubicaciones
		} catch (error) {
			console.log('error', error)
		}
	}

	const syncDepartments = async () => {
		try {
			const { data } = await SyncApi.syncDepartments()
			departments.value = data.Departamentos
		} catch (error) {
			console.log('error', error)
		}
	}

	const syncCategories = async () => {
		try {
			await SyncApi.syncCategories()
		} catch (error) {
			console.log('error', error)
		}
	}

	const listCategories = async (sub) => {
		try {
			const { data } = await SyncApi.getListCategories(sub)
			categories.value = data.Categorias
		} catch (error) {
			console.log('error', error)
		}
	}

	const syncNexus = async () => {
		try {
			const { data } = await SyncApi.syncNexus()
			nexus.value = data.Nexus
		} catch (error) {
			console.log('error', error)
		}
	}

	const syncTaxes = async () => {
		try {
			const { data } = await SyncApi.syncTaxes()
			taxes.value = data.taxes
		} catch (error) {
			console.log('error', error)
		}
	}

	const syncTaxesCodes = async (taxType) => {
		try {
			const { data } = await TaxesApi.getTaxescodes(taxType)
			taxesCodes.value = data.taxes[0].taxCodes
			tax.value = data.taxes
		} catch (error) {
			console.log('error', error)
		}
	}

	const syncViajeCodes = async (id_employee) => {
		try {
			const { data } = await SyncApi.syncViajes(id_employee)
			viajes.value = data.Codigos
		} catch (error) {
			console.log('error', error)
		}
	}

	const syncViajeCodesFacturas = async (id_employee, code) => {
		try {
			const { data } = await SyncApi.syncViajesFacturas(id_employee, code)
			viajesFacturas.value = data.Codigos
		} catch (error) {
			console.log('error', error)
		}
	}

	return {
		employees,
		reports,
		subsidiaries,
		currencys,
		locations,
		departments,
		categories,
		nexus,
		taxes,
		tax,
		taxesCodes,
		viajes,
		viajesFacturas,
		syncEmployees,
		syncReports,
		filterExpenses,
		syncSubsidiaries,
		syncCurrencys,
		syncLocations,
		syncDepartments,
		syncCategories,
		listCategories,
		syncNexus,
		syncTaxes,
		syncTaxesCodes,
		syncViajeCodes,
		syncViajeCodesFacturas
	}
})
