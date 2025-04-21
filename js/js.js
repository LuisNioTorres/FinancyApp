import { App } from './app.js'; 

const boton_open = document.querySelector('#check');
const index = document.querySelector('.index');
const navbar = document.querySelector('.navbar');
const boton_close = document.querySelector('.check_close');
const home = document.querySelector('.home');
const options = document.querySelectorAll('.option');
const options_transacciones = document.querySelectorAll('.atajos__div');

let expresiones_tecla = {
    nombre_transaccion: /^[a-zA-Z0-9_ ]+$/,
    monto_transaccion : /^[0-9.]$/
}

let expresiones_input = {
    nombre_transaccion: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,\-()]+$/,
    monto_transaccion: /^[0-9,\.]+$/,
    fecha_transaccion: /^\d{4}-\d{2}-\d{2}$/
};

const validaciones = {
    nombre_transaccion : false,
    monto_transaccion : false,
    fecha_transaccion : false
}



class UI {

    static mostrarNavbar (activadores = [check,boton_close] ,elementos = [index,navbar]) {
        activadores.forEach((activador)=> {
            activador.addEventListener('click', () => {
                elementos.forEach((elemento) => Navbar.toggleClassNavbar(elemento,'active'));
            })
        })
    }

    static mostrarIndex (options) {
        Navbar.toggleStyleOption(options);

        options.forEach((option)=>{
            option.addEventListener('click', async ()=>{
                 const page = option.querySelector('p').textContent;

                 /***** AWAIT ES IMPORTANTE? 
                 await UI.cargarHtml(home,page).then(()=>{
                    const options_transacciones = document.querySelectorAll('.option_transaccion');
                    console.log("EXISTE??",options_transacciones);
                 });

                 /*/
                await UI.cargarHtml(home,page);
                const options_transacciones = document.querySelectorAll('.option_transaccion');
                Transacciones.mostrarFormulario(options_transacciones);

                })
        })
    } 

    static async cargarHtml (div,page) {
        try{
            const response = await fetch(`${page}.html`)
            if(!response.ok) throw new Error("ERROR, NO SE ENCONTRO LA PAGINA!");
            const html = await response.text();
            div.innerHTML = html;
        } catch (error) {
            console.log(error)
        }
    }

}


class Navbar {

    static toggleClassNavbar (navbar,estado) {
        navbar.classList.toggle(estado);
    }

    static toggleStyleOption (options) {
        function removeAllActive(options){
            options.forEach((option)=>option.classList.remove('active'));
        }

        options.forEach((option)=>{
            option.addEventListener('click', () => {
                removeAllActive(options);
                option.classList.add('active');
            })
        })
    }
}


class Transacciones {
    static mostrarFormulario (options_transacciones) {
        options_transacciones.forEach((transaccion) => {
            transaccion.addEventListener('click', async () => {
                await UI.cargarHtml(home,`formulario`);
                const inputs = document.querySelectorAll('.input');
                const fecha = document.querySelector('#fecha_transaccion');
                const boton_enviar = document.querySelector('.boton_enviar');
                Formulario.aplicarValidacion(inputs);
                Formulario.enviarFormulario(boton_enviar,inputs);

            })
        })
    }

}

class Formulario {
    static aplicarValidacion (inputs) {
        inputs.forEach(input => {
            if(input.name=="monto_transaccion"){
                input.addEventListener('keyup',()=>Formulario.mostrarMoneda(input));
            }

            input.addEventListener('keydown', (e) =>  {
            Formulario.validarTecla(e,expresiones_tecla[input.name])
            })
        });
    }

    static mostrarMoneda(input) {
        //Permitir solo Numeros o punto.
        let value = input.value.replace(/[^0-9.]/g,'');

        //Separar el value donde haya un punto.

        let partes = value.split('.');

        //Permitir un solo punto .
        if(partes.length>2){
            value = partes[0] + '.' + partes[1];
        }

        //Separar el value en parte ENTERA y DECIMAL
        let[entera,decimal] = value.split('.');

        //Convertir la parte entera en MONEDA US
        entera = Number(entera).toLocaleString('en-US');


        //Si decimal es indefinico, simplemente queda la parte entera,
        //Si hemos colocado decimal, puesto mostramos ENTERA.DECIMAL
        input.value = decimal==undefined? entera : entera+'.'+decimal;
    }

    static validarTecla (event,expresion) {
        const valueKey = event.key;

        if(valueKey=='Backspace' || valueKey.length>1) return;

        if(!expresion.test(valueKey)) event.preventDefault();

    }

    static enviarFormulario (boton_enviar,inputs) {
        boton_enviar.addEventListener('click', (e) => {
            e.preventDefault();
            inputs.forEach(input=> Formulario.validarInputs(input,expresiones_input[input.name]));
            if(validaciones.fecha_transaccion == true &&
               validaciones.monto_transaccion == true &&
               validaciones.fecha_transaccion == true
            ) {
                Formulario.mostrarMensaje('.formulario__mensaje_exito','active',600);
                inputs.forEach((input)=>{
                    input.classList.add('exito')
                    setTimeout(()=>{
                        input.classList.remove('exito')
                    },600)
                })

            } else {
                Formulario.mostrarMensaje('.formulario__mensaje_error','active',900);
                
            }
        })
    }

    static mostrarMensaje (clase,estado,tiempo) {
        const mensaje = document.querySelector(clase);
        mensaje.classList.add(estado);
        setTimeout(()=>{
            mensaje.classList.remove(estado)
        },tiempo)
    }
   
    static validarInputs(input,expresion){
        validaciones[input.name] = expresion.test(input.value) ? true : false;
        //Modificar los Colores de los inputs correctos o incorrectos
        if(!expresion.test(input.value)){
            input.classList.add('active')
            setTimeout(()=>{
                input.classList.remove('active');
            },600)
        } else {
            input.classList.remove('active');
        }
    }

}


UI.mostrarNavbar([boton_open,boton_close],[index,navbar]);
UI.mostrarIndex(options);
Transacciones.mostrarFormulario(options_transacciones);
