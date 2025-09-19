const custom = "../components/header.html";
$("#header").load(custom, () => {
  const script = document.createElement("script");
  script.src = "../js/header.js";
  script.onload = () => {
    // Now <header-element> is defined
    $("#header").append("<header-element></header-element>");
  };
  document.body.appendChild(script);
});

const nav_path = "../components/nav.html";
$(".nav-custom").load(nav_path, () => {
  const script = document.createElement("script");
  script.src = "../js/nav.js";
  script.onload = () => {
    $(".nav-custom").append("<custom-navbar></custom-navbar>");
  };
  document.body.appendChild(script);
});
const load_path = "../components/loader.html";
$("#loader").load(load_path, () => {
  const script = document.createElement("script");
  script.src = "../js/loader.js";
  script.onload = () => {
    $("#loader").append("<custom-loader></custom-loader>");
  };
  document.body.appendChild(script);
});

const Teacher = function () {
  this.addTeacher = function () {
    // $("#teacher_submit").click(showMod);
    $("tbody tr td").css("text-align", "center");

    $(document).on("click", "#add_teacher", function () {
      $("#teacher_modal").modal("show");
      $.validator.addMethod(
        "regex",
        function (value, element, regexp) {
          let re = new RegExp(regexp);
          return this.optional(element) || re.test(value);
        },
        "Invalid format"
      );
      $(".add-teacher-form").validate({
        onkeyup: false,
        rules: {
          name: {
            required: true,
            regex: /^[A-Za-z][a-z]{3,30}$/,
          },
          subject: {
            required: true,
            regex: /^[a-zA-Z]{3,18}$/,
          },
          mail: {
            required: true,
            regex: /^[a-z][a-z0-9]{3,30}@[a-z]{3,10}\.[a-z]{1,4}$/gm,
          },
        },
        messages: {
          name: {
            required: "Enter Name",
            regex: "Not a Valid name",
          },
          subject: {
            required: "Enter Subject",
            regex: "Enter a valid subject",
          },
          mail: {
            required: "Enter Email",
            regex: "Enter a valid email",
          },
          errorClass:"text-danger"
        },
        submitHandler:function(form){
          const data = $(form).serializeJSON();
          console.log(data);
           $.ajax({
          method: "POST",
          url: "https://dev-api.humhealth.com/StudentManagementAPI/teachers/save",
          data: JSON.stringify({
            teacherName: data.name,
            teacherSpeciality: data.subject,
            teacherEmail: data.mail,
          }),
          contentType: "application/json",
          success: function (response) {
            console.log("success response", response);
            // const res = JSON.parse(response)
            if (response.status === "success") {
              $("#teacher_modal").modal("hide");

              $("#teacher_submit_modal").show();
              $("#table").DataTable().ajax.reload();

              setTimeout(() => {
                $("#teacher_submit_modal").hide();
                $("#name").val("");
                $("#mail").val("");
                $("#subject").val("");
                console.log(name);
              }, 2000);
            } else {
              if (
                response.status == "failure" &&
                response.data[0].startsWith("email")
              ) {
                // alert("not email")
                if ($(".err-email").length == 0) {
                  $("#mail").after(
                    `<span class="text-danger mail err-email">Email already Exists</span>`
                  );
                }
              }
            }
          },
          error: function (xhr, status, error) {
            console.log("error in api");

            // alert("Cant upload data")
            $("#teacher_modal").modal("hide");

            $("#teacher_error_modal").show();

            setTimeout(() => {
              $("#teacher_error_modal").hide();
              $("#name").val("");
              $("#mail").val("");
              $("#subject").val("");
            }, 2000);
          },
        });
          return false
          
        }
      });
    });
  };
  this.showTeacher = function () {
    $.ajax({
      method: "POST",
      url: "https://dev-api.humhealth.com/StudentManagementAPI/teachers/list",
      dataType: "json",
      contentType: "application/json",
      success: function (response) {
        console.log(response.data);

        const table = $("#table").DataTable({
          sort: false,
          ajax: {
            method: "POST",
            url: "https://dev-api.humhealth.com/StudentManagementAPI/teachers/list",
            dataSrc: "data", // ✅ tell DataTables to use response.data
          },
          dom: '<"dt-header d-flex justify-content-between "<"but d-flex justify-content-between"l><"d-flex justify-content-between"<"inp dt-search d-flex justify-content-between mx-3">>>rt<"d-flex justify-content-between"<i><p>>',
          columns: [
            { data: "teacherId" },
            { data: "teacherName" },
            { data: "teacherSpeciality" },
            { data: "teacherEmail" },
            // {
            //   data: null,
            //   render: (row) => {
            //     return `
            //     <i class="fa-regular fa-pen-to-square text-secondary edit-btn btn-default" btn data-id="${row.teacherId}"></i>&nbsp;&nbsp;
            //     <i class="fa-solid fa-trash text-danger delete-btn btn btn-default" data-id="${row.teacherId}"></i>
            //   `;
            //   },
            // },
          ],
          initComplete: function () {
            $(".but").append(
              "<form><label class='mx-3 mt-4' id='add_teacher'><button type='button' class='btn btn-default text-light inter-table rounded-lg' id='add_teacher'>+ Add Teacher</button></label></form>"
            );
            $(".inp").append(
              '<div><label class="form-label p-0 m-0">Search By</label><select id="columnSelect" class="form-select"><option value="1">Name</option><option value="0">ID</option></select></div><div>&nbsp &nbsp;</div><div><label class="form-label p-0 m-0 ">Search Value</label><input id="search_value" type="text" class="form-control" /></div>'
            );
            $("#search_value").on("keyup", function () {
              console.log("logged");

              const columnIndex = $("#columnSelect").val(); // "1" or "2"
              const value = this.value;
              console.log(value);

              table.column(columnIndex).search(value).draw();
            });
          },
        });
      },
      error: function (xhr, status, error) {
        console.error("Error:", error);
      },
    });
  };
};
const teacherObj = new Teacher();
teacherObj.showTeacher();
teacherObj.addTeacher();
