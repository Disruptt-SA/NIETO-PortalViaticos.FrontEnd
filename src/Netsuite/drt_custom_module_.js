/**
 * @NApiVersion 2.1
 */
define(['N/record', 'N/search', 'N/format', 'N/encode', 'N/file', 'N/xml'],
	/**
 * @param{record} record
 * @param{search} search
 */
	(record, search, format, encode, file, xml) => {
		const searchQuery = (searchType, searchFilters, searchColumns) => {
			const respuesta = {
				success: false,
				data: {},
				error: {}
			};
			try {
				log.debug("searchType", searchType);
				log.debug("searchFilters", searchFilters);
				log.debug("searchColumns", searchColumns);

				const searchObj = search.create({
					type: searchType,
					filters: searchFilters,
					columns: searchColumns
				});
				const searchCount = searchObj.runPaged().count;
				log.audit("searchCount", searchCount);
				const start = 0;
				do {
					var searchObjResult = searchObj.run().getRange({
						start: start,
						end: start + 1000
					});
					if (searchCount > 0) {
						log.debug("searchObjResult", searchObjResult);
						for (let i = 0; i < searchCount; i++) {
							respuesta.data[searchObjResult[i].id] = {
								id: searchObjResult[i].id,
							};
							log.debug("respuesta.data", respuesta.data[searchObjResult[i].id]);
							for (let column in searchColumns) {
								respuesta.data[searchObjResult[i].id][searchColumns[column].name] = searchObjResult[i].getValue(searchColumns[column]) || 0
								log.debug("respuesta.data1", respuesta.data[searchObjResult[i].id][searchColumns[column].name]);
							}
						}
					}

				} while (searchObjResult && searchObjResult.length > 1000)

				respuesta.success = Object.keys(respuesta.data).length > 0;
				log.debug("respuesta.success", respuesta.success);

			} catch (error) {
				log.error("error searchRecord", error);
				respuesta.error = error;
			} finally {
				log.debug("respuesta_fin_", respuesta);
				return respuesta;
			}
		}

		const getEmployees = () => {
			var arregloEmpleados = [];
			var objEmpleado = {}
			try {
				var empleados = searchQuery(
					'employee',
					[
						["custentity_fc_disponible_app", search.Operator.IS, "T"]
					],
					[
						{
							name: "internalid"
						},
						{
							name: "entityid"
						},
						{
							name: "email"
						},
						{
							name: "custentity_fc_password_integration"
						},
						{
							name: "subsidiary"
						},
						{
							name: "location"
						},
						{
							name: "supervisor"
						},
						{
							name: "department"
						},
						{
							name: "custentity_nie_rol_drivin"
						}
					]
				);

				log.debug('empleados', empleados.success);

				var nombreDepartamento = "not name departament";
				if (empleados.success == true) {
					for (var i in empleados.data) {

						objEmpleado = {
							internalid: empleados.data[i]['internalid'],
							entityid: empleados.data[i]['entityid'],
							email: empleados.data[i]['email'] ? empleados.data[i]['email'] : "not email",
							custentity_fc_password_integration: empleados.data[i]['custentity_fc_password_integration'] ? empleados.data[i]['custentity_fc_password_integration'] : "not password",
							subsidiary: empleados.data[i]['subsidiary'],
							location: empleados.data[i]['location'],
							supervisor: empleados.data[i]['supervisor'] ? empleados.data[i]['supervisor'] : "not supervisor",
							department: empleados.data[i]['department'] ? empleados.data[i]['department'] : "not id department",
							custentity_nie_nombre_rol: empleados.data[i]['custentity_nie_rol_drivin'] ? empleados.data[i]['custentity_nie_rol_drivin'] : 'not rol'
						}

						if (empleados.data[i]['department'] != 0) {
							var fieldLookUpDepartament = search.lookupFields({
								type: 'department',
								id: empleados.data[i]['department'],
								columns: ['name']
							});

							nombreDepartamento = fieldLookUpDepartament.name;
							objEmpleado.name_departament = nombreDepartamento
						} else {
							objEmpleado.name_departament = "not name departament"
						}

						arregloEmpleados.push(objEmpleado);
					}
				}
			} catch (error_get_employees) {
				log.error('error_get_employees', error_get_employees);
			} finally {
				return arregloEmpleados
			}

		}

		const getExpenseReport = () => {
			var arrayReportes = [];
			var objReportes = {};
			try {
				var reportes = searchQuery(
					'expensereport',
					[
						["type", search.Operator.ANYOF, "ExpRept"],
						"AND",
						["mainline", search.Operator.IS, "T"],
						"AND",
						["approvalstatus", search.Operator.ANYOF, "1", "2", "3"],
						"AND",
						["custbody_fc_aprobacion_reporte", search.Operator.ANYOF, "1"]
					],
					[
						{
							name: 'transactionnumber',
						},
						{
							name: 'trandate',
						},
						{
							name: 'memo',
						},
						{
							name: 'amount',
						},
						{
							name: 'statusref',
						},
						{
							name: 'internalid'
						},
						{
							name: "entityid",
							join: "employee"
						},
						{
							name: "entity"
						},
						{
							name: "custbody_drt_campoinforgasto_anticapli"
						},
						{
							name: "custbody_fc_cancelacion"
						}
					]
				);
				log.debug('resouesta', reportes.success)
				if (reportes.success == true) {
					for (var r in reportes.data) {
						var objRecord = record.load({
							type: "employee",
							id: reportes.data[r]['entity'],
							isDynamic: true,
						});
						const id_sup = objRecord.getValue("supervisor");
						objReportes = {
							internalid: reportes.data[r]['internalid'],
							transactionnumber: reportes.data[r]['transactionnumber'],
							trandate: reportes.data[r]['trandate'],
							memo: reportes.data[r]['memo'],
							amount: reportes.data[r]['amount'],
							statusref: reportes.data[r]['statusref'],
							entity: reportes.data[r]['entityid'],
							entity_id: reportes.data[r]['entity'],
							supervisor: id_sup,
							anticipo: reportes.data[r]['custbody_drt_campoinforgasto_anticapli'],
							cancelacion: reportes.data[r]['custbody_fc_cancelacion']
						}

						arrayReportes.push(objReportes);
					}
				}

			} catch (errorGetExpenseReport) {
				log.error('errorGetExpenseReport', errorGetExpenseReport);
			} finally {
				return arrayReportes;
			}
		}

		const getDetailReport = (idReporte) => {
			var arrayReporte = [];
			var objReporte = {};
			var objLineas = {};
			var arrayLineas = [];

			try {
				var objRecord = record.load({
					type: record.Type.EXPENSE_REPORT,
					id: idReporte,
					isDynamic: true,
				});

				var fileObj;
				var fileName;
				var fileUrl;
				if (objRecord.getValue('custbody_fc_aditional_document')) {
					fileObj = file.load({
						id: objRecord.getValue('custbody_fc_aditional_document')
					});
					fileName = fileObj.name;
					fileUrl = `https://8173338.app.netsuite.com${fileObj.url}`
				}

				var trandate = objRecord.getValue('trandate')
				var fecha = toFecha(trandate);
				fecha = format.format({
					value: fecha,
					type: format.Type.DATE
				});
				log.debug('fecha', fecha);
				objReporte.internalid = objRecord.getValue('id');
				objReporte.tranId = objRecord.getValue('transactionnumber');
				objReporte.trandate = fecha;
				objReporte.memo = objRecord.getValue('custbody_fc_memo');
				objReporte.amount = objRecord.getValue('amount');
				objReporte.statusref = objRecord.getValue('statusref');
				objReporte.entity_id = objRecord.getValue('entity');
				objReporte.entity_name = objRecord.getText('entity');
				objReporte.subsidiary_id = objRecord.getValue('subsidiary');
				objReporte.subsidiary_name = objRecord.getText('subsidiary');
				objReporte.status = objRecord.getText('status');
				objReporte.custbody_fc_nota_aprobacion = objRecord.getValue('custbody_fc_nota_aprobacion');
				objReporte.anticipo = objRecord.getValue('custbody_drt_campoinforgasto_anticapli');
				objReporte.cancelacion = objRecord.getValue('custbody_fc_cancelacion');
				objReporte.xmlvalidacion = objRecord.getValue('custbody_fc_validate_response_xml');
				objReporte.nameDocumentoAdicional = fileName;
				objReporte.urlDocumentoAdicional = fileUrl;

				var lineas = objRecord.getLineCount({
					sublistId: 'expense'
				});
				for (var j = 0; j < lineas; j++) {
					var pdfName, pdfUrl, xmlName, xmlUrl;
					if (objRecord.getSublistValue({ sublistId: 'expense', fieldId: 'custcol_fc_file_pdf', line: j })) {
						var fileObjPDF = file.load({
							id: objRecord.getSublistValue({
								sublistId: 'expense',
								fieldId: 'custcol_fc_file_pdf',
								line: j
							})
						});
						pdfName = fileObjPDF.name;
						pdfUrl = `https://8173338.app.netsuite.com${fileObjPDF.url}`;
					}
					if (objRecord.getSublistValue({ sublistId: 'expense', fieldId: 'custcol_fc_file_xml', line: j })) {
						var fileObjXML = file.load({
							id: objRecord.getSublistValue({
								sublistId: 'expense',
								fieldId: 'custcol_fc_file_xml',
								line: j
							})
						});
						xmlName = fileObjXML.name;
						xmlUrl = `https://8173338.app.netsuite.com${fileObjXML.url}`;
					}
					arrayLineas.push({
						category_id: objRecord.getSublistValue({
							sublistId: 'expense',
							fieldId: 'category',
							line: j
						}),
						category: objRecord.getSublistValue({
							sublistId: 'expense',
							fieldId: 'category_display',
							line: j
						}),
						foreignamount: objRecord.getSublistValue({
							sublistId: 'expense',
							fieldId: 'foreignamount',
							line: j
						}),
						currency: objRecord.getSublistText({
							sublistId: 'expense',
							fieldId: 'currency',
							line: j
						}),
						exchangerate: objRecord.getSublistValue({
							sublistId: 'expense',
							fieldId: 'exchangerate',
							line: j
						}).toFixed(2),
						amount: objRecord.getSublistValue({
							sublistId: 'expense',
							fieldId: 'amount',
							line: j
						}),
						grossamt: objRecord.getSublistValue({
							sublistId: 'expense',
							fieldId: 'grossamt',
							line: j
						}),
						memo: objRecord.getSublistValue({
							sublistId: 'expense',
							fieldId: 'memo',
							line: j
						}),
						department: objRecord.getSublistValue({
							sublistId: 'expense',
							fieldId: 'department_display',
							line: j
						}),
						taxamount: objRecord.getSublistValue({
							sublistId: 'expense',
							fieldId: 'taxamount',
							line: j
						}),
						pdfName: pdfName,
						pdfUrl: pdfUrl,
						xmlname: xmlName,
						xmlUrl: xmlUrl,
					})
				}
				/* for (var l = 0; l < lineas; l++) {

					objLineas.category_id = objRecord.getSublistValue({
						sublistId: 'expense',
						fieldId: 'category',
						line: l
					});

					objLineas.category = objRecord.getSublistValue({
						sublistId: 'expense',
						fieldId: 'category_display',
						line: l
					});

					objLineas.foreignamount = objRecord.getSublistValue({
						sublistId: 'expense',
						fieldId: 'foreignamount',
						line: l
					});

					objLineas.currency = objRecord.getSublistText({
						sublistId: 'expense',
						fieldId: 'currency',
						line: l
					});

					objLineas.exchangerate = objRecord.getSublistValue({
						sublistId: 'expense',
						fieldId: 'exchangerate',
						line: l
					}).toFixed(2);

					objLineas.amount = objRecord.getSublistValue({
						sublistId: 'expense',
						fieldId: 'amount',
						line: l
					});

					objLineas.grossamt = objRecord.getSublistValue({
						sublistId: 'expense',
						fieldId: 'grossamt',
						line: l
					});

					objLineas.memo = objRecord.getSublistValue({
						sublistId: 'expense',
						fieldId: 'memo',
						line: l
					});

					objLineas.department = objRecord.getSublistValue({
						sublistId: 'expense',
						fieldId: 'department_display',
						line: l
					});

					objLineas.taxamount = objRecord.getSublistValue({
						sublistId: 'expense',
						fieldId: 'taxamount',
						line: l
					});

					arrayLineas.push(objLineas)
				} */

				objReporte.lines = arrayLineas;

				arrayReporte.push(objReporte);
			} catch (getDetailReport) {
				log.error('getDetailReport', getDetailReport);
			} finally {
				return arrayReporte;
			}
		}

		const validateExpenseReport = (idReporte) => {
			let numberExpenseR = 0;
			try {
				var expensereportSearchObj = search.create({
					type: "expensereport",
					filters:
						[
							["type", search.Operator.ANYOF, "ExpRept"],
							"AND",
							["internalid", search.Operator.ANYOF, idReporte],
							"AND",
							["mainline", search.Operator.IS, "T"]
						],
					columns:
						[
							"tranid",
							"entity",
							"memo",
							"internalid"
						]
				});
				numberExpenseR = expensereportSearchObj.runPaged().count;
				log.debug('numberExpenseR', numberExpenseR);

			} catch (error_validateExpenseReport) {
				log.error('error_validateExpenseReport', error_validateExpenseReport);
			} finally {
				return numberExpenseR
			}
		}

		const toFecha = (date) => {
			date = new Date(date)
			let dateFormat = (date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1)) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear()
			var fecha = format.parse({
				value: dateFormat,
				type: format.Type.DATE
			});

			return fecha;

			/* var fecha = format.parse({
				value: date,
				type: format.Type.DATE
			});

			return fecha; */
		}

		const createFile = (param_name, param_type, param_contenido, param_folder) => {
			let idFile = null;
			try {
				log.debug(`createFile ${param_name} ${param_type} ${param_folder}`, param_contenido);
				var fileNew = file.create({
					name: param_name,
					fileType: param_type,
					contents: param_contenido,
					encoding: file.Encoding.UTF8,
					folder: param_folder,
					isOnline: true
				});

				idFile = fileNew.save();
				log.debug('idFile', idFile)
			} catch (errorCreateFile) {
				log.error('errorCreateFile', errorCreateFile);
			} finally {
				return idFile
			}
		}

		const getUuid = (idFile) => {
			let uuid = null;
			try {
				var xmlObj = file.load({
					id: idFile
				});

				var xmlContent = xmlObj.getContents();

				var xmlparser = xml.Parser.fromString({
					text: xmlContent
				});

				var xpath_4 = 'cfdi:Comprobante//cfdi:Complemento//tfd:TimbreFiscalDigital';

				var xmlSelect_4 = xml.XPath.select({
					node: xmlparser,
					xpath: xpath_4
				});

				var getUuid = xmlSelect_4[0].getAttributeNode({
					name: 'UUID'
				});

				uuid = getUuid.value;
			} catch (errorGetUuid) {
				log.error('errorGetUuid', errorGetUuid)
			} finally {
				return uuid
			}
		}

		const procesarRegistro = (objExpense) => {
			let idExpense = null;
			const respuestaRegistro = {
				code: 0,
				isSuccessful: true,
				message: "Some errors occured",
				data: null,
				id_netsuite: 0
			}

			const arrayUuid = [];
			var objUuid = {};
			try {
				log.audit('objExpense', objExpense);
				var newExpenseReport = record.create({
					type: 'expensereport',
					isDynamic: true,
				});
				const time1 = parseInt(new Date / 1000);
				log.audit('marca de tiempo', time1);

				newExpenseReport.setValue('entity', objExpense.entity);
				newExpenseReport.setValue('subsidiary', objExpense.subsidiary);
				const trandate = toFecha(objExpense.trandate);
				log.debug('trandate', trandate);
				newExpenseReport.setValue('trandate', trandate);
				newExpenseReport.setValue('approvalstatus', 1);
				newExpenseReport.setValue('custbody_fc_aprobacion_reporte', 1);
				if (objExpense.anticipo_recibidpo == true) {
					newExpenseReport.setValue('supervisorapproval', true);
				}

				newExpenseReport.setValue('externalid', objExpense.externalid);
				newExpenseReport.setValue('custbody_fc_memo', objExpense.nota);
				newExpenseReport.setValue('account', objExpense.account);
				//log.debug('lon', objExpense.documento_adicional.length);
				//newExpenseReport.setValue('custbody_fc_data_response_', JSON.stringify(objExpense));

				if (
					objExpense.documento_adicional &&
					objExpense.documento_adicional.length > 0
				) {
					const fileCabecera = createFile(time1 + '_pdf_', file.Type.PDF, objExpense.documento_adicional, 2406);
					newExpenseReport.setValue('custbody_fc_aditional_document', fileCabecera);
				}

				newExpenseReport.setValue('advanceaccount', objExpense.advanceaccount);
				newExpenseReport.setValue('nexus', 1);

				if (objExpense.anticipo) {
					newExpenseReport.setValue('custbody_drt_campoinforgasto_anticapli', true);
					newExpenseReport.setValue('supervisorapproval', true);
				}

				for (var i in objExpense.expense_list) {
					log.debug('iteracion', objExpense.expense_list[i]);
					newExpenseReport.selectNewLine({
						sublistId: 'expense'
					});
					const trandateLine = toFecha(objExpense.expense_list[i]['expensedate'])
					newExpenseReport.setCurrentSublistValue({
						sublistId: 'expense',
						fieldId: 'expensedate',
						value: trandateLine
					});

					newExpenseReport.setCurrentSublistValue({
						sublistId: 'expense',
						fieldId: 'category',
						value: objExpense.expense_list[i]['category']
					});


					newExpenseReport.setCurrentSublistValue({
						sublistId: 'expense',
						fieldId: 'expenseaccount',
						value: objExpense.expense_list[i]['expenseaccount']
					});

					newExpenseReport.setCurrentSublistValue({
						sublistId: 'expense',
						fieldId: 'memo',
						value: objExpense.expense_list[i]['memo']
					});

					//newExpenseReport.setCurrentSublistValue({
					//    sublistId: 'expense',
					//    fieldId: 'department',
					//    value: objExpense.expense_list[i].departamento
					//});

					newExpenseReport.setCurrentSublistValue({
						sublistId: 'expense',
						fieldId: 'amount',
						value: objExpense.expense_list[i]['amount']
					});

					newExpenseReport.setCurrentSublistValue({
						sublistId: 'expense',
						fieldId: 'grossamt',
						value: objExpense.expense_list[i]['amount']
					});

					newExpenseReport.setCurrentSublistValue({
						sublistId: 'expense',
						fieldId: 'foreignamount',
						value: objExpense.expense_list[i]['amount']
					});

					newExpenseReport.setCurrentSublistValue({
						sublistId: 'expense',
						fieldId: 'exchangerate',
						value: objExpense.expense_list[i]['exchangerate']
					});

					newExpenseReport.setCurrentSublistValue({
						sublistId: 'expense',
						fieldId: 'currency',
						value: objExpense.expense_list[i]['currency']
					});

					if (
						!!objExpense.expense_list[i]['pdf'] &&
						objExpense.expense_list[i]['pdf'].length > 0
					) {
						const filePdf = createFile(time1 + '_PDF_line_' + i, file.Type.PDF, objExpense.expense_list[i]['pdf'], 2406);
						newExpenseReport.setCurrentSublistValue({
							sublistId: 'expense',
							fieldId: 'custcol_fc_file_pdf',
							value: filePdf
						});
					}

					if (
						!!objExpense.expense_list[i]['xml'] &&
						objExpense.expense_list[i]['xml'].length > 0
					) {
						var xmlEncode = encode.convert({
							string: objExpense.expense_list[i]['xml'],
							inputEncoding: encode.Encoding.BASE_64,
							outputEncoding: encode.Encoding.UTF_8
						});

						const fileXML = createFile(time1 + '_XML_line_' + i, file.Type.XMLDOC, xmlEncode, 2406);
						newExpenseReport.setCurrentSublistValue({
							sublistId: 'expense',
							fieldId: 'custcol_fc_file_xml',
							value: fileXML
						});

						if (fileXML) {
							let uuidV = getUuid(fileXML);
							log.audit('uuidV', uuidV);

							if (!!uuidV) {
								newExpenseReport.setCurrentSublistValue({
									sublistId: 'expense',
									fieldId: 'custcol_drt_uuid',
									value: uuidV
								});

								objUuid = {
									uuid: uuidV,
									line: i
								}

								arrayUuid.push(objUuid)
							}
						}
					}

					if (
						objExpense.expense_list[i]['doc_adicional'] &&
						objExpense.expense_list[i]['doc_adicional_type']
					) {
						if (!!objExpense.expense_list[i] &&
							objExpense.expense_list[i]['doc_adicional'].length > 0
						) {
							var tipoArchivo = '';


							if (objExpense.expense_list[i]['doc_adicional_type'] == "application/pdf") {
								tipoArchivo = file.Type.PDF
							} else if (objExpense.expense_list[i]['doc_adicional_type'] == "image/jpeg") {
								tipoArchivo = file.Type.JPGIMAGE
							} else if (objExpense.expense_list[i]['doc_adicional_type'] == "text/xml") {
								tipoArchivo = file.Type.EXCEL
							}

							const documentoA = createFile(time1 + '_documento_adicional_' + i, tipoArchivo, objExpense.expense_list[i]['doc_adicional'], 2406);
							newExpenseReport.setCurrentSublistValue({
								sublistId: 'expense',
								fieldId: 'custcol_fc_archivo_adicional',
								value: documentoA
							});

						}
					}

					newExpenseReport.commitLine({
						sublistId: 'expense'
					});
					log.audit("linea impuestos", objExpense.expense_list[i].impuestos);
					for (var l in objExpense.expense_list[i].impuestos) {
						if (objExpense.hasOwnProperty("nexus") && objExpense.expense_list[i].impuestos[l].hasOwnProperty("tipoimpuesto")) {
							const line_l = Number(i) + 1;
							log.audit("tax reference line", `NEW${line_l}`);

							newExpenseReport.selectNewLine({
								sublistId: 'taxdetails'
							});

							newExpenseReport.setCurrentSublistValue({
								sublistId: 'taxdetails',
								fieldId: 'taxdetailsreference',
								value: `NEW${line_l}`
							});

							newExpenseReport.setCurrentSublistValue({
								sublistId: 'taxdetails',
								fieldId: 'taxtype',
								value: objExpense.expense_list[i].impuestos[l].tipoimpuesto
							});

							newExpenseReport.setCurrentSublistValue({
								sublistId: 'taxdetails',
								fieldId: 'taxcode',
								value: objExpense.expense_list[i].impuestos[l].codImpuesto
							});

							newExpenseReport.setCurrentSublistValue({
								sublistId: 'taxdetails',
								fieldId: 'taxbasis',
								value: objExpense.expense_list[i].impuestos[l].amount
							});

							newExpenseReport.setCurrentSublistValue({
								sublistId: 'taxdetails',
								fieldId: 'taxrate',
								value: objExpense.expense_list[i].impuestos[l].rateTax
							});

							newExpenseReport.setCurrentSublistValue({
								sublistId: 'taxdetails',
								fieldId: 'taxamount',
								value: objExpense.expense_list[i].impuestos[l].amounttax
							});

							newExpenseReport.commitLine({
								sublistId: 'taxdetails'
							});
						}
					}
				}

				//Impuestos Line
				/* for (var l in objExpense.expense_list) {
					if (objExpense.hasOwnProperty("nexus") && objExpense.expense_list[l].hasOwnProperty("tipoimpuesto")) {
						const line_l = Number(l) + 1;
						log.debug("tax reference line", `NEW${line_l}`);
						newExpenseReport.selectNewLine({
							sublistId: 'taxdetails'
						});
 
						newExpenseReport.setCurrentSublistValue({
							sublistId: 'taxdetails',
							fieldId: 'taxdetailsreference',
							value: `NEW${line_l}`
						});
 
						newExpenseReport.setCurrentSublistValue({
							sublistId: 'taxdetails',
							fieldId: 'taxtype',
							value: objExpense.expense_list[l]['tipoimpuesto']
						});
 
						newExpenseReport.setCurrentSublistValue({
							sublistId: 'taxdetails',
							fieldId: 'taxcode',
							value: objExpense.expense_list[l]['codImpuesto']
						});
 
						newExpenseReport.setCurrentSublistValue({
							sublistId: 'taxdetails',
							fieldId: 'taxbasis',
							value: objExpense.expense_list[l]['amount']
						});
 
						newExpenseReport.setCurrentSublistValue({
							sublistId: 'taxdetails',
							fieldId: 'taxrate',
							value: objExpense.expense_list[l]['rateTax']
						});
 
						newExpenseReport.setCurrentSublistValue({
							sublistId: 'taxdetails',
							fieldId: 'taxamount',
							value: objExpense.expense_list[l]['amounttax']
						});
 
						newExpenseReport.commitLine({
							sublistId: 'taxdetails'
						});
					}
				} */

				const arrayRespuesta = [];
				var objArrayRespuesta = {};
				log.audit('arrayUuid', arrayUuid)
				if (arrayUuid.length > 0) {
					for (var h in arrayUuid) {
						var uuidget = arrayUuid[h]['uuid'];
						var linea = arrayUuid[h]['line']
						log.audit('uuidget', uuidget);
						log.audit('uuidget', arrayUuid[h]);
						var expensereportSearchObj = search.create({
							type: "expensereport",
							filters:
								[
									["type", "anyof", "ExpRept"],
									"AND",
									["custcol_drt_uuid", "is", uuidget]
								],
							columns:
								[
									"internalid",
									"tranid",
									"transactionnumber"
								]
						});
						var expenseN = expensereportSearchObj.runPaged().count;
						log.audit('expenseN', expenseN);

						if (expenseN > 0) {
							objArrayRespuesta = {
								message: "El uuid" + " " + uuidget + " " + "ya se encuentra en otras transacciones.",
								line: linea
							}

							arrayRespuesta.push(objArrayRespuesta);
						}
					}

				}

				log.audit('arrayRespuesta', arrayRespuesta);

				if (arrayRespuesta.length > 0) {
					respuestaRegistro.code = 304;
					respuestaRegistro.isSuccessful = false;
					respuestaRegistro.data = arrayRespuesta;
				} else {
					idExpense = newExpenseReport.save();
					respuestaRegistro.code = 200;
					respuestaRegistro.isSuccessful = true;
					respuestaRegistro.data = "successful expense report creation.";
					respuestaRegistro.id_netsuite = idExpense
				}


				//log.debug('idExpense', idExpense);


			} catch (error_procesar_registro) {
				log.error('error_procesar_registro', error_procesar_registro);
			} finally {
				return respuestaRegistro
			}
		}

		const updateExpense = (param_id, param_objeto) => {
			let idUpdate = null
			try {
				var loadReporte = record.load({
					type: 'expensereport',
					id: param_id,
					isDynamic: false,
				});

				let transactionnumber = loadReporte.getValue('transactionnumber');
				if (param_objeto.documento_adicional) {
					if (param_objeto.documento_adicional.length > 0) {
						const fileCabecera = createFile(transactionnumber + '_pdf_', file.Type.PDF, param_objeto.documento_adicional, 2406);
						loadReporte.setValue('custbody_fc_aditional_document', fileCabecera);
					}
				}


				let lineas = loadReporte.getLineCount({
					sublistId: 'expense'
				});

				for (let r = 0; r < lineas; r++) {
					log.debug('param_objeto.expense_list', param_objeto.expense_list);
					//log.debug('param_objeto.expense_list[a][pdf]', param_objeto.expense_list[r]['pdf'].length);
					//log.debug('param_objeto.expense_list[a][xml]', param_objeto.expense_list[r]['xml'].length);
					if (param_objeto.expense_list[r]['pdf']) {
						if (!!param_objeto.expense_list[r] &&
							param_objeto.expense_list[r]['pdf'].length > 0
						) {
							const filePdf = createFile(transactionnumber + '_PDF_line_' + r, file.Type.PDF, param_objeto.expense_list[r]['pdf'], 2406);
							loadReporte.setSublistValue({
								sublistId: 'expense',
								fieldId: 'custcol_fc_file_pdf',
								value: filePdf,
								line: r
							});
						}
					}

					if (param_objeto.expense_list[r]['xml']) {
						if (!!param_objeto.expense_list[r] &&
							param_objeto.expense_list[r]['xml'].length > 0
						) {

							var xmlEncode = encode.convert({
								string: param_objeto.expense_list[r]['xml'],
								inputEncoding: encode.Encoding.BASE_64,
								outputEncoding: encode.Encoding.UTF_8
							});

							const fileXML = createFile(transactionnumber + '_XML_line_' + r, file.Type.XMLDOC, xmlEncode, 2406);
							loadReporte.setSublistValue({
								sublistId: 'expense',
								fieldId: 'custcol_fc_file_xml',
								value: fileXML,
								line: r
							});
						}
					}

					if (param_objeto.expense_list[r]['doc_adicional'] && param_objeto.expense_list[r]['doc_adicional_type']) {
						if (!!param_objeto.expense_list[r] &&
							param_objeto.expense_list[r]['doc_adicional'].length > 0
						) {
							var tipoArchivo = '';

							if (param_objeto.expense_list[r]['doc_adicional_type'] == "application/pdf") {
								tipoArchivo = file.Type.PDF
							} else if (param_objeto.expense_list[r]['doc_adicional_type'] == "image/jpeg") {
								tipoArchivo = file.Type.JPGIMAGE
							} else if (param_objeto.expense_list[r]['doc_adicional_type'] == "text/xml") {
								tipoArchivo = file.Type.EXCEL
							}

							const documentoA = createFile(transactionnumber + '_documento_adicional_' + r, tipoArchivo, param_objeto.expense_list[r]['doc_adicional'], 2406);
							loadReporte.setSublistValue({
								sublistId: 'expense',
								fieldId: 'custcol_fc_archivo_adicional',
								value: documentoA,
								line: r
							});
						}
					}
				}


				idUpdate = loadReporte.save();
				log.debug('guardado', idUpdate);


			} catch (error_updateExpense) {
				log.error('error_updateExpense', error_updateExpense);
			} finally {
				return idUpdate;
			}
		}

		const drivingScenery = (param_id, param_objeto) => {
			let idUpdate = null
			try {
				var loadReporte = record.load({
					type: 'expensereport',
					id: param_id,
					isDynamic: false,
				});

				let lineas = loadReporte.getLineCount({
					sublistId: 'expense'
				});

				for (let r = 0; r < lineas; r++) {
					for (let h in param_objeto.expense_list) {
						for (let u in param_objeto.expense_list[h]['driving']) {
							log.debug('longitud', param_objeto.expense_list[h]['driving'].length)
							if (param_objeto.expense_list[h]['driving'].length > 0) {
								loadReporte.setSublistValue({
									sublistId: 'expense',
									fieldId: 'custcol_nie_numero_viaje_driving',
									value: param_objeto.expense_list[h]['driving'][u]['n_viaje'],
									line: r
								});
								loadReporte.setSublistValue({
									sublistId: 'expense',
									fieldId: 'custcol_facturas_relacionadas_driving',
									value: param_objeto.expense_list[h]['driving'][u]['n_facturas'],
									line: r
								});
							}
						}
					}
				}

				idUpdate = loadReporte.save();
				log.debug('guardado', idUpdate);

			} catch (error_driving) {
				log.error('error_driving', error_driving);
			} finally {
				return idUpdate;
			}
		}

		const rejectExpenseReport = (param_id) => {
			let idReject = null
			try {
				var loadReporte = record.load({
					type: 'expensereport',
					id: param_id,
					isDynamic: false,
				});
				loadReporte.setValue({
					fieldId: 'approvalstatus',
					value: 3
				});
				idReject = loadReporte.save();
				log.debug('rechazado', idReject);
			} catch (error) {
				log.error('error_updateExpense', error_updateExpense);
			} finally {
				return idUpdate;
			}
		}

		const getSubsidiaries = () => {
			var arraySubsidiaries = [];
			var objSubsidiaries = {};

			try {
				const subsidiarias = searchQuery(
					'subsidiary',
					[
						["isinactive", search.Operator.IS, "F"]
					],
					[
						{
							name: "internalid"
						},
						{
							name: "name",
							sort: search.Sort.ASC
						}
					]
				);

				if (subsidiarias.success == true) {
					for (var s in subsidiarias.data) {
						objSubsidiaries = {
							internalid: subsidiarias.data[s]['internalid'],
							name: subsidiarias.data[s]['name'],
						}

						arraySubsidiaries.push(objSubsidiaries);
					}
				}

			} catch (errorGetSubsidiaries) {
				log.error('errorGetSubsidiaries', errorGetSubsidiaries);
			} finally {
				return arraySubsidiaries;
			}
		}

		const getLocations = () => {
			var arrayLocations = [];
			var objLocations = {};
			try {
				const locations = searchQuery(
					"location",
					[
						["isinactive", search.Operator.IS, "F"]
					],
					[
						{
							name: "internalid"
						},
						{
							name: "name",
							sort: search.Sort.ASC
						},
						{
							name: "subsidiary"
						}
					]
				);

				if (locations.success == true) {
					for (var l in locations.data) {
						objLocations = {
							internalid: locations.data[l]['internalid'],
							name: locations.data[l]['name'],
							subsidiary: locations.data[l]['subsidiary'],
						}

						arrayLocations.push(objLocations);
					}
				}
			} catch (errorGetLocations) {
				log.error('errorGetLocations', errorGetLocations);
			} finally {
				return arrayLocations;
			}
		}

		const getCurrensy = () => {
			var arrayMonedas = [];
			var objMonedas = {};
			try {
				const monedas = searchQuery(
					"currency",
					[],
					[
						{
							name: "internalid"
						},
						{
							name: "name",
							sort: search.Sort.ASC
						},
						{
							name: "symbol"
						},
						{
							name: "exchangerate"
						}
					]
				);

				if (monedas.success == true) {
					for (var m in monedas.data) {
						objMonedas = {
							internalid: monedas.data[m]['internalid'],
							name: monedas.data[m]['name'],
							symbol: monedas.data[m]['symbol'],
							exchangerate: monedas.data[m]['exchangerate']
						}

						arrayMonedas.push(objMonedas);
					}
				}
			} catch (errorMonedas) {
				log.error('errorMonedas', errorMonedas);
			} finally {
				return arrayMonedas;
			}
		}

		//temporal

		const getTemporal = () => {
			const respuesta = {
				success: false,
				data: {},
				error: {}
			};
			try {
				var departmentSearchObj = search.create({
					type: "department",
					filters:
						[],
					columns:
						[
							search.createColumn({
								name: "name",
								sort: search.Sort.ASC
							}),
							"internalid",
							"subsidiary"
						]
				});
				var searchResultCount = departmentSearchObj.run();
				//log.debug("searchCount", searchResultCount);
				const start = 0;
				//do {
				var searchObjResult = searchResultCount.getRange(0, 10);
				//var searchObjResult = searchResultCount.getRange({
				//    start: start,
				//    end: start + 1000
				//});
				if (searchResultCount > 0) {
					log.debug("searchObjResult", searchObjResult);
					for (let i = 0; i < searchObjResult.length; i++) {
						var columnas = searchObjResult[i].columns;
						var total = searchObjResult[i].getValue(columnas[1]);
						log.debug('total', total);
					}
				}
				//} while (searchObjResult && searchObjResult.length == 1000)
			} catch (errorGetTemporal) {
				log.error('errorGetTemporal', errorGetTemporal);
			} finally {
				log.debug("respuesta_fin_", respuesta);
				return respuesta;
			}
		}

		const getDepartments = () => {
			var arrayDepartamentos = [];
			var objDepartamentos = {};
			try {
				const departamentos = searchQuery(
					"department",
					[],
					[
						{
							name: "internalid"
						},
						{
							name: "name",
							sort: search.Sort.ASC
						},
						{
							name: "subsidiary"
						}
					]
				);

				//if(departamentos.success == true){
				for (var d in departamentos.data) {
					let objids = [];
					var objRecord = record.load({
						type: "department",
						id: departamentos.data[d]['internalid'],
						isDynamic: true,
					});
					var nameSubsidiary = objRecord.getValue("subsidiary");
					for (var idsub of nameSubsidiary) {
						objids.push({ id: idsub });
					}

					objDepartamentos = {
						internalid: departamentos.data[d]['internalid'],
						name: departamentos.data[d]['name'],
						subsidiary_name: departamentos.data[d]['subsidiary'],
						subsidiary: objids
					}

					arrayDepartamentos.push(objDepartamentos);
				}
				//}
			} catch (errorDepartamentos) {
				log.error('errorDepartamentos', errorDepartamentos);
			} finally {
				return arrayDepartamentos;
			}
		}

		const getExpenseCategory = () => {
			try {
				var arrayECategories = [];
				var objECategories = {};

				const eCategories = searchQuery(
					"expensecategory",
					[
						["custrecord_nie_porta_viaticos", "is", "T"]
					],
					[
						{
							name: "internalid"
						},
						{
							name: "name",
							sort: search.Sort.ASC
						},
						{
							name: "subsidiary"
						},
						{
							name: "account"
						},
						{
							name: "custrecorddtt_requerido_xml"
						},
						{
							name: "custrecord_dtt_facturas_viaje"
						},
						{
							name: "custrecord_fte_exp_category_m_tax_code"
						}
					]
				);

				log.debug('s', eCategories.success);

				if (eCategories.success == true) {
					for (var eC in eCategories.data) {

						var nameSubsidiary = search.lookupFields({
							type: 'subsidiary',
							id: eCategories.data[eC]["subsidiary"],
							columns: ['name']
						});

						var nameAccount = search.lookupFields({
							type: 'account',
							id: eCategories.data[eC]["account"],
							columns: ['name']
						});

						var objids = [];
						var objRecord = record.load({
							type: "expensecategory",
							id: eCategories.data[eC]['internalid'],
							isDynamic: true,
						});
						var nameSubsidiary = objRecord.getValue("subsidiary");
						for (var idsub of nameSubsidiary) {
							objids.push({ id: idsub });
						}

						log.debug('nameSubsidiary', nameSubsidiary.name)
						var mandatoryXml = 0;

						if (eCategories.data[eC]["custrecorddtt_requerido_xml"] == true) {
							mandatoryXml = 1
						} else {
							mandatoryXml = 0
						}

						var custrecord_dtt_facturas_viaje = 0;

						if (eCategories.data[eC]["custrecord_dtt_facturas_viaje"] == true) {
							custrecord_dtt_facturas_viaje = 1
						} else {
							custrecord_dtt_facturas_viaje = 0
						}

						objECategories = {
							internalid: eCategories.data[eC]["internalid"],
							name: eCategories.data[eC]["name"],
							subsidiary: objids,
							name_subsidiary: nameSubsidiary.name,
							expenseAccount: eCategories.data[eC]["account"],
							name_expenseAccount: nameAccount.name,
							mandatory_xml: mandatoryXml,
							custrecord_dtt_facturas_viaje: custrecord_dtt_facturas_viaje,
							custrecord_fte_exp_category_m_tax_code: eCategories.data[eC]["custrecord_fte_exp_category_m_tax_code"]
						}

						arrayECategories.push(objECategories);
					}
				}
			} catch (errorGetExpenseCategory) {
				log.error('errorGetExpenseCategory', errorGetExpenseCategory);
			} finally {
				return arrayECategories
			}
		}

		const getNexusTax = () => {
			try {
				var arrayTNexus = [];
				var objTNexus = {};

				const eNexus = searchQuery(
					"nexus",
					[["country", "anyof", "MX"]],
					[
						{
							name: "internalid"
						},
						{
							name: "country"
						},
						{
							name: "taxagency"
						},
						{
							name: "description"
						}
					]
				);
				if (eNexus.success == true) {
					for (var eN in eNexus.data) {
						objTNexus = {
							internalid: eNexus.data[eN]["internalid"],
							country: eNexus.data[eN]["country"],
							taxagency: eNexus.data[eN]["taxagency"],
							description: eNexus.data[eN]["description"]
						}

						arrayTNexus.push(objTNexus);
					}
				}
			} catch (errorGetTaxNexus) {
				log.error('errorGetTaxNexus', errorGetTaxNexus);
			} finally {
				return arrayTNexus
			}
		}

		const getTaxtype = () => {
			try {
				var eTxType = [
					{
						internalid: 15,
						name: "IVA 0%",
						country: 1,
						taxCodes: [{
							internalid: 535,
							name: "IVA - 0%",
							rate: 0.0
						}]
					},
					{
						internalid: 2,
						name: "IVA 16%",
						country: 1,
						taxCodes: [{
							internalid: 6,
							name: "IVA 16%",
							rate: 0.16
						}]
					},
					{
						internalid: 3,
						name: "IVA 8%",
						country: 1,
						taxCodes: [{
							internalid: 7,
							name: "IVA 8%",
							rate: 0.08
						}]
					},

					{
						internalid: 14,
						name: "IVA EXENTO",
						country: 1,
						taxCodes: [{
							internalid: 119,
							name: "EXENTO",
							rate: 0.0
						}]
					}
				]
			} catch (errorGetTaxNexus) {
				log.error('errorGetTaxTypeCodes', errorGetTaxNexus);
			} finally {
				return eTxType
			}
		}

		const getNumerosViaje = (param_empleado) => {
			var arrayCodigos = [];
			var objCodigos = {};
			try {

				const travelNumbers = searchQuery(
					"invoice",
					[
						["type", "anyof", "CustInvc"],
						"AND",
						["mainline", "is", "T"],
						"AND",
						["custbody_drt_cp_figura_transporte.custrecord_nie_ov_empleado", "anyof", param_empleado],
						"AND",
						["class", "anyof", "2", "1"]
					],
					[
						{
							name: "internalid"
						},
						{
							name: "custbody_nie_numero_viaje_"
						}
					]

				);

				if (travelNumbers.success == true) {
					for (var tN in travelNumbers.data) {
						objCodigos = {
							internalId: travelNumbers.data[tN]["internalid"],
							code: travelNumbers.data[tN]["custbody_nie_numero_viaje_"]
						}

						arrayCodigos.push(objCodigos)
					}
				}
			} catch (errorGetNumerosViaje) {
				log.error('error_get_numeros_viaje', errorGetNumerosViaje);
			} finally {
				return arrayCodigos;
			}
		}

		const getInvoicebyNumberviaje = (param_empleado, param_code) => {
			var arrayInvoice = [];
			var objInvoice = {};
			try {
				const getInvoice = searchQuery(
					"invoice",
					[
						["type", "anyof", "CustInvc"],
						"AND",
						["mainline", "is", "T"],
						"AND",
						["custbody_nie_numero_viaje_", "is", param_code],
						"AND",
						["custbody_drt_cp_figura_transporte.custrecord_nie_ov_empleado", "anyof", param_empleado]
					],
					[
						{
							name: "internalid"
						},
						{
							name: "tranid"
						}
					]
				);

				if (getInvoice.success == true) {
					for (var gI in getInvoice.data) {
						2
						objInvoice = {
							internal_id: getInvoice.data[gI]['internalid'],
							tranId: getInvoice.data[gI]['tranid']
						}

						arrayInvoice.push(objInvoice)
					}
				}


			} catch (errorGetInvoicebyNumberviaje) {
				log.error('errorGetInvoicebyNumberviaje', errorGetInvoicebyNumberviaje);
			} finally {
				return arrayInvoice;
			}
		}

		const searchRoleDriving = (param_entity) => {
			var role = 0
			try {
				const entitySearchObj = searchQuery(
					"entity",
					[
						["internalid", "anyof", param_entity],
						"AND",
						["type", "anyof", "Employee"]
					],
					[
						{
							name: "internalid"
						},
						{
							name: "custentity_nie_rol_drivin"
						}
					]
				);
				if (entitySearchObj.success == true) {

					for (var f in entitySearchObj.data) {
						role = entitySearchObj.data[f]["custentity_nie_rol_drivin"]
					}
				}

				log.debug('role', role)

			} catch (errorSearchRoleDriving) {
				log.error('errorSearchRoleDriving', errorSearchRoleDriving);
			} finally {
				return role;
			}
		}

		return { searchQuery, getEmployees, getExpenseReport, getDetailReport, validateExpenseReport, procesarRegistro, createFile, updateExpense, rejectExpenseReport, getSubsidiaries, getLocations, getCurrensy, getDepartments, getExpenseCategory, getTemporal, getNexusTax, getTaxtype, getNumerosViaje, getInvoicebyNumberviaje, drivingScenery, searchRoleDriving }

	});
