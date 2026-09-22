const conatiner = document.getElementById('container')
const registerbtn = document.getElementById('register');
const loginbtn = document.getElementById('login');

registerbtn.addEventListener('click',()=>{
    conatiner.classList.add("active");
})

loginbtn.addEventListener('click',()=>{
    conatiner.classList.remove("active");
})
