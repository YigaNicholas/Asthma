
import { useEffect } from "react";

function Upper() {

   fetch('https://api.thingspeak.com/channels/3006338/feeds.json?api_key=YK2YQ9UJCEPUF1X1&results=2')
   .then(res=>res.json())
   .then(data=>{
    const results =data.feeds.map(feed=>{
        console.log('field1 :' ,feed.field1)
    })
    
   })

}
export default Upper;