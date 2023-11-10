<script setup>
import { inject, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSyncStore } from '../stores/sync'
import { useLoginStore } from '../stores/login';

//Components
import navBar from '../components/navBar.vue';

//Imports variables
const router = useRouter()
const syncStore = useSyncStore()
const loginStore = useLoginStore()

//variables
const openFilters = ref(false)
const userData = loginStore.user
const filters = ref({
  employeeFilter: 0,
  statusFilter: 0,
  orderFilter: 0,
  startDateFilter: 0,
  finishDateFilter: 0
})

onMounted(() => {
  const userData = loginStore.user
  filters.value.employeeFilter = userData.internalid
  filters.value.orderFilter = 0
})

const handleOpenFilters = () => {
  openFilters.value = !openFilters.value
}

const handleOpenNewExpense = () => {
  router.push({ name: 'newexpense' });
}

const handleOpenExpense = (id) => {
  router.push({ name: 'viewexpense', params: { id: id } });
}

const handleFilterExpenses = async () => {
  const ord = filters.value.orderFilter;
  let starDate = `${filters.value.startDateFilter}T05:00:00`;
  let finishDate = `${filters.value.finishDateFilter}T05:00:00`;
  const entity = filters.value.employeeFilter;
  const estatus = filters.value.statusFilter;

  if (filters.value.startDateFilter == "") {
    starDate = "0001-01-01T05:00:00";
  }
  if (filters.value.finishDateFilter == "") {
    finishDate = "9999-01-01T05:00:00";
  }

  await syncStore.filterExpenses(ord, entity, starDate, finishDate, estatus)
}
</script>

<template>
  <main>
    <navBar />
    <div class="px-5">
      <h1 class="text-xl md:text-3xl l mt-28 text-sky-900 flex">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
          class="bi bi-card-list mr-2 w-8 h-8" viewBox="0 0 16 16">
          <path
            d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
          <path
            d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
        </svg>
        Lista Reporte de gastos
      </h1>

      <div class="block rounded-lg bg-slate-200 shadow-card">
        <div class="border-b-2 border-slate-300 px-6 py-3 flex md:order-2">
          <p class="text-2xl text-center text-gray-900">Filtros</p>
          <div class="w-full flex items-end justify-end">
            <button data-collapse-toggle="navbar-sticky" type="button"
              class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 ml-3"
              aria-controls="navbar-sticky" aria-expanded="false" @click="handleOpenFilters">
              <span class="sr-only">Open main menu</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                class="bi bi-caret-down-fill w-8 h-8" viewBox="0 0 16 16" v-if="openFilters">
                <path
                  d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                class="bi bi-caret-up-fill w-8 h-8" viewBox="0 0 16 16" v-if="!openFilters">
                <path
                  d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
              </svg>
            </button>
          </div>
        </div>
        <div class="p-6 flex justify-center items-center" :class="{ 'hidden': openFilters }">
          <form action="" class="flex flex-col md:flex-row w-full" @submit.prevent="handleFilterExpenses">
            <!-- <div class="mr-2">
              <label for="user" class="block mb-2 text-sm font-medium text-sky-900">Empleado</label>
              <select
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                v-model="filters.employeeFilter">
                <option value="0" selected>Seleccione una opción</option>
              </select>
            </div> -->
            <div class="mr-2">
              <label for="user" class="block mb-2 text-sm font-medium text-sky-900">Estatus</label>
              <select
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                v-model="filters.statusFilter">
                <option selected value="0">Todos</option>
                <option value="1">Pendiente aprobar por supervisor</option>
                <option value="2">Pendiente aprobar por contaduria</option>
                <option value="3">Rechazado</option>
                <option value="4">Aprobado</option>
                <!-- <option value="5">Pago completado</option> -->
              </select>
            </div>
            <div class="mr-2">
              <label for="user" class="block mb-2 text-sm font-medium text-sky-900">Fecha Inicio</label>
              <input type="date" id="user"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                v-model="filters.startDateFilter">
            </div>
            <div class="mr-2">
              <label for="user" class="block mb-2 text-sm font-medium text-sky-900">Fecha Final</label>
              <input type="date" id="user"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                v-model="filters.finishDateFilter">
            </div>
            <div class="flex justify-center items-center mt-2 md:mt-0">
              <Button
                class="flex w-full mt-3 md:mt-5 h-[40px] md:h-[50px] justify-center items-center md:mr-5 md:w-36 rounded-md btn-shadow bg-sky-900 text-neutral-50 hover:bg-sky-800 hover:text-neutral-50 text-xl"
                color="sky" size="xl" type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search"
                  viewBox="0 0 16 16">
                  <path
                    d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
                <p class="ml-1">Filtrar</p>
              </Button>
            </div>
          </form>
        </div>
      </div>


      <div class="w-full flex items-end justify-end mt-5">
        <Button
          class="flex justify-center items-center w-full md:w-72 h-14 md:h-10 rounded-md btn-shadow bg-sky-900 text-neutral-50 hover:bg-sky-800 hover:text-neutral-50 text-lg"
          color="sky" size="xl" type="submit" @click="handleOpenNewExpense">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-cash-coin w-6 h-6" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0z" />
            <path
              d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1h-.003zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195l.054.012z" />
            <path
              d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083c.058-.344.145-.678.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1H1z" />
            <path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 5.982 5.982 0 0 1 3.13-1.567z" />
          </svg>
          <p class="ml-2">Crear Reporte de Gastos</p>
        </Button>
      </div>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-2">
        <table class="w-full text-sm text-left text-blue-100">
          <thead class="text-xs text-white uppercase bg-sky-900">
            <tr>
              <!-- <th scope="col" class="px-6 py-3">

              </th> -->
              <th scope="col" class="px-6 py-3">
                Acciones
              </th>
              <th scope="col" class="px-6 py-3">
                Id NS
              </th>
              <th scope="col" class="px-6 py-3">
                Empleado
              </th>
              <th scope="col" class="px-6 py-3">
                Identificador
              </th>
              <th scope="col" class="px-6 py-3">
                Fecha
              </th>
              <th scope="col" class="px-6 py-3">
                Estatus
              </th>
              <th scope="col" class="px-6 py-3">
                Notas
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-slate-200 border-b border-sky-900 text-black" v-for="(report) in syncStore.reports"
              :key="report.internalid" v-show="report.entity_id === userData.internalid">
              <!--  <th scope="row" class="px-6 py-4 font-medium text-black whitespace-nowrap">
                {{ index + 1 }}
              </th> -->
              <td class="px-6 py-4">
                <button
                  class="flex justify-center items-center font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  @click="handleOpenExpense(report.internalid)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye"
                    viewBox="0 0 16 16">
                    <path
                      d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                  </svg>
                  <p class="ml-1">VER</p>
                </button>
              </td>
              <td class="px-6 py-4 font-bold">
                {{ report.internalid }}
              </td>
              <td class="px-6 py-4">
                {{ report.entity }}
              </td>
              <td class="px-6 py-4 font-bold">
                {{ report.transactionnumber }}
              </td>
              <td class="px-6 py-4">
                {{ new Date(report.trandate).toLocaleDateString() }}
              </td>
              <td class="px-6 py-4">
                {{ report.statusref == 'pendingSupApproval' ? 'Pendiente aprobar por supervisor' : '' || report.statusref
                  == 'pendingAcctApproval' ? 'Pendiente aprobar por contaduria' : '' || report.statusref
                    == 'rejectedBySup' ? 'Rechazado' : '' || report.statusref
                      == 'approvedByAcct' ? 'Aprobado' : '' || report.statusref
                        == 'paidInFull' ? 'Pago completado' : '' }}
              </td>
              <td class="px-6 py-4">
                {{ report.memo }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </main>
</template>
