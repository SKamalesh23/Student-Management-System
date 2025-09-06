$(document).ready(()=>{
    $("nav").load('../components/nav.html')
    $("header").load("../components/header.html")
    $("#save_holiday").click(()=>{
        $(".save-holidays").slideToggle()
    })
    $(document).on('click','#add_holiday',function(){
        $(".holiday-form").after(` <form class="d-flex gap-5 pt-4 save-h">

            <div class="form-group">
                <label for="" class="form-label">Enter Date</label>
                <input type="date" class="form-control e-date">
            </div>
            <div class="form-group">
                <label for="" class="form-label">Enter Reason</label>
                <input type="text" class="form-control e-reason">
            </div>
            <div class="form-group d-flex gap-4 align-items-center pt-4">
            <button type="button" class="btn btn-second" id="add_holiday" style="height:40px">ADD</button>
            <button type="button" class="btn" id="remove_holiday"><i class="fa-solid fa-trash text-secondary" role="button"></i></button>
            </div>

           
        </form>`)
    })
 
    
    
})
   $(document).on('click', '#remove_holiday', function () {
    $(this).closest("form").remove();
});
$(document).on('click',"#save_button",function(){
    const ar = $(".save-h").find('.form-group').find('input');
    console.log(ar);
    
})