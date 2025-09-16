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
const load_path = "../components/loader.html"
$("#loader").load(load_path,()=>{
  const script = document.createElement("script")
  script.src = "../js/loader.js"
  script.onload = () =>{
    $("#loader").append("<custom-loader></custom-loader>")
  }
  document.body.appendChild(script)

})

const nav_path = "../components/nav.html"
$(".nav-custom").load(nav_path,()=>{
  const script = document.createElement("script")
  script.src="../js/nav.js";
  script.onload = () =>{
    $('.nav-custom').append("<custom-navbar></custom-navbar>")
  }
  document.body.appendChild(script)
})
const Dashboard = function(){
  this.graphFunction = function(){
    $(".card").on("mouseenter", function () {
    $(this).css({
      transform: "translateY(-5px)",
      "box-shadow": "0 6px 15px rgba(0,0,0,0.15)"
    });
  }).on("mouseleave", function () {
    $(this).css({
      transform: "translateY(0)",
      "box-shadow": "0 4px 10px rgba(0,0,0,0.1)"
    });
  });

  // ========== Chart.js ==========
  if ($("#attendanceChart").length) {
    const ctx1 = $("#attendanceChart")[0].getContext("2d");
    new Chart(ctx1, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        datasets: [
          {
            label: "Attendance %",
            data: [92, 88, 95, 90, 93],
            borderColor: "#2E9BE8",
            backgroundColor: "rgba(46, 155, 232, 0.2)",
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  if ($("#performanceChart").length) {
    const ctx2 = $("#performanceChart")[0].getContext("2d");
    new Chart(ctx2, {
      type: "bar",
      data: {
        labels: ["Maths", "Science", "English", "Social", "Tamil"],
        datasets: [
          {
            label: "Avg Score",
            data: [85, 78, 90, 70, 88],
            backgroundColor: [
              "#2A9D8F",
              "#E76F51",
              "#264653",
              "#E9C46A",
              "#F4A261"
            ]
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, max: 100 }
        }
      }
    });
  }

  // ========== Table interactions ==========
  $("table tbody tr").on("click", function () {
    $(this).toggleClass("table-active");
  });

  }
 this.promiseFunction = function () {
  const studentPromise = new Promise((resolve, reject) => {
    $.ajax({
      url: "https://dev-api.humhealth.com/StudentManagementAPI/students/list",
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        isActive: null,
        isHosteller: false,
        isDayScholar: false,
        searchBy: "",
        searchValue: "",
        start: 0,
        length: 10
      }),
      success: function (response) {
        resolve(response.recordsTotal); // ✅ fix
      },
      error: function (xhr, status, error) {
        reject(status);
      }
    });
  });

  const teacherPromise = new Promise((resolve, reject) => {
    $.ajax({
      url: "https://dev-api.humhealth.com/StudentManagementAPI/teachers/list",
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      data: {
            "teacherName": "",
            "teacherSpeciality": "",
            "teacherEmail": ""
          },
      success: function (response) {
        resolve(response.data.length);
      },
      error: function (xhr, status, error) {
        reject(status);
      }
    });
  });

  const examPromise = new Promise((resolve,reject)=>{
    $.ajax({
      url:"https://dev-api.humhealth.com/StudentManagementAPI/marks/summary/list?quarterAndYear=01/2025",
      type:"GET",
      dataType:"JSON",
      success:function(response){
        const data = response.data
        console.log("-->ll",data.totalPassStudentsCount)
        const res = (data.totalPassStudentsCount/data.totalResultCount)*100
        console.log(res)
        resolve(res)
      }
    })
  })

  Promise.allSettled([studentPromise, teacherPromise,examPromise]).then((results) => {
    console.log(results); // [{status: "fulfilled", value: ...}, {status: "fulfilled", value: ...}]
    
    const studentCount = results[0].status === "fulfilled" ? results[0].value : 0;
    const teacherCount = results[1].status === "fulfilled" ? results[1].value : 0;
    const examScore = results[2].status === "fulfilled" ? results[2].value : 0;

    console.log("Total Students:", studentCount);
    console.log("Total Teachers:", teacherCount);
    console.log("Exam Percentage :", examScore);

    // Example → update dashboard cards
    $("#students_count").text(studentCount);
    $("#teachers_count").text(teacherCount);
    $("#exam_perfomance").text(examScore + "%");
  });
};

}
const dashboard = new Dashboard()
dashboard.graphFunction()
dashboard.promiseFunction()

