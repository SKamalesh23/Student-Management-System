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

const Complian = function(){
    this.getTableFunction = function(){
           function getCompliance(c) {
          if (c === "T") {
            return true;
          }
          return false;
        }
        const table = $("#table").DataTable({
            sort:false,
            processing:true,
            ajax:{
                url:"https://dev-api.humhealth.com/StudentManagementAPI/marks/students/overall/list",
                type:"POST",
                contentType:"application/json",
                dataType:"json",
                data:function(){
                    const req = {
                    quarterAndYear: $("#qa").val(),
                    showTopper: $("#topper").val(),
                    studentClass: $("#class").val(),
                    result: $("#result").val(),
                    isCompliance: getCompliance($("#compliance").val()),
                    };
                    return JSON.stringify(req)
                },
            
            },
            dataSrc:'data',
    dom: "<dt-header<'search-factors '><'float-end pt-2'p>t<'d-flex justify-content-between' i p>>",
    columns:[
        {
            title:"Name",
            data:'studentName'
        },
        {
            title:"Class",
            data:"studentClass"
        },
        {
            title:"Quarter and Year",
            data:"quarterAndYear"
        },
        {
            title:"Total",
            data:"total"
        },
        {
            title:"Result",
            data:"result"
        }
    ],
    initComplete:function(){
        $(".search-factors").html(`
                 <div id="download_filter">
                 <div class="d-flex justify-content-end">
                    <button class="btn btn-second mt-4" type="button" id="download_report">Download Report <i class="fa-solid fa-download"></i></button>
                </div>
              <form class="row">
                <div class="form-group col-2">
                    <label class="form-label">Quarter And Year</label>
                    <select class="form-select" id="qa">
                      <option value="01/2025">I</option>
                      <option value="02/2025">II</option>
                      <option value="03/2025">III</option>
                    </select>               
                   </div>
                <div class="form-group col-2">
                    <label class="form-label" id="topper">Show Topper</label>
                    <select class="form-select">
                      <option value="Y">Yes</option>
                      <option value="N">No</option>
                    </select>               
                   </div>
                   <div class="form-group col-2">
                    <label class="form-label">Class</label>
                    <input class="form-control" id="class" placeholder="Enter Class"/>
                   </div>
                      <div class="form-group col-2">
                    <label class="form-label">Result</label>
                    <select class="form-select" id="result">
                      <option value="P">Pass</option>
                      <option value="F">Fail</option>
                    </select>               
                   </div>
                      <div class="form-group col-2">
                    <label class="form-label">Complaiance</label>
                    <select class="form-select" id="compliance">
                      <option value="T">True</option>
                      <option value="F">False</option>
                    </select>               
                   </div>
                   <div class="form-group col-2 mt-1">
                    <button class="btn btn-primary mt-4" type="button" id="download_confirm">Submit</button>
                    <button class="btn btn-secondary mt-4" type="reset" id="download_confirm">Cancel</button>

                   </div>
              </form>
            </div>
            `)
            $(document).on("click","#download_confirm",function(){
                table.ajax.reload()
              $("#table tbody").show()

            })
            $(document).on("change","input,select",()=>{
              $("#table tbody").hide()
            })
            $(document).on("click","#download_report",function(){
                  const req = {
                    quarterAndYear: $("#qa").val(),
                    showTopper: $("#topper").val(),
                    studentClass: $("#class").val(),
                    result: $("#result").val(),
                    isCompliance: getCompliance($("#compliance").val()),
                    };
                 $.ajax({
          url: "https://dev-api.humhealth.com/StudentManagementAPI/marks/students/overall/report",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify(req),
          xhrFields: {
            responseType: "blob", // 👈 Important: treat as binary
          },
          success: function (data) {
            // Create a blob from the response
            const blob = new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            // Create temporary link
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = "marks_report.xlsx"; 
            link.click();

            // Clean up
            window.URL.revokeObjectURL(link.href);
          },
          error: function (xhr, statusText, error) {
            console.log("Error rres---->", xhr);
          },
        });
            })
    }

        })
    }
}
const compliance = new Complian()
compliance.getTableFunction()