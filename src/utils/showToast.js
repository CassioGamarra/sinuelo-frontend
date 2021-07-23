import { showToast } from '../components/Toasts';
import swal from 'sweetalert'; 

//Alerts que recebem como parametro o callback da api.
export const showSuccess = (cb) => showToast({
    type:"success",
    message: cb.data.message
});

export const showError = (cb) => showToast({
    type:"error",
    message: cb.data.message,
});

export const showWarning = (cb) => showToast({
    type:"warn",
    message:cb.data.message
});

export const showInfo = (cb) => showToast({
    type:"info",
    message:cb.data.message
});


//Não recebe como parâmetro o callback da api.
export const showMessage = ( type, message ) => showToast({
    type: type,
    message:message
});


//Swal Alerts
export const swalRegisterSuccess = (cb, msgButton) => swal({
    title: cb.data.title,
    text: cb.data.message,
    icon: "success",
    button: msgButton
});

export const swalRegisterError = (cb, msgButton) => swal({
    title: cb.data.title,
    text: cb.data.message,
    icon: "error",
    button: msgButton
})

export const swalRegisterWarning = (cb, msgButton) => swal({
    title: cb.data.title,
    text: cb.data.message,
    icon: "warning",
    button: msgButton
})
