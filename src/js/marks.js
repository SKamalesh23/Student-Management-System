  $(document).ready(() => {
    $("nav").load("../components/nav.html");
    $("header").load("../components/header.html");
    const table = $("#table").DataTable({
      sort:false,
      processing:true,
      ajax:{
  url:"https://dev-api.humhealth.com/StudentManagementAPI/marks/list",
  type:"POST",
  contentType:"application/json",
  dataType:"json",
  data: function(d) {
    return JSON.stringify({
      result: "P",
      subject: "maths",
      operator: ">=",
      value: 99,
      quarterAndYear:"01/2025",
      name:"",
      start: d.start || 0,
      length: d.length || 10,
      orderColumn: "total",
      orderDirection: "desc"
    });
  },
  dataSrc:function(json){
    console.log("api response ✅ : ",json.data.data);
    return json.data.data;
  }

      },
      dom:"<dt-header<'search-factors'>t<'d-flex justify-content-between' i p>>",
      columns:[
        {
          title:"ID",
          data:"studentId",
          createdCell: function (td, cellData, rowData, row, col) {
        $(td).attr("data-id", rowData.markId);
        $(td).addClass("fw-bold")
      }
        },
        {
          title:"Tamil",
          data:"tamil"
        },
        {
          title:"English",
          data:"english"
        },
        {
          title:"Maths",
          data:"maths"
        },
        {
          title:"Science",
          data:"science"
        },
        {
          title:"Social",
          data:"socialScience"
        },
        {
          title:"Total",
          data:"total"
        },
        {
          title:"actions",
          data:null,
          render:()=>{
            return `<i class="fa-regular fa-pen-to-square text-secondary"></i>`
          }
        }
      ],
      initComplete:function(){
        $(".search-factors").append(`
            <div class="d-flex justify-content-end gap-4">
              <button type="button" class="btn btn-primary" id="add_filter">Add Filters</button>
              <button type="button" class="btn btn-second" id="summary">Download Report</button>

            </div>
            <div id="marks_filter" style="display:none">
                      <form class="d-flex flex-column gap-2">
                      <div class="d-flex gap-2">
                          <div class="form-group">
                            <label class="form-label">Result</label>
                            <select class="form-select">
                              <option value="P">Pass</option>
                              <option value="F">Pass</option>
                            </select>
                          </div>
                          <div class="form-group">
                            <label class="form-label">Subject</label>
                            <select class="form-select">
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
                                  <select class="form-select">
                                    <option value="<">Less than</option>
                                    <option value="<=">Less than or equal to</option>
                                    <option value=">">Greater Than</option>
                                    <option value=">=">Greater Than or equal to</option>
                                    <option value="==">Equals</option>
                                  </select>
                              </div>
                              <div class="form-group">
                                  <label class="form-label">Mark</label>
                                  <input type="text" class="form-control"/>
                              </div>
                          </div>
                          <div class="form-group">
                            <label class="form-label">Quarter and Year</label>
                            <select class="form-select">
                              <option value="01/2025">I</option>
                              <option value="02/2025">II</option>
                              <option value="03/2025">III</option>
                            </select>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-2">
                            <div class="form-group">
                            <label class="form-label">Sort<label>
                              <select class="form-select">
                                <option>Ascending</option>
                                <option>Descending</option>
                              </select>
                            
                            </div>
                          
                          </div>
                          <div class="col-2">
                            <div class="form-group gap-0">
                            <label class="form-label p-0 m-0">Start</label>
                              <input class="form-control m-0" type="text"/>
                            </div>
                              
                          </div>
                          <div class="col-2">
                            <div class="form-group gap-0">
                            <label class="form-label p-0 m-0">Length</label>
                              <input class="form-control m-0" type="text"/>
                            </div>
                              
                          </div>
                          <div class="col-4"></div>
                            <div class="col-2">
                            <button class="btn btn-second" type="button">Submit</button>
                            </div>
                        </div>
                      </form>
                    </div>
            </div>
          `)
        $(document).on("click","#add_filter",function(){
          // alert("jjjj")
          $("#marks_filter").slideToggle()
        })
        $(document).on("click","#summary",function(){
          // alert("Downloaded")
          $.ajax({
            url:"https://dev-api.humhealth.com/StudentManagementAPI/marks/students/overall/report",
          })
        })
        $('#table').on("click",'.fa-pen-to-square',function(){
          $row = $(this).closest('tr').find('td:first-child')
          console.log($row.data('id'));
          
        })
      }
    })
    $(".save-marks").click(() => {
      console.log("clciked");
      
      const mark_regex = /^(100|[0-9]{1,2})$/; // allows 0–100 only

      const id = $("#id");
      const quarter = $("#quarter");
      const tamil = $("#tamil");
      const english = $("#english");
      const maths = $("#maths");
      const science = $("#science");
      const social = $("#social");

      const arr = [id, tamil, english, maths, science, social];
      let valid = true
      for (let x of arr) {
        const fieldId = x.attr("id"); // get input id (e.g. tamil, english)

        // remove old error message before re-validating
        $("." + fieldId + "-err").remove();

        if (!mark_regex.test(x.val())) {
          x.after(
            `<span class="text-danger ${fieldId}-err err fs-6">Enter Marks in Numbers (0–100)</span>`
          );
          valid = false
        }
      }
      if(!valid){
        console.log("returned");
        
        return;

      }
      const req = {
          studentId:parseInt(id.val()),
          quarterAndYear:quarter.val(),
          tamil:parseInt(tamil.val()),
          english:parseInt(english.val()),
          maths:parseInt(maths.val()),
          science:parseInt(science.val()),
          socialScience:parseInt(social.val()),
          createdTeacherId:3
        }
        const res = [req]
        console.log(JSON.stringify(res));

        
      $.ajax({
        url:"https://dev-api.humhealth.com/StudentManagementAPI/marks/save",
        type:"POST",
        data:JSON.stringify(res),
        contentType:"application/json",
        dataType:"json",
        success:function(response){
          // const res = response.data
          console.log(response)
          if(response.status==="success"){
            console.log("response success->",response);
            table.ajax.reload()
            id.val("")
            quarter.val("")
            tamil.val("")
            english.val("")
            maths.val("")
            science.val("")
            social.val("")
            Swal.fire({
                  icon: "success",
                  title: "Generated",
                  text: "✅" + response.data,
                  showConfirmButton: false,
                  timer: 2000,
                });
          }
          else{
            Swal.fire({
                  icon: "info",
                  title: "Generated",
                  text: "❗" + response.data,
                  showConfirmButton: false,
                  timer: 2000,
                });
          }
        },
        error:function(xhr,status,error){
          console.log(xhr);
          
          Swal.fire({
                  icon: "error",
                  title: "Generated",
                  text: "🚫 Cant save mark  ",
                  showConfirmButton: false,
                  timer: 2000,
                });
        }
      })

      
    });
  });
