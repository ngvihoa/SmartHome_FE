
const imgg = document.querySelectorAll("#imgg");

const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
        entry.target.classList.toggle('float', entry.isIntersecting)
    })
})

imgg.forEach(img=>{

    observer.observe(img)
})