import React from 'react';
import config from '../../constants/config'
import defaultImage from '../../assets/img/default.jpg'
const Image = (props =>{
  return ( 
    <img src={props.image   ? config.baseURL  + props.image : defaultImage}/>
 ) 
})
export default Image 