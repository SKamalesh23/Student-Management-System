  $(".table-container").load("../components/takeAttendance.html")
$(".view-attendance").click(()=>{
  $(".view-attendance").addClass("bg-secondary text-light").removeClass("text-dark")
  $(".take-attendance").addClass("text-dark").removeClass("bg-secondary text-light")
  $(".table-container").load("../components/viewAttendance.html")
})
$(".take-attendance").click(() => {
   $(".take-attendance").addClass("bg-secondary text-light").removeClass("text-dark")
  $(".view-attendance").addClass("text-dark").removeClass("bg-secondary text-light")
  $(".table-container").load("../components/takeAttendance.html", function () {
    // destroy if exists
    if ($.fn.DataTable.isDataTable("#table")) {
      $("#table").DataTable().clear().destroy();
    }

    // now init DataTable fresh
    initAttendanceTable();
  });
});
function initAttendanceTable(){
const table = $(".table-container #table").DataTable({
    processing: true,
    serverSide: true,
    sort: false,
    ajax: {
      url: "https://dev-api.humhealth.com/StudentManagementAPI/students/list",
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      data: function (d) {
        // Merge DataTables params with your custom filters
        return JSON.stringify({
          isActive: true,
          isHosteller: false,
          isDayScholar: false,
          searchBy: "",
          searchValue: "",
          start: 0,
          length: 50
        });
      }
    },
    dataSrc: "data",  
    dom:"<dt-header<'d-flex justify-content-end w-100'<'sub mt-1 w-100 d-flex justify-content-end'> >>",
    columns: [
      {
        title: "ID",
        data: "id"
      },
      {
        title: "Name",
        data: null,
        render: function (data) {
          return `<b class="fw-bold">${data.firstName} ${data.lastName}</b>`;
        }
      },
      {
        title: "Date",
        data: null,
        render: function () {
          const currentDate = new Date();
          const day = String(currentDate.getDate()).padStart(2, "0");
          const month = String(currentDate.getMonth() + 1).padStart(2, "0");
          const year = currentDate.getFullYear();
          return `${day}-${month}-${year}`;
        }
      },
      {
        title:"Status",
        data:null,
        render:function(){
          return `<div class="d-flex justify-content-center"><p class="bg-warning  w-50 text-center rounded stat-text">Not Taken</p></div>`
        }
      },
      {
        title: "Present",
        data: null,
        render: function (data) {
          return `<input class="form-check-input attendance" type="checkbox" data-id="${data.id}" style="border-color:#1E2A38"/>`;
        }
      },
      {
        title: "Sick",
        data: null,
        render: function (data) {
          return `<input class="form-check-input sick" type="checkbox" data-id="${data.id}" style="border-color:#1E2A38"/>`;
        }
      },
      {
        title: "ECA",
        data: null,
        render: function (data) {
          return `<input class="form-check-input eca" type="checkbox" data-id="${data.id}" style="border-color:#1E2A38"/>`;
        }
      }
    ],
   initComplete: function () {
    $(".sub").html(`
            <form class="pt-5 p-3 w-25">
              <button class="btn btn-lg btn-success w-100 " type="button" id="submit_attendance">SUBMIT</button>
            </form>
          `)
  $("table").on("change", ".attendance", function () {
    let $row = $(this).closest("tr"); // get the current row
    let isPresent = $(this).is(":checked"); // true if Present
    let $stat = $row.find(".stat-text")
    console.log("stat--->",$stat.text());
    


    let $sick = $row.find(".sick"); 
    let $eca = $row.find(".eca");

    if (isPresent) {
      // If Present → disable sick + eca
      $sick.prop("checked", false)
      $eca.prop("checked", false)
      $stat.text("Present").removeClass("bg-warning bg-danger text-white").addClass("text-success").css({"background-color":"#b5e8c7ff","border-radius":"20px"})

    } else {
      // If Absent → enable sick + eca
      $sick.prop("disabled", false);
      $eca.prop("disabled", false);
      $stat.text("Not Taken").removeClass("bg-success text-white text-success").addClass("bg-warning")

      
    }
  });
  $("table").on("change",".sick",function(){
    // alert("hiii")
    let $row = $(this).closest('tr');
    let $eca = $row.find(".eca")
    let $stat = $row.find(".stat-text")
    let $attendance = $row.find(".attendance")

    console.log($eca);
    
    let isSick = $(this).is(":checked");
    if(isSick){
      $eca.prop("checked",false)
      $attendance.prop("checked",false)
      $stat.text("Absent").removeClass("bg-warning").addClass("bg-danger text-white")

    }
    else{
      $eca.prop("disabled", false);
      $stat.text("Not Taken").removeClass("bg-danger text-white").addClass("bg-warning text-black")


    }

  })
  $("table").on("change",".eca",function(){
    // alert("hiii")
    let $row = $(this).closest('tr');
    let $stat = $row.find(".stat-text")
    let $eca = $row.find(".sick")
    let $attendance = $row.find(".attendance")

    console.log($eca);
    
    let isSick = $(this).is(":checked");
    if(isSick){
      $eca.prop("checked",false)
      $attendance.prop("checked",false)
      
      $stat.text("Absent").removeClass("bg-warning").addClass("bg-danger text-white")


    }
    else{
      $eca.prop("disabled", false);
      $stat.text("Not Taken").removeClass("bg-danger text-white").addClass("bg-warning text-dark")


    }

  })
  function collectAttendance() {
  let table = $("#table").DataTable();
  let payload = [];

  // Loop over each row in DataTable
  table.rows().every(function () {
    let rowNode = $(this.node());   // get the <tr>
    let data = this.data();         // backend JSON for this row

    let isPresent = rowNode.find(".attendance").is(":checked");
    let isSick = rowNode.find(".sick").is(":checked");
    let isEca = rowNode.find(".eca").is(":checked");
  if (!isPresent && !isSick && !isEca) {
    return; // continue to next row
  }
    // Format today’s date as MM-DD-YYYY
    let now = new Date();
    let day = String(now.getDate()).padStart(2, "0");
    let month = String(now.getMonth() +1).padStart(2, "0");
    let year = now.getFullYear();
    let formattedDate = `${month}-${day}-${year}`;

payload.push({
  studentId: data.id, // from DataTable API
  attendanceDate: formattedDate,

  // If ECA is checked, force "P"
  attendanceStatus: isEca ? "P" : (isPresent ? "P" : "A"),

  sickLeaveFlag: isSick ? "Y" : "N",
  ecaFlag: isEca ? "Y" : "N",
  createdTeacherId: 7 // static (can be dynamic later)
});

  });

  return payload;
}

$("#submit_attendance").on("click", function () {
  // alert("clicked")
  let payload = collectAttendance();
  console.log(JSON.stringify(payload))
  $.ajax({
    url: "https://dev-api.humhealth.com/StudentManagementAPI/dailyattendance/take",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(payload),
    success: function (res) {
      console.log("Attendance saved successfully:", res);
      if(res.status==="success"){
Swal.fire({
              icon: "success",
              title: "Generated",
              text: "✅ " + res.data,
              showConfirmButton: false,
              timer: 2000,
            });
      }
      else{
        Swal.fire({
              icon: "info",
              title: "Error",
              text: "❗ " + res.data,
              showConfirmButton: false,
              timer: 2000,
            });
      }
      
    },
    error: function (err) {
      console.error("Error saving attendance:", err);
      Swal.fire({
              icon: "error",
              title: "Generated",
              text: "🚫 Cant Save Data",
              showConfirmButton: false,
              timer: 2000,
            });
    }
  });
});

}

  });
}
function viewAttendanceTable(){
  const table = $("#table").DataTable({
    processing: true,
    serverSide: true,
    sort:false,
    ajax:{
      url:"https://dev-api.humhealth.com/StudentManagementAPI/dailyattendance/take",
      type:"POST",
      contentType:"application/json",
      dataType:"json",
      data:function(){
        
      }
      
    }

  })
}
$(document).ready(() => {
  $("header").load("../components/header.html");
  $("nav").load("../components/nav.html");
 $(".table-container").load("../components/takeAttendance.html", function () {
    initAttendanceTable(); // initialize DataTable once DOM is loaded
  });
  $(".save-holidays").click(() => {
    $("#save_holidays").toggle();
  });

  
});
