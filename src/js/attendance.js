$(document).ready(() => {
  $("nav").load("../components/nav.html");
  $("header").load("../components/header.html");

  $(".save-holidays").click(() => {
    $("#save_holidays").toggle();
  });

  const table = $("#table").DataTable({
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
          isActive: null,
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
          return `<input class="form-check-input attendance" type="checkbox" data-id="${data.id}"/>`;
        }
      },
      {
        title: "Sick",
        data: null,
        render: function (data) {
          return `<input class="form-check-input sick" type="checkbox" data-id="${data.id}"/>`;
        }
      },
      {
        title: "ECA",
        data: null,
        render: function (data) {
          return `<input class="form-check-input eca" type="checkbox" data-id="${data.id}"/>`;
        }
      }
    ],
   initComplete: function () {
  $("table").on("change", ".attendance", function () {
    let $row = $(this).closest("tr"); // get the current row
    let isPresent = $(this).is(":checked"); // true if Present
    let $stat = $row.find(".stat-text")
    console.log("stat--->",$stat.text());
    


    let $sick = $row.find(".sick"); 
    let $eca = $row.find(".eca");

    if (isPresent) {
      // If Present → disable sick + eca
      $sick.prop("checked", false).prop("disabled", true);
      $eca.prop("checked", false).prop("disabled", true);
      $stat.text("Present").removeClass("bg-warning bg-danger text-white").css({"background-color":"#b5e8c7ff","border-radius":"20px"})

    } else {
      // If Absent → enable sick + eca
      $sick.prop("disabled", false);
      $eca.prop("disabled", false);
      $stat.text("Not Taken").removeClass("bg-success text-white").addClass("bg-warning")

      
    }
  });
  $("table").on("change",".sick",function(){
    // alert("hiii")
    let $row = $(this).closest('tr');
    let $eca = $row.find(".eca")
    let $stat = $row.find(".stat-text")

    console.log($eca);
    
    let isSick = $(this).is(":checked");
    if(isSick){
      $eca.prop("checked",false)
      $stat.text("Absent").removeClass("bg-warning").addClass("bg-danger text-white")

    }
    else{
      $eca.prop("disabled", false);

    }

  })
  $("table").on("change",".eca",function(){
    // alert("hiii")
    let $row = $(this).closest('tr');
    let $stat = $row.find(".stat-text")
    let $eca = $row.find(".sick")
    console.log($eca);
    
    let isSick = $(this).is(":checked");
    if(isSick){
      $eca.prop("checked",false)
      $stat.text("Absent").removeClass("bg-warning").addClass("bg-danger text-white")

    }
    else{
      $eca.prop("disabled", false);

    }

  })
}

  });
});
