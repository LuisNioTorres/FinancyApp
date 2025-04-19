const boton_open = document.querySelector('#check');
const index = document.querySelector('.index');
const navbar = document.querySelector('.navbar');
const boton_close = document.querySelector('.check_close');
const home = document.querySelector('.home');
const options = document.querySelectorAll('.option');
const options_transacciones = document.querySelectorAll('.atajos__div');


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
            transaccion.addEventListener('click', () => {
                UI.cargarHtml(home,`formulario`);
            })
        })
    }
}

UI.mostrarNavbar([boton_open,boton_close],[index,navbar]);
UI.mostrarIndex(options);
Transacciones.mostrarFormulario(options_transacciones);
/*/STYLES DE CADA BOTON Y MODIFICAR EL INDEX
options.forEach((option)=>{
    option.addEventListener('click', ()=>{
        options.forEach(o => o.classList.remove('active'));
        option.classList.add('active');

        const enlace = option.querySelector('p').textContent;

        fetch(`${enlace}.html`)
        .then(res => res.text()) // OJO: no es res.json(), porque es HTML plano
        .then(html => {
          home.innerHTML = html;
        });

    })
})
*/