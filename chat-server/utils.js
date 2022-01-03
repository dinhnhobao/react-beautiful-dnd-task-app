const getRandomString = () => { // returns a random string of length 5
    return Math.random().toString(36).substr(2, 5);
}

module.exports = { getRandomString }