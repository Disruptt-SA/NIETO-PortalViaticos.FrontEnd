<script setup>
import { ref, inject, onMounted } from 'vue';
import { useLoginStore } from '../stores/login'
import { useSyncStore } from '../stores/sync'
import { useRouter } from 'vue-router'
import LoginApi from '../api/LoginApi';

//INICIARLIZAR
const router = useRouter()
const loginStore = useLoginStore()
const syncStore = useSyncStore()
const toast = inject('toast')
//VARIABLES
const form_data = ref({})
const syncData = ref(false)
const syncMsg = ref("")

onMounted(async () => {
	try {
		const response = await LoginApi.getEmployeeById()

		if (response.data.Employee != null) {
			router.push({ name: 'home' });
		}
	} catch (error) { }

	syncData.value = true
	syncMsg.value = "Sincronizando Empleados"
	await syncStore.syncEmployees()
	syncMsg.value = "Sincronizando Reportes"
	await syncStore.syncReports()
	syncMsg.value = "Sincronizando Subsidiarias"
	await syncStore.syncSubsidiaries()
	syncMsg.value = "Sincronizando Monedas"
	await syncStore.syncCurrencys()
	syncMsg.value = "Sincronizando Ubicaciones"
	await syncStore.syncLocations()
	syncMsg.value = "Sincronizando Departamentos"
	await syncStore.syncDepartments()
	syncMsg.value = "Sincronizando Categorias"
	await syncStore.syncCategories()
	syncMsg.value = "Sincronizando Nexus"
	await syncStore.syncNexus()
	syncMsg.value = "Sincronizando Tipo de Impuestos"
	await syncStore.syncTaxes()
	syncData.value = false
})

const handleLogin = async () => {
	const data = form_data.value
	await loginStore.login(data)

	const user = localStorage.getItem('USER_ID')
	if (user != null) {
		router.push({ name: 'home' });
	} else {
		toast.open({
			message: "Error al iniciar sesión",
			type: 'error'
		})
	}
}

const handleSyncUsers = async () => {
	syncData.value = true
	syncMsg.value = "Sincronizando Empleados"
	try {
		await syncStore.syncEmployees()
		toast.open({
			message: "Sincronización de empleados realizado correctamente",
			type: 'success'
		})
	} catch (error) {
		toast.open({
			message: error,
			type: 'error'
		})
	}
	syncData.value = false
}
</script>

<template>
	<!-- <div v-if="syncData" class="flex flex-col h-screen w-screen justify-center items-center">
		<span class="loader"></span>
		<p class="text-4xl mt-5">{{ syncMsg }}</p>
	</div> -->
	<div class="container-fluid mx-auto min-h-screen">
		<div class="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
			<div class="bg-sky-700 shadow-lg min-h-screen backgroundImage hidden md:block">
				<div
					class="flex flex-col min-h-screen justify-center items-center px-10 lg:px-36 md:px-36 backdrop-blur-sm">
					<img class="object-cover p-5 logo-shadow" src="../assets/logos/nieto_logo_3.png">
				</div>
			</div>
			<div class="bg-color-bunsi shadow-lg min-h-screen">
				<div v-if="syncData" class="flex flex-col min-h-screen justify-center items-center">
					<span class="loader"></span>
					<p class="text-4xl mt-5">{{ syncMsg }}</p>
					<p class="text-xl mt-2">Por favor espere...</p>
				</div>
				<div v-else class="flex flex-col min-h-screen justify-center items-center px-10 lg:px-36 md:px-36">
					<img class="object-fill w-64 block md:hidden" src="../assets/logos/nieto_logo.jpeg">
					<p class="text-[45px] lg:text-[75px] md:text-[80px] text-sky-900 tracking-widest font-light">
						BIENVENIDO
					</p>
					<p class="text:[15px] lg:text-xl md:text-xl text-sky-900 text-center font-extralight mb-10">
						Inicia sesión para ingresar al portal de viaticos.
					</p>
					<form class="w-full" @submit.prevent="handleLogin">
						<div class="relative mb-3 w-[100%]">
							<div>
								<label for="user" class="block mb-2 text-sm font-medium text-sky-900">Usuario</label>
								<input type="text" id="user" v-model="form_data.email"
									class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
									placeholder="john@nieto.com" required>
							</div>
							<!-- <input type="text"
								class="peer m-0 block h-[58px] w-full rounded border border-solid border-indigo-900 bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-900 transition duration-200 ease-linear placeholder:text-transparent focus:border-primary focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-900 focus:outline-none peer-focus:text-primary dark:border-sky-600 dark:text-neutral-200 dark:focus:border-primary dark:peer-focus:text-primary [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
								id="floatingInput" placeholder="name@example.com" v-model="form_data.email" />
							<label for="floatingInput"
								class="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-sky-600 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary">Correo
								electrónico</label> -->
						</div>
						<div class="relative mb-3 w-[100%]">
							<div>
								<label for="password" class="block mb-2 text-sm font-medium text-sky-900">Contraseña</label>
								<input type="password" id="password" v-model="form_data.password"
									class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
									required>
							</div>
							<!-- <input type="password"
								class="peer m-0 block h-[58px] w-full rounded border border-solid border-indigo-900 bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-900 transition duration-200 ease-linear placeholder:text-transparent focus:border-primary focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-900 focus:outline-none peer-focus:text-primary dark:border-sky-600 dark:text-neutral-200 dark:focus:border-primary dark:peer-focus:text-primary [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
								id="floatingInput" placeholder="name@example.com" v-model="form_data.password" />
							<label for="floatingInput"
								class="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-sky-600 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary">Contraseña</label> -->
						</div>
						<div class="flex flex-col md:flex-row justify-center items-center mt-10">
							<Button
								class="md:mr-5 w-full lg:w-48 md:w-48 h-14 rounded-md btn-shadow bg-sky-900 text-neutral-50 hover:bg-sky-800 hover:text-neutral-50 text-xl"
								color="sky" size="xl" type="submit">Ingresar</Button>
							<p class="text-gray-500 dark:text-gray-400 mt-5 md:mt-0"><button @click="handleSyncUsers"
									class="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline">
									Sincronizar usuarios con Netsuite
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
										class="bi bi-people-fill ml-2" viewBox="0 0 16 16">
										<path
											d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
									</svg>
								</button></p>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>