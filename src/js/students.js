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
  let update_id = 0;
  const val = $("#active").val();
  const isActive = val ? (val === "A" ? true : false) : null;
  let isHosteller = false;
  let isDayscholar = false;
  let count = 0;
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
    contentType: "application/json",
    success: function (data) {
      console.log(data);
      count = data.recordsTotal;
      const table = $("#table").DataTable({
        sort: false,
        paging: true,
        ajax: {
          url: "https://dev-api.humhealth.com/StudentManagementAPI/students/list",
          type: "POST",
          contentType: "application/json",
          data: function (d) {
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
            console.log("after-.-->", filter);

            return JSON.stringify(filter);
          },
          dataSrc: "data", // tell DataTables to use response.data
        },
        dom: '<"dt-header d-flex flex-column justify-content-between w-100" <"d-flex justify-content-between px-5 w-100"<"search-factors dt-search d-flex justify-content-between mx-3 w-100" >>>rt<"d-flex justify-content-between"<i>p>',
        columns: [
          {
            title: "Student ID",
            data: "id",
          },
          {
            title: "Student Name",
            data: null,
            render: function (data, type, row) {
              return `<b class="fw-bold">${data.firstName} ${data.lastName}</b>`;
            },
          },
          {
            title: "Class",
            data: "studentClass",
          },
          {
            title: "Student Email",
            data: "studentEmail",
          },
          {
            title: "Student Status",
            data: null,
            render: function (data, type, row) {
              const resident = data.activeStatus;
              if (resident == "A") {
                return `<div class=" d-flex justify-content-center"><div class="bg-sm  text-success  w-25 active-student" id="active"  data-id="${data.id}" style="background-color:#DCFCE7;border-radius:20px" role="button">Active</div></div>`;
              } else {
                return `<div class=" d-flex justify-content-center"><div class="bg-sm  text-danger  w-25 active-student" id="inactive" data-id="${data.id}" style="background-color:#FEE2E2;border-radius:20px" role="button">Inactive</div></div>`;
              }
            },
          },
          {
            title: "Actions",
            data: null,
            render: function (data, type, row) {
              return `<i class="fa-solid fa-pen-to-square text-secondary" role="button" data-id="${data.id}"></i>`;
            },
          },
        ],
        initComplete: function () {
          $(".search-factors")
            .append(`<form class="d-flex justify-content-around w-100 gap-2"><div><label class="form-label m-0 p-0">Active Status</label><select class="form-select" id="active">
            <option value="" selected></option>
            <option value="A">Active</option>
            <option value="NA">Inactive</option>
          </select>
        </div>
        <div>
          <label class="form-label m-0 mx-3 p-0">Hostel/Dayscholar</label
          ><select class="form-select" id="resident">
            <option value="" disabled selected>Select Residence</option>
            <option value="D">Dayscholar</option>
            <option value="H">Hostel</option>
          </select>
        </div>
        <div>
          <label class="form-label p-0 m-0">Search By</label
          ><select class="form-select" id="search_by">
            <option value="" selected>Select </option>
            <option value="id">Id</option>
            <option value="firstName">FirstName</option>
            <option value="lastName">LastName</option>
          </select>
        </div>
        <div>
          <label class="form-label p-0 m-0">Search Value</label
          ><input id="search_value" type="text" class="form-control" />
        </div>
        <div class="">
          <label class="form-label m-0 p-0">No. of Entries</label>
          <select class="form-select w-75" id="noe">
              <option value="10" selected>10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
          </select>
        </div>
        <div>
          <button type="button" id="search_button" class="btn btn-primary mt-4">
            Submit
          </button>
        </div>
      </form>`);
          $("#table").on("click", ".fa-pen-to-square", function () {
            update_id = $(this).data("id");
            $.ajax({
              method: "GET",
              url: `https://dev-api.humhealth.com/StudentManagementAPI/students/get?id=${update_id}`,
              dataType: "json",
              success: function (response) {
                const res = response.data;
                console.log("::::::::", res);

                const fname = res.firstName;
                $("#firstName").val(fname);
                const mname = res.middleName;
                $("#middleName").val(mname);
                const lname = res.lastName;
                $("#lastName").val(lname);
                const city = res.cityName;
                $("#cityName").val(city);
                const phoneNo = res.phoneNo;
                $("#phoneNo").val(phoneNo);
                const streetName = res.streetName;
                $("#streetName").val(streetName);
                const post = res.postalcode;
                $("#postalcode").val(post);
                const gender = res.gender;
                $("#gender").val(gender);
                const ar_date = res.dob.split("-");
                // console.log(a);
                // console.log(`${ar_date[2]}-${ar_date[0]}-${ar_date[1]}`)
                $("#dob").val(`${ar_date[2]}-${ar_date[0]}-${ar_date[1]}`);
                const emergencyContactPersonName =
                  res.emergencyContactPersonName;
                $("#emergencyContactPersonName").val(
                  emergencyContactPersonName
                );
                const emergencyContactPhoneNumber =
                  res.emergencyContactPhoneNumber;
                $("#emergencyContactPhoneNumber").val(
                  emergencyContactPhoneNumber
                );
                $("#studentEmail").val(res.studentEmail);
                $("#studentClass").val(res.studentClass);
                $("#residingStatus").val(res.residingStatus);
              },
            });
            $("#add_submit").text("Update");
            $("#student_submit_modal").modal("show");
          });
          $("#table").on("click", ".active-student", function () {
            // alert("clicked")
            const id = $(this).data("id");

            const cal = $(this).attr("id") === "active" ? false : true;
            console.log("cal->", cal);
            $("#student_status").modal("show");
            $("#ok").click(() => {
              $.ajax({
                method: "POST",
                url: `https://dev-api.humhealth.com/StudentManagementAPI/students/update/status?toActivate=${cal}&studentId=${id}&teacherId=9`,
                dataType: "json",
                success: function () {
                  $("#student_status").modal("hide");

                  table.ajax.reload();
                },
              });
            });
          });
          const dt_length = $("#dt-length-0").val();
          const page = $(".pagination .active button").text();
          const count_to = page * dt_length;
          $(".show-entries").append(
            `<p>Show ${
              page * dt_length + 1 - dt_length
            } to ${count_to} of ${count} entries</p>`
          );
          $("#search_button").click(() => {
            table.ajax.reload();
          });
          $(".pagination .active button").click(() => {
            alert("hii");
            table.ajax.reload();
          });
        },
      });
    },
    error: function (xhr) {
      console.error("Error", xhr);
    },
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
      if ($("#add_submit") === "Add") {
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
              // $("#student_success").modal("show");
              // setTimeout(() => {
              //   $("#student_success").modal("hide");
              // }, 2000);
              Swal.fire({
                icon: "success",
                title: "Generated",
                text: ":white_check_mark: " + res.object,
                showConfirmButton: false,
                timer: 2000,
              });
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
      } else {
        const update_details = {
          id: update_id,
          ...details,
          updatedTeacherId: 12,
        };
        $.ajax({
          method: "POST",
          url: "https://dev-api.humhealth.com/StudentManagementAPI/students/save",
          data: JSON.stringify(update_details),
          contentType: "application/json",
          dataType: "json",
          success: function (response) {
            console.log("success ---->", response);
            Swal.fire({
              icon: "success",
              title: "Generated",
              text: "✅ " + response.data,
              showConfirmButton: false,
              timer: 2000,
            });
            // const response = JSON.parse(res)
            if (response.status === "success") {
              $("#student_submit_modal").modal("hide");
              // $("#student_success").modal("show");
              // setTimeout(() => {
              //   $("#student_success").modal("hide");
              // }, 2000);
            } else {
              $("#studentEmail").after(
                '<span class="text-danger err">Email already Exists</span>'
              );
            }
          },
          error: function (xhr, status, error) {
            console.log("Error status:", error);

            Swal.fire({
              icon: "error",
              title: "Request Failed",
              text:
                "❌ " +
                (xhr.responseJSON?.message || error || "Something went wrong"),
              showConfirmButton: false,
              timer: 2500,
            });
          },
        });
      }
    }
  });
});
function apiCall() {}
function check() {}
$("#ok").on("click", function () {
  const $btn = $(this);
  $btn.prop("disabled", true).html(`
    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
    Processing...
  `);

  // simulate async action (AJAX)
  setTimeout(() => {
    // reset button or close modal
    $btn.prop("disabled", false).text("Yes");
    $("#student_status").modal("hide");
  }, 2000);
});
