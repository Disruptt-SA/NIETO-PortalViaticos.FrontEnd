<script setup>
import { inject, onMounted, ref } from 'vue';
import { useSyncStore } from '../../stores/sync';
import { useExpenseStore } from '../../stores/expenses';

const toast = inject('toast')
const syncStore = useSyncStore()
const expenseStore = useExpenseStore()
const openModal = ref()
const props = defineProps({
	handleModalTaxes: Boolean,
	amountExpense: Number,
})

//variables
const formTaxes = ref({})
const emit = defineEmits(['handleOpenModalTaxes'])

//Funciones

onMounted(() => {
	formTaxes.value.tipoimpuesto = 0
	formTaxes.value.codImpuesto = 0
	console.log("taxes", expenseStore.taxeDataTemporal)
})

const selectTipoImpuesto = async (e) => {
	const taxType = e.target.value;
	await syncStore.syncTaxesCodes(taxType)
	const tax = syncStore.tax
	formTaxes.value.taxTypeName = tax[0].name
}

const selectCodigoImpuesto = async (e) => {
	const taxCodes = syncStore.taxesCodes
	formTaxes.value.taxCodeName = taxCodes[0].name;
	formTaxes.value.rateTax = taxCodes[0].rate;
	const taxesLine = props.amountExpense * Number(taxCodes[0].rate)
	formTaxes.value.amounttax = Number(taxesLine.toFixed(2))
	formTaxes.value.amount = props.amountExpense
	formTaxes.value.total = Number((Number(formTaxes.value.amounttax) + props.amountExpense).toFixed(2))
}

const handleAddTaxes = () => {
	if (formTaxes.value.tipoimpuesto === 0 || formTaxes.value.tipoimpuesto === null || formTaxes.value.tipoimpuesto === '') {
		toast.open({
			message: "Falta el tipo de impuesto",
			type: 'warning'
		})
		return
	}
	if (formTaxes.value.codImpuesto === 0 || formTaxes.value.codImpuesto === null || formTaxes.value.codImpuesto === '') {
		toast.open({
			message: "Falta el código de impuesto",
			type: 'warning'
		})
		return
	}

	if (expenseStore.taxeDataTemporal.length > 0) {
		for (const tax in expenseStore.taxeDataTemporal) {
			console.log(expenseStore.taxeDataTemporal[tax])
			if (expenseStore.taxeDataTemporal[tax].tipoimpuesto == formTaxes.value.tipoimpuesto) {
				toast.open({
					message: "Este tipo de impuesto ya fue agregado",
					type: 'warning'
				})
				return false
			}
		}
	}

	expenseStore.taxeDataTemporal.push(formTaxes.value)
	formTaxes.value = {}
	emit('handleOpenModalTaxes')
}
</script>

<template>
	<div id="small-modal" tabindex="-1"
		class="fixed left-0 top-0 z-50 p-4 h-full overflow-y-auto overflow-x-hidden outline-none grid w-screen place-items-center backdrop-blur-sm bg-black bg-opacity-70">
		<div class="relative w-full max-w-4xl max-h-full">
			<!-- Modal content -->
			<div class="relative bg-slate-100 rounded-lg shadow">
				<!-- Modal header -->
				<div class="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-600">
					<h3 class="text-xl font-medium text-sky-900">
						Agregue una nueva linea de gasto
					</h3>
					<button type="button"
						class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
						data-modal-hide="small-modal" @click="$emit('handleOpenModalTaxes')">
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
						<div class="w-full md:w-1/2 px-3 md:mt-2">
							<label for="tipoimpuesto" class="block text-sm font-medium text-sky-900">Tipo de
								impuesto</label>
							<select name="tipoimpuesto" id="tipoimpuesto"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
								@change="selectTipoImpuesto" v-model="formTaxes.tipoimpuesto">
								<option selected value="0">Seleccione...</option>
								<option :value="tax.internalid" v-for="tax in syncStore.taxes" :key="tax.internalid">{{
									tax.name
								}}</option>
							</select>
						</div>
						<div class="w-full md:w-1/2 px-3 md:mt-2">
							<label for="user" class="block text-sm font-medium text-sky-900">Código de impuesto</label>
							<select name="tipoimpuesto" id="tipoimpuesto"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
								@change="selectCodigoImpuesto" v-model="formTaxes.codImpuesto">
								<option selected value="0">Seleccione...</option>
								<option :value="code.internalid" v-for="code in syncStore.taxesCodes"
									:key="code.internalid">{{ code.name }}</option>
							</select>
						</div>
						<div class="w-full md:w-1/2 px-3 mt-2 md:mt-2">
							<label for="user" class="block text-sm font-medium text-sky-900">Rate</label>
							<input type="text"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-100"
								v-model="formTaxes.rateTax" disabled>
						</div>
						<div class="w-full md:w-1/2 px-3 md:mt-2">
							<label for="user" class="block text-sm font-medium text-sky-900">Importe Neto</label>
							<input type="text"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-100"
								:value="props.amountExpense" disabled>
						</div>
						<div class="w-full md:w-1/2 px-3 mt-2 md:mt-2">
							<label for="user" class="block text-sm font-medium text-sky-900">Importe de Impuesto</label>
							<input type="text"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-100"
								v-model="formTaxes.amounttax" disabled>
						</div>
						<div class="w-full md:w-1/2 px-3 mt-2 md:mt-2">
							<label for="user" class="block text-sm font-medium text-sky-900">Total</label>
							<input type="text"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-100"
								v-model="formTaxes.total" disabled>
						</div>
					</div>
				</div>
				<!-- Modal footer -->
				<div
					class="flex flex-col md:flex-row items-center justify-center p-6 border-t border-gray-200 rounded-b dark:border-gray-600">
					<Button
						class="flex justify-center items-center w-64 md:w-64 h-10 mb-3 md:mb-0 rounded-md btn-shadow bg-sky-900 text-white hover:bg-sky-800 hover:text-white text-lg"
						color="sky" size="xl" type="submit" @click="handleAddTaxes">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
							class="bi bi-check2-circle" viewBox="0 0 16 16">
							<path
								d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
							<path
								d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
						</svg>
						<p class="ml-2">Agregar Linea de Impuesto</p>
					</Button>
					<Button
						class="flex justify-center items-center w-64 md:w-64 h-10 ml-0 md:ml-3 rounded-md btn-shadow bg-sky-900 text-white hover:bg-sky-800 hover:text-white text-lg"
						color="sky" size="xl" type="submit" @click="$emit('handleOpenModalTaxes')">
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
</template>