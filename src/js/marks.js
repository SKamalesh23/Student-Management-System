const nav_path = "../components/nav.html"
$(".nav-custom").load(nav_path,()=>{
  const script = document.createElement("script")
  script.src="../js/nav.js";
  script.onload = () =>{
    $('.nav-custom').append("<custom-navbar></custom-navbar>")
  }
  document.body.appendChild(script)
})
//header  
const custom = '../components/header.html';
$("#header").load(custom, () => {
  const script = document.createElement("script");
  script.src = "../js/header.js";
  script.onload = () => {
    // Now <header-element> is defined
    $("#header").append("<header-element></header-element>");
  };
  document.body.appendChild(script);
});
//loader
const load_path = "../components/loader.html"
$("#loader").load(load_path,()=>{
  const script = document.createElement("script")
  script.src = "../js/loader.js"
  script.onload = () =>{
    $("#loader").append("<custom-loader></custom-loader>")
  }
  document.body.appendChild(script)

})
  $(document).ready(function(){
      $(".add-marks").on("click", function(){
        $("#contentWrapper").addClass("slide-form");
      });
      $(".cancel").on("click", function(){
        cancelSave()
        $("#contentWrapper").removeClass("slide-form");
      });
    });

   function cancelSave(){
    const id = $("#id");
  const quarter = $("#quarter");
  const tamil = $("#tamil");
  const english = $("#english");
  const maths = $("#maths");
  const science = $("#science");
  const social = $("#social");
  id.val("");
  id.prop("disabled", false);
  quarter.prop("disabled", false);
  quarter.val("");
  tamil.val("");
  english.val("");
  maths.val("");
  science.val("");
  social.val("");
$(".save-marks").text("Save Marks");
}
  const table = $("#table").DataTable({
    sort: false,
    processing: true,
    ajax: {
      url: "https://dev-api.humhealth.com/StudentManagementAPI/marks/list",
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      data: function (d) {
        const result = $("#result_fill");
        const subject = $("#subject");
        const operator = $("#operator");
        const range = $("#range_value");
        const qaf = $("#qaf");
        const name = $("#add_name");
        const start = $("#start");
        const slength = $("#length");
        const asc = $("#asc");
        const res = {
          result: result.length ? result.val() : "",
          subject: subject.length ? subject.val() : "",
          operator: operator.length ? operator.val() : "",
          value: range.length ? range.val() : "",
          quarterAndYear: qaf.length ? qaf.val() : "01/2025",
          name: name.length ? name.val() : "",
          start: start.length ? start.val() : 0,
          length: slength.length ? slength.val() : 10,
          orderColumn: "total",
          orderDirection: asc.length ? asc.val() : "",
        };
        console.log("filter response ---> ", JSON.stringify(res));

        return JSON.stringify(res);
      },
      dataSrc: function (json) {
        console.log("api response ✅ : ", json.data.data);
        return json.data.data;
      },
    },
    dom: "<dt-header<'search-factors '><'float-end pt-2'p>t<'d-flex justify-content-between' i p>>",
    columns: [
        {
            title:"S.No",
            data:null,
          render: function (data, type, row, meta) {
    return meta.row + 1 + meta.settings._iDisplayStart;
  }
          },
      {
        title: "ID",
        data: "studentId",
        createdCell: function (td, cellData, rowData, row, col) {
          $(td).attr("data-id", rowData.markId);
          $(td).addClass("fw-bold");
        },
      },
      {
        title: "Result",
        data: null,
        render: (data, type, row) => {
          if (data.result === "P") {
            return `<p class="text-success fw-bold">Pass</p>`;
          } else {
            return `<p class="text-danger fw-bold">Fail</p>`;
          }
        },
      },
      {
        title: "Tamil",
        data: "tamil",
      },
      {
        title: "English",
        data: "english",
      },
      {
        title: "Maths",
        data: "maths",
      },
      {
        title: "Science",
        data: "science",
      },
      {
        title: "Social",
        data: "socialScience",
      },
      {
        title: "Total",
        data: "total",
        createdCell: function (td, cellData, rowData, row, col) {
          $(td).attr("data-id", rowData.markId);
          $(td).addClass("fw-bold text-primary");
        },
      },
      {
        title: "actions",
        data: null,
        render: () => {
          return `<i class="fa-regular fa-pen-to-square text-secondary"></i>`;
        },
      },
    ],
    initComplete: function () {
      $(".search-factors").append(`
           
            <div id="marks_filter" style="">
                      <form class="d-flex flex-column gap-2">
                      <div class="d-flex gap-2">
                          <div class="form-group">
                            <label class="form-label">Result</label>
                            <select class="form-select" id="result_fill">
                              <option value="P">Pass</option>
                              <option value="F">Fail</option>
                            </select>
                          </div>
                          <div class="form-group">
                            <label class="form-label">Subject</label>
                            <select class="form-select" id="subject">
                              <option value="tamil">Tamil</option>
                              <option value="english">English</option>
                              <option value="maths">Maths</option>
                              <option value="science">Science</option>
                              <option value="socialScience">Social</option>
                            </select>
                          </div>
                          <div class="d-flex gap-5">
                              <div class="form-group">
                                  <label class="form-label">Range</label>
                                  <select class="form-select" id="operator">
                                    <option value="<">Less than</option>
                                    <option value="<=">Less than or equal to</option>
                                    <option value=">">Greater Than</option>
                                    <option value=">=">Greater Than or equal to</option>
                                    <option value="=">Equals</option>
                                  </select>
                              </div>
                              <div class="form-group">
                                  <label class="form-label">Mark</label>
                                  <input type="text" class="form-control" id="range_value"/>
                              </div>
                          </div>
                          <div class="form-group">
                            <label class="form-label">Quarter and Year</label>
                            <select class="form-select" id="qaf">
                              <option value="01/2025">I</option>
                              <option value="02/2025">II</option>
                              <option value="03/2025">III</option>
                            </select>
                          </div>
                        </div>
                        <div class="row">
                        <div class="col-2">
                          <div class="form-group">
                            <label class="form-label p-0 m-0">Name</label>
                            <input class="form-control " placeholder="Enter Name" id="add_name"/>
                          </div>
                        </div>
                          <div class="col-2">
                            <div class="form-group p-0 m-0">
                            <label class="form-label p-0 m-0">Sort</label>
                              <select class="form-select mt-0" id="asc">
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                              </select>
                            
                            </div>
                          
                          </div>
                          <div class="col-2">
                            <div class="form-group gap-0">
                            <label class="form-label p-0 m-0">Start</label>
                              <input class="form-control m-0" type="text" id="start"/>
                            </div>
                              
                          </div>
                          <div class="col-2">
                            <div class="form-group gap-0">
                            <label class="form-label p-0 m-0">Length</label>
                              <input class="form-control m-0" type="text" id="length"/>
                            </div>
                              
                          </div>
                          <div class="col-2"></div>
                            <div class="col-2">
                            <button class="btn btn-second" type="button" id="filter_submit">Submit</button>
                            </div>
                        </div>
                      </form>
                    </div>
            </div>
          `);
      $(document).on("click", "#filter_submit", function () {
        table.ajax.reload();
        $("#table tbody").show()
      });
      $(".search-factors").on("change","input[type],select",()=>{
        $("#table tbody").hide()
      })
      $(document).on("click", "#download_confirm", function () {
        function getCompliance(c) {
          if (c === "T") {
            return true;
          }
          return false;
        }
        const req = {
          quarterAndYear: $("#qa").val(),
          showTopper: $("#topper").val(),
          studentClass: $("#class").val(),
          result: $("#result").val(),
          isCompliance: getCompliance($("#compliance").val()),
        };
        // alert("jiiii")
       
      });
      $(document).on("click", "#add_filter", function () {
        // alert("jjjj")
        $("#marks_filter").slideToggle();
        $("#download_filter").slideUp();
      });
      $(document).on("click", "#summary", function () {
        // alert("jjjj")
        $("#download_filter").slideToggle();
        $("#marks_filter").slideUp();
      });
      $("#table").on("click", ".fa-pen-to-square", function () {
        $row = $(this).closest("tr").find("td:nth-child(2)");
        const dataId = $row.data("id");
        $("#contentWrapper").toggleClass("slide-form");
        $.ajax({
          url: `https://dev-api.humhealth.com/StudentManagementAPI/marks/get?id=${dataId}`,
          type: "GET",
          dataType: "json",
          success: function (response) {
            console.log("marks response -->", response);
            const data = response.data;
            const id = $("#id");
            const quarter = $("#quarter");
            const tamil = $("#tamil");
            const english = $("#english");
            const maths = $("#maths");
            const science = $("#science");
            const social = $("#social");
            id.attr("data-id", dataId);
            console.log(".arkId====>", data.markId);

            id.val(data.studentId);
            id.prop("disabled", true);
            quarter.val(data.quarterAndYear);
            quarter.prop("disabled", true);
            tamil.val(data.tamil);
            english.val(data.english);
            maths.val(data.maths);
            science.val(data.science);
            social.val(data.socialScience);
            const $but = $(".save-marks");
            // $but.addClass('update-marks').removeClass('save-marks').text("Change Marks")
            $but.text("Update Marks");
          },
        });
      });
    },
  });
  $(".update-marks").click(() => {
    alert("updated");
  });
  $(".save-marks").click(() => {
    const mark_regex = /^(100|[0-9]{1,2})$/; // allows 0–100 only

    const id = $("#id");
    const quarter = $("#quarter");
    const tamil = $("#tamil");
    const english = $("#english");
    const maths = $("#maths");
    const science = $("#science");
    const social = $("#social");

    const arr = [id, tamil, english, maths, science, social];
    let valid = true;
    for (let x of arr) {
      const fieldId = x.attr("id"); // get input id (e.g. tamil, english)

      // remove old error message before re-validating
      $("." + fieldId + "-err").remove();

      if (!mark_regex.test(x.val())) {
        x.after(
          `<span class="text-danger ${fieldId}-err err fs-6">Enter Marks in Numbers (0–100)</span>`
        );
        valid = false;
      }
    }
    if (!valid) {
      console.log("returned");

      return;
    }
    if ($(".save-marks").text().trim() === `Save Marks`) {
      console.log("clciked");

      const req = {
        studentId: parseInt(id.val()),
        quarterAndYear: quarter.val(),
        tamil: parseInt(tamil.val()),
        english: parseInt(english.val()),
        maths: parseInt(maths.val()),
        science: parseInt(science.val()),
        socialScience: parseInt(social.val()),
        createdTeacherId: 3,
      };
      const res = [req];
      console.log(JSON.stringify(res));

      $.ajax({
        url: "https://dev-api.humhealth.com/StudentManagementAPI/marks/save",
        type: "POST",
        data: JSON.stringify(res),
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
          // const res = response.data
          console.log(response);
          if (response.status === "success") {
            console.log("response success->", response);
            table.ajax.reload();
            id.val("");
            quarter.val("");
            tamil.val("");
            english.val("");
            maths.val("");
            science.val("");
            social.val("");
            Swal.fire({
              icon: "success",
              title: "Generated",
              text: "✅" + response.data,
              showConfirmButton: false,
              timer: 2000,
            });
          } else {
            Swal.fire({
              icon: "info",
              title: "Generated",
              text: "❗" + response.data,
              showConfirmButton: false,
              timer: 2000,
            });
          }
        },
        error: function (xhr, status, error) {
          console.log(xhr);

          Swal.fire({
            icon: "error",
            title: "Generated",
            text: "🚫 Cant save mark  ",
            showConfirmButton: false,
            timer: 2000,
          });
        },
      });
    } else {
      const req = {
        markId: $("#id").attr("data-id"),
        studentId: parseInt(id.val()),
        quarterAndYear: quarter.val(),
        tamil: parseInt(tamil.val()),
        english: parseInt(english.val()),
        maths: parseInt(maths.val()),
        science: parseInt(science.val()),
        socialScience: parseInt(social.val()),
        updatedTeacherId: 3,
      };
      const res = [req];
      console.log("update----->", JSON.stringify(res));

      $.ajax({
        url: "https://dev-api.humhealth.com/StudentManagementAPI/marks/save",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(res),
        dataType: "json",
        success: function (response) {
          if (response.status === "success") {
            table.ajax.reload();
            $(".modal-success").text("✅" + response.data);
            $(".modal-content").css("background-color", "#1c9646ff");
            $("#success_modal").modal("show");
            setTimeout(() => {
              $("#success_modal").modal("hide");
              $("#success-modal .modal-content").removeClass("bg-success");
            }, 2000);
          }
        },
        error: function (xhr, statusText, error) {
          console.log("error ---->", xhr);
          Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: "❌ " + statusText,
            showConfirmButton: false,
            timer: 2000,
          });
        },
      });
    }
   
cancelSave()
$("#contentWrapper").toggleClass("slide-form");
  });

