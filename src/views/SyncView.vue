<script setup>
import { useRouter } from 'vue-router'
import { inject, ref } from 'vue'
import { useSyncStore } from '../stores/sync'

//Components
import navBar from '../components/navBar.vue';

//Imports variables
const syncStore = useSyncStore()
const toast = inject('toast')
const router = useRouter()

const reports_sync = ref(false)
const reports_empleados = ref(false)
const reports_subsidiarias = ref(false)
const reports_monedas = ref(false)
const reports_ubicaciones = ref(false)
const reports_departamentos = ref(false)
const reports_categorias = ref(false)
const reports_nexus = ref(false)
const reports_impuestos = ref(false)

//Funciones
const handleHome = () => {
	router.push({ name: "home" })
}

const handleSyncReportes = async () => {
	reports_sync.value = true
	try {
		await syncStore.syncReports()
		toast.open({
			message: "Sincronización de reporte de gastos exitoso",
			type: 'success'
		})
		reports_sync.value = false
	} catch (error) {
		toast.open({
			message: "Error al sincronizar Reporte de gastos",
			type: 'error'
		})
		reports_sync.value = false
	}
}

const handleSyncEmpleados = async () => {
	reports_empleados.value = true
	try {
		await syncStore.syncEmployees()
		toast.open({
			message: "Sincronización de empleados exitoso",
			type: 'success'
		})
		reports_empleados.value = false
	} catch (error) {
		toast.open({
			message: "Error al sincronizar empleados",
			type: 'error'
		})
		reports_empleados.value = false
	}
}

const handleSyncSubsidiarias = async () => {
	reports_subsidiarias.value = true
	try {
		await syncStore.syncSubsidiaries()
		toast.open({
			message: "Sincronización de subsidiarias exitoso",
			type: 'success'
		})
		reports_subsidiarias.value = false
	} catch (error) {
		toast.open({
			message: "Error al sincronizar subsidiarias",
			type: 'error'
		})
		reports_subsidiarias.value = false
	}
}

const handleSyncMonedas = async () => {
	reports_monedas.value = true
	try {
		await syncStore.syncCurrencys()
		toast.open({
			message: "Sincronización de monedas exitoso",
			type: 'success'
		})
		reports_monedas.value = false
	} catch (error) {
		toast.open({
			message: "Error al sincronizar monedas",
			type: 'error'
		})
		reports_monedas.value = false
	}
}

const handleSyncUbicaciones = async () => {
	reports_ubicaciones.value = true
	try {
		await syncStore.syncLocations()
		toast.open({
			message: "Sincronización de ubicaciones exitoso",
			type: 'success'
		})
		reports_ubicaciones.value = false
	} catch (error) {
		toast.open({
			message: "Error al sincronizar ubicaciones",
			type: 'error'
		})
		reports_ubicaciones.value = false
	}
}

const handleSyncDepartamentos = async () => {
	reports_departamentos.value = true
	try {
		await syncStore.syncDepartments()
		toast.open({
			message: "Sincronización de departamentos exitoso",
			type: 'success'
		})
		reports_departamentos.value = false
	} catch (error) {
		toast.open({
			message: "Error al sincronizar departamentos",
			type: 'error'
		})
		reports_departamentos.value = false
	}
}

const handleSyncCategorias = async () => {
	reports_categorias.value = true
	try {
		await syncStore.syncCategories()
		toast.open({
			message: "Sincronización de categorias exitoso",
			type: 'success'
		})
		reports_categorias.value = false
	} catch (error) {
		toast.open({
			message: "Error al categorias monedas",
			type: 'error'
		})
		reports_categorias.value = false
	}
}

const handleSyncNexus = async () => {
	reports_nexus.value = true
	try {
		await syncStore.syncNexus()
		toast.open({
			message: "Sincronización de nexus exitoso",
			type: 'success'
		})
		reports_nexus.value = false
	} catch (error) {
		toast.open({
			message: "Error al nexus monedas",
			type: 'error'
		})
		reports_nexus.value = false
	}
}

const handleSyncImpuestos = async () => {
	reports_impuestos.value = true
	try {
		await syncStore.syncTaxes()
		toast.open({
			message: "Sincronización de impuestos exitoso",
			type: 'success'
		})
		reports_impuestos.value = false
	} catch (error) {
		toast.open({
			message: "Error al sincronizar impuestos",
			type: 'error'
		})
		reports_impuestos.value = false
	}
}
</script>

<template>
	<main>
		<navBar />
		<div class="px-5">
			<div class="w-full flex items-start justify-start">
				<button
					class="flex justify-center items-center py-2 pl-3 pr-4 text-sky-900 rounded md:bg-transparent hover:text-sky-700 md:p-0 mt-32 text-lg font-semibold"
					aria-current="page" @click="handleHome">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
						class="bi bi-arrow-left-square-fill" viewBox="0 0 16 16">
						<path
							d="M16 14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12zm-4.5-6.5H5.707l2.147-2.146a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708-.708L5.707 8.5H11.5a.5.5 0 0 0 0-1z" />
					</svg>
					<p class="ml-2">Volver</p>
				</button>
			</div>
			<h1 class="text-xl md:text-3xl l mt-5 text-sky-900 flex">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
					class="bi bi-card-list mr-2 w-8 h-8" viewBox="0 0 16 16">
					<path
						d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
					<path
						d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
				</svg>
				Sincronizar Información de Nestuite al Portal
			</h1>

			<div class=" rounded-lg bg-slate-200 shadow-card">
				<div class="border-b-2 border-slate-300 px-6 py-3 flex md:order-2">
					<p class="text-2xl text-center text-gray-900">Sync</p>
				</div>
				<div class="p-6">
					<div class="space-x-0 md:space-x-4 space-y-4 md:space-y-4 grid grid-cols-4 w-full">
						<div class="block rounded-lg bg-sky-900 shadow-card col-span-4 md:col-span-1">
							<div class="border-b-2 border-sky-950 px-6 py-3 flex md:order-2">
								<p class="text-2xl text-center text-white">Reportes</p>
							</div>
							<div class="p-6 flex justify-center items-center">
								<div class="inline-flex">
									<button type="button"
										class="flex justify-center items-center w-full text-black bg-white hover:bg-slate-300 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 mr-2 mb-2 disabled:bg-slate-200 disabled:text-slate-500"
										@click="handleSyncReportes" :disabled="reports_sync">
										<svg aria-hidden="true" role="status"
											class="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600"
											viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"
											v-if="reports_sync">
											<path
												d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
												fill="currentColor" />
											<path
												d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
												fill="#1C64F2" />
										</svg>
										Sincronizar
									</button>
								</div>
							</div>
						</div>
						<div class="block rounded-lg bg-sky-900 shadow-card col-span-4 md:col-span-1">
							<div class="border-b-2 border-sky-950 px-6 py-3 flex md:order-2">
								<p class="text-2xl text-center text-white">Empleados</p>
							</div>
							<div class="p-6 flex justify-center items-center">
								<div class="inline-flex">
									<button type="button"
										class="flex justify-center items-center w-full text-black bg-white hover:bg-slate-300 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 mr-2 mb-2 disabled:bg-slate-200 disabled:text-slate-500"
										@click="handleSyncEmpleados" :disabled="reports_empleados">
										<svg aria-hidden="true" role="status"
											class="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600"
											viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"
											v-if="reports_empleados">
											<path
												d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
												fill="currentColor" />
											<path
												d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
												fill="#1C64F2" />
										</svg>
										Sincronizar
									</button>
								</div>
							</div>
						</div>
						<div class="block rounded-lg bg-sky-900 shadow-card col-span-4 md:col-span-1">
							<div class="border-b-2 border-sky-950 px-6 py-3 flex md:order-2">
								<p class="text-2xl text-center text-white">Subsidiarias</p>
							</div>
							<div class="p-6 flex justify-center items-center">
								<div class="inline-flex">
									<button type="button"
										class="flex justify-center items-center w-full text-black bg-white hover:bg-slate-300 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 mr-2 mb-2 disabled:bg-slate-200 disabled:text-slate-500"
										@click="handleSyncSubsidiarias" :disabled="reports_subsidiarias">
										<svg aria-hidden="true" role="status"
											class="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600"
											viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"
											v-if="reports_subsidiarias">
											<path
												d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
												fill="currentColor" />
											<path
												d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
												fill="#1C64F2" />
										</svg>
										Sincronizar
									</button>
								</div>
							</div>
						</div>
						<div class="block rounded-lg bg-sky-900 shadow-card col-span-4 md:col-span-1">
							<div class="border-b-2 border-sky-950 px-6 py-3 flex md:order-2">
								<p class="text-2xl text-center text-white">Monedas</p>
							</div>
							<div class="p-6 flex justify-center items-center">
								<div class="inline-flex">
									<button type="button"
										class="flex justify-center items-center w-full text-black bg-white hover:bg-slate-300 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 mr-2 mb-2 disabled:bg-slate-200 disabled:text-slate-500"
										@click="handleSyncMonedas" :disabled="reports_monedas">
										<svg aria-hidden="true" role="status"
											class="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600"
											viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"
											v-if="reports_monedas">
											<path
												d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
												fill="currentColor" />
											<path
												d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
												fill="#1C64F2" />
										</svg>
										Sincronizar
									</button>
								</div>
							</div>
						</div>
						<div class="block rounded-lg bg-sky-900 shadow-card col-span-4 md:col-span-1">
							<div class="border-b-2 border-sky-950 px-6 py-3 flex md:order-2">
								<p class="text-2xl text-center text-white">Ubicaciones</p>
							</div>
							<div class="p-6 flex justify-center items-center">
								<div class="inline-flex">
									<button type="button"
										class="flex justify-center items-center w-full text-black bg-white hover:bg-slate-300 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 mr-2 mb-2 disabled:bg-slate-200 disabled:text-slate-500"
										@click="handleSyncUbicaciones" :disabled="reports_ubicaciones">
										<svg aria-hidden="true" role="status"
											class="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600"
											viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"
											v-if="reports_ubicaciones">
											<path
												d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
												fill="currentColor" />
											<path
												d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
												fill="#1C64F2" />
										</svg>
										Sincronizar
									</button>
								</div>
							</div>
						</div>
						<div class="block rounded-lg bg-sky-900 shadow-card col-span-4 md:col-span-1">
							<div class="border-b-2 border-sky-950 px-6 py-3 flex md:order-2">
								<p class="text-2xl text-center text-white">Departamentos</p>
							</div>
							<div class="p-6 flex justify-center items-center">
								<div class="inline-flex">
									<button type="button"
										class="flex justify-center items-center w-full text-black bg-white hover:bg-slate-300 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 mr-2 mb-2 disabled:bg-slate-200 disabled:text-slate-500"
										@click="handleSyncDepartamentos" :disabled="reports_departamentos">
										<svg aria-hidden="true" role="status"
											class="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600"
											viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"
											v-if="reports_departamentos">
											<path
												d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
												fill="currentColor" />
											<path
												d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
												fill="#1C64F2" />
										</svg>
										Sincronizar
									</button>
								</div>
							</div>
						</div>
						<div class="block rounded-lg bg-sky-900 shadow-card col-span-4 md:col-span-1">
							<div class="border-b-2 border-sky-950 px-6 py-3 flex md:order-2">
								<p class="text-2xl text-center text-white">Categorias</p>
							</div>
							<div class="p-6 flex justify-center items-center">
								<div class="inline-flex">
									<button type="button"
										class="flex justify-center items-center w-full text-black bg-white hover:bg-slate-300 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 mr-2 mb-2 disabled:bg-slate-200 disabled:text-slate-500"
										@click="handleSyncCategorias" :disabled="reports_categorias">
										<svg aria-hidden="true" role="status"
											class="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600"
											viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"
											v-if="reports_categorias">
											<path
												d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
												fill="currentColor" />
											<path
												d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
												fill="#1C64F2" />
										</svg>
										Sincronizar
									</button>
								</div>
							</div>
						</div>
						<div class="block rounded-lg bg-sky-900 shadow-card col-span-4 md:col-span-1">
							<div class="border-b-2 border-sky-950 px-6 py-3 flex md:order-2">
								<p class="text-2xl text-center text-white">Nexus</p>
							</div>
							<div class="p-6 flex justify-center items-center">
								<div class="inline-flex">
									<button type="button"
										class="flex justify-center items-center w-full text-black bg-white hover:bg-slate-300 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 mr-2 mb-2 disabled:bg-slate-200 disabled:text-slate-500"
										@click="handleSyncNexus" :disabled="reports_nexus">
										<svg aria-hidden="true" role="status"
											class="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600"
											viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"
											v-if="reports_nexus">
											<path
												d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
												fill="currentColor" />
											<path
												d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
												fill="#1C64F2" />
										</svg>
										Sincronizar
									</button>
								</div>
							</div>
						</div>
						<div class="block rounded-lg bg-sky-900 shadow-card col-span-4 md:col-span-1">
							<div class="border-b-2 border-sky-950 px-6 py-3 flex md:order-2">
								<p class="text-2xl text-center text-white">Impuestos</p>
							</div>
							<div class="p-6 flex justify-center items-center">
								<div class="inline-flex">
									<button type="button"
										class="flex justify-center items-center w-full text-black bg-white hover:bg-slate-300 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 mr-2 mb-2 disabled:bg-slate-200 disabled:text-slate-500"
										@click="handleSyncImpuestos" :disabled="reports_impuestos">
										<svg aria-hidden="true" role="status"
											class="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600"
											viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"
											v-if="reports_impuestos">
											<path
												d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
												fill="currentColor" />
											<path
												d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
												fill="#1C64F2" />
										</svg>
										Sincronizar
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>