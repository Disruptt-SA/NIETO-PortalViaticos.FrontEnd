/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/search', '/SuiteScripts/drt_custom_module/drt_custom_module_', 'N/record'],
	/**
 * @param{search} search
 */
	(search, drt_custom_module, record) => {
		/**
		 * Defines the function that is executed when a GET request is sent to a RESTlet.
		 * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
		 *     content types)
		 * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
		 *     Object when request Content-Type is 'application/json' or 'application/xml'
		 * @since 2015.2
		 */
		const get = (requestParams) => {
			log.debug('requestParams', requestParams);
			var proceso = "";
			let idBusqueda = requestParams.id_busqueda;
			let idEmpleado = requestParams.id_empleado;
			let codigo = requestParams.codigo;

			switch (requestParams.accion) {
				case "consulta_empleados":
					log.debug('inicia proceso empleados', 'cargando');
					proceso = drt_custom_module.getEmployees();
					break
				case "consulta_reporte_gastos":
					log.debug('inicia proceso de consulta', 'cargando');
					proceso = drt_custom_module.getExpenseReport();
					break
				case "consulta_detalle_reporte_gastos":
					log.debug('inicia proceso de consulta', 'cargando');
					proceso = drt_custom_module.getDetailReport(idBusqueda);
					break
				case "consulta_subsidiarias":
					log.debug('inicia proceso de consulta de subsidiarias', '.........cargando');
					proceso = drt_custom_module.getSubsidiaries();
					break
				case "consulta_ubicaciones":
					log.debug('inicia proceso de consulta de subsidiarias', '.........cargando');
					proceso = drt_custom_module.getLocations();
					break
				case "consulta_monedas":
					log.debug('inicia proceso de consulta de tipos de moneda', '.........cargando');
					proceso = drt_custom_module.getCurrensy();
					break
				case "consulta_departamentos":
					log.debug('inicia proceso de consulta de departamentos', '.........cargando');
					proceso = drt_custom_module.getDepartments();
					break
				case "consulta_categotias_gastos":
					log.debug('inicia proceso de consulta de categorias de gastos', '.........cargando');
					proceso = drt_custom_module.getExpenseCategory();
					break
				case "rechazar_gasto":
					log.debug('inicia proceso de rechazar gasto', '.........cargando');
					proceso = drt_custom_module.rejectExpenseReport();
					break
				case "consulta_nexus":
					log.debug('inicia proceso de consulta de nexus', '.........cargando');
					proceso = drt_custom_module.getNexusTax();
					break
				case "consulta_taxtypes":
					log.debug('inicia proceso de consulta de nexus', '.........cargando');
					proceso = drt_custom_module.getTaxtype();
					break
				case "consulta_codigos":
					log.debug('inicia proceso de consulta de codigos', '.........cargando');
					proceso = drt_custom_module.getNumerosViaje(idEmpleado);
					break
				case "consulta_facturas":
					log.debug('inicia proceso de consulta de facturas', '.........cargando');
					proceso = drt_custom_module.getInvoicebyNumberviaje(idEmpleado, codigo);
					break
				default:
					break;
			}

			return JSON.stringify(proceso)
			/**
			 * 
			 1. Consulta de empleado (get) hecho
			 2. Historial de reporte de gastos capturados por el empleado que los capturo (get) hecho
			 3. Detalle de un reporte de gastos capturado (get) hecho
			 4. Historial de informe de gastos por aprobacion (get) cuantos estados se van a manejar
			 5. Actualizacion de informe de gastos (put)
			 6. Creacion del informe de gastos (pos)
			 */
		}

		/**
		 * Defines the function that is executed when a PUT request is sent to a RESTlet.
		 * @param {string | Object} requestBody - The HTTP request body; request body are passed as a string when request
		 *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
		 *     the body must be a valid JSON)
		 * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
		 *     Object when request Content-Type is 'application/json' or 'application/xml'
		 * @since 2015.2
		 */
		const put = (requestBody) => {
			const responseData = {
				isSuccessful: true,
				data: []
			}

			try {
				log.debug('requestBody', requestBody);
				var validaReporteGastos = drt_custom_module.validateExpenseReport(requestBody.id);
				log.debug('validaReporteGastos', validaReporteGastos);

				if (validaReporteGastos == 0) {
					responseData.isSuccessful = false;
					responseData.data.push({
						code: 402,
						message: "no se encuentra el reporte de gastos",
						reference: requestBody.id
					})
				} else {
					if (requestBody.custbody_fc_cancelacion) {
						let objUpdate = {
							'custbody_fc_nota_aprobacion': requestBody.memo,
							'approvalstatus': 3,
							'custbody_fc_cancelacion': requestBody.custbody_fc_cancelacion == true ? true : false,
						}

						var id = record.submitFields({
							type: record.Type.EXPENSE_REPORT,
							id: requestBody.id,
							values: objUpdate,
							options: {
								enableSourcing: false,
								ignoreMandatoryFields: true
							}
						});
						responseData.data.push({
							code: 200,
							message: "Reporte de Gastos rechazado Correctamente",
							reference: requestBody.id
						})
					} else {
						log.debug("parobacion", "entro aprobacion")

						let objUpdate = {
							//'approvalstatus': 2,
							'custbody_fc_aprobacion_reporte': 2,
							'custbody_fc_nota_aprobacion': requestBody.memo,
							'custbody_fc_cancelacion': requestBody.custbody_fc_cancelacion == true ? true : false,
						}

						var id = record.submitFields({
							type: record.Type.EXPENSE_REPORT,
							id: requestBody.id,
							values: objUpdate,
							options: {
								enableSourcing: false,
								ignoreMandatoryFields: true
							}
						});

						log.debug('id aprobado', id);

						responseData.data.push({
							code: 200,
							message: "Actualizacion de Reporte de Gastos Correctamente",
							reference: requestBody.id
						})
					}
				}
			} catch (error_put) {
				log.error('error_put', error_put);
			} finally {
				return responseData
			}
		}

		/**
		 * Defines the function that is executed when a POST request is sent to a RESTlet.
		 * @param {string | Object} requestBody - The HTTP request body; request body is passed as a string when request
		 *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
		 *     the body must be a valid JSON)
		 * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
		 *     Object when request Content-Type is 'application/json' or 'application/xml'
		 * @since 2015.2
		 */
		const post = (requestBody) => {
			const responseData = {
				isSuccessful: true,
				data: []
			}


			try {
				var crearReporte = drt_custom_module.procesarRegistro(requestBody);
				log.audit('crearReporte', crearReporte);
				var xml_validation = 0
				if (!!crearReporte) {
					if (crearReporte.id_netsuite != 0) {
						var searchRol = drt_custom_module.searchRoleDriving(requestBody.entity);
						log.debug('searchRol', searchRol);
						if (searchRol == 1) {
							var driving = drt_custom_module.drivingScenery(crearReporte.id_netsuite, requestBody);
							log.debug('driving_2', driving);
						}
						var loadReporte = record.load({
							type: 'expensereport',
							id: crearReporte.id_netsuite,
							isDynamic: false,
						});
						xml_validation = JSON.parse(loadReporte.getValue('custbody_fc_validate_response_xml'));

					}
					responseData.isSuccessful = crearReporte.isSuccessful
					responseData.data.push({
						code: crearReporte.code,
						message: crearReporte.data,
						id_netsuite: crearReporte.id_netsuite,
						xml_validation: xml_validation.length > 0 ? xml_validation : []
					})
				}


			} catch (errorPost) {
				log.error('errorPost', errorPost);
			} finally {
				return responseData
			}
		}

		/**
		 * Defines the function that is executed when a DELETE request is sent to a RESTlet.
		 * @param {Object} requestParams - Parameters from HTTP request URL; parameters are passed as an Object (for all supported
		 *     content types)
		 * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
		 *     Object when request Content-Type is 'application/json' or 'application/xml'
		 * @since 2015.2
		 */
		const doDelete = (requestParams) => {

		}

		return { get, put, post, delete: doDelete }

	});