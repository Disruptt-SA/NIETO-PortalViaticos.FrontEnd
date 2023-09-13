<script setup>
import { inject, onMounted, ref } from 'vue';
import { useSyncStore } from '../../stores/sync';
import { useExpenseStore } from '../../stores/expenses';
import { useLoginStore } from '../../stores/login';

const toast = inject('toast')
const syncStore = useSyncStore()
const expenseStore = useExpenseStore()
const loginStore = useLoginStore()
const props = defineProps({
	handleModalDriving: Boolean,
	required_factura_viaje: Boolean
})

//variables
const formDriving = ref({})
const emit = defineEmits(['handleOpenModalDriving'])

//Funciones
onMounted(async () => {
	const userData = loginStore.user
	formDriving.value = {}
	await syncStore.syncViajeCodes(userData.internalid)
	console.log("init", formDriving.value)
})

const getCodigoFacturas = async (e) => {
	const viajeCode = e.target.value
	const userData = loginStore.user
	await syncStore.syncViajeCodesFacturas(userData.internalid, viajeCode)
}

const handleAddDriving = () => {
	formDriving.value.n_facturas = String(formDriving.value.n_facturas)
	let flag = false
	if (expenseStore.drivingDataTemporal.length > 0) {
		expenseStore.drivingDataTemporal.find((el, index) => {
			if (el.n_viaje === formDriving.value.n_viaje) {
				flag = true
			}
		})
	}
	if (flag) {
		toast.open({
			message: "El número de viaje ya fue agregado",
			type: 'warning'
		})
		return
	}
	expenseStore.drivingDataTemporal.push(formDriving.value)
	emit('handleOpenModalDriving')
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
						Agregue una nueva linea de driving
					</h3>
					<button type="button"
						class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
						data-modal-hide="small-modal" @click="$emit('handleOpenModalDriving')">
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
						<div class="w-full px-3 md:mt-2">
							<label for="tipoimpuesto" class="block text-sm font-medium text-sky-900">Codigos de
								viajes</label>
							<select name="tipoimpuesto" id="tipoimpuesto"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
								@change="getCodigoFacturas" v-model="formDriving.n_viaje">
								<option selected value="0">Seleccione...</option>
								<!-- <option value="123">codigo 1</option>
								<option value="234">codigo 2</option> -->
								<option :value="viaje.internalId" v-for="viaje in syncStore.viajes" :key="viaje.internalId">
									{{ viaje.code }}</option>
							</select>
						</div>
						<div class="w-full px-3 md:mt-2" v-if="props.required_factura_viaje">
							<label for="user" class="block text-sm font-medium text-sky-900">Códigos de facturas</label>
							<select name="tipoimpuesto" id="tipoimpuesto"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black-900 focus:border-black-900 block w-full p-2.5"
								v-model="formDriving.n_facturas" multiple>
								<!-- <option value="900">factura 1</option>
								<option value="786">factura 2</option> -->
								<option :value="facturas.internalId" v-for="facturas in syncStore.viajesFacturas"
									:key="facturas.internalId">{{ facturas.code }}</option>
							</select>
						</div>
					</div>
				</div>
				<!-- Modal footer -->
				<div
					class="flex flex-col md:flex-row items-center justify-center p-6 border-t border-gray-200 rounded-b dark:border-gray-600">
					<Button
						class="flex justify-center items-center w-64 md:w-64 h-10 mb-3 md:mb-0 rounded-md btn-shadow bg-sky-900 text-white hover:bg-sky-800 hover:text-white text-lg"
						color="sky" size="xl" type="submit" @click="handleAddDriving">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
							class="bi bi-check2-circle" viewBox="0 0 16 16">
							<path
								d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
							<path
								d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
						</svg>
						<p class="ml-2">Agregar Linea de Driving</p>
					</Button>
					<Button
						class="flex justify-center items-center w-64 md:w-64 h-10 ml-0 md:ml-3 rounded-md btn-shadow bg-sky-900 text-white hover:bg-sky-800 hover:text-white text-lg"
						color="sky" size="xl" type="submit" @click="$emit('handleOpenModalDriving')">
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