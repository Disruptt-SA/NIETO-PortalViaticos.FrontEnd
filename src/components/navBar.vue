<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useLoginStore } from '../stores/login';

const route = useRoute()
const router = useRouter()
const openMenu = ref(false)
const loginStore = useLoginStore()

const handleOpenMenu = () => {
	openMenu.value = !openMenu.value
}

const handleHome = () => {
	router.push({ name: "home" })
}

const handleSync = () => {
	router.push({ name: "sync" })
}

const closeSesion = () => {
	loginStore.user = null
	router.push({ name: "login" })
}
</script>

<template>
	<nav class="bg-slate-200 fixed w-full top-0 left-0 border-b border-gray-200">
		<div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
			<a href="https://flowbite.com/" class="flex items-center">
				<img src="../assets/logos/nieto_logo_4.png" class="h-8 mr-3" alt="Flowbite Logo">
				<span class="self-center text-2xl font-semibold whitespace-nowrap">Nieto
					<p class="text-sm">portal de viaticos</p>
				</span>
			</a>
			<div class="flex md:order-2">
				<div class="flex flex-col">
					<p class="text-center text-xs md:text-lg font-semibold">Bienvenido</p>
					<p class="text-center text-xs md:text-sm">{{ loginStore.user.entityid }}</p>
					<p class="text-gray-500 mt-1 text-center text-xs md:text-sm">
						<button
							class="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline"
							@click="closeSesion">
							Cerrar sesión
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
								class="bi bi-box-arrow-right ml-1" viewBox="0 0 16 16">
								<path fill-rule="evenodd"
									d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
								<path fill-rule="evenodd"
									d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
							</svg>
						</button>
					</p>
				</div>
				<button data-collapse-toggle="navbar-sticky" type="button"
					class="inline-flex items-center p-2 w-14 h-14 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 ml-3"
					aria-controls="navbar-sticky" aria-expanded="false" @click="handleOpenMenu">
					<span class="sr-only">Open main menu</span>
					<svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
						viewBox="0 0 17 14">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M1 1h15M1 7h15M1 13h15" />
					</svg>
				</button>
			</div>
			<div class="items-center justify-between w-full md:flex md:w-auto md:order-1" :class="{ 'hidden': !openMenu }"
				id="navbar-sticky">
				<ul
					class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-slate-200">
					<li>
						<button
							class="block py-2 pl-3 pr-4 text-black bg-white rounded md:bg-transparent md:hover:text-blue-700 md:p-0"
							aria-current="page" :class="route.name === 'home' ? 'text-blue-700' : ''"
							@click="handleHome">Historial</button>
					</li>
					<li>
						<button
							class="block py-2 pl-3 pr-4 text-black bg-white rounded md:bg-transparent md:hover:text-blue-700 md:p-0"
							:class="route.name === 'sync' ? 'text-blue-700' : ''" @click="handleSync">Sincronizar
							Datos</button>
					</li>
					<li v-if="route.name === 'newexpense'">
						<p class="block py-2 pl-3 pr-4 text-black bg-white rounded md:bg-transparent md:p-0"
							aria-current="page" :class="route.name === 'newexpense' ? 'text-blue-700' : ''">Nuevo Reporte
							Gastos</p>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</template>