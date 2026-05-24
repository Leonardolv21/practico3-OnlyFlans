module.exports = app => {
    require('./auth.routes')(app);
    require('./creator.routes')(app);
    require('./post.routes')(app);
    require('./donation.routes')(app);
    require('./follower.routes')(app);
}
