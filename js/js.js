const check = document.querySelector('#check');
const index = document.querySelector('.index');

check.addEventListener('click', () => {
    console.log("");
    index.classList.toggle('active');
})