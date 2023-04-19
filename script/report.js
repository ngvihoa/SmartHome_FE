
// let a = Date();
// console.log(a);

let listLi = document.querySelectorAll('.report-topic > ul li');

listLi.forEach((e)=>{
    e.addEventListener("click", ()=>{
        listLi.forEach((i)=>{
            i.classList.remove('aim');
        }, 100);
        e.classList.add('aim');
    })
}, 100);

