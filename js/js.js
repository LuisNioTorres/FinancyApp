const check = document.querySelector('#check');
const index = document.querySelector('.index');
const navbar = document.querySelector('.navbar');
const boton_close = document.querySelector('.check_close');

boton_close.addEventListener('click',()=>{
    index.classList.add('active');
    navbar.classList.add('active');
})

check.addEventListener('click', () => {
    index.classList.remove('active');
    navbar.classList.remove('active');
})
