const getTodayDate = () => {
	let yourDate = new Date();
	const offset = yourDate.getTimezoneOffset();
	yourDate = new Date(yourDate.getTime() - (offset * 60 * 1000));
	return yourDate.toISOString().split('T')[0]
}

export default getTodayDate