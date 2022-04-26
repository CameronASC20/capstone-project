// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')
const Comment = require('./comment')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const basketballSchema = new Schema(
	{
		player: { type: Object },
		team: { type: Object },
		pts: { type: Number },
		reb: { type: Number },
		stl: { type: Number },
		ast: { type: Number },
		blk: { type: Number, },
		dreb: { type: Number },
		fg3_pct: { type: Number },
		fg3a: { type: Number },
		fg3m: { type: Number },
		fg_pct: { type: Number },
		fga: { type: Number },
		fgm: { type: Number },
		ft_pct: { type: Number },
		fta: { type: Number },
		oreb: { type: Number },
		turnover: { type: Number },
		comments: [{ 
			type: Schema.Types.ObjectID,
			ref: 'Comment',
		 }],
		owner: {
			type: Schema.Types.ObjectID,
			ref: 'User',
		}
	},
	{ timestamps: true }
)

const Basketball = model('Basketball', basketballSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Basketball
