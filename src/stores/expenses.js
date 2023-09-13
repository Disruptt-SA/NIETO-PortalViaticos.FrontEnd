import { ref } from 'vue'
import { defineStore } from 'pinia'
import ExpenseApi from '../api/ExpensesApi'

export const useExpenseStore = defineStore('expense', () => {
	const expenseLines = ref([])
	const taxeDataTemporal = ref([])
	const drivingDataTemporal = ref([])
	const expenseLineTemporal = ref({})
	const expenseView = ref({
		tranId: 0,
		subsidiary_name: 0,
		memo: 0,
		trandate: 0,
		urlDocumentoAdicional: 0,
		nameDocumentoAdicional: 0,
		xmlvalidacion: 0,
		amount: 0,
		lines: []
	})
	const oneCategorie = ref()

	const createExpense = async (expenseData) => {
		try {
			const { data } = await ExpenseApi.createExpense(expenseData)
			return data.data[0]
		} catch (error) {
			console.log('error', error)
		}
	}

	const getExpense = async (id) => {
		try {
			const { data } = await ExpenseApi.getExpenseByInternalId(id)
			expenseView.value = data.Report[0]
		} catch (error) {
			console.log('error', error)
		}
	}

	const getOneCategorieById = async (id) => {
		try {
			const { data } = await ExpenseApi.getCategorieById(id)
			return data.Categorias[0]
		} catch (error) {
			console.log('error', error)
		}
	}

	return {
		expenseLines,
		taxeDataTemporal,
		expenseLineTemporal,
		drivingDataTemporal,
		oneCategorie,
		expenseView,
		createExpense,
		getExpense,
		getOneCategorieById
	}
})
