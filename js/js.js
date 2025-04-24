import { Transaccion, Store } from './app.js';

const boton_open = document.querySelector('#check');
const index = document.querySelector('.index');
const navbar = document.querySelector('.navbar');
const boton_close = document.querySelector('.check_close');
const home = document.querySelector('.home');
const options = document.querySelectorAll('.option');
const options_transacciones = document.querySelectorAll('.atajos__div');
const balance_total = document.querySelector('.balance_total');
const ingreso_total = document.querySelector('.ingreso_total');
const gasto_total = document.querySelector('.gasto_total');
const ahorro_total = document.querySelector('.ahorro_total')

let expresiones_tecla = {
    nombre_transaccion: /^[a-zA-Z0-9_ ]+$/,
    monto_transaccion: /^[0-9.]$/
}

let expresiones_input = {
    nombre_transaccion: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,\-()]+$/,
    monto_transaccion: /^[0-9,\.]+$/,
    fecha_transaccion: /^\d{4}-\d{2}-\d{2}$/
};

const validaciones = {
    nombre_transaccion: false,
    monto_transaccion: false,
    fecha_transaccion: false
}


class UI {

    static mostrarTotales2() {
        let info = Store.getTransacciones();
        let total_ingreso = info.reduce((acum, item) => {
            if (item.tipo == 'INGRESO') {
                console.log(item);
                return acum += Number(item.monto); //Solo haz el calculo si el tipo es INGRESO
            }
            return acum; //Devuelve el Acumulador para la siguiente iteracion, o para return final en total_ingreso
        }, 0)

        let gasto_total = info.reduce((acum, item) => {
            if (item.tipo == 'GASTO') {
                console.log(item);
                return acum += Number(item.monto);
            }
            return acum;
        }, 0)

        let ahorro_total = info.reduce((acum, item) => {
            if (item.tipo == 'AHORRO') {
                console.log(item);
                return acum += Number(item.monto);
            }
            return acum;
        }, 0)

        console.log("INGRESO:", total_ingreso);
        console.log("GASTO:", gasto_total);
        console.log("AHORRO:", ahorro_total);


    }

    static calcularTotales() {
        let info = Store.getTransacciones();
        const res = info.reduce((acum, transaccion) => {
            switch (transaccion.tipo) {
                case 'INGRESO':
                    acum.ingreso += Number(transaccion.monto.replace(/[,]/g,''));
                    break;
                case 'GASTO':
                    acum.gasto += Number(transaccion.monto.replace(/[,]/g,''));
                    break;
                case 'AHORRO':
                    acum.ahorro += Number(transaccion.monto.replace(/[,]/g,''));
            }
            return acum;
        }, { ingreso: 0, gasto: 0, ahorro: 0 })
        //let {ingreso,gasto,ahorro} = res; //SE DEBE DEVOLVER EL OBJETO, Y CUANDO LO VAYA A USAR, DESTRUCTURARLO
        return res;
    }

    static modificarContent(ingreso, gasto, ahorro, totales) {
        ingreso.textContent = '$ ' + totales.ingreso;
        gasto.textContent = '$ ' + totales.gasto;
        ahorro.textContent = '$ ' + totales.ahorro;
    }

    static calcularBalance(totales) {
        return totales.ingreso - totales.gasto - totales.ahorro;
    }

    static showTotales(balance, ingreso, gasto, ahorro) {
        UI.modificarContent(ingreso, gasto, ahorro, UI.calcularTotales());
        let balance_total = UI.calcularBalance(UI.calcularTotales());
        balance.textContent = '$ ' + balance_total;
    }

    static mostrarNavbar(activadores = [check, boton_close], elementos = [index, navbar]) {
        activadores.forEach((activador) => {
            activador.addEventListener('click', () => {
                elementos.forEach((elemento) => Navbar.toggleClassNavbar(elemento, 'active'));
            })
        })
    }

    static mostrarIndex(options) {
        Navbar.toggleStyleOption(options);

        options.forEach((option) => {
            option.addEventListener('click', async () => {
                const page = option.querySelector('p').textContent;
                await UI.cargarHtml(home, page);
                UI.mostrarTransacciones();
                const options_transacciones = document.querySelectorAll('.option_transaccion');
                Transacciones.mostrarFormulario(options_transacciones);

            })
        })
    }

    static async cargarHtml(div, page) {
        if (page == 'Home') {
            location.href = 'index.html';
        }
        try {
            const response = await fetch(`${page}.html`)
            if (!response.ok) throw new Error("ERROR, NO SE ENCONTRO LA PAGINA!");
            const html = await response.text();
            div.innerHTML = html;
        } catch (error) {
            console.log(error)
        }
    }

    static mostrarTransacciones() {
        const lista_transacciones = document.querySelector('.lista_transacciones');
        let basket = Store.getTransacciones();
        basket.sort((a,b)=> new Date(b.fecha)- new Date(a.fecha));
        //console.log("SE ORDENO",reciente_antigua);
        lista_transacciones.innerHTML = basket.map((transaccion) => {
            let meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
            let fecha = new Date(transaccion.fecha);
            let dia = fecha.getDate();
            let mes = fecha.getMonth();
            let año = fecha.getFullYear();
            if(transaccion.tipo!=='AHORRO'){
                let icono = transaccion.tipo == 'INGRESO' ? "ingreso.png" : "gasto.png";
            return `<li>
                 <div class="persona">
                                        <img width="25" src="/imagenes/${icono}" alt="">
                                        <h2>${transaccion.nombre}</h2>
                                    </div>
                                    <div class="info">
                                        <h2>${transaccion.tipo == 'INGRESO' ? "+" : "-"} $${transaccion.monto}</h2>
                                        <p>${dia} ${meses[mes]} ${año}</p>
                                    </div>
            </li>
            `
            }
        }).join("");
    }

    static mostrarAhorros() {
        const lista_ahorros = document.querySelector('.lista_ahorros');
        let basket = Store.getTransacciones();
        lista_ahorros.innerHTML = basket.map((transaccion) => {
            if (transaccion.tipo == 'AHORRO') {
                return `
                                <li style="--color: gray">
                                    <p>${transaccion.nombre}</p>
                                    <h2>$ ${transaccion.monto}</h2>
                                </li>
                                
                `
            }
        }).join("")
    }

    static mostrarRecord() {
        const lista_record = document.querySelector('.lista_record');
        let basket = Store.getTransacciones();
        //Ordenar Basket de Mayor a Menor segun el MONTO
        let mayor_menor = basket.sort((a, b) => b.monto - a.monto);
        lista_record.innerHTML = mayor_menor.map((transaccion) => {
            let color = transaccion.tipo == 'INGRESO'? "rgb(37, 190, 37)" : transaccion.tipo == 'GASTO'? "rgb(236, 109, 109)" : "gray";
            return `
                    <li style="--color : ${color}">
                        <p>${transaccion.nombre}</p>
                            <h2>${transaccion.monto}</h2>
                    </li>
            `
        }).join('')

    }

}


class Navbar {

    static toggleClassNavbar(navbar, estado) {
        navbar.classList.toggle(estado);
    }

    static toggleStyleOption(options) {
        function removeAllActive(options) {
            options.forEach((option) => option.classList.remove('active'));
        }

        options.forEach((option) => {
            option.addEventListener('click', () => {
                removeAllActive(options);
                option.classList.add('active');
            })
        })
    }
}


class Transacciones {
    static mostrarFormulario(options_transacciones) {
        options_transacciones.forEach((transaccion) => {
            transaccion.addEventListener('click', async () => {
                await UI.cargarHtml(home, `formulario`);
                const inputs = document.querySelectorAll('.input');
                const fecha = document.querySelector('#fecha_transaccion');
                const boton_enviar = document.querySelector('.boton_enviar');
                Formulario.aplicarValidacion(inputs);
                Formulario.enviarFormulario(boton_enviar, inputs);

            })
        })
    }

}

class Formulario {
    static aplicarValidacion(inputs) {
        inputs.forEach(input => {
            if (input.name == "monto_transaccion") {
                input.addEventListener('keyup', () => Formulario.mostrarMoneda(input));
            }

            input.addEventListener('keydown', (e) => {
                Formulario.validarTecla(e, expresiones_tecla[input.name])
            })
        });
    }

    static mostrarMoneda(input) {
        //Permitir solo Numeros o punto.
        let value = input.value.replace(/[^0-9.]/g, '');

        //Separar el value donde haya un punto.

        let partes = value.split('.');

        //Permitir un solo punto .
        if (partes.length > 2) {
            value = partes[0] + '.' + partes[1];
        }

        //Separar el value en parte ENTERA y DECIMAL
        let [entera, decimal] = value.split('.');

        //Convertir la parte entera en MONEDA US
        entera = Number(entera).toLocaleString('en-US');


        //Si decimal es indefinico, simplemente queda la parte entera,
        //Si hemos colocado decimal, puesto mostramos ENTERA.DECIMAL
        input.value = decimal == undefined ? entera : entera + '.' + decimal;
    }

    static validarTecla(event, expresion) {
        const valueKey = event.key;

        if (valueKey == 'Backspace' || valueKey.length > 1) return;

        if (!expresion.test(valueKey)) event.preventDefault();

    }

    static enviarFormulario(boton_enviar, inputs) {
        boton_enviar.addEventListener('click', (e) => {
            e.preventDefault();
            inputs.forEach(input => Formulario.validarInputs(input, expresiones_input[input.name]));
            const nombre_transaccion = document.querySelector('#nombre_transaccion');
            const tipo_transaccion = document.querySelector('#tipo_transaccion');
            const monto_transaccion = document.querySelector('#monto_transaccion');
            const fecha_transaccion = document.querySelector('#fecha_transaccion');

            if (validaciones.fecha_transaccion == true &&
                validaciones.monto_transaccion == true &&
                validaciones.fecha_transaccion == true
            ) {
                Formulario.mostrarMensaje('.formulario__mensaje_exito', 'active', 600);
                inputs.forEach((input) => {
                    input.classList.add('exito')
                    setTimeout(() => {
                        input.classList.remove('exito')
                    }, 600)
                })

                Store.setTransacciones(new Transaccion(nombre_transaccion.value,
                    tipo_transaccion.value,
                    monto_transaccion.value,
                    fecha_transaccion.value
                ))
            } else {
                Formulario.mostrarMensaje('.formulario__mensaje_error', 'active', 900);

            }
        })
    }

    static mostrarMensaje(clase, estado, tiempo) {
        const mensaje = document.querySelector(clase);
        mensaje.classList.add(estado);
        setTimeout(() => {
            mensaje.classList.remove(estado)
        }, tiempo)
    }

    static validarInputs(input, expresion) {
        validaciones[input.name] = expresion.test(input.value) ? true : false;
        //Modificar los Colores de los inputs correctos o incorrectos
        if (!expresion.test(input.value)) {
            input.classList.add('active')
            setTimeout(() => {
                input.classList.remove('active');
            }, 600)
        } else {
            input.classList.remove('active');
        }
    }

}


UI.mostrarNavbar([boton_open, boton_close], [index, navbar]);
UI.mostrarIndex(options);
Transacciones.mostrarFormulario(options_transacciones);
UI.showTotales(balance_total, ingreso_total, gasto_total, ahorro_total);
UI.mostrarTransacciones();
UI.mostrarAhorros();
UI.mostrarRecord();

export {UI}