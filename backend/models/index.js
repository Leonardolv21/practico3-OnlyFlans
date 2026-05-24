const { sequelize } = require('../config/db.config');

const user = require('./user.model')(sequelize);
const post = require('./post.model')(sequelize);
const creatorInteraction = require('./creatorInteraction.model')(sequelize);
const donation = require('./donation.model')(sequelize);
const comment = require('./comment.model')(sequelize);
const goal = require('./goal.model')(sequelize);

user.hasMany(post, { foreignKey: 'creator_id', as: 'createdPosts' });
post.belongsTo(user, { foreignKey: 'creator_id', as: 'creator' });

user.hasMany(donation, { foreignKey: 'follower_id', as: 'sentDonations' });
user.hasMany(donation, { foreignKey: 'creator_id', as: 'receivedDonations' });
donation.belongsTo(user, { foreignKey: 'follower_id', as: 'follower' });
donation.belongsTo(user, { foreignKey: 'creator_id', as: 'creator' });

post.hasMany(comment, { foreignKey: 'post_id', as: 'comments' });
comment.belongsTo(post, { foreignKey: 'post_id', as: 'post' });
user.hasMany(comment, { foreignKey: 'follower_id', as: 'writtenComments' });
comment.belongsTo(user, { foreignKey: 'follower_id', as: 'follower' });
user.hasMany(comment, { foreignKey: 'creator_id', as: 'receivedComments' });
comment.belongsTo(user, { foreignKey: 'creator_id', as: 'creator' });

user.hasMany(creatorInteraction, { foreignKey: 'follower_id', as: 'interactionsAsFollower' });
user.hasMany(creatorInteraction, { foreignKey: 'creator_id', as: 'interactionsAsCreator' });
creatorInteraction.belongsTo(user, { foreignKey: 'follower_id', as: 'follower' });
creatorInteraction.belongsTo(user, { foreignKey: 'creator_id', as: 'creator' });

user.belongsToMany(user, {
    through: {
        model: creatorInteraction,
        unique: false,
        scope: { type: 'following' }
    },
    foreignKey: 'follower_id',
    otherKey: 'creator_id',
    as: 'followedCreators'
});

user.hasMany(goal, { foreignKey: 'creator_id', as: 'goals' });
goal.belongsTo(user, { foreignKey: 'creator_id', as: 'creator' });

module.exports = {
    user,
    post,
    creatorInteraction,
    donation,
    comment,
    goal,
    sequelize,
    Sequelize: sequelize.Sequelize
}
