<script setup>
import { inject, onMounted, ref } from 'vue';
import modalTaxes from './modalTaxes.vue';
import modalDriving from './modalDriving.vue';
import { useLoginStore } from '../../stores/login';
import { useSyncStore } from '../../stores/sync';
import { useExpenseStore } from '../../stores/expenses';
import getTodayDate from '../../lib/dates'

const toast = inject('toast')
const loginStore = useLoginStore()
const syncStore = useSyncStore()
const expenseStore = useExpenseStore()
const openModal = ref()
const openModalTaxes = ref(false)
const openModalDriving = ref(false)

const props = defineProps({
	handleModal: Boolean,
	view: Boolean,
	index: Number
})

//Variables
const formExpense = ref({})
const required_codigos_viaje = ref(true)
const required_factura_viaje = ref(false)
const amount_expense = ref(0)
const emit = defineEmits(['handleOpenModal'])
const required_xml = ref(false)
const user_driving = ref(0)
const categorie_selected = ref(0)

//Funciones
onMounted(() => {
	const userData = loginStore.user
	console.log("user", userData)

	if (props.index != null) {
		formExpense.value = expenseStore.expenseLines[props.index]
		if (formExpense.value.categoryName == 'Camionetas') {
			required_codigos_viaje.value = true;
			user_driving.value = userData.custentity_nie_nombre_rol
		}
		console.log(expenseStore.expenseLines[props.index])
	} else {
		formExpense.value = {}
		formExpense.value.expensedate = getTodayDate()
		formExpense.value.departamento = userData.department
		formExpense.value.deparmentName = userData.name_departament
		formExpense.value.currency = 1
		formExpense.value.currencyName = "MXN"
		formExpense.value.exchangerate = 1
		formExpense.value.category = 0
		formExpense.value.nexus = 0;
		formExpense.value.total = 0
		formExpense.value.amount = 0
		user_driving.value = userData.custentity_nie_nombre_rol;
	}
})

const handleOpenModalTaxes = () => {
	amount_expense.value = formExpense.value.amount
	openModalTaxes.value = !openModalTaxes.value
}

const handleOpenModalDriving = () => {
	openModalDriving.value = !openModalDriving.value
}

const handleDeleteTaxLine = (index) => {
	expenseStore.taxeDataTemporal.splice(index, 1)
}

const handleDeleteDrivingLine = (index) => {
	expenseStore.drivingDataTemporal.splice(index, 1)
}

const selectCategory = async (e) => {
	const category = e.target.value;
	/* switch (category) {
		case "37": //Alimentos en extranjero
			required_factura_viaje.value = true;
			break;
		case "102": //prueba camionetas
			required_factura_viaje.value = true;
			break;
		default:
			required_factura_viaje.value = false;
			break;
	} */

	const dataCategorie = await expenseStore.getOneCategorieById(category)
	required_factura_viaje.value = dataCategorie.custrecord_dtt_facturas_viaje
	categorie_selected.value = dataCategorie

	let category_name;
	let expense_name;
	let expenseAccountId;
	let expense_pdf = false;
	for (let cat in syncStore.categories) {
		console.log("entro al cat");
		if (syncStore.categories[cat].internalid == category) {
			category_name = syncStore.categories[cat].name;
			expense_name = syncStore.categories[cat].name_expenseAccount;
			expenseAccountId = syncStore.categories[cat].expenseAccount;
			expense_pdf = syncStore.categories[cat].custrecorddtt_requerido_xml;
			required_xml.value = syncStore.categories[cat].custrecorddtt_requerido_xml;
		}
	}
	formExpense.value.categoryName = category_name;
	formExpense.value.expenseAccountName = expense_name;
	formExpense.value.expenseaccount = expenseAccountId;
	formExpense.value.expense_pdf = expense_pdf;
}

const selectCurrency = (e) => {
	const currency = e.target.value;
	let exchange_rate;
	let currency_name;

	for (let curr in syncStore.currencys) {
		if (syncStore.currencys[curr].internalid == currency) {
			exchange_rate = syncStore.currencys[curr].exchangerate;
			currency_name = syncStore.currencys[curr].name;
			console.log("seleccionado currency", currency_name);
		}
	}
	formExpense.value.exchangerate = Number(exchange_rate);
	formExpense.value.currencyName = currency_name;
}

const onXML = (e) => {
	const files = e.target.files || e.dataTransfer.files;
	if (!files.length)
		return;

	let file = files[0];
	let reader = new FileReader();
	reader.readAsText(file);
	reader.onload = function () {
		(reader.result);
		// Encode the String
		const encodedXML = btoa(reader.result);
		formExpense.value.xml = encodedXML;
		formExpense.value.xml_name = file.name;
	};

	reader.onerror = function () {
		console.error(reader.error);
	};
}

const onPDF = (e) => {
	const file = e.target.files[0]
	const reader = new FileReader()

	reader.readAsDataURL(file)

	reader.onload = () => {
		const base64 = reader.result.split(',')[1]
		formExpense.value.pdf = base64;
		formExpense.value.pdf_name = file.name;
	}

	reader.onerror = function () {
		console.error(reader.error);
	};
}

const handleBlurImporte = () => {
	console.log(expenseStore.taxeDataTemporal)
	if (expenseStore.taxeDataTemporal.length > 0) {
		const importe = formExpense.value.amount;
		let impuestos_linea = 0
		let total = 0
		for (let tax of expenseStore.taxeDataTemporal) {
			impuestos_linea = (importe * tax.rateTax).toFixed(2)
			total = (Number(importe) + Number(impuestos_linea)).toFixed(2)

			tax.amount = Number(importe)
			tax.amounttax = Number(impuestos_linea)
			tax.total = Number(total)
		}
	}
}

const addExpenseline = async () => {
	if (formExpense.value.category === 0) {
		toast.open({
			message: "Agregue una categoría",
			type: 'warning'
		})
		return
	}
	if (formExpense.value.currency === 0) {
		toast.open({
			message: "Agregue una moneda",
			type: 'warning'
		})
		return
	}
	if (formExpense.value.amount <= 0) {
		toast.open({
			message: "El importe debe ser mayor a 0",
			type: 'warning'
		})
		return
	}
	if (required_xml.value) {
		if (!formExpense.value.xml_name) {
			toast.open({
				message: "El archivo XML es obligatorio para la categoría seleccionada",
				type: 'warning'
			})
			return
		}
	}

	formExpense.value.impuestos = expenseStore.taxeDataTemporal
	formExpense.value.driving = expenseStore.drivingDataTemporal

	let amount_sum = 0
	let tax_sum = 0

	if (expenseStore.taxeDataTemporal.length != 0) {
		for (const tax of expenseStore.taxeDataTemporal) {
			amount_sum += tax.total
			tax_sum += tax.amounttax
		}

		formExpense.value.impuesto = Number(tax_sum)
		formExpense.value.total = Number(amount_sum)
	} else {
		formExpense.value.impuesto = tax_sum
		formExpense.value.total = Number(formExpense.value.amount)

		await syncStore.syncTaxesCodes(categorie_selected.value.custrecord_fte_exp_category_m_tax_code)
		const tax = syncStore.tax

		const taxCodes = syncStore.taxesCodes
		const amount_line = Number(formExpense.value.amount)
		const amounttax_line = Number(Number(formExpense.value.amount) * Number(taxCodes[0].rate))
		const total_line = amount_line + amounttax_line

		formExpense.value.impuestos.push({
			tipoimpuesto: categorie_selected.value.custrecord_fte_exp_category_m_tax_code,
			taxTypeName: tax[0].name,
			codImpuesto: taxCodes[0].internalid,
			taxCodeName: taxCodes[0].name,
			rateTax: taxCodes[0].rate,
			amount: amount_line,
			amounttax: amounttax_line,
			total: total_line
		})

		amount_sum += total_line
		tax_sum += amounttax_line
		formExpense.value.impuesto = Number(tax_sum)
		formExpense.value.total = Number(amount_sum)

		console.log(formExpense.value)
	}

	expenseStore.expenseLines.push(formExpense.value)
	expenseStore.taxeDataTemporal = []
	expenseStore.drivingDataTemporal = []

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

	emit('handleOpenModal', total_amount)
}
</script>

<template>
	<!-- Small Modal -->
	<div id="small-modal" tabindex="-1"
		class="fixed left-0 top-0 z-40 p-4 h-full overflow-y-auto overflow-x-hidden outline-none grid w-screen place-items-center backdrop-blur-sm bg-black bg-opacity-80">
		<div class="relative w-full max-w-7xl max-h-full">
			<!-- Modal content -->
			<div class="relative bg-slate-100 rounded-lg shadow">
				<!-- Modal header -->
				<div class="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-600">
					<h3 class="text-xl font-medium text-sky-900 flex justify-center items-center" v-if="!props.view">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
							class="bi bi-cash-coin w-8 h-8 mr-2" viewBox="0 0 16 16">
							<path fill-rule="evenodd"
								d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0z" />
							<path
								d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1h-.003zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195l.054.012z" />
							<path
								d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083c.058-.344.145-.678.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1H1z" />
							<path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 5.982 5.982 0 0 1 3.13-1.567z" />
						</svg>
						Agregue una nueva linea de gasto
					</h3>
					<h3 class="text-xl font-medium text-sky-900 flex justify-center items-center" v-else>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
							class="bi bi-eye w-8 h-8 mr-2" viewBox="0 0 16 16">
							<path
								d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
							<path
								d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
						</svg>
						Visualización de línea de gasto
					</h3>
					<button type="button"
						class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
						data-modal-hide="small-modal" @click="$emit('handleOpenModal')">
						<svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
							viewBox="0 0 14 14">
							<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
						</svg>
						<span class="sr-only">Close modal</span>
					</button>
				</div>
				<!-- Modal body -->
				<div class="p-6 space-y-6">
					<div class="flex flex-wrap">
						<div class="w-full md:w-full px-3 md:mt-0">
							<label for="user" class="block text-sm font-medium text-sky-900">Fecha del gasto</label>
							<input type="date"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
								v-model="formExpense.expensedate" :disabled="props.view">
						</div>
						<div class="w-full md:w-1/2 px-3 md:mt-2">
							<label for="user" class="block text-sm font-medium text-sky-900">Departamento</label>
							<select name="tipoimpuesto" id="tipoimpuesto"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-200 disabled:font-bold"
								v-model="formExpense.departamento" disabled>
								<option selected value="0">Seleccione...</option>
								<option :value="deparment.internalid" v-for="deparment in syncStore.departments"
									:key="deparment.internalid">{{ deparment.name }}</option>
							</select>
						</div>
						<div class="w-full md:w-1/2 px-3 mt-2 md:mt-2">
							<label for="user" class="block text-sm font-medium text-sky-900">Categoria</label>
							<select name="tipoimpuesto" id="tipoimpuesto"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
								@change="selectCategory" v-model="formExpense.category" :disabled="props.view">
								<option selected value="0">Seleccione...</option>
								<option :value="categorie.internalid" v-for="categorie in syncStore.categories"
									:key="categorie.internalid">{{ categorie.name }}</option>
							</select>
						</div>
						<div class="w-full md:w-1/2 px-3 md:mt-2" v-show="false">
							<label for="user" class="block text-sm font-medium text-sky-900">Cuenta</label>
							<input type="text"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-200 disabled:font-semibold"
								v-model="formExpense.expenseAccountName" disabled>
						</div>
						<div class="w-full md:w-1/2 px-3 md:mt-2">
							<label for="user" class="block text-sm font-medium text-sky-900">Moneda</label>
							<select name="tipoimpuesto" id="tipoimpuesto"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-200 disabled:font-bold"
								@change="selectCurrency" v-model="formExpense.currency" :disabled="true">
								<option selected value="0">Seleccione...</option>
								<option :value="currency.internalid" v-for="currency in syncStore.currencys"
									:key="currency.internalid">{{ currency.name }}</option>
							</select>
						</div>
						<div class="w-full md:w-1/2 px-3 md:mt-2" v-show="false">
							<label for="user" class="block text-sm font-medium text-sky-900">Tipo de cambio</label>
							<input type="text"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-200 disabled:font-semibold"
								v-model="formExpense.exchangerate" disabled>
						</div>
						<div class="w-full md:w-1/2 px-3 mt-2 md:mt-2">
							<label for="user" class="block text-sm font-medium text-sky-900">Importe</label>
							<input type="number"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
								v-model="formExpense.amount" :disabled="props.view" @blur="handleBlurImporte">
						</div>
						<div class="w-full md:w-full px-3 mt-2 md:mt-2">
							<label for="user" class="block text-sm font-medium text-sky-900">Nota</label>
							<input type="text"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
								v-model="formExpense.memo" :disabled="props.view">
						</div>
						<div class="w-full md:w-1/2 px-3 md:mt-2" v-if="required_xml">
							<label for="user" class="block text-sm font-medium text-sky-900">XML
								<span
									class="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300"
									v-if="required_xml">Obligatorio</span>
							</label>
							<input type="file"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
								accept="text/xml" @change="onXML" :disabled="props.view">
						</div>
						<div class="w-full md:w-1/2 px-3 mt-2 md:mt-2" v-if="required_xml">
							<label for="user" class="block text-sm font-medium text-sky-900">PDF</label>
							<input type="file"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
								@change="onPDF" id="pdfLine" accept="application/pdf" :disabled="props.view">
						</div>
					</div>

					<!-- TABLA DE DRIVING -->
					<div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-6 mb-10"
						v-if="required_codigos_viaje && user_driving == 1">
						<table class="w-full text-sm text-left table-fixed">
							<caption
								class="p-5 text-lg font-semibold text-left text-white bg-sky-900 border-b-2 border-sky-950">
								<div class="flex flex-col">
									<p>Drivin</p>
								</div>
								<div class="flex flex-col md:flex-row justify-start items-start mt-5" v-if="!props.view">
									<Button
										class="flex justify-center items-center w-64 md:w-64 h-10 rounded-md btn-shadow bg-white text-black hover:bg-slate-100 hover:text-black text-lg"
										color="sky" size="xl" type="submit" @click="handleOpenModalDriving">
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
											class="bi bi-car-front" viewBox="0 0 16 16">
											<path
												d="M4 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm10 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2H6ZM4.862 4.276 3.906 6.19a.51.51 0 0 0 .497.731c.91-.073 2.35-.17 3.597-.17 1.247 0 2.688.097 3.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 10.691 4H5.309a.5.5 0 0 0-.447.276Z" />
											<path
												d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679c.033.161.049.325.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.807.807 0 0 0 .381-.404l.792-1.848ZM4.82 3a1.5 1.5 0 0 0-1.379.91l-.792 1.847a1.8 1.8 0 0 1-.853.904.807.807 0 0 0-.43.564L1.03 8.904a1.5 1.5 0 0 0-.03.294v.413c0 .796.62 1.448 1.408 1.484 1.555.07 3.786.155 5.592.155 1.806 0 4.037-.084 5.592-.155A1.479 1.479 0 0 0 15 9.611v-.413c0-.099-.01-.197-.03-.294l-.335-1.68a.807.807 0 0 0-.43-.563 1.807 1.807 0 0 1-.853-.904l-.792-1.848A1.5 1.5 0 0 0 11.18 3H4.82Z" />
										</svg>
										<p class="ml-2">Agregar drivin</p>
									</Button>
								</div>
							</caption>
							<thead class="text-xs text-white uppercase bg-sky-900">
								<tr>
									<th scope="col" class="px-6 py-3">
										#
									</th>
									<th scope="col" class="px-6 py-3">
										Acciones
									</th>
									<th scope="col" class="px-6 py-3">
										Código de Viaje
									</th>
									<th scope="col" class="px-6 py-3">
										Códigos de Facturas
									</th>
								</tr>
							</thead>
							<tbody v-if="!props.view">
								<tr class="bg-slate-200 border-b border-sky-900 text-black"
									v-for="(driving, index) in expenseStore.drivingDataTemporal" :key="index">
									<th scope="row" class="px-6 py-4 font-medium text-black whitespace-nowrap">
										{{ index + 1 }}
									</th>
									<td class="px-6 py-4">
										<Button
											class="flex justify-center items-center w-[100px] h-10 rounded-md btn-shadow bg-red-800 text-white hover:bg-red-800 hover:text-white text-xs"
											color="sky" size="xl" type="submit" @click="handleDeleteDrivingLine(index)">
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
												fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
												<path
													d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
												<path
													d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
											</svg>

											<p class="ml-2">Eliminar</p>
										</Button>
									</td>
									<td class="px-6 py-4">
										{{ driving.n_viaje }}
									</td>
									<td class="px-6 py-4 font-bold">
										{{ driving.n_facturas }}
									</td>
								</tr>
							</tbody>
							<tbody v-else>
								<tr class="bg-slate-200 border-b border-sky-900 text-black"
									v-for="(driving, index) in formExpense.driving" :key="index">
									<th scope="row" class="px-6 py-4 font-medium text-black whitespace-nowrap">
										{{ index + 1 }}
									</th>
									<td class="px-6 py-4">

									</td>
									<td class="px-6 py-4">
										{{ driving.n_viaje }}
									</td>
									<td class="px-6 py-4 font-bold">
										{{ driving.n_facturas }}
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					<!-- TABLA DE IMPUESTOS -->
					<div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-6 mb-10" v-if="required_xml">
						<table class="w-full text-sm text-left table-fixed">
							<caption
								class="p-5 text-lg font-semibold text-left text-white bg-sky-900 border-b-2 border-sky-950">
								<div class="flex flex-col">
									<p>Impuestos</p>
								</div>
								<div class="flex flex-col md:flex-row justify-start items-start mt-5" v-if="!props.view">
									<Button
										class="flex justify-center items-center w-64 md:w-64 h-10 rounded-md btn-shadow bg-white text-black hover:bg-slate-100 hover:text-black text-lg"
										color="sky" size="xl" type="submit" @click="handleOpenModalTaxes"
										v-if="formExpense.amount > 0">
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
											class="bi bi-bank2" viewBox="0 0 16 16">
											<path
												d="M8.277.084a.5.5 0 0 0-.554 0l-7.5 5A.5.5 0 0 0 .5 6h1.875v7H1.5a.5.5 0 0 0 0 1h13a.5.5 0 1 0 0-1h-.875V6H15.5a.5.5 0 0 0 .277-.916l-7.5-5zM12.375 6v7h-1.25V6h1.25zm-2.5 0v7h-1.25V6h1.25zm-2.5 0v7h-1.25V6h1.25zm-2.5 0v7h-1.25V6h1.25zM8 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM.5 15a.5.5 0 0 0 0 1h15a.5.5 0 1 0 0-1H.5z" />
										</svg>
										<p class="ml-2">Agregar Impuesto</p>
									</Button>
									<span class="bg-gray-900 text-gray-100 text-md font-medium mr-2 px-2.5 py-0.5 rounded"
										v-else>Para
										agregar líneas de impuesto, el importe debe ser mayor a 0</span>
								</div>
							</caption>
							<thead class="text-xs text-white uppercase bg-sky-900">
								<tr>
									<th scope="col" class="px-6 py-3">
										#
									</th>
									<th scope="col" class="px-6 py-3">
										Acciones
									</th>
									<th scope="col" class="px-6 py-3">
										Tipo de impuesto
									</th>
									<th scope="col" class="px-6 py-3">
										Código de impuesto
									</th>
									<th scope="col" class="px-6 py-3">
										Tasa
									</th>
									<th scope="col" class="px-6 py-3">
										Importe
									</th>
									<th scope="col" class="px-6 py-3">
										Impuesto
									</th>
									<th scope="col" class="px-6 py-3">
										Total
									</th>
								</tr>
							</thead>
							<tbody v-if="!props.view">
								<tr class="bg-slate-200 border-b border-sky-900 text-black"
									v-for="(tax, index) in expenseStore.taxeDataTemporal" :key="index">
									<th scope="row" class="px-6 py-4 font-medium text-black whitespace-nowrap">
										{{ index + 1 }}
									</th>
									<td class="px-6 py-4">
										<Button
											class="flex justify-center items-center w-[100px] h-10 rounded-md btn-shadow bg-red-800 text-white hover:bg-red-800 hover:text-white text-xs"
											color="sky" size="xl" type="submit" @click="handleDeleteTaxLine(index)">
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
												fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
												<path
													d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
												<path
													d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
											</svg>

											<p class="ml-2">Eliminar</p>
										</Button>
									</td>
									<td class="px-6 py-4">
										{{ tax.taxTypeName }}
									</td>
									<td class="px-6 py-4 font-bold">
										{{ tax.taxCodeName }}
									</td>
									<td class="px-6 py-4">
										{{ tax.rateTax }}
									</td>
									<td class="px-6 py-4 font-bold">
										${{ tax.amount }}
									</td>
									<td class="px-6 py-4">
										${{ tax.amounttax }}
									</td>
									<td class="px-6 py-4 font-extrabold">
										${{ tax.total }}
									</td>
								</tr>
							</tbody>
							<tbody v-else>
								<tr class="bg-slate-200 border-b border-sky-900 text-black"
									v-for="(tax, index) in formExpense.impuestos" :key="index">
									<th scope="row" class="px-6 py-4 font-medium text-black whitespace-nowrap">
										{{ index + 1 }}
									</th>
									<td class="px-6 py-4">

									</td>
									<td class="px-6 py-4">
										{{ tax.taxTypeName }}
									</td>
									<td class="px-6 py-4 font-bold">
										{{ tax.taxCodeName }}
									</td>
									<td class="px-6 py-4">
										{{ tax.rateTax }}
									</td>
									<td class="px-6 py-4 font-bold">
										${{ tax.amount }}
									</td>
									<td class="px-6 py-4">
										${{ tax.amounttax }}
									</td>
									<td class="px-6 py-4 font-extrabold">
										${{ tax.total }}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<!-- Modal footer -->
				<div
					class="flex flex-col md:flex-row items-center justify-center p-6 border-t border-gray-200 rounded-b dark:border-gray-600">
					<Button
						class="flex justify-center items-center w-64 md:w-64 h-10 mb-3 md:mb-0 rounded-md btn-shadow bg-sky-900 text-white hover:bg-sky-800 hover:text-white text-lg"
						color="sky" size="xl" type="submit" @click="addExpenseline" v-if="!props.view">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
							class="bi bi-check2-circle" viewBox="0 0 16 16">
							<path
								d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
							<path
								d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
						</svg>
						<p class="ml-2">Agregar Linea de Gasto</p>
					</Button>
					<Button
						class="flex justify-center items-center w-64 md:w-64 h-10 ml-0 md:ml-3 rounded-md btn-shadow bg-sky-900 text-white hover:bg-sky-800 hover:text-white text-lg"
						color="sky" size="xl" type="submit" @click="$emit('handleOpenModal')">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
							class="bi bi-x-circle" viewBox="0 0 16 16">
							<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
							<path
								d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
						</svg>
						<p class="ml-2">Cancelar</p>
					</Button>
				</div>
			</div>
		</div>
	</div>

	<modalTaxes :handleModalTaxes="openModalTaxes" :amountExpense="amount_expense"
		@handleOpenModalTaxes="handleOpenModalTaxes" v-if="openModalTaxes" />

	<modalDriving :handleModalDriving="openModalDriving" :required_factura_viaje="required_factura_viaje"
		@handleOpenModalDriving="handleOpenModalDriving" v-if="openModalDriving" />
</template>