////////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////////
const express = require('express')
const mongoose = require('mongoose')

// we need our Fruit MODEL because comments are ONLY a schema
// so we'll run queries on fruits, and add in comments
const Basketball = require('../models/basketball')
const Comment = require('../models/comment')
////////////////////////////////////////////
// Create router
////////////////////////////////////////////
const router = express.Router()

////////////////////////////////////////////
// Routes
////////////////////////////////////////////
// only need two routes for comments right now
// POST -> to create a comment
router.post('/:playerId', (req, res) => {
    const playerId = req.params.superId
    console.log('first comment body', req.body)
    
    // we'll adjust req.body to include an author
    // the author's id will be the logged in user's id
    req.body.author = req.session.userId
    console.log('updated comment body', req.body)
    // we'll find the superhero with the superId
    Comment.create({
        title: req.body.title,
        body: req.body.body,
        player: playerId,
        author: req.body.author
    })
    .then(comment => {
        console.log(comment)
        Basketball.findById(playerId)
        .then(player => {
            // then we'll send req.body to the comments array
            player.comments.push(comment._id)
            // save the superhero
            return player.save()
        })
        .then(player => {
            // redirect
            console.log(player)
            res.redirect(`/basketballapp/favorite/${player.id}`)
        })
    })
        // or show an error if we have one
        .catch(error => {
            console.log(error)
            res.send(error)
        })
})

// DELETE -> to destroy a comment
// we'll use two params to make our life easier
// first the id of the superhero, since we need to find it
// then the id of the comment, since we want to delete it
// router.delete('/delete/:fruitId/:commId', (req, res) => {
//     // first we want to parse out our ids
//     const superId = req.params.superId
//     const commId = req.params.commId
//     // then we'll find the superhero
//     Fruit.findById(superId)
//         .then(superhero => {
//             const theComment = superhero.comments.id(commId)
//             // only delete the comment if the user who is logged in is the comment's author
//             if ( theComment.author == req.session.userId) {
//                 // then we'll delete the comment
//                 theComment.remove()
//                 // return the saved superhero
//                 return superhero.save()
//             } else {
//                 return
//             }

//         })
//         .then(superhero => {
//             // redirect to the superhero show page
//             res.redirect(`/superheroapp/${superId}`)
//         })
//         .catch(error => {
//             // catch any errors
//             console.log(error)
//             res.send(error)
//         })
// })

////////////////////////////////////////////
// Export the Router
////////////////////////////////////////////
module.exports = router