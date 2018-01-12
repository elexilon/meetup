var Meetup = require("meetup")
var mup = new Meetup()
var app = require('express')()
var server = require('http').Server(app)
var io = require('socket.io')(server)

server.listen(3002)

let topicsCounter = {}

io.on('connection', socket => {
  console.log('got connection')
  meetupTop10([])
});

mup.stream("/2/rsvps", stream => {
  stream
    .on("data", item => {
      const topicNames = item.group.group_topics.map(topic => topic.topic_name)

      if(topicNames.indexOf('Software Development') < 0)
      {
        return
      }
      meetupTop10(topicNames)

    }).on("error", e => {
       console.log("error! " + e)
    });
});

function meetupTop10(topicNames) {



    topicNames.forEach(name => {
      if (topicsCounter[name]) {
        topicsCounter[name]++
      }
      else {
        topicsCounter[name] = 1
      }
    })

  //console.log(topicsCounter)
  const arrayOfTopics = Object.keys(topicsCounter)
  arrayOfTopics.sort((topicA, topicB) => {
    if (topicsCounter[topicA] > topicsCounter[topicB]) {
      return -1
    }
    else if (topicsCounter[topicB] > topicsCounter[topicA]) {
      return 1
    }
    else {
      return 0
    }
  })
  const mapedTopics = arrayOfTopics.map((topic) => {
    return { topic: topic, count: topicsCounter[topic] }
  })
  const top10 = mapedTopics.slice(0,10)
  io.emit('action', top10)
  console.log(top10)
}
