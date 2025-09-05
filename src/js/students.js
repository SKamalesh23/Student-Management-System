function verify(input_arr) {
  let ver = true;

  const name_reg = /^[A-Z][a-z]{2,25}$/;
  const last_reg = /^[A-Za-z]{1,24}$/;
  const class_reg = /^[0-9]$/;
  const mail_reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;
  const number_reg = /^[6-9][0-9]{9}$/;

  console.log(input_arr);

  for (let key in input_arr) {
    console.log(`Key : ${key} , value : ${input_arr[key]}`);

    // remove old error if any
    $(`#${key}`).next(".err").remove();
    if (key === "emergencyContactPhoneNumber" && !input_arr[key]) {
      $(`#${key}`).after(
        `<span class="text-danger err">Enter Phone Number</span>`
      );
    }
    if (key === "emergencyContactPersonName" && !input_arr[key]) {
      $(`#${key}`).after(`<span class="text-danger err">Enter Name</span>`);
    }
    if (
      key !== "middleName" &&
      key !== "emergencyContactPhoneNumber" &&
      key !== "emergencyContactPersonName" &&
      (!input_arr[key] || input_arr[key].length === 0)
    ) {
      $(`#${key}`).after(`<span class="text-danger err">Enter ${key}</span>`);
      ver = false;
    } else {
      if (
        key === "firstName" &&
        input_arr[key] &&
        !name_reg.test(input_arr[key])
      ) {
        ver = false;
        $(`#${key}`).after(
          `<span class="text-danger err">Enter Valid First Name</span>`
        );
      } else if (
        key === "middleName" &&
        input_arr[key] &&
        !name_reg.test(input_arr[key])
      ) {
        ver = false;
        $(`#${key}`).after(
          `<span class="text-danger err">Enter Valid Middle Name</span>`
        );
      } else if (
        key === "lastName" &&
        input_arr[key] &&
        !last_reg.test(input_arr[key])
      ) {
        ver = false;
        $(`#${key}`).after(
          `<span class="text-danger err">Enter Valid Last Name</span>`
        );
      } else if (
        key === "studentEmail" &&
        input_arr[key] &&
        !mail_reg.test(input_arr[key])
      ) {
        ver = false;
        $(`#${key}`).after(
          `<span class="text-danger err">Enter Valid Email</span>`
        );
      } else if (
        key === "phoneNo" &&
        input_arr[key] &&
        !number_reg.test(input_arr[key])
      ) {
        ver = false;
        $(`#${key}`).after(
          `<span class="text-danger err">Enter Valid Phone Number</span>`
        );
      } else if (
        key === "emergencyContactPhoneNumber" &&
        input_arr[key] &&
        !number_reg.test(input_arr[key])
      ) {
        ver = false;
        $(`#${key}`).after(
          `<span class="text-danger err">Enter Valid Emergency Number</span>`
        );
      }
    }
  }

  return ver;
}

// function filteredTable(search_by,search_value,noe,active){
//     console.log(search_by,search_value,noe,active);
//     $.ajax({
//         method:"GET",
//         url:'../../public/json/teachers.json',
//         dataType:"json",
//         // data:JSON.stringify({})
//         success:function(data){
//             const table = $("#table").dataTable({
//         sort:false,
//         data:data,
//         column:[
//             {
//                 title:"Student ID",
//                 data:"id"
//             },
//             {
//                 title:'Student Name',
//                 data:"teacherName",
//             }
//             ,{
//                 title:"Student Email",
//                 data:"teacherEmail"
//             }
//         ]

//     })

//         }
//     })

// }
$("header").load("../components/header.html");
$(document).ready(() => {
  $("nav").load("../components/nav.html");
  const val = $("#active").val();
  const isActive = val ? (val === "A" ? true : false) : null;
  let isHosteller = false;
  let isDayscholar = false;

  const res_val = $("#resident").val();

  if (res_val === "H") {
    isHosteller = true;
  } else if (res_val === "D") {
    isDayscholar = true;
  }
  // if val is empty/undefined → both remain false
  const searchBy = $("#search_by").val();
  const searchValue = $("#search_value").val();
  let noe = $("#noe").val();
  if (noe) {
    noe = parseInt(noe);
  } else {
    noe = 10;
  }
  const filter = {
    isActive: isActive,
    isHosteller: isHosteller,
    isDayScholar: isDayscholar,
    searchBy: searchBy,
    searchValue: searchValue,
    start: 0,
    length: noe,
  };
  console.log(filter);
  

  //dataTable
  $.ajax({
    method: "POST",
    url: "https://dev-api.humhealth.com/StudentManagementAPI/students/list",
    data: JSON.stringify(filter),
    dataType: "json",
    contentType:'application/json',
    success: function (data) {
      console.log(data);
      const table = $("#table").DataTable({
        sort: false,
        data: data.data,
        dom: '<"dt-header d-flex justify-content-between"<"d-flex justify-content-between"<"search-factors dt-search d-flex justify-content-between mx-3">>>rt<"d-flex justify-content-between"<i><p>>',
        columns: [
          {
            title: "Student ID",
            data: "id",
          },
          {
            title: "Student Name",
            data: null,
            render: function (data, type, row) {
              return `${data.firstName} ${data.lastName}`;
            },
          },
          {
            title: "Student Email",
            data: "studentEmail",
          },
          {
            title: "Actions",
            data: null,
            render: function () {
              return `<i class="fa-solid fa-pen-to-square text-secondary"></i>&nbsp;&nbsp;&nbsp;<i class="fa-solid fa-trash text-danger"></i>`;
            },
          },
        ],
        initComplete: function () {
          $(".search-factors").append("");
          $("#search_button").click(() => {
            const search_value = $("#search_value").val();
            const noe = $("#noe").val();
            const search_by = $("#search_by").val();
            const active = $("#active").val();
            filteredTable(search_by, search_value, noe, active);
          });
        },
      });
    },
    error:function(xhr){
      console.error("Error",xhr)
    }
  });

  $("#add_student").click(() => {
    $("#student_submit_modal").modal("show");
  });
  $("#add_cancel").click(() => {
    $("#student_submit_modal").modal("hide");
  });
  $("#add_submit").click(() => {
    $(".err").remove();
    function formatDateToDDMMYYYY(dateStr) {
      if (!dateStr) return "";
      const parts = dateStr.split("-"); // ["yyyy", "MM", "dd"]
      if (parts.length !== 3) return dateStr;
      return `${parts[1]}-${parts[2]}-${parts[0]}`;
    }
    const rawDob = $("#dob").val(); // "2010-05-05" from input
    const dob = formatDateToDDMMYYYY(rawDob); // "05-05-2010"

    const details = {
      firstName: $("#firstName").val(),
      middleName: $("#middleName").val(),
      lastName: $("#lastName").val(),
      gender: $("#gender").val(),
      dob: formatDateToDDMMYYYY($("#dob").val()), // "23-01-2001"
      studentClass: parseInt($("#studentClass").val(), 10),
      residingStatus: $("#residingStatus").val(),
      phoneNo: $("#phoneNo").val(),
      emergencyContactPersonName: $("#emergencyContactPersonName").val(),
      emergencyContactPhoneNumber: $("#emergencyContactPhoneNumber").val(),
      streetName: $("#streetName").val(),
      cityName: $("#cityName").val(),
      postalcode: $("#postalcode").val(),
      activeStatus: $("#activeStatus").val(),
      studentEmail: $("#studentEmail").val(),
      createdTeacherId: 7,
    };

    //verify
    let valid = verify(details);
    console.log("is valid ---->", valid);

    if (valid) {
      const api = JSON.stringify(details);
      console.log(api);

      $(".err").remove();

      $.ajax({
        method: "POST",
        url: "https://dev-api.humhealth.com/StudentManagementAPI/students/save",
        data: JSON.stringify(details),
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
          console.log("success ---->", response);

          // const response = JSON.parse(res)
          if (response.status === "success") {
            $("#student_submit_modal").modal("hide");
            $("#student_success").modal("show");
            setTimeout(() => {
              $("#student_success").modal("hide");
            }, 2000);
          } else {
            $("#studentEmail").after(
              '<span class="text-danger err">Email already Exists</span>'
            );
          }
        },
        error: function (err) {
          console.log("Error status : ", err);
          alert("error occured see log");
        },
      });
    }
  });
});
function apiCall() {}
function check() {}
