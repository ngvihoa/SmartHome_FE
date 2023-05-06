
let btn = document.querySelector('#menu-btn');
let sidebar = document.querySelector('.sidebar');

btn.onclick = ()=>{
    sidebar.classList.toggle('active');
}