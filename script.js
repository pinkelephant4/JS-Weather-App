const currentTemperature = document.getElementById('currentTemp')
const weatherIcon = document.getElementById('weatherIcon')
const weatherDescription = document.getElementById('weatherDescription')
const windSpeed = document.getElementById('wind')
const windDirection = document.getElementById('windDir')
const lowestToday = document.getElementById('lowestToday')
const highestToday = document.getElementById('highestToday')
const pressure = document.getElementById('pressure')
const humidity = document.getElementById('humidity')
const sunrise = document.getElementById('sunrise')
const sunset = document.getElementById('sunset')
const sunriseRelative = document.getElementById('sunriseRelative')
const sunsetRelative = document.getElementById('sunsetRelative')
const userLocation = document.getElementById('location')
const time = document.getElementById('time')
const date = document.getElementById('date')
const searchInput = document.getElementById('searchInput')

const monthNames = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
]

const getWeatherData = async () => {
	try {
		const city = searchInput.value || 'New Delhi'

		const currentWeather = new Promise(async (resolve, reject) => {
			try {
				const weatherApiData = await fetch(
					`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=8109965e7254a469d08a746e8b210e1e&units=imperial`,
				)

				resolve(await weatherApiData.json())
			} catch (error) {
				reject()
			}
		})

		const forecast = new Promise(async (resolve, reject) => {
			try {
				const forecastApiData = await fetch(
					`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=8109965e7254a469d08a746e8b210e1e&units=imperial&cnt=10`,
				)

				resolve(await forecastApiData.json())
			} catch (error) {
				reject()
			}
		})

		
		const data = await Promise.all([currentWeather, forecast])

		
		updateDom(data)
	} catch (error) {
		console.log(error)
	}
}

const getDirection = deg => {
	switch (true) {
		case deg < 22.5:
			return 'N'
		case deg < 67.5:
			return 'NE'
		case deg < 112.5:
			return 'E'
		case deg < 157.5:
			return 'SE'
		case deg < 202.5:
			return 'S'
		case deg < 247.5:
			return 'SW'
		case deg < 292.5:
			return 'W'
		case deg < 337.5:
			return 'NW'
	}
}

const updateDom = data => {
	console.log('🔥 updating', data)
	
	currentTemperature.innerText = (((data[0].main.temp) - 32) * 0.555555555555555).toFixed(1)

	
	weatherIcon.src = `https://openweathermap.org/img/wn/${data[0].weather[0].icon}@2x.png`

	weatherDescription.innerText = data[0].weather[0].main

	windSpeed.innerText = data[0].wind.speed.toFixed(1)

	windDirection.innerText = getDirection(data[0].wind.deg)

	lowestToday.innerText = Math.round(((data[0].main.temp_min) - 32) * 0.555555555555555)

	highestToday.innerText = Math.round(((data[0].main.temp_max) - 32) * 0.555555555555555)

	pressure.innerText = data[0].main.pressure

	humidity.innerText = data[0].main.humidity

	const sunriseTs = new Date(data[0].sys.sunrise * 1000)
	const sunsetTs = new Date(data[0].sys.sunset * 1000)

	sunrise.innerText = sunriseTs.toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
	})

	sunset.innerText = sunsetTs.toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
	})

	sunriseRelative.innerText = timeago.format(sunriseTs)
	sunsetRelative.innerText = timeago.format(sunsetTs)

	userLocation.innerText = data[0].name

	time.innerText = new Date(Date.now()).toLocaleString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
	})

	date.innerText = new Date(Date.now()).toLocaleString('en-US', {
		weekday: 'long',
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	})

	renderChart(data[1].list)
}

const renderChart = data => {
	const myChart = echarts.init(document.getElementById('chart'))

	const option = {
		legend: {
			data: ['temperature'],
		},
		tooltip: {},
		xAxis: {
			data: data.map(item => item.dt_txt),
		},
		yAxis: {},
		series: [
			{
				type: 'line',
				smooth: true,
				areaStyle: {
					opacity: 0.5,
				},
				data: data.map(item => item.main.temp),
			},
		],
	}

	myChart.setOption(option)
}

getWeatherData()

document.addEventListener('keydown', (e) => {
	if (e.key == 'Enter') {
		getWeatherData()
	}
})

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '0b444c2151msh8b588925920d99cp1ffc77jsndfc3b816e049',
		'X-RapidAPI-Host': 'open-weather13.p.rapidapi.com'
	}
};

fetch('https://open-weather13.p.rapidapi.com/city/New%20Delhi', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));