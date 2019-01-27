import config from '../../constants/config'
import {searchLocal} from '../../helpers/electron/ipcRequests'

const axios = require('axios')

const search = async (q) => {
  try {
  let { data } = await axios(config.baseURL + `albums/search?query=${q}`)
    return data.result
  } catch (error) {
    console.log(error)
  }
}



const searchEverything = async(q)=>{
  try{
    let data = await Promise.all([search(q), searchLocal(q)]).catch(e => console.log(e, 'search err'))
    data  = data.filter(r=>{
      return r != undefined
    })
    data = [].concat(...data)
    console.log(data)
    return data
  }catch(e){
    console.log(e,'searchEverything func')
  }
}

  export default{searchEverything}