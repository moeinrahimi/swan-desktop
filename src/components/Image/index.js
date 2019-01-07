import React from 'react';
import config from '../../constants/config'
import defaultImage from '../../assets/img/default.jpg'
const Image = (props =>{
  let image = config.baseURL  + props.image
  if(props.image && props.image.length > 100){
    image = 'data:image/jpeg;base64,' + props.image 
  }
  return ( 
    < img src ="http://localhost:8080/birth.jpg" 
    />
    // <img src={props.image   ?  image  : defaultImage}/>
 ) 
})
export default Image 