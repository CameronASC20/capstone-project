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
	fetch('https://www.balldontlie.io/api/v1/players')
		.then((responseData) => {
			console.log(responseData)
			// return responseData
			return responseData.json()
			// res.send(responseData)
		})
		.then((jsonData) => {
			console.log(jsonData)
			// res.send(jsonData)
			res.render('basketball/index', { players: jsonData, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})


// new route -> GET route that renders our page with the form
router.get('/new', (req, res) => {
	const { username, userId, loggedIn } = req.session
	res.render('superhero/new', { username, loggedIn })
})

router.get('/favorites', (req, res) => {
	const { username, userId, loggedIn } = req.session
	Superhero.find({owner: userId})
	.then(superheroes => {
		res.render('superhero/favoriteindex', { superheroes, username, loggedIn })
	})
})

// get route for favorite page
router.get('/favorite/:id', (req, res) => {
	const superId = req.params.id
	Superhero.findById(superId)
		.populate(
			{path:'comments',
			populate: {
				path: 'author'
			}
			})
		
		.then(superhero => {
			console.log(superhero)
			// console.log('powerstats', superhero.powerstats.intelligence)
			// console.log('appearance', superhero.appearance)
			// console.log('biography', superhero.biography)
			// console.log('connections', superhero.connections)
			console.log(superhero.comments)
			const { username, userId, loggedIn } = req.session
			res.render('superhero/favorite' , { superhero, userId, username, loggedIn })
			// use this if console.log is not giving out full data
			// res.send({ superhero })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// create -> POST route that favorites the superhero and renders the show page
router.post('/favorite/:id', (req, res) => {
	req.body.ready = req.body.ready === 'on' ? true : false
	// create form with type submit that has a value of favorite
	// in that form use hidden inputs with values of the api info that I want to save
	// that form info is available in req.body
	req.body.owner = req.session.userId
	req.body.powerstats = {
		intelligence: req.body.intelligence,
		strength: req.body.strength,
		speed: req.body.speed,
		durability: req.body.durability,
		power: req.body.power,
		combat: req.body.combat
	}
	req.body.appearance = {
		gender: req.body.gender,
		race: req.body.race,
		height: req.body.height,
		weight: req.body.weight,
		eyeColor: req.body.eyeColor,
		hairColor: req.body.hairColor
	}
	req.body.biography = {
		fullName: req.body.fullName,
		alterEgos: req.body.alterEgos,
		aliases: req.body.aliases,
		placeOfBirth: req.body.placeOfBirth,
		firstAppearance: req.body.firstAppearance,
		publisher: req.body.publisher,
		alignment: req.body.alignment,
	}
	req.body.connections = {
		groupAffiliation: req.body.groupAffiliation
	}
	console.log('req.body', req.body)
	Superhero.create(req.body)
	.then(superhero => {
		console.log('this is the owner', superhero.owner.id)
			console.log(superhero._id)
			res.redirect(`/superheroapp/favorite/${superhero._id}`)
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
	})


// update route
router.put('/:id/edit', (req, res) => {
	const superId = req.params.id
	Superhero.findByIdAndUpdate(superId, req.body, { new: true })
	.then(superhero => {
			console.log('the updated superhero', superhero)
			res.redirect(`/superheroapp/favorite/${superhero._id}`)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
	})
	
// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	// we need to get the id
	const superId = req.params.id
	Superhero.findById(superId)
	.then(superhero => {
		const username = req.session.username
		const loggedIn = req.session.loggedIn
		res.render('superhero/edit', { superhero, username, loggedIn})
	})
	.catch((error) => {
		res.redirect(`/error?error=${error}`)
	})
})
	
	
// create -> POST route that creates a new superhero
router.post('/:id', (req, res) => {
	req.body.ready = req.body.ready === 'on' ? true : false
	req.body.owner = req.session.userId
	console.log('create route', req.body)
	Superhero.create(req.body)
		.then(superhero => {
				res.redirect('/superheroapp/favorites')
		})
		.catch(error => {
				res.redirect(`/error?error=${error}`)
		})
	})
	
// show route -> index that shows the superhero selected and renders the show page
router.get('/:id', (req, res) => {
	console.log('PARAMS', req.params.id)
	fetch(`https://akabab.github.io/superhero-api/api/id/${req.params.id}.json`)
		.then(jsonData => {
			const superhero = jsonData.json()
		.then(superhero => {
				console.log('LOOK AT THIS', superhero)
				res.render('superhero/show', { superhero: superhero })
			})
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

	
// delete route
router.delete('/:id', (req, res) => {
	Superhero.findByIdAndDelete(req.params.id)
		.then(
			res.redirect(`/superheroapp/favorites`)
		)
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
	})

// Export the Router
module.exports = router
