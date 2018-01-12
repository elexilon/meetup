var Meetup = require("meetup")
var mup = new Meetup()

let topicsCounter = {}

mup.stream("/2/rsvps", stream => {
  stream
    .on("data", item => {
      //console.log("got item " + item)

      // inside of our stream event handler (!) we retrieve the group topics
      const topicNames = item.group.group_topics.map(topic => topic.topic_name)

      const containSofware = topicNames.filter((topic_name) => {
        return topic_name === 'Software Development'
      })
      
      if(containSofware.length > 0)
      {
        topicNames.forEach(name => {
          if (topicsCounter[name]) {
            topicsCounter[name]++
          }
          else {
            topicsCounter[name] = 1
          }
        })
      }
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
      console.log(mapedTopics.slice(0,10))

    }).on("error", e => {
       console.log("error! " + e)
    });
});