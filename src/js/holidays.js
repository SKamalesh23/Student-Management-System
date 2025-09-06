$(document).ready(() => {
  $(".nav-custom").load("../components/nav.html");
  $("header").load("../components/header.html");
  $("#save_holiday").click(() => {
    $(".save-holidays").slideToggle();
  });
  $(document).on("click", "#add_holiday", function () {
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

           
        </form>`);
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
});
$("#cancel_button").click(()=>{
    const res_arr = []
    const dates = document.querySelectorAll('.e-date')
    const reason1 = document.querySelector(".e-reason").value
    for(let x = 0;x<dates.length;x++){
        res_arr.push(dates[x].value)
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
      table.ajax.reload()
        }
    })
    
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
  let isCancelled = $("#cancelled").val();
  isCancelled = isCancelled === "" ? "" : isCancelled === "true";
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
  dom: '<"dt-header d-flex justify-content-between"<"search-factor w-100">>t<"d-flex justify-content-between"ip>',
  columns: [
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
            return `<i class="fa-solid fa-pen-to-square text-secondary" role="button" data-id="${data.holidayId}"></i> <i class="fa-solid fa-trash text-danger mx-4" role="button" data-id="${data.id}"></i>`
        }
    }
  ],
  initComplete: function () {
    const months = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];

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

