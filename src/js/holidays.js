function clearDateFunction(){
    $(".e-date").val("")
          $(".e-reason").val("")
          $(".save-h").remove()
          $("#add_holiday").prop("disabled",false)
          $(".e-date").attr("data-id",holidayId)
          $("#save_button").text("Save Holiday")
          $("#add_holiday_modal").modal("hide")
}
const nav_path = "../components/nav.html"
$(".nav-custom").load(nav_path,()=>{
  const script = document.createElement("script")
  script.src="../js/nav.js";
  script.onload = () =>{
    $('.nav-custom').append("<custom-navbar></custom-navbar>")
  }
  document.body.appendChild(script)
})
const load_path = "../components/loader.html"
$("#loader").load(load_path,()=>{
  const script = document.createElement("script")
  script.src = "../js/loader.js"
  script.onload = () =>{
    $("#loader").append("<custom-loader></custom-loader>")
  }
  document.body.appendChild(script)

})
const custom = '../components/header.html';
$("#header").load(custom, () => {
  const script = document.createElement("script");
  script.src = "../js/header.js";
  script.onload = () => {
    $("#header").append("<header-element></header-element>");
  };
  document.body.appendChild(script);
});

$(document).ready(() => {
$(".datepicker").datepicker({
  dateFormat: "yy-mm-dd",
  appendTo: "#add_holiday_modal" 
});
  $("#save_holiday").click(() => {
    $("#save_button").text("Save Holiday")
    $("#add_holiday_modal").modal("show")
  });
  $(document).on("click", "#add_holiday", function () {
    $(".holiday-form").after(` <form class=" pt-4 save-h">

            <div class="form-group">
                <label for="" class="form-label">Enter Date</label>
                <input type="text" class="form-control e-date date" id="datepicker">
            </div>
            <div class="form-group">
                <label for="" class="form-label">Enter Reason</label>
                <input type="text" class="form-control e-reason">
            </div>
            <div class="form-group d-flex gap-4 align-items-center pt-4">
            <button type="button" class="btn" id="remove_holiday"><i class="fa-solid fa-trash text-secondary" role="button"></i></button>
            </div>

           
        </form>`);
       $(".datepicker").datepicker({
  dateFormat: "yy-mm-dd",
  appendTo: "#add_holiday_modal" // 👈 attach inside modal
});
  });
});
$(document).on("click", "#remove_holiday", function () {
  $(this).closest("form").remove();
});
$(document).on("click", "#save_button", function () {
  const dates = document.querySelectorAll(".e-date");
  const reasons = document.querySelectorAll(".e-reason");
  console.log(dates[0].value);
  console.log(reasons[0].value);
  const array = [];
  for (let x = 0; x < dates.length; x++) {
    const date_format = dates[x].value.split("-");
    let value = {
      holidayDate: `${date_format[1]}-${date_format[2]}-${date_format[0]}`,
      holidayReason: reasons[x].value,
      createdTeacherId: 7,
    };
    array.push(value);
  }
  console.log("array : ", JSON.stringify(array));
  if($("#save_button").text().trim()==="Save Holiday"){

    
  $.ajax({
    method: "POST",
    url: "https://dev-api.humhealth.com/StudentManagementAPI/holidays/save",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(array),
    success: function (response) {
      console.log("---->", response);
    if(response.status==="success"){
         Swal.fire({
        icon: "success",
        title: "Generated",
        text: "✅ " + response.data,
        showConfirmButton: false,
        timer: 2000,
      });
       for (let x = 0; x < dates.length; x++) {
        dates[x].value = "";
        dates[x].value = "";
        reasons[x].value = "";
      }
    }
    else{
         Swal.fire({
        icon: "warning",
        title: "Generated",
        text: "😊 " + response.data,
        showConfirmButton: false,
        timer: 2000,
      });
    }
     
     
      table.ajax.reload()
    },
    error: function () {
      Swal.fire({
        icon: "error",
        title: "Cant Upload Holiday",
        text: "🚫 Error",
        showConfirmButton: false,
        timer: 2000,
      });
    },
  });
  }
  else{
    const holidayId = $(".e-date").attr("data-id")
    const newArr = [{...array[0],holidayId:holidayId,updatedTeacherId:7}]
    console.log("newArr ---> ",newArr);
    
    $.ajax({
    method: "POST",
    url: "https://dev-api.humhealth.com/StudentManagementAPI/holidays/save",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(newArr),
    success: function (response) {
      console.log("---->", response);
    if(response.status==="success"){
         Swal.fire({
        icon: "success",
        title: "Generated",
        text: "✅ " + response.data,
        showConfirmButton: false,
        timer: 2000,
      });
       for (let x = 0; x < dates.length; x++) {
        dates[x].value = "";
        dates[x].value = "";
        reasons[x].value = "";
      }
       clearDateFunction()

    }
    else{
         Swal.fire({
        icon: "warning",
        title: "Generated",
        text: "😊 " + response.data,
        showConfirmButton: false,
        timer: 2000,
      });
    }
     
     
      table.ajax.reload()
    },
    error: function () {
      Swal.fire({
        icon: "error",
        title: "Cant Upload Holiday",
        text: "🚫 Error",
        showConfirmButton: false,
        timer: 2000,
      });
    },
  });
  }
  
});
$("#cancel_button").click(() => {
  const res_arr = [];
  const dates = document.querySelectorAll('.e-date');
  const reason1 = document.querySelector(".e-reason").value;

  dates.forEach(input => {
    if (input.value.trim() !== "") {   // check value, not element
      res_arr.push(input.value);
    }
  });

  console.log(res_arr);
    if(res_arr.length===0){
      if($(".err").length===0 ){
           $(".e-date").after(`
          <span class="text-danger err">Enter Date</span>
        `)
      }
        return
    }
    $.ajax({
        method:"POST",
        url:`https://dev-api.humhealth.com/StudentManagementAPI/holidays/cancel?reason=${reason1}&teacherId=7`,
        contentType:"application/json",
        dataType:'json',
        data:JSON.stringify(res_arr),
        success:function(response){
        Swal.fire({
        icon: "success",
        title: "Generated",
        text: "✅ " + response.data,
        showConfirmButton: false,
        timer: 2000,
      });
        $("#add_holiday_modal").modal("hide")
        $(".err").remove()
        table.ajax.reload()
        },
        error:function(xhr,statusText,error){

        }
    })
    
})

$("#add_holiday_modal").on("click",".btn-close",function(){
 $(".e-date").val("")
          $(".e-reason").val("")
          $("#add_holiday").prop("disabled",false)
          $(".e-date").attr("data-id",holidayId)
          $("#save_button").text("Save Holiday")
        })
// Initialize once
// $.ajax({
//     method:"POST",
//     url: `https://dev-api.humhealth.com/StudentManagementAPI/holidays/list?isCancelled=&year=&month=`,
//     contentType:'application/json',
//     dataType:'json',
//     success:function(response) {
        
//     }
// })
// let cancelled = $("#cancelled").val() || false
// let year = $("#year").val() || 2025
// let month = $("#month").val() || 9
// console.log("year->",year);
function getHolidayUrl() {
  let isCancelled = $("#cancelled");
  // isCancelled = isCancelled === "" ? isCancelled : isCancelled === "";
  isCancelled = isCancelled.length? isCancelled.val() : ""
 let month = $("#month").val() ? $("#month").val() : new Date().getMonth()+1;
let year  = $("#year").val()  ? $("#year").val()  : new Date().getFullYear();

  return `https://dev-api.humhealth.com/StudentManagementAPI/holidays/list?isCancelled=${isCancelled}&year=${year}&month=${month}`;
}

const table = $("#table").DataTable({
  sort: false,
  ajax: {
    type: "POST",
    url:getHolidayUrl(),
    contentType: "application/json",
    dataType: "json",
    // data: function () {
    //   let cancelledVal = $("#cancelled").val();
    //   return JSON.stringify({
    //     isCancelled: cancelledVal === "" ? null : cancelledVal === "true",
    //     year: $("#year").val(),
    //     month: $("#month").val(),
    //   });
    // },
    dataSrc: "data",
    error: function (xhr, status, error) {
      console.log("XHR Error:", xhr);
    },
  },
  dom: '<"dt-header d-flex justify-content-between"<"search-factor w-100 ">>< "d-flex w-100 justify-content-end" p>t<"d-flex justify-content-between"ip>',
  columns: [
      {
            title:"S.No",
            data:null,
          render: function (data, type, row, meta) {
    return meta.row + 1;
  }
          },
    { data: "holidayId", title: "Id" },
    { data: "holidayDate", title: "Date" },
    { data: "holidayReason", title: "Reason" },
    {
      title: "Status",
      data: null,
      render: function (data) {
        if (data.isHolidayCancelled === "N") {
          return `<div class="d-flex justify-content-center">
                    <div class="bg-sm text-success w-25 active-student" id="active"
                         style="background-color:#DCFCE7;border-radius:20px" role="button">Leave</div>
                  </div>`;
        } else {
          return `<div class="d-flex justify-content-center">
                    <div class="bg-sm text-danger w-50 active-student" id="inactive"
                         style="background-color:#FEE2E2;border-radius:20px" role="button">Cancelled</div>
                  </div>`;
        }
      },
    },
    {
        title:"Action",
        data:null,
        render:function(data){
            return `<i class="fa-solid fa-pen-to-square edit-holiday text-secondary" role="button" data-id="${data.holidayId}"></i>`
        }
    }
  ],
  initComplete: function () {
    $("#table").on("click",".edit-holiday",function(){
      function getDateFormat(dateStr){
        const datArr = dateStr.split("-")
        return `${datArr[2]}-${datArr[0]}-${datArr[1]}`
      }
      const holidayId = $(this).attr("data-id")
      $.ajax({
        url:`https://dev-api.humhealth.com/StudentManagementAPI/holidays/get?id=${holidayId}`,
        type:"GET",
        dataType:"json",
        success:function(response){
          console.log(response)
          $(".e-date").val(getDateFormat(response.data.holidayDate))
          $(".e-reason").val(response.data.holidayReason)
          $("#add_holiday").prop("disabled",true)
          $(".e-date").attr("data-id",holidayId)
          $("#save_button").text("Update Holiday")
          $("#add_holiday_modal").modal("show")

        }
      })
    })
    const months = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];
    $(document).on("change","select",()=>{
      $("#table tbody").hide()
    })
    $(".search-factor").append(`
      <div class="d-flex justify-content-between w-100">
        <form class="d-flex gap-4 justify-content-end">
          <div class="form-group">
            <label class="form-label">Status</label>
            <select class="form-select" id="cancelled">
              <option value="">All</option>
              <option value="true">Cancelled</option>
              <option value="false">Active</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Year</label>
            <select class="form-select" id="year">
              <option selected>2025</option>
              <option>2024</option>
              <option>2023</option>
              <option>2022</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Month</label>
            <select class="form-select" id="month">
              ${months.map((m, i) => 
                `<option value="${i+1}" ${new Date().getMonth()===i ? "selected":""}>${m}</option>`
              ).join("")}
            </select>
          </div>
        </form>
        <div class="mt-4">
          <button class="btn btn-primary" type="button" id="leave_list_submit">Submit</button>
        </div>
      </div>
    `);

    // ✅ Hook up the filter button
    $("#leave_list_submit").on("click", function () {
      console.log("Filters →", {
        cancelled: $("#cancelled").val(),
        year: $("#year").val(),
        month: $("#month").val()
      });
      console.log(getHolidayUrl());

        table.ajax.url(getHolidayUrl()).load();
        $("#table tbody").show()
    });
  },
});
$("#save_sunday_button").click(()=>{
 if($("#flexCheckDefault").is(":checked")){
    $.ajax({
        type:"POST",
        url:`https://dev-api.humhealth.com/StudentManagementAPI/holidays/set?year=${new Date().getFullYear()}&teacherId=7`,
        contentType:"application/json",
        dataType:"json",
        success:function(response){
             Swal.fire({
        icon: "success",
        title: "Holidays set",
        text: "✅"+response.data,
        showConfirmButton: false,
        timer: 2000,
      });
        }

    })
 }
})

