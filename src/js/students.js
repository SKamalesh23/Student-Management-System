const SELECTORS = {
  header : "#header",
  phoneNo:"#phoneNo",
  navBar:".nav-custom",
  loader:"#loader",
  activeStatus:"#active",
  residence:"#resident",
  table:"#table",
  searchBy:"#search_by",
  searchValue:"#search_value"
}

const custom = '../components/header.html';
$(SELECTORS.header).load(custom, () => {
  const script = document.createElement("script");
  script.src = "../js/header.js";
  script.onload = () => {
    // Now <header-element> is defined
    $(SELECTORS.header).append("<header-element></header-element>");
  };
  document.body.appendChild(script);
});
//nav
$(SELECTORS.phoneNo).inputmask("999-9999-999")
const nav_path = "../components/nav.html"
$(SELECTORS.navBar).load(nav_path,()=>{
  const script = document.createElement("script")
  script.src="../js/nav.js";
  script.onload = () =>{
    $(SELECTORS.navBar).append("<custom-navbar></custom-navbar>")
  }
  document.body.appendChild(script)
})
//loader Element
const load_path = "../components/loader.html"
$(SELECTORS.loader).load(load_path,()=>{
  const script = document.createElement("script")
  script.src = "../js/loader.js"
  script.onload = () =>{
    $(SELECTORS.loader).append("<custom-loader></custom-loader>")
  }
  document.body.appendChild(script)

})
const Students = function(){
  this.getStudentsList = function(){
      
  let update_id = 0;
  const val = $(SELECTORS.activeStatus).val();
  const isActive = val ? (val === "A" ? true : false) : null;
  let isHosteller = false;
  let isDayscholar = false;
  let count = 0;
  const res_val = $(SELECTORS.residence).val();

  if (res_val === "H") {
    isHosteller = true;
  } else if (res_val === "D") {
    isDayscholar = true;
  }
  // if val is empty/undefined → both remain false
  const searchBy = $(SELECTORS.searchBy).val();
  const searchValue = $(SELECTORS.searchValue).val();
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
      const table = $(SELECTORS.table).DataTable({
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
            const searchValue = $("#search_value").val()
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
          dataSrc: "data", // tell DataTables to use response.data,
          error:function(xhr,statusText,error){
          }
        },
        dom: '<"dt-header d-flex flex-column justify-content-between w-100" <"d-flex justify-content-between px-5 w-100"<"search-factors dt-search d-flex justify-content-between  w-100" >>>rt<"d-flex justify-content-between"<i>p>',
        columns: [
          {
            title:"S.No",
            data:null,
          render: function (data, type, row, meta) {
    return meta.row + 1;
  }
          },
          {
            title: "Student ID",
            data: null,
            render:(data)=>{
              return `<p class="fw-bold text-primary">${data.id}</p>`
            }
          },
          {
            title: "Student Name",
            data: null,
            render: function (data, type, row) {
              return `<b class="fw-bold ">${data.firstName} ${data.lastName}</b>`;
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
                return `<div class=" d-flex justify-content-center "><div class="bg-sm  text-danger  w-50 active-student"  id="inactive" data-id="${data.id}" style="background-color:#FEE2E2;border-radius:20px" role="button">Inactive</div></div>`;
              }
            },
          },
          {
            title: "Actions",
            data: null,
            render: function (data, type, row) {
              return `<i class="fa-solid fa-pen-to-square text-secondary mx-3" role="button" data-id="${data.id}"></i><i class="fa-regular fa-eye mx-3 eye" data-id="${data.id}" role="button"></i>`;
            },
          },
        ],
        initComplete: function () {
          $(".search-factors")
            .append(`<form class="d-flex justify-content-around w-100 gap-2"><div><label class="form-label m-0 p-0">Active Status</label><select class="form-select" id="active">
            <option value="" selected>All</option>
            <option value="A">Active</option>
            <option value="NA">Inactive</option>
          </select>
        </div>
        <div>
          <label class="form-label m-0 mx-3 p-0">Hostel/Dayscholar</label
          ><select class="form-select" id="resident">
            <option value=""  selected>All</option>
            <option value="D">Dayscholar</option>
            <option value="H">Hostel</option>
          </select>
        </div>
        <div>
          <label class="form-label p-0 m-0">Search By</label
          ><select class="form-select" id="search_by">
            <option value="" selected>Select </option>
            <option value="studentEmail">Email</option>
            <option value="fullName">FirstName</option>
            <option value="phoneNo">Phone Number</option>
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
          Submit</button>
          <button type="reset" id="" class="btn btn-secondary mt-4">
            Cancel
          </button>
        </div>
      </form>`);
      $(".search-factors").on("change","input[type='text'],select",()=>{
        $("#table tbody").hide()("#table").next().hide()

      })
      $("#table").on("click",".eye",function(){
        const view_id = $(this).data("id");
        console.log(view_id);
        studentId=view_id
        
        // alert("-->",view_id)
        $.ajax({
          method:"GET",
          url: `https://dev-api.humhealth.com/StudentManagementAPI/students/get?id=${view_id}`,
          dataType:"json",
          success:function(response){
            const res = response.data;
            $(".view-name").text(res.firstName + res.lastName)
            $(".fs-cus").text(res.firstName[0])
            $(".view-class").text(res.studentClass)
            $(".view-city").text(res.cityName)  
            $(".view-str").text(res.streetName)
            $(".view-pin").text(res.postalcode)
            $(".view-mail").text(res.studentEmail)
            $(".view-ecn").text(res.emergencyContactPersonName)
            $(".view-ecp").text(res.emergencyContactPhoneNumber)
            $(".view-gender").text(res.gender==="M"?"Male":"Female")
            $(".view-phone").text(res.phoneNo)
            $(".view-id").text(res.id)
            const ar_date = res.dob.split("-");
                // console.log(a);
                // console.log(`${ar_date[2]}-${ar_date[0]}-${ar_date[1]}`)
                $(".view-dob").text(`${ar_date[0]}-${ar_date[1]}-${ar_date[2]}`);
          }
        })
         $.ajax({
    url:`https://dev-api.humhealth.com/StudentManagementAPI/marks/profile?quarterAndYear=01/2025&studentId=${studentId}`,
    type:"GET",
    dataType:'json',
    success:function(response){
      console.log(response);
      const data = response.data
      $('.score-panel').html(
        `  <form action="">
                      <div class="d-flex gap-5">
                        <div class="form-group">
                          <label for="" class="form-label">Tamil</label>
                          <input
                            type="text"
                            class="form-control"
                            value="${data.tamil || "Not Entered"}"
                            disabled
                          />
                        </div>
                        <div class="form-group">
                          <label for="" class="form-label">English</label>
                          <input
                            type="text"
                            class="form-control"
                            value="${data.english || "Not Entered"}"
                            disabled
                          />
                        </div>
                      </div>
                      <div class="d-flex gap-5">
                        <div class="form-group">
                          <label for="" class="form-label">Maths</label>
                          <input
                            type="text"
                            class="form-control"
                            value="${data.maths || "Not Entered"}"
                            disabled
                          />
                        </div>
                        <div class="form-group">
                          <label for="" class="form-label">SCience</label>
                          <input
                            type="text"
                            class="form-control"
                            value="${data.science || "Not Entered"}"
                            disabled
                          />
                        </div>
                      </div>
                      <div class="form-group">
                        <label for="" class="form-label">Social Science</label>
                        <input
                          type="text"
                          class="form-control"
                          value="${data.socialScience || "Not Entered"}"
                          disabled
                        />
                      </div>
                      <h4 class="fw-bold text-center mt-4">Total Marks : <span class="text-success">${data.total || "Not Entered"}</span></h4>
                    </form>`
      )
      
    }
  })
        $("#view_student_modal").modal("show")
      })
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
            $("#table tbody").show()
            table.ajax.reload();
          });
          $(".pagination .active button").click(() => {
            alert("hii");
            table.ajax.reload();
          });
        },
      });
      $(".exam-score").click(() => {
  $(".score-panel").slideToggle(500, () => {
    // After slideToggle animation is finished
    $(".modal-body").animate(
      { scrollTop: $(".modal-dialog").scrollTop() + 250 },
    );
  });
});


$("#ok").on("click", function () {
  const $btn = $(this);
  $btn.prop("disabled", true).html(`
    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
    Processing...
  `);
$("#reset").click(() => {
  // $("#student_submit_modal").modal("hide");

  // const form = $("#student_submit_modal form")[0]; 
  // form.reset(); // resets all fields
});


  // simulate async action (AJAX)
  setTimeout(() => {
    // reset button or close modal
    $btn.prop("disabled", false).text("Yes");
    $("#student_status").modal("hide");
  }, 2000);
});
$(document).on("click","#reset_modal",function(){
   $("#student_submit_modal").modal("hide");

  const form = $("#student_submit_modal form")[0]; 
  form.reset(); // resets all fields
})
  }
  this.addAndUpdateFunction = function(){
        $(document).on("click","#add_student,.fa-pen-to-square",function(){
    if($(this).is("#add_student")){
          $("#add_submmit").text("Add")

    }

    update_id=0
      $("#dob").datepicker({
      dateFormat: "mm-dd-yy",
  })
    // alert("kkk")
    $(" label.error").remove();
    // console.log("iii>",$(this))
    if($(this).is(".fa-pen-to-square")){
                  $("#add_submmit").text("Update");

      console.log("yes it is")
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
                
                // console.log(a);
                // console.log(`${ar_date[2]}-${ar_date[0]}-${ar_date[1]}`)
                $("#dob").val(res.dob);
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
                $("")
              },
            });
    }

    $("#student_submit_modal").modal("show");
    $.validator.addMethod(
        "regex",
        function (value, element, regexp) {
          let re = new RegExp(regexp);
          return this.optional(element) || re.test(value);
        },
        "Invalid format"
      );
    $(".add-student-form").validate({
      onkeyup:false,
      rules:{
        firstName:{
          required:true,
          regex:/^[A-Z][a-z]{2,25}$/

        },
        lastName:{
          required:true,
          regex:/^[A-Z][a-z]{2,25}$/

        },
        middleName:{
          required:false,
          regex:/^[A-Z][a-z]{2,25}$/
        },
        studentClass:{
          required:true,
          regex:/^[0-9]$/
        },
        gender:{
          required:true,
        },
        dob:{
          required:true,
        },
        activeStatus:{
          required:true,
        },
        studentEmail:{
          required:true,
          regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/
        },
        residingStatus:{
          required:true,
        },
        emergencyContactPersonName:{
          required:true,

        },
        emergencyContactPhoneNumber:{
          required:true,
        },
        phoneNo:{
          required:true,

        },
        streetName:{
          required:true,
        },
        cityName:{
          required:true,
        },
        postalcode:{
          required:true,
        }
      },
      messages:{
         firstName:{
          required:"Enter FirstName",
          regex:"Not valid Name"

        },
        lastName:{
          required:"Enter Lastname",
          regex:"Not Valid Name"

        },
        middleName:{
          // required:true
          regex:"Not a valid name"
        },
        studentClass:{
          required:"Enter Class",
          regex:"Not a Valid Class"
        },
        gender:{
          required:"Enter Gender",
        },
        dob:{
          required:"Enter Date of Birth"
        },
        activeStatus:{
          required:"Select active status"
        },
        studentEmail:{
          required:"Enter mail",
          regex:"Not a Valid Email"
        },
        residingStatus:{
          required:"Select residence"
        },
        emergencyContactPersonName:{
          required:"Enter name"
        },
        emergencyContactPhoneNumber:{
          required:"Enter number"
        },
        phoneNo:{
          required:"Enter mobile number",

        },
        streetName:{
          required:"Enter Street"
        },
        cityName:{
          required:"Enter City"
        },
        postalcode:{
          required:"Enter Postal code"
        }
      },
      submitHandler:function(form,event){
        event.preventDefault()
          const data = $(form).serializeJSON()
          console.log(data);
          data.phoneNo = data.phoneNo.replace(/-/g, "");
          let request = {...data,createdTeacherId:12}
          console.log("update id : ",update_id);
          // return false;
          if(update_id>0){
            request = {id:update_id,...request,updatedTeacherId:7}
          }
          console.log(JSON.stringify(request));

          $.ajax({
          method: "POST",
          url: "https://dev-api.humhealth.com/StudentManagementAPI/students/save",
          data: JSON.stringify(request),
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
              $("#student_success").modal("show");
              setTimeout(() => {
                $("#student_success").modal("hide");
              }, 2000);
            } else {
              $("#studentEmail").after(
                '<span class="text-danger err">Email already Exists</span>'
              );
            }
            update_id=0

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
    })
  });
   $("#add_cancel").click(() => {
    $("#student_submit_modal").modal("hide");
  });
// $("add_student")
  }
}


let studentId = 0

$(document).ready(() => {
 
 
 
});

const student = new Students()
student.getStudentsList()
student.addAndUpdateFunction()
