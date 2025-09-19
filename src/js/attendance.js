// const { act } = require("react");

const nav_path = "../components/nav.html";
$(".nav-custom").load(nav_path, () => {
  const script = document.createElement("script");
  script.src = "../js/nav.js";
  script.onload = () => {
    $(".nav-custom").append("<custom-navbar></custom-navbar>");
  };
  document.body.appendChild(script);
});
//header
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
//loader
const load_path = "../components/loader.html";
$("#loader").load(load_path, () => {
  const script = document.createElement("script");
  script.src = "../js/loader.js";
  script.onload = () => {
    $("#loader").append("<custom-loader></custom-loader>");
  };
  document.body.appendChild(script);
});
$(".table-container").load("../components/takeAttendance.html");
$(".view-attendance").click(() => {
  $(".view-attendance")
    .addClass("text-primary current-page")
    .removeClass("text-secondary ");
  $(".take-attendance")
    .addClass("text-secondary")
    .removeClass("text-primary current-page");
  $(".view-absent")
    .addClass("text-seondary")
    .removeClass("text-primary current-page");
  $(".table-container").load("../components/viewAttendance.html", function () {
    //  if ($.fn.DataTable.isDataTable("#table")) {
    //   $("#table").DataTable().clear().destroy();
    // }

    // now init DataTable fresh
    viewAttendanceTable();
  });
});
$(".take-attendance").click(() => {
  $(".take-attendance")
    .addClass(" text-primary current-page")
    .removeClass("text-secondary");
  $(".view-attendance")
    .addClass("text-secondary")
    .removeClass("text-primary current-page");
  $(".view-absent")
    .addClass("text-seondary")
    .removeClass("text-primary current-page");
  $(".table-container").load("../components/takeAttendance.html", function () {
    // destroy if exists
    if ($.fn.DataTable.isDataTable("#table")) {
      $("#table").DataTable().clear().destroy();
    }

    // now init DataTable fresh
    // initAttendanceTable();
    console.log("in");

    getActiveStudents();
  });
});

$(".view-absent").click(() => {
  $(".view-absent")
    .addClass("text-primary current-page")
    .removeClass("text-secondary");
  $(".view-attendance")
    .addClass("text-secondary")
    .removeClass("text-primary current-page");
  $(".take-attendance")
    .addClass("text-secondary")
    .removeClass("text-primary current-page");
  $(".table-container").load("../components/takeAttendance.html", function () {
    // destroy if exists
    if ($.fn.DataTable.isDataTable("#table")) {
      $("#table").DataTable().clear().destroy();
    }

    // now init DataTable fresh
    absentTable();
  });
});
function getMonth(m) {
  const ar = m.split("-"); // ["2025", "09"]
  return parseInt(ar[1], 10); // 9
}
function getYear(m) {
  const ar = m.split("-"); // ["2025", "09"]
  return parseInt(ar[0], 10);
}
function absentTable() {
  let month = $("#month").length ? getMonth($("#month").val()) : 9;
  let year = $("#month").length
    ? getYear($("#month").val())
    : new Date().getFullYear();
  let percent = $("#absent_percent").length ? $("#absent_percent").val() : 50;
  $("#loading-screen").css("opacity", "1");
  $("#loading-screen").show();
  $("#loading-screen").addClass("d-flex justify-content-center ");
  const table = $("#table").DataTable({
    processing: true,
    sort: false,
    ajax: {
      url: `https://dev-api.humhealth.com/StudentManagementAPI/dailyattendance/absent/percentage`,
      type: "GET",
      dataType: "json",
      data: function () {
        return {
          month: $("#month").val() ? getMonth($("#month").val()) : 9,
          year: $("#month").val()
            ? getYear($("#month").val())
            : new Date().getFullYear(),
          absentPercent: $("#absent_percent").val() || 50,
        };
      },
      dataSrc: function (json) {
        // remove duplicates by studentId
        console.log(json);

        const unique = [];
        const seen = new Set();

        json.data.forEach((row) => {
          if (!seen.has(row.studentId)) {
            seen.add(row.studentId);
            unique.push(row);
          }
        });

        return unique; // return cleaned data
      },
    },
    dom: "<dt-header <'search-factors p-2 d-flex justify-content-end'>t<'d-flex justify-content-between'<i><p>>>",
    columns: [
      {
        title: "S.No",
        data: null,
        render: function (data, type, row, meta) {
          return meta.row + 1;
        },
      },

      { data: "studentId", title: "ID" },
      { data: "studentFirstName", title: "First Name" },
      { data: "studentClass", title: "Class" },
      { data: "studentEmail", title: "Email" },
    ],
    initComplete: function () {
      $("#loading-screen").css("opacity", "0");
      $("#loading-screen").hide();
      $("#loading-screen").removeClass("d-flex justify-content-center ");
      $(".search-factors").html(`
        <form class="d-flex gap-5">
              <div class="form-group">
                  <label class="form-label">Month</label>
                  <input type="month" id="month" class="form-control" />
              </div>
              <div class="form-group">
                  <label class="form-label">Percentage</label>
                  <select class="form-select" id="absent_percent">
                    <option value="25">25%</option>
                    <option value="50">50%</option>
                    <option value="75">75%</option>
                    <option value="90">90%</option>
                  </select>
              </div>
              <div class="form-group">
               <label class="form-label mt-5"></label>
              <button type="button" class="btn btn-primary absent-submit ">Submit</button>
              </div>

             
        </form>
        `);
      $(".search-factors").on("click", ".absent-submit", () => {
        table.ajax.reload();
      });
    },
  });

  // Loader show/hide
  $("#table").on("preXhr.dt", function () {
    $("#loadingScreen").show();
  });

  $("#table").on("xhr.dt", function () {
    $("#loadingScreen").hide();
  });
}
function getActiveStudents() {
  console.log("In active ");

  const activePromise = new Promise((resolve, reject) => {
    $.ajax({
      url: "https://dev-api.humhealth.com/StudentManagementAPI/dailyattendance/list",
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        isActive: true,
        isHosteller: false,
        isDayScholar: false,
        searchBy: "",
        searchValue: "",
        start: 0,
        length: 20,
      }),
      success: function (response) {
        console.log("->", response.data);
        resolve([
          ...response.data["01/2025"],
          ...response.data["No attendance"],
        ]);
      },
      error: function (xhr, status, error) {
        console.log("error getting active students");
        reject(status);
      },
    });
  });
  const attendancePromise = new Promise((resolve, reject) => {
    $.ajax({
      url: "https://dev-api.humhealth.com/StudentManagementAPI/dailyattendance/list",
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        tookAttendance: "N",
        today: "Y",
        customDate: null,
        month: null,
        sickLeaveFlag: null,
        ecaFlag: null,
      }),
      success: function (response) {
        const data = [
          ...response.data["01/2025"],
          ...response.data["No attendance"],
        ];
        console.log("success");

        resolve(data);
      },
      error: function (xhr, status, error) {
        reject(status);
      },
    });
  });

  Promise.allSettled([activePromise, attendancePromise]).then((results) => {
    const active = results[0].status === "fulfilled" ? results[0].value : [];
    const attendance =
      results[1].status === "fulfilled" ? results[1].value : [];
    console.log("ACtive :", active);
    console.log("Attendance :", attendance);
    const seen = new Set();
    const result = [];
    attendance.forEach((item) => {
      const res = active.some(
        (student) => student.studentId === item.studentId
      );
      if (res) {
        seen.add(item);
        result.push(item);
      }
    });
    console.log("result->", result);
    const table = $("#table").DataTable({
      processing: true,
      serverSide: false,
      sort: false,
      data:result,
      dom: "<dt-header<'d-flex justify-content-end w-100'<'sub mt-1 w-100 d-flex justify-content-end'> >>",
      columns: [
        {
          title: "S.No",
          data: null,
          render: function (data, type, row, meta) {
            return meta.row + 1;
          },
        },
        {
          title: "ID",
          data: "studentId",
        },
        {
          title: "Name",
          data: null,
          render: function (data) {
            return `<b class="fw-bold">${data.studentFirstName} ${data.studentLastName}</b>`;
          },
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
          },
        },
        {
          title: "Status",
          data: null,
          render: function () {
            return `<div class="d-flex justify-content-center"><p class="bg-warning  w-50 text-center rounded stat-text">Not Taken</p></div>`;
          },
        },
        {
          title: "Present",
          data: null,
          render: function (data) {
            return `<input class="form-check-input attendance" type="checkbox" data-id="${data.id}" style="border-color:#1E2A38"/>`;
          },
        },
        {
          title: "Sick",
          data: null,
          render: function (data) {
            return `<input class="form-check-input sick" type="checkbox" data-id="${data.id}" style="border-color:#1E2A38"/>`;
          },
        },
        {
          title: "ECA",
          data: null,
          render: function (data) {
            return `<input class="form-check-input eca" type="checkbox" data-id="${data.id}" style="border-color:#1E2A38"/>`;
          },
        },
      ],
       
      initComplete: function () {
        $(".sub").html(`
                    <form class="pt-5 p-3 w-25">
                      <button class="btn btn-lg btn-success w-100 " type="button" id="submit_attendance">SUBMIT</button>
                    </form>
                  `);
        $("table").on("change", ".attendance", function () {
          let $row = $(this).closest("tr"); // get the current row
          let isPresent = $(this).is(":checked"); // true if Present
          let $stat = $row.find(".stat-text");
          console.log("stat--->", $stat.text());

          let $sick = $row.find(".sick");
          let $eca = $row.find(".eca");

          if (isPresent) {
            // If Present → disable sick + eca
            $sick.prop("checked", false);
            $eca.prop("checked", false);
            $stat
              .text("Present")
              .removeClass("bg-warning bg-danger text-white")
              .addClass("text-success")
              .css({
                "background-color": "#b5e8c7ff",
                "border-radius": "20px",
              });
          } else {
            // If Absent → enable sick + eca
            $sick.prop("disabled", false);
            $eca.prop("disabled", false);
            $stat
              .text("Not Taken")
              .removeClass("bg-success text-white text-success")
              .addClass("bg-warning");
          }
        });
        $("table").on("change", ".sick", function () {
          // alert("hiii")
          let $row = $(this).closest("tr");
          let $eca = $row.find(".eca");
          let $stat = $row.find(".stat-text");
          let $attendance = $row.find(".attendance");

          console.log($eca);

          let isSick = $(this).is(":checked");
          if (isSick) {
            $eca.prop("checked", false);
            $attendance.prop("checked", false);
            $stat
              .text("Absent")
              .removeClass("bg-warning")
              .addClass("bg-danger text-white");
          } else {
            $eca.prop("disabled", false);
            $stat
              .text("Not Taken")
              .removeClass("bg-danger text-white")
              .addClass("bg-warning text-black");
          }
        });
        $("table").on("change", ".eca", function () {
          // alert("hiii")
          let $row = $(this).closest("tr");
          let $stat = $row.find(".stat-text");
          let $eca = $row.find(".sick");
          let $attendance = $row.find(".attendance");

          console.log($eca);

          let isSick = $(this).is(":checked");
          if (isSick) {
            $eca.prop("checked", false);
            $attendance.prop("checked", false);

            $stat
              .text("Absent")
              .removeClass("bg-warning")
              .addClass("bg-danger text-white");
          } else {
            $eca.prop("disabled", false);
            $stat
              .text("Not Taken")
              .removeClass("bg-danger text-white")
              .addClass("bg-warning text-dark");
          }
        });
        function collectAttendance() {
          let table = $("#table").DataTable();
          let payload = [];

          // Loop over each row in DataTable
          table.rows().every(function () {
            let rowNode = $(this.node()); // get the <tr>
            let data = this.data(); // backend JSON for this row
            console.log("THis is the date--->", data.studentId);

            let isPresent = rowNode.find(".attendance").is(":checked");
            let isSick = rowNode.find(".sick").is(":checked");
            let isEca = rowNode.find(".eca").is(":checked");
            if (!isPresent && !isSick && !isEca) {
              return; // continue to next row
            }
            // Format today’s date as MM-DD-YYYY
            let now = new Date();
            let day = String(now.getDate()).padStart(2, "0");
            let month = String(now.getMonth() + 1).padStart(2, "0");
            let year = now.getFullYear();
            let formattedDate = `${month}-${day}-${year}`;

            payload.push({
              studentId: data.studentId, // from DataTable API
              attendanceDate: formattedDate,

              // If ECA is checked, force "P"
              attendanceStatus: isEca ? "P" : isPresent ? "P" : "A",

              sickLeaveFlag: isSick ? "Y" : "N",
              ecaFlag: isEca ? "Y" : "N",
              createdTeacherId: 7, // static (can be dynamic later)
            });
          });

          return payload;
        }

        $("#submit_attendance").on("click", function () {
          // alert("clicked")
          let payload = collectAttendance();
          console.log(JSON.stringify(payload));
          $.ajax({
            url: "https://dev-api.humhealth.com/StudentManagementAPI/dailyattendance/take",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(payload),
            success: function (res) {
              console.log("Attendance saved successfully:", res);
              if (res.status === "success") {
                Swal.fire({
                  icon: "success",
                  title: "Generated",
                  text: "✅ " + res.data,
                  showConfirmButton: false,
                  timer: 2000,
                });
                let table = $("#table").DataTable();

      table.rows().every(function () {
        let $row = $(this.node());
        let isChecked =
          $row.find(".attendance").is(":checked") ||
          $row.find(".sick").is(":checked") ||
          $row.find(".eca").is(":checked");

        if (isChecked) {
          this.remove(); // remove this row
        }
      });
      table.draw(false)
              } else {
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
            },
          });
        });
      },
    });
    //  getActiveStudents().then(data => {
    //     table.clear().rows.add(data).draw();
    //   });
  });
}

function viewAttendanceTable() {
  function getsearchDate() {
    let today = $("#today").length ? $("#today").is(":checked") : true;
    let custom_date = $("#attendanceDate").length
      ? $("#attendanceDate").val()
      : null;
    const d = new Date();
    if (today || custom_date == "") {
      const date = d.getDate();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      console.log(`today ----> ${year}-${month}-${date}`);
      return `${year}-${month}-${date}`;
    } else {
      console.log("custom---------", custom_date);

      return custom_date;
    }
  }
  if ($.fn.DataTable.isDataTable("#table")) {
    $("#table").DataTable().clear().destroy();
  }

  const table = $("#table").DataTable({
    processing: true,
    serverSide: false,
    ajax: {
      url: "https://dev-api.humhealth.com/StudentManagementAPI/dailyattendance/list",
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      data: function () {
        let attend = $("#stat").length ? $("#stat").val() : "";

        let today = $("#today").length ? $("#today").is(":checked") : null;
        let month = null;
        let c_date = null;

        if (today) {
          // if today is checked, disable date/month
          today = "Y";
          month = null;
          c_date = null;
        } else {
          today = null;
          month = $("#month").length ? $("#month").val() : null;
          c_date = $("#attendanceDate").length
            ? $("#attendanceDate").val()
            : null;
          if (c_date) {
            const arr = c_date.split("-");
            c_date = `${arr[1]}-${arr[2]}-${arr[0]}`;
          }
        }

        let sickLeave = $("#sick").length
          ? $("#sick").is(":checked")
            ? "Y"
            : null
          : null;
        let eca = $("#eca").length
          ? $("#eca").is(":checked")
            ? "Y"
            : null
          : null;

        const payload = {
          tookAttendance: attend,
          today: today,
          customDate: c_date,
          month: $("#month").length ? getMonth($("#month").val()) : null,
          sickLeaveFlag: sickLeave,
          ecaFlag: eca,
        };

        console.log("Request Payload:", JSON.stringify(payload));
        return JSON.stringify(payload);
      },

      dataSrc: function (json) {
        console.log(
          "API response:",
          json.data[$("#quarter").length ? $("#quarter").val() : "01/2025"]
        );
        const keys = Object.keys(json.data || {});
        if (keys.length === 0) return [];

        // flatten response, keep absentDates for later use
        const qt = json.data[
          $("#quarter").length ? $("#quarter").val() : "01/2025"
        ]?.map((r) => ({
          ...r,
          absentDates: r.absentDates || [],
        }));
        const seen = new Set();
        const presentStudents = [];
        const absentStudents = [];
        qt?.forEach((item) => {
          if (item.absentDates.includes(getsearchDate())) {
            absentStudents.push(item);
          } else {
            presentStudents.push(item);
          }
        });
        if (!$("#present").length || $("#present").val() == "") {
          console.log("All students : ", qt);

          return qt;
        } else if ($("#present")?.val() == "Y") {
          console.log("Present students : ", presentStudents);

          return presentStudents;
        } else {
          console.log("absent Studenys : ", absentStudents);

          return absentStudents;
        }
      },
    },
    dom: "<dt-header <'search-factors'>t<'d-flex justify-content-between'<i><p>>>",
    columns: [
      {
        title: "S.No",
        data: null,
        render: function (data, type, row, meta) {
          return meta.row + 1;
        },
      },
      { data: "studentId", title: "ID" },
      { data: "studentFirstName", title: "First Name" },
      {
        title: "Status",
        data: null,
        render: (data) => {
          if ($("#stat")?.val() === "N") {
            return `<span class="bg-warning text-white rounded p-1">Not Taken</span>`;
          }
          if (!data.absentDates.includes(getsearchDate())) {
            return `<span class=" text-success  p-1" style="background-color:#DCFCE7;border-radius:20px"> Present</span>`;
          }
          return `<span class=" text-danger p-1" style="background-color:#FEE2E2;border-radius:20px">Absent</span>`;
        },
      },
      { data: "studentClass", title: "Class" },
      { data: "studentEmail", title: "Email" },
      {
        title: "Absent Dates",
        data: null,
        render: function (data, type, row) {
          return `
            <button 
              class="btn btn-sm show_absent" 
              data-id="${row.studentId}">
              <i class="fa-regular fa-eye"></i>
            </button>`;
        },
      },
    ],

    initComplete: function () {
      console.log("Attendance table loaded ✅");
      $(".search-factors").append(`
      <div class=" d-flex justify-content-start mb-1">
      <div class="fill w-100">
      <form class=" align-items-center fill-form" >
      <div class="row">
      <div class="col-2 form-group">
          <label class="form-label">Quarter</label>
          <select name="" id="quarter" class="form-select">
            <option value="01/2025">I</option>
            <option value="02/2025">II</option>
            <option value="03/2025">III</option>
          </select>
      </div>
        <div class="col-2 form-group">
          <label class="form-label">Attendance</label>
          <select name="" id="stat" class="form-select">
            <option value="Y">Taken</option>
            <option value="N">Not Taken</option>
          </select>
        </div>
        <div class="col-2 form-group">
          <label class="form-label">Status</label>
          <select name="" id="present" class="form-select">
            <option value="">All</option>
            <option value="Y">Present</option>
            <option value="N">Absent</option>
          </select>
        </div>
        <div class=" col-1 form-group mt-5">
          <input type="checkbox" class="form-check-input" id="today"/>
          <label class="form-label" for="today">Today</label>
        </div>
   <div class=" col-2 form-group">
  <label for="attendanceDate" class="form-label">Date</label>
  <input type="text" class="form-control" id="attendanceDate" name="attendanceDate">
</div>
<div class="col-2 form-group">
  <label for="month" class="form-label">Select Month</label>
  <input type="month" id="month" class="form-control">
</div>
</div>
<div class="row">
<div class="col-2 form-group mt-5">
          <input type="checkbox" class="form-check-input" id="sick"/>
          <label class="form-label">Sick Leave</label>
</div>
<div class=" col-8 form-group mt-5">
          <input type="checkbox" class="form-check-input" id="eca" />
          <label class="form-label">Extra Curricular Activities</label>
</div>
<div class="col-1 form-group mt-5"><button type="button" class="btn btn-primary border-none w-100 sub">Submit</button></div>
<div class="col-1 form-group mt-5"><button type="reset" class="btn btn-secondary border-none w-100 reset">Cancel</button></div>
</div>
      </form>
      </div>
    `);
      $("#attendanceDate").datepicker({
        dateFormat: "yy-mm-dd",
        yearRange: "1990:2025",
        changeMonth: true,
        changeYear: true,
      });
      $(".search-factors").on("change", "input,select", () => {
        $("#table tbody,tfoot").hide();
      });
      $(document).on("click", ".reset", () => {
        $("#today").prop("disabled", false);
        $("#attendanceDate").prop("disabled", false);
        $("#today").prop("disabled", false);
        $("#month").prop("disabled", false);
      });
      $(document).on("click", ".add-fill", function () {
        $(".fill").slideToggle();
      });
      $(".fill-form").on("click", ".sub", function () {
        console.log("clickeddd");
        $("#table tbody,tfoot").show();
        table.ajax.reload();
      });
      $(".fill-form").on("change", "#sick", function () {
        let $sick = $(this).is(":checked");
        if ($sick) {
          $("#today").prop("disabled", true);
          $("#attendanceDate").prop("disabled", true);
        } else {
          $("#today").prop("disabled", false);
          $("#attendanceDate").prop("disabled", false);
        }
      });
      $(".fill-form").on("change", "#eca", function () {
        let $sick = $(this).is(":checked");
        if ($sick) {
          $("#today").prop("disabled", true);
          $("#attendanceDate").prop("disabled", true);
        } else {
          $("#today").prop("disabled", false);
          $("#attendanceDate").prop("disabled", false);
        }
      });
      $(".fill-form").on("change", "#today", function () {
        $today = $(this).is(":checked");
        console.log("uuu", $today);

        if ($today) {
          $("#attendanceDate").val("");
          $("#month").val("");
          $("#attendanceDate").prop("disabled", true);
          $("#month").prop("disabled", true);
          $("#sick").prop("disabled", true);
          $("#eca").prop("disabled", true);
          $("#sick").prop("checked", false);
          $("#eca ").prop("checked", false);
        } else {
          $("#attendanceDate").prop("disabled", false);
          $("#month").prop("disabled", false);
          $("#sick").prop("disabled", false);
          $("#eca").prop("disabled", false);
        }
      });
      $("#table").on("click", ".show_absent", function () {
        function getDayFunction(dateString) {
          const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
          const date = new Date(dateString); // e.g. "2025-09-18"
          return days[date.getDay()];
        }

        let table = $("#table").DataTable();
        let rowData = table.row($(this).closest("tr")).data();

        console.log(
          "Absent dates for student:",
          rowData.studentId,
          rowData.absentDates
        );

        let $modal = $("#absentModal");
        let $modalTitle = $modal.find(".modal-title");
        let $modalBody = $modal.find(".modal-body");

        if (!rowData.absentDates || rowData.absentDates.length === 0) {
          $modalTitle.text(`Absent Dates - ${rowData.studentFirstName}`);
          $modalBody.html(
            `<p class="text-muted">This student has no absent dates.</p>`
          );
        } else {
          $modalTitle.text(`Absent Dates - ${rowData.studentFirstName}`);
          let list = rowData.absentDates
            .map(
              (d) =>
                `<li class="">&#128198; ${d}  <span class="text-success mx-3">${getDayFunction(
                  d
                )}</span></li>`
            )
            .join("");
          $modalBody.html(`
        <ul class="d-flex flex-column justify-content-center gap-2 fs-5" style="list-style-type:none;">
          ${list} 
        </ul>
      `);
        }

        // Show Bootstrap modal
        $modal.modal("show");
      });
    },
  });
}

$(document).ready(() => {
  $(".table-container").load("../components/takeAttendance.html", function () {
    getActiveStudents(); // initialize DataTable once DOM is loaded
  });
  $(".save-holidays").click(() => {
    $("#save_holidays").toggle();
  });
});
