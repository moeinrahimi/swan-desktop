import {notify as notifier} from 'react-notify-toast';
const notify = (msg,type='success')=>{
  notifier.show(msg,type)
}
export {
  notify 
}