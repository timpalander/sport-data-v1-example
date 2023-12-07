// Use any http library you want
const axios = require('axios');

// Authorization header
const axiosInstance = axios.create({
	headers: {
		'Authorization': 'XXXXXXXXXXX',
	}
})

const apiUrl = 'https://solidsport.com'

const getEndpointUrl = (type, id = '') => {
	return `${apiUrl}/api/sport_data_v1/${type}/${id}`
}

// API
const ApiService = () => {
	const findOrCreate = async (type, params, patchIfExists = false) => {
		const url = getEndpointUrl(type, params.id)
		console.log('[GET]', url, params)
		let obj = await axiosInstance.get(url, { params })
																 .then((response) => response.data)
																 .catch((error) => { console.log(error.response.data) })
		if (obj) {
			if (patchIfExists) {
				// Optional patch if already exists
				console.log('[PATCH]', url, params)
				obj = await axiosInstance.patch(url, params)
																.then((response) => response.data)
																.catch((error) => { console.log(error.response.data) })
			}
		} else {
			const postUrl = getEndpointUrl(type)
			console.log('[POST]', url, params)
			obj = await axiosInstance.post(postUrl, params)
															 .then((response) => response.data)
															 .catch((error) => { console.log(error.response.data) })
		}
		return obj
	}
	return {
		findOrCreate
	}
}

// Main -----------------------------------------------------------------
const run = async () => {
	// Mock data
	const eventData = {
		id: 'test',
		name: 'Test event',
	}
	const homeTeamData = {
		id: '1',
		name: 'Team 1',
		event_id: eventData.id
	}
	const awayTeamData = {
		id: '2',
		name: 'Team 2',
		event_id: eventData.id
	}
	const gameData = {
		event_id: eventData.id,
		period_length: 20,
		number_of_periods: 3,
		start_at: '2023-12-01T10:00:00Z',
		end_at: '2023-12-01T12:00:00Z',
		create_livestream: true
	}
	// Exec.
	const event = await ApiService().findOrCreate('events', eventData, false)
	console.log('event => ', event)
	const homeTeam = await ApiService().findOrCreate('teams', homeTeamData, false)
	console.log('homeTeam => ', homeTeam)
	const awayTeam = await ApiService().findOrCreate('teams', awayTeamData, false)
	console.log('awayTeam => ', awayTeam)
	const game = await ApiService().findOrCreate(
		'games',
		{
			...gameData,
			home_team_id: homeTeam.id,
			away_team_id: awayTeam.id
		}
	)
	console.log('game => ', game)
}
run()
