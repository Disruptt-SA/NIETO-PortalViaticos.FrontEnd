<script setup>
import { useRouter } from 'vue-router'
import { inject, onMounted, ref } from 'vue';
import { useExpenseStore } from '../stores/expenses';
import { useLoginStore } from '../stores/login';
import { useSyncStore } from '../stores/sync';
import getTodayDate from '../lib/dates'
//Components
import navBar from '../components/navBar.vue';
import modalExpense from '../components/expenseReports/modalExpense.vue';

const router = useRouter()
const toast = inject('toast')
const loginStore = useLoginStore()
const syncStore = useSyncStore()
const expenseStore = useExpenseStore()

//Variables
const openModal = ref(false)
const openModalView = ref(false)
const formData = ref({})
const total_expense = ref({
	total_amount: 0,
	taxt_total: 0,
	importe_total: 0
})
const saveReport = ref(false)
const saveReportResponse = ref({})
const blockForm = ref(false)
const indexExpense = ref(null)

const modalDeleteExpenseLine = ref({
	index: null,
	openModal: false
})
const modalSaveExpense = ref(false)
const modalResetExpense = ref(false)

//Funciones
onMounted(async () => {
	const userData = loginStore.user
	await loginStore.getSubsidiarieById(userData.subsidiary)
	//await syncStore.syncCategories
	await syncStore.listCategories(userData.subsidiary)
	expenseStore.expenseLines = []
	formData.value = {}
	formData.value.entity = userData.internalid;
	formData.value.subsidiary = userData.subsidiary;
	formData.value.supervisorapproval = false;
	formData.value.advanceaccount = "118";
	formData.value.account = "111";
	formData.value.anticipo = false;
	formData.value.nota_cancelacion = "";
	formData.value.nexus = 1;
	formData.value.taxRegName = "JES900109Q90 (Mexico, Mexico)";
	formData.value.taxRegId = 2;
	formData.value.trandate = getTodayDate()
	formData.value.subsidiaryName = loginStore.subsidiarieUser.name
})

const handleOpenModalReset = () => {
	modalResetExpense.value = !modalResetExpense.value
}

const resetForm = async () => {
	const userData = loginStore.user
	await loginStore.getSubsidiarieById(userData.subsidiary)
	await syncStore.syncCategories
	expenseStore.expenseLines = []
	formData.value = {}
	formData.value.entity = userData.internalid;
	formData.value.subsidiary = userData.subsidiary;
	formData.value.supervisorapproval = false;
	formData.value.advanceaccount = "118";
	formData.value.account = "111";
	formData.value.anticipo = false;
	formData.value.nota_cancelacion = "";
	formData.value.nexus = 1;
	formData.value.taxRegName = "JES900109Q90 (Mexico, Mexico)";
	formData.value.taxRegId = 2;
	formData.value.trandate = getTodayDate()
	formData.value.subsidiaryName = loginStore.subsidiarieUser.name

	total_expense.value = {
		total_amount: 0,
		taxt_total: 0,
		importe_total: 0
	}

	handleOpenModalReset()
}

const handleHome = () => {
	router.push({ name: "home" })
}

const handleOpenModal = (total) => {
	if (total) {
		total_expense.value = total
	}
	indexExpense.value = null
	expenseStore.taxeDataTemporal = []
	expenseStore.drivingDataTemporal = []
	openModal.value = !openModal.value
}

const handleOpenModalView = (index) => {
	indexExpense.value = index
	openModalView.value = true
	openModal.value = !openModal.value
}

const handleOpenModalDeleteExpenseLine = (index) => {
	modalDeleteExpenseLine.value.index = index
	modalDeleteExpenseLine.value.openModal = true
}

const handleDeleteExpenseLine = () => {
	expenseStore.expenseLines.splice(modalDeleteExpenseLine.value.index, 1)
	modalDeleteExpenseLine.value.index = null

	let total_amount = {
		total_amount: 0,
		taxt_total: 0,
		importe_total: 0
	}
	let tax_expenses_total = 0
	let amount_expenses_total = 0
	for (const expenseLine of expenseStore.expenseLines) {
		tax_expenses_total = expenseLine.impuesto
		amount_expenses_total = expenseLine.amount
		total_amount.total_amount += (tax_expenses_total + amount_expenses_total)
		total_amount.taxt_total += tax_expenses_total
		total_amount.importe_total += amount_expenses_total
	}

	total_expense.value = total_amount

	modalDeleteExpenseLine.value.openModal = false
}

const onDocumentoAdicional = (e) => {
	const file = e.target.files[0]
	const reader = new FileReader()

	reader.readAsDataURL(file)

	reader.onload = () => {
		const base64 = reader.result.split(',')[1]
		formData.value.documento_adicional = base64;
	}

	reader.onerror = function () {
	};
}

const testExpense = () => {
	console.log("expense", formData.value)
	console.log("expenseLines", expenseStore.expenseLines)
}

const onHandleSave = async () => {
	if (expenseStore.expenseLines.length === 0) {
		toast.open({
			message: "El reporte de gastos no puede ser enviado, No tiene ingresado lineas de gastos",
			type: 'warning'
		})
		modalSaveExpense.value = false
		return false;
	}

	modalSaveExpense.value = false
	saveReport.value = true
	formData.value.expense_list = expenseStore.expenseLines

	const response = await expenseStore.createExpense(formData.value)

	if (response.code === 200) {
		if (response.id_netsuite != '') {
			saveReportResponse.value.code = 200
			saveReportResponse.value.message = "Reporte de gastos creado correctamente en Netsuite"
			saveReportResponse.value.message_des = "Si desea abrir el reporte en Netsuite, puede dar click en el botón “Ver reporte en NS” para verificar la información."
			saveReportResponse.value.id_netsuite = response.id_netsuite
			saveReportResponse.value.url = `https://8173338.app.netsuite.com/app/accounting/transactions/exprept.nl?id=${response.id_netsuite}&whence=`
			saveReportResponse.value.xml_validation = response.xml_validation
			blockForm.value = true
		} else {
			saveReportResponse.value.code = "Error"
			saveReportResponse.value.message = "Hubo un error al crear el reporte de gastos"
			saveReportResponse.value.resp_message = response.message
			saveReportResponse.value.message_des = "Por favor intente de nuevo a guardar el reporte de gastos, si el problema persiste, favor de notificarlo a su supervisor."
			blockForm.value = false
		}
	} else {
		saveReportResponse.value.code = "Error"
		saveReportResponse.value.message = "Hubo un error al crear el reporte de gastos"
		saveReportResponse.value.resp_message = response.message
		saveReportResponse.value.message_des = "Por favor intente de nuevo a guardar el reporte de gastos, si el problema persiste, favor de notificarlo a su supervisor."
		blockForm.value = false
	}

	console.log(response)
	console.log(formData.value)
	await syncStore.syncReports()
	saveReport.value = false
}
</script>

<template>
	<main>
		<navBar />
		<div v-if="saveReport">
			<div class="flex flex-col min-h-screen justify-center items-center text-center z-50">
				<span class="loader"></span>
				<p class="text-4xl mt-5">Guardando Reporte de Gastos</p>
				<p class="text-xl mt-2">Por favor espere...</p>
			</div>
		</div>
		<div class="px-5" v-else>
			<div class="w-full flex items-start justify-start">
				<button
					class="flex justify-center items-center text-sky-900 rounded md:bg-transparent hover:text-sky-700 md:p-0 mt-32 text-2xl md:text-3xl font-semibold"
					aria-current="page" @click="handleHome">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
						class="bi bi-arrow-left-square-fill w-6 h-6 md:w-8 md:h-8" viewBox="0 0 16 16">
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
				Crear nuevo reporte de gastos
			</h1>
			<div class="w-full flex items-start justify-start" v-if="!blockForm">
				<Button
					class="flex justify-center items-center w-full md:w-32 h-10 mb-5 rounded-md btn-shadow bg-sky-900 text-neutral-50 hover:bg-sky-800 hover:text-neutral-50 text-sm"
					color="sky" size="xl" type="submit" @click="() => modalSaveExpense = true">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
						class="bi bi-check2-circle" viewBox="0 0 16 16">
						<path
							d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
						<path
							d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
					</svg>
					<p class="ml-2">Guardar</p>
				</Button>
				<!-- <Button
					class="flex justify-center items-center w-full md:w-32 h-10 mb-5 rounded-md btn-shadow bg-sky-900 text-neutral-50 hover:bg-sky-800 hover:text-neutral-50 text-sm"
					color="sky" size="xl" type="submit" @click="testExpense">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
						class="bi bi-check2-circle" viewBox="0 0 16 16">
						<path
							d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
						<path
							d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
					</svg>
					<p class="ml-2">test</p>
				</Button> -->
				<Button
					class="flex justify-center items-center w-full md:w-32 h-10 mb-5 ml-2 rounded-md btn-shadow bg-sky-900 text-neutral-50 hover:bg-sky-800 hover:text-neutral-50 text-sm"
					color="sky" size="xl" @click="handleOpenModalReset">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eraser"
						viewBox="0 0 16 16">
						<path
							d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm2.121.707a1 1 0 0 0-1.414 0L4.16 7.547l5.293 5.293 4.633-4.633a1 1 0 0 0 0-1.414l-3.879-3.879zM8.746 13.547 3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z" />
					</svg>
					<p class="ml-2">Reiniciar</p>
				</Button>
			</div>
			<div class="w-full flex items-start justify-start content-center"
				v-if="saveReportResponse.code === 200 || saveReportResponse.code === 'Error'">
				<div id="alert-additional-content-3" class="p-4 mb-4 w-full border rounded-lg text-center md:text-left"
					role="alert"
					:class="saveReportResponse.code === 200 ? 'text-green-800 border-green-300 bg-green-50' : 'text-red-800 border-red-300 bg-red-50'">
					<div class="flex flex-col md:flex-row items-center">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
							class="bi bi-check2-circle w-24 h-24 md:w-10 md:h-10 mr-3 mb-2 md:mt-0" viewBox="0 0 16 16"
							v-if="saveReportResponse.code === 200">
							<path
								d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
							<path
								d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
						</svg>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
							class="bi bi-x-circle w-24 h-24 md:w-10 md:h-10 mr-3 mb-2 md:mt-0" viewBox="0 0 16 16" v-else>
							<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
							<path
								d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
						</svg>
						<span class="sr-only">Info</span>
						<h3 class="text-2xl font-medium ml-1">{{ saveReportResponse.message }}</h3>
					</div>
					<div class="mt-4 md:mt-0 mb-4 text-lg" v-for="(error, index) in saveReportResponse.resp_message"
						:key="index">
						{{ error.message }}
					</div>
					<div class="mt-4 md:mt-0 mb-4 text-lg">
						{{ saveReportResponse.message_des }}
					</div>
					<div class="flex flex-col md:flex-row items-center justify-start content-center"
						v-if="saveReportResponse.code === 200">
						<a :href="saveReportResponse.url" target="_blank"
							class="text-white bg-green-800 hover:bg-green-900 hover:cursor-pointer focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-lg md:text-md px-3 py-1.5 mr-2 text-center inline-flex items-center">
							<svg class="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
								fill="currentColor" viewBox="0 0 20 14">
								<path
									d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
							</svg>
							Ver reporte en NS
						</a>
					</div>
				</div>
			</div>

			<!-- Header Form -->

			<div class="w-full border border-slate-300 rounded-lg shadow">
				<ul class="flex flex-wrap text-sm font-medium text-center text-gray-900 border-b border-slate-300 rounded-t-lg bg-slate-200"
					id="defaultTab" data-tabs-toggle="#defaultTabContent" role="tablist">
					<p class="inline-block p-4">Información primaria</p>
				</ul>
				<div id="defaultTabContent">
					<div class="p-4 bg-slate-200 md:p-8">
						<div class="grid grid-cols-3">
							<div class="col-span-3 md:col-span-1">
								<div class="flex flex-col px-0 md:px-10">
									<div>
										<label for="user"
											class="block mb-2 text-sm font-medium text-sky-900">Empleado</label>
										<input type="text"
											class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-200 disabled:font-bold"
											:value="loginStore.user.internalid + ' ' + loginStore.user.entityid" disabled>
									</div>
									<div class="mt-2">
										<label for="user"
											class="block mb-2 text-sm font-medium text-sky-900">Subsidiaria</label>
										<input type="text"
											class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-200 disabled:font-bold"
											v-model="formData.subsidiaryName" disabled>
									</div>
									<div class="mt-2">
										<label for="memo" class="block mb-2 text-sm font-medium text-sky-900">Nota</label>
										<textarea name="memo" id="memo" rows="5"
											class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-200 disabled:font-bold"
											v-model="formData.nota" :disabled="blockForm"></textarea>
									</div>
								</div>
							</div>
							<div class="col-span-3 md:col-span-1">
								<div class="flex flex-col px-0 md:px-10">
									<div>
										<label for="user" class="block mb-2 text-sm font-medium text-sky-900">Fecha</label>
										<input type="date"
											class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-200 disabled:font-bold"
											v-model="formData.trandate" :disabled="blockForm">
									</div>
									<div class="mt-2">
										<label for="user" class="block mb-2 text-sm font-medium text-sky-900">Documento
											Adicional</label>
										<input type="file"
											class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 disabled:bg-gray-200 disabled:font-bold"
											accept="application/pdf" @change="onDocumentoAdicional" :disabled="blockForm">
									</div>
									<div class="mt-2">
										<label for="user" class="block mb-2 text-sm font-medium text-sky-900">Validación
											XML</label>
										<textarea name="memo" id="memo" rows="5"
											class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-200 disabled:font-bold"
											disabled></textarea>
									</div>
								</div>
							</div>
							<div class="col-span-3 mb-5 row-start-1 md:col-span-1 md:mb-0 md:row-start-auto">
								<div class="w-full border border-slate-300 rounded-lg shadow">
									<ul class="flex flex-wrap text-2xl font-medium text-center text-white border-b border-slate-300 rounded-t-lg bg-sky-900"
										id="defaultTab" data-tabs-toggle="#defaultTabContent" role="tablist">
										<p class="inline-block p-4">Resumen</p>
									</ul>
									<div id="defaultTabContent">
										<div class="bg-slate-100 p-2">
											<p class="text-md font-semibold">Importe</p>
											<p class="text-xl font-semibold">${{ (total_expense.importe_total).toFixed(2) }}
											</p>
										</div>
										<div class="bg-slate-100 p-2">
											<p class="text-md font-semibold">Impuestos</p>
											<p class="text-xl font-semibold">${{ (total_expense.taxt_total).toFixed(2) }}
											</p>
										</div>
										<hr class="w-full h-0.5 mx-auto bg-sky-900">
										<div class="bg-slate-100 p-2">
											<p class="text-xl font-black">Total</p>
											<p class="text-3xl font-black">${{ (total_expense.total_amount).toFixed(2) }}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Tabla de gastos -->
			<div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-6 mb-10">
				<table class="w-full text-sm text-left">
					<caption class="p-5 text-lg font-semibold text-left text-white bg-sky-900 border-b-2 border-sky-950">
						<div class="flex flex-col">
							<p>Gastos</p>
						</div>
						<div class="flex flex-col md:flex-row justify-start items-start mt-5">
							<Button
								class="flex justify-center items-center w-64 md:w-64 h-10 rounded-md btn-shadow bg-white text-black hover:bg-slate-100 hover:text-black text-lg"
								color="sky" size="xl" type="submit"
								@click="(() => { openModal = !openModal; openModalView = false })" v-if="!blockForm">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
									class="bi bi-cash-coin" viewBox="0 0 16 16">
									<path fill-rule="evenodd"
										d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0z" />
									<path
										d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1h-.003zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195l.054.012z" />
									<path
										d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083c.058-.344.145-.678.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1H1z" />
									<path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 5.982 5.982 0 0 1 3.13-1.567z" />
								</svg>
								<p class="ml-2">Agregar Gasto</p>
							</Button>
							<!-- <Button
								class="flex justify-center items-center mt-3 md:mt-0 md:ml-3 w-64 md:w-64 h-10 rounded-md btn-shadow bg-white text-black hover:bg-slate-100 hover:text-black text-lg"
								color="sky" size="xl" type="submit">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
									class="bi bi-x-circle" viewBox="0 0 16 16">
									<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
									<path
										d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
								</svg>
								<p class="ml-2">Eliminar lineas de gasto</p>
							</Button> -->
						</div>
					</caption>
					<thead class="text-xs text-white uppercase bg-sky-900">
						<tr>
							<th scope="col" class="px-6 py-3">

							</th>
							<th scope="col" class="px-6 py-3 text-center">
								Acciones
							</th>
							<th scope="col" class="px-6 py-3 text-center">
								Fecha Gasto
							</th>
							<th scope="col" class="px-6 py-3 text-center">
								Departamento
							</th>
							<th scope="col" class="px-6 py-3 text-center">
								Categoria
							</th>
							<th scope="col" class="px-6 py-3 text-center">
								Moneda
							</th>
							<th scope="col" class="px-6 py-3 text-center">
								Tipo de cambio
							</th>
							<th scope="col" class="px-6 py-3 text-center">
								Importe
							</th>
							<th scope="col" class="px-6 py-3 text-center">
								Impuesto
							</th>
							<th scope="col" class="px-6 py-3 text-center">
								Total
							</th>
							<th scope="col" class="px-6 py-3 text-center">
								Nota
							</th>
							<th scope="col" class="px-6 py-3 text-center">
								PDF
							</th>
							<th scope="col" class="px-6 py-3 text-center">
								XML
							</th>
						</tr>
					</thead>
					<tbody>
						<tr class="bg-slate-200 border-b border-sky-900 text-black"
							v-for="(expenseLine, index) in expenseStore.expenseLines" :key="index">
							<th scope="row" class="px-6 py-4 font-medium text-black whitespace-nowrap text-center">
								{{ index + 1 }}
							</th>
							<td class="px-6 py-4 text-center flex">
								<Button
									class="flex justify-center items-center w-[100px] h-10 rounded-md btn-shadow bg-sky-900 text-white hover:bg-sky-800 hover:text-white text-xs mr-2"
									color="sky" size="xl" type="submit" @click="handleOpenModalView(index)">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
										class="bi bi-eye" viewBox="0 0 16 16">
										<path
											d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
										<path
											d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
									</svg>
									<p class="ml-2">VER</p>
								</Button>
								<Button
									class="flex justify-center items-center w-[100px] h-10 rounded-md btn-shadow bg-red-800 text-white hover:bg-red-800 hover:text-white text-xs"
									color="sky" size="xl" type="submit" @click="handleOpenModalDeleteExpenseLine(index)"
									v-if="!blockForm">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
										class="bi bi-trash" viewBox="0 0 16 16">
										<path
											d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
										<path
											d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
									</svg>

									<p class="ml-2">Eliminar</p>
								</Button>
							</td>
							<td class="px-6 py-4 font-bold text-center">
								{{ new Date(expenseLine.expensedate).toLocaleDateString() }}
							</td>
							<td class="px-6 py-4 font-bold text-center">
								{{ expenseLine.deparmentName }}
							</td>
							<td class="px-6 py-4 text-center">
								{{ expenseLine.categoryName }}
							</td>
							<td class="px-6 py-4 font-bold text-center">
								{{ expenseLine.currencyName }}
							</td>
							<td class="px-6 py-4 text-center">
								{{ expenseLine.exchangerate }}
							</td>
							<td class="px-6 py-4 font-bold text-center">
								${{ expenseLine.amount.toFixed(2) }}
							</td>
							<td class="px-6 py-4 font-bold text-center">
								${{ expenseLine.impuesto.toFixed(2) }}
							</td>
							<td class="px-6 py-4 font-bold text-center">
								${{ (expenseLine.amount + expenseLine.impuesto).toFixed(2) }}
							</td>
							<td class="px-6 py-4 text-center">
								{{ expenseLine.memo }}
							</td>
							<td class="px-6 py-4 text-center">
								{{ expenseLine.pdf_name }}
							</td>
							<td class="px-6 py-4 text-center">
								{{ expenseLine.xml_name }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<modalExpense :handleModal="openModal" :view="openModalView" :index="indexExpense"
			@handleOpenModalView="handleOpenModalView" @handleOpenModal="handleOpenModal" v-if="openModal" />

		<!-- MODAL ELIMINAR EXPENSE LINE -->
		<div id="popup-modal" tabindex="-1"
			class="fixed left-0 top-0 z-40 p-4 h-full overflow-y-auto overflow-x-hidden outline-none grid w-screen place-items-center backdrop-blur-sm bg-black bg-opacity-80"
			:class="!modalDeleteExpenseLine.openModal ? 'hidden' : ''">
			<div class="relative w-full max-w-lg max-h-full">
				<div class="relative rounded-lg shadow bg-gray-700">
					<div class="p-6 text-center">
						<svg class="mx-auto mb-4 w-12 h-12 text-gray-200" aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
							<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
						</svg>
						<h3 class="mb-5 text-xl font-normal text-gray-200">¿Está seguro de querer
							eliminar la línea #{{ modalDeleteExpenseLine.index + 1 }} de gasto?</h3>
						<button data-modal-hide="popup-modal" type="button"
							class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-800 font-medium rounded-lg text-lg inline-flex items-center px-5 py-2.5 text-center mr-0 md:mr-2 mb-3 md:mb-0"
							@click="handleDeleteExpenseLine">
							Si, estoy seguro
						</button>
						<button data-modal-hide="popup-modal" type="button"
							class="focus:ring-4 focus:outline-none rounded-lg border text-lg font-medium px-5 py-2.5 focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600"
							@click="() => modalDeleteExpenseLine.openModal = false">No,
							Cancelar</button>
					</div>
				</div>
			</div>
		</div>

		<!-- MODAL PARA GUARDAR EL REPORTE DE GASTOS -->
		<div id="popup-modal" tabindex="-1"
			class="fixed left-0 top-0 z-40 p-4 h-full overflow-y-auto overflow-x-hidden outline-none grid w-screen place-items-center backdrop-blur-sm bg-black bg-opacity-80"
			:class="modalSaveExpense ? '' : 'hidden'">
			<div class="relative w-full max-w-lg max-h-full">
				<div class="relative rounded-lg shadow bg-gray-700">
					<div class="p-6 text-center">
						<svg class="mx-auto mb-4 w-12 h-12 text-gray-200" aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
							<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
						</svg>
						<h3 class="mb-5 text-xl font-normal text-gray-200">¿Está seguro de guardar y enviar este reporte de
							gasto a Netsuite?</h3>
						<button data-modal-hide="popup-modal" type="button"
							class="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-800 font-medium rounded-lg text-lg inline-flex items-center px-5 py-2.5 text-center mr-0 md:mr-2 mb-3 md:mb-0"
							@click="onHandleSave">
							Si, estoy seguro
						</button>
						<button data-modal-hide="popup-modal" type="button"
							class="focus:ring-4 focus:outline-none rounded-lg border text-lg font-medium px-5 py-2.5 focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600"
							@click="() => modalSaveExpense = false">No,
							Cancelar</button>
					</div>
				</div>
			</div>
		</div>

		<!-- MODAL PARA REINICIAR EL FORMULARIO -->
		<div id="popup-modal" tabindex="-1"
			class="fixed left-0 top-0 z-40 p-4 h-full overflow-y-auto overflow-x-hidden outline-none grid w-screen place-items-center backdrop-blur-sm bg-black bg-opacity-80"
			:class="!modalResetExpense ? 'hidden' : ''">
			<div class="relative w-full max-w-lg max-h-full">
				<div class="relative rounded-lg shadow bg-gray-700">
					<div class="p-6 text-center">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
							class="bi bi-arrow-counterclockwise mb-4 w-12 h-12 text-gray-200 mx-auto" viewBox="0 0 16 16">
							<path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z" />
							<path
								d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z" />
						</svg>
						<h3 class="mb-3 text-xl font-normal text-gray-200">¿Está seguro de reiniciar el formulario?</h3>
						<p class="mb-5 text-lg font-normal text-yellow-400 flex items-center text-center justify-center">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
								class="bi bi-exclamation-triangle h-10 w-10 mr-2" viewBox="0 0 16 16">
								<path
									d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
								<path
									d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
							</svg>
							Esta acción eliminará toda la información
						</p>
						<button data-modal-hide="popup-modal" type="button"
							class="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-800 font-medium rounded-lg text-lg inline-flex items-center px-5 py-2.5 text-center mr-0 md:mr-2 mb-3 md:mb-0"
							@click="resetForm">
							Si, estoy seguro
						</button>
						<button data-modal-hide="popup-modal" type="button"
							class="focus:ring-4 focus:outline-none rounded-lg border text-lg font-medium px-5 py-2.5 focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600"
							@click="handleOpenModalReset">No,
							Cancelar</button>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>