$(document).ready(()=>{
    const currentPath = window.location.pathname.split('/').pop(); // Gets the filename like "teachers.html"
    console.log(currentPath);
    const navLinks = document.querySelectorAll('#nav_drop a');
    navLinks.forEach(link => {
      const linkPath = link.getAttribute('href').split('/').pop();
      console.log("current path : ",linkPath);
      if (linkPath === currentPath) {
        console.log("ans : ",linkPath);
        
        link.classList.add('active-nav');
        // $(".active-link").css({'color':'#e94040ff'})
      } else {
        link.classList.remove('active-nav');
      }
    });
    $('#logout').click(()=>{
      alert('click')
      $("#log_out_modal").modal('show')
    })
    
})