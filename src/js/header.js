$(document).ready(() => {
  $(".alert").hover(
    function () { // mouse enters
      $(this).find(".dropdown-menu").stop(true, true).fadeIn(200);
    },
    function () { // mouse leaves
      $(this).find(".dropdown-menu").stop(true, true).fadeOut(200);
    }
  );
  $(".user").click(()=>{
    $('.top-100').toggle()
  })
});
