$(document).ready(()=>{
    $('button').click((event)=>{
        const user = $('#username').val()
        const pass = $('#password').val()
        let user_reg = /^[a-z]{8,20}$/
        let pass_reg = /^[A-Za-z]([a-zA-Z0-9@&%$]{8,16})$/gm;
        const user_regex = user_reg.test(user)
        const pass_regex = pass_reg.test(pass)
        $(".span").text("")
        
        if(user.length === 0){
            $("#username").after("<span class='span'>Username is required</span>")

        }
        else if(!user_regex){
            $("#username").after("<span class='span'>Incorrect Username</span>")
        }
        if(pass.length===0){
            $(".err-pass").after("<span class='span'>Password is required</span>")

        }
        else if(!pass_regex){
            $(".err-pass").after("<span class='span'>Incorrect Password</span>")
        }
        $(".span").css('color','red')
        if(user && pass && user_regex && pass_regex){
        $(".span").text("")
        $(".modal").show()
        setTimeout(()=>{
            window.location.href="dashboard.html"
        },1000)

            
        }
        else{
            console.log(user && pass && user_regex && pass_regex)
        }
    })
})

$(document).on("click",".eye",()=>{
    const input = $("#password");

    if (input.attr("type") === "password") {
      input.attr("type", "text"); // show password
      $(this).removeClass("fa-eye").addClass("fa-eye-slash");
    } else {
      input.attr("type", "password"); // hide password
      $(this).removeClass("fa-eye-slash").addClass("fa-eye");
    }

})