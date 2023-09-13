import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import LoginApi from '../api/LoginApi'

export const useLoginStore = defineStore('login', () => {
	const user = ref(null)
	const subsidiarieUser = ref()

	const login = async (formData) => {
		try {
			let objApiForm = {
				email: formData.email,
				custentity_fc_password_integration: formData.password
			}
			const { data } = await LoginApi.login(objApiForm)
			user.value = data.Employee
			if (data.Employee != null) {
				localStorage.setItem('USER_ID', data.Employee._id)
			} else {
				localStorage.removeItem('USER_ID')
			}
		} catch (error) {
			console.log(error)
		}
	}

	const getEmployeeById = async () => {
		try {
			const _id = localStorage.getItem('USER_ID')
			const { data } = await LoginApi.getEmployeeById(_id)
		} catch (error) {
			console.log(error)
		}
	}

	const getSubsidiarieById = async (id) => {
		try {
			const { data } = await LoginApi.getSubsidiarieById(id)
			subsidiarieUser.value = data.Subsidiarias[0]
		} catch (error) {
			console.log('error', error)
		}
	}

	return {
		user,
		login,
		subsidiarieUser,
		getEmployeeById,
		getSubsidiarieById
	}
})
