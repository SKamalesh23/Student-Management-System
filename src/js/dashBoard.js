
$(document).ready(function () {
  // Load sidebar & header (if you use external components)
  $("nav").load("../components/nav.html");
  $("header").load("../components/header.html");

  // ========== Stats cards hover effect ==========
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
});
