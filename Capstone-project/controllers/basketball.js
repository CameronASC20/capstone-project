// Import Dependencies
const express = require('express')
const Basketball = require('../models/basketball')
const fetch = require('node-fetch')

// Create router
const router = express.Router()

// Routes

// index ALL
router.get('/', (req, res) => {
	const { username, userId, loggedIn } = req.session
	fetch('https://www.balldontlie.io/api/v1/players?page=301&per_page=11')
		.then((responseData) => {
			console.log('response', responseData)
			// return responseData
			return responseData.json()
			// res.send(responseData)
		})
		.then((jsonData) => {
			console.log('response data', jsonData.data)
			// res.send(jsonData)
			res.render('basketball/index', { players: jsonData.data, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})


router.get('/favorites', (req, res) => {
	const { username, userId, loggedIn } = req.session
	Basketball.find({owner: userId})
	.then(players => {
		res.render('basketball/favoriteindex', { players, username, loggedIn })
	})
})

// get route for favorite show page
router.get('/favorite/:id:/playerFirst/:playerLast', (req, res) => {
	const playerId = req.params.id
	const playerFName = req.params.playerFirst
	const playerLName = req.params.playerLast
	Basketball.findById(playerId)
		.populate(
			{path:'comments',
			populate: {
				path: 'author'
			}
			})
		
		.then(basketball => {
			console.log(basketball)
			console.log(basketball.comments)
			const playerName = { first: playerFName, last: playerLName}
			const { username, userId, loggedIn } = req.session
			res.render('basketball/favorite' , { basketball, userId, username, loggedIn, playerName: playerName })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// create -> POST route that favorites the player and renders the show page
router.post('/favorite/:id', (req, res) => {
	req.body.ready = req.body.ready === 'on' ? true : false
	// create form with type submit that has a value of favorite
	// in that form use hidden inputs with values of the api info that I want to save
	// that form info is available in req.body
	req.body.owner = req.session.userId
	console.log('req.body', req.body)
	Basketball.create(req.body)
	.then(player => {
		console.log('this is the owner', player.owner.id)
			console.log(player.id)
			res.redirect(`/basketballapp/favorite/${player.id}`)
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
	})


// update route
router.put('/:id/edit', (req, res) => {
	const playerId = req.params.id
	Basketball.findByIdAndUpdate(playerId, req.body, { new: true })
	.then(player => {
			console.log('the updated player', player)
			res.redirect(`/basketballapp/favorite/${player.id}`)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
	})
	
// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	// we need to get the id
	const playerId = req.params.id
	Basketball.findById(playerId)
	.then(basketball => {
		const username = req.session.username
		const loggedIn = req.session.loggedIn
		res.render('basketball/edit', { basketball, username, loggedIn})
	})
	.catch((error) => {
		res.redirect(`/error?error=${error}`)
	})
})
	
	
// create -> POST route that redirects to favorites index page
router.post('/:id', (req, res) => {
	req.body.ready = req.body.ready === 'on' ? true : false
	req.body.owner = req.session.userId
	console.log('create route', req.body)
	Basketball.create(req.body)
		.then(basketball => {
				res.redirect('/basketballapp/favorites')
		})
		.catch(error => {
				res.redirect(`/error?error=${error}`)
		})
	})
	
// show route -> index that shows the player selected and renders the show page
router.get('/:id/:playerFirst/:playerLast', (req, res) => {
	console.log('PARAMS', req.params.id)
	const playerFName = req.params.playerFirst
	const playerLName = req.params.playerLast
	console.log(playerFName)
	fetch(`https://www.balldontlie.io/api/v1/season_averages?season=2020&player_ids[]=${req.params.id}`)
		.then(jsonData => {
			console.log('DATA', jsonData)
			return jsonData.json()
		})
		.then(basketball => {
				const playerName = { first: playerFName, last: playerLName}
				console.log('LOOK AT THIS', basketball)
				res.render('basketball/show', { player: basketball, playerName: playerName })
			})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

	
// delete route
router.delete('/:id', (req, res) => {
	Basketball.findByIdAndDelete(req.params.id)
		.then(
			res.redirect(`/basketballapp/favorites`)
		)
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
	})

// Export the Router
module.exports = router
