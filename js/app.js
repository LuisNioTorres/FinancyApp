class Transaccion {
    constructor(nombre,tipo,monto,fecha){
        this.nombre = nombre,
        this.tipo = tipo,
        this.monto = monto,
        this.fecha = fecha
    }
}

class Store {
    static getTransacciones () {
        let basket = [];
        return localStorage.getItem('transaccion')==null? basket : JSON.parse(localStorage.getItem('transaccion'));
    }

    static setTransacciones (transaccion) {
        let basket = Store.getTransacciones();
        basket.push(transaccion);
        localStorage.setItem('transaccion',JSON.stringify(basket))
    }
}

export {Transaccion,Store}
