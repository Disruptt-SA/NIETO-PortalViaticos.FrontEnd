import api from '../lib/axios';

export default {
	getTaxescodes(taxType) {
		return api.get(`/api/mongo/taxes/code/${taxType}`)
	},
}