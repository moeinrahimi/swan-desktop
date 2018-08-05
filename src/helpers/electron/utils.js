const isDesktop = () =>{
  var userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf(' electron/') > -1) {
      return true 
    }
    return false 
}
export  {
  isDesktop
}