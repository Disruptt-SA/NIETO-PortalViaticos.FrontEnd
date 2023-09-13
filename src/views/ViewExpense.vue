<script setup>
import { useRouter, useRoute } from 'vue-router'
import { onMounted, ref } from 'vue';
import { useExpenseStore } from '../stores/expenses';
import { useLoginStore } from '../stores/login';
import getTodayDate from '../lib/dates'
//Components
import navBar from '../components/navBar.vue';

//Imports variables
const router = useRouter()
const route = useRoute()
const loginStore = useLoginStore()
const expenseStore = useExpenseStore()

//Variables
const taxes = ref(0)
const importe = ref(0)
const status = ref("")
const url = ref("")
const load = ref(false)


//Funciones
onMounted(async () => {
	load.value = true
	await expenseStore.getExpense(route.params.id)
	for (let lineExpense of expenseStore.expenseView.lines) {
		importe.value += lineExpense.amount
		taxes.value += lineExpense.taxamount
	}
	status.value = expenseStore.expenseView.status
	url.value = `https://8173338.app.netsuite.com/app/accounting/transactions/exprept.nl?id=${route.params.id}&whence=`
	load.value = false
})

const handleHome = () => {
	router.push({ name: "home" })
}
</script>

<template>
	<main>
		<navBar />
		<div v-if="load">
			<div class="flex flex-col min-h-screen justify-center items-center text-center z-50">
				<span class="loader"></span>
				<p class="text-4xl mt-5">Cargando Información</p>
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
			<h1 class="text-xl md:text-3xl font-bold l mt-5 text-sky-900 flex">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
					class="bi bi-card-list mr-2 w-10 h-10" viewBox="0 0 16 16">
					<path
						d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
					<path
						d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
				</svg>
				{{ expenseStore.expenseView.tranId }}
			</h1>
			<div class="w-full flex items-start justify-start content-center">
				<div id="alert-additional-content-3" class="p-4 mb-4 w-full border rounded-lg text-center md:text-left"
					:class="status == 'Pending Supervisor Approval' ? 'text-slate-800 border-neutral-400 bg-neutral-50' : ''"
					role="alert">
					<div class="flex flex-col md:flex-row items-center">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
							class="bi bi-check2-circle w-10 h-10 md:w-10 md:h-10 mr-3 mb-2 md:mt-0" viewBox="0 0 16 16">
							<path
								d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
							<path
								d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
						</svg>
						<span class="sr-only">Info</span>
						<h3 class="text-lg md:text-2xl font-medium ml-1">Estatus</h3>
					</div>
					<div class="mt-0 md:mt-0 mb-4 text-sm md:text-lg">
						{{ status }}
					</div>
					<div class="flex flex-col md:flex-row items-center justify-start content-center">
						<a :href="url" target="_blank"
							class="hover:cursor-pointer focus:ring-4 focus:outline-none font-medium rounded-lg text-lg md:text-md px-3 py-1.5 mr-2 text-center inline-flex items-center"
							:class="status == 'Pending Supervisor Approval' ? 'text-slate-50 border-neutral-400 bg-slate-600 hover:bg-slate-700' : ''">
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
											:value="expenseStore.expenseView.subsidiary_name" disabled>
									</div>
									<div class="mt-2">
										<label for="memo" class="block mb-2 text-sm font-medium text-sky-900">Nota</label>
										<textarea name="memo" id="memo" rows="5"
											class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-200 disabled:font-bold"
											:value="expenseStore.expenseView.memo" disabled></textarea>
									</div>
								</div>
							</div>
							<div class="col-span-3 md:col-span-1">
								<div class="flex flex-col px-0 md:px-10">
									<div>
										<label for="user" class="block mb-2 text-sm font-medium text-sky-900">Fecha</label>
										<input type="text"
											class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-200 disabled:font-bold"
											:value="expenseStore.expenseView.trandate" disabled>
									</div>
									<div class="mt-2">
										<label for="user" class="block mb-2 text-sm font-medium text-sky-900">Documento
											Adicional</label>
										<a :href="expenseStore.expenseView.urlDocumentoAdicional"
											class="form-control input-style-link h-10 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-1.5 bg-gray-200 font-bold"
											target="__blank">{{
												expenseStore.expenseView.nameDocumentoAdicional }}</a>
										<!-- <input type="file"
											class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 disabled:bg-gray-200 disabled:font-bold"
											accept="application/pdf" @change="onDocumentoAdicional" :disabled="blockForm"> -->
									</div>
									<div class="mt-2">
										<label for="user" class="block mb-2 text-sm font-medium text-sky-900">Validación
											XML</label>
										<textarea name="memo" id="memo" rows="5"
											class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-200 disabled:font-bold"
											disabled :value="expenseStore.expenseView.xmlvalidacion"></textarea>
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
											<p class="text-xl font-semibold">${{ importe.toFixed(2) }}
											</p>
										</div>
										<div class="bg-slate-100 p-2">
											<p class="text-md font-semibold">Impuestos</p>
											<p class="text-xl font-semibold">${{ taxes.toFixed(2) }}
											</p>
										</div>
										<hr class="w-full h-0.5 mx-auto bg-sky-900">
										<div class="bg-slate-100 p-2">
											<p class="text-xl font-black">Total</p>
											<p class="text-3xl font-black">${{ (expenseStore.expenseView.amount).toFixed(2)
											}}
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
						</div>
					</caption>
					<thead class="text-xs text-white uppercase bg-sky-900">
						<tr>
							<th scope="col" class="px-6 py-3">

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
							v-for="(expenseLine, index) in expenseStore.expenseView.lines" :key="index">
							<th scope="row" class="px-6 py-4 font-medium text-black whitespace-nowrap text-center">
								{{ index + 1 }}
							</th>
							<td class="px-6 py-4 font-bold text-center">
								{{ expenseLine.department }}
							</td>
							<td class="px-6 py-4 text-center">
								{{ expenseLine.category }}
							</td>
							<td class="px-6 py-4 font-bold text-center">
								{{ expenseLine.currency }}
							</td>
							<td class="px-6 py-4 text-center">
								{{ expenseLine.exchangerate }}
							</td>
							<td class="px-6 py-4 font-bold text-center">
								${{ expenseLine.amount.toFixed(2) }}
							</td>
							<td class="px-6 py-4 font-bold text-center">
								${{ expenseLine.taxamount.toFixed(2) }}
							</td>
							<td class="px-6 py-4 font-bold text-center">
								${{ (expenseLine.grossamt).toFixed(2) }}
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
	</main>
</template>