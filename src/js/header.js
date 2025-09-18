if (!customElements.get("header-element")) {

class Header extends HTMLElement{
  constructor(){
    super();
    const template = $("#show-header").get(0)
    this.appendChild(template.content.cloneNode(true))
  }
  connectedCallback(){
    this.alertShowFunction()
    this.showNavbarFunction()
    this.searchByName()
    this.logOutFunction()
    this.checkUser()
    this.getCurrentPage()
  }
  async checkUser(){
    const log = localStorage.getItem("log");
    if(!log){

          window.location.replace('../html/login.html');

    }
  }
  getCurrentPage(){
    const currentPath = window.location.pathname.split('/').pop().replace('.html', '');
    $(".header-title").text(currentPath.charAt().toUpperCase()+currentPath.slice(1))
  }
  logOutFunction(){
    $(".log-out").click(()=>{
      localStorage.removeItem("log")
          window.location.replace('../html/login.html');

    })
  }
  searchByName(){
    $(document).on("click", ".result-close", function () {
  $("#student_name_search_modal").modal("hide");
});
  function capitalizeFirstLetter(str) {
  if (!str) return ""; // Handle empty or null strings
  return str.charAt(0).toUpperCase() + str.slice(1);
}
    $(".name-search").on("submit",function(e){
      e.preventDefault()
      const searchValue = capitalizeFirstLetter($(this).find("input").val().trim());
      console.log(searchValue);
      
  if (searchValue) {
    $.ajax({
      url:"https://dev-api.humhealth.com/StudentManagementAPI/students/list",
      type:"POST",
      contentType:"application/json",
      dataType:"json",
      data:JSON.stringify({
            isActive: null,
            isHosteller: false,
            isDayScholar: false,
            searchBy:"fullName",
            searchValue:searchValue,
            start: 0,
            length: 10
          }),
        success:function(response){
          console.log("created--->",response.data[0])
          if(response.status==="success"){
                const data = response.data[0]
                $(".result-name").text(`${data.firstName} ${data.lastName}`)
                $(".result-class").text(data.studentClass)
                $(".result-id").text(data.id)
                $(".result-mail").text(data.studentEmail)
                if(data.activeStatus==="A"){
                  $(".result-status").addClass("bg-success")
                  $(".result-status").text("Active")
                }
                else{
                  $(".result-status").addClass("bg-success")
                  $(".result-status").text("Inactive")

                }

          }
        }
    })
  }
  if($(".result-name").text()!==""){
      $("#student_name_search_modal").modal("show");
      $("#name_input").val("")

  }
    })
  }
  alertShowFunction(){
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
  }
  showNavbarFunction() {
  const nav = $(".nav-custom");
  const main = $("main");

  // Hover effect (only if nav is open)
  nav.on("mouseover", () => {
    if (nav.hasClass("open")) {
      main.addClass("wide");
    }
  });

  nav.on("mouseleave", () => {
    main.removeClass("wide");
  });

  // Click toggle
  $(".show-nav").on("click", () => {
    nav.toggleClass("open");
    $(".menu").toggleClass("fa-bars")
    $(".menu").toggleClass("fa-xmark")
    main.toggleClass("shifted");
  });
}
}
customElements.define("header-element", Header);

}