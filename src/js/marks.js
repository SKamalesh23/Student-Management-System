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
      value: 90,
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
      dom:"<dt-header>",
      columns:[
        {
          title:"ID",
          data:"studentId"
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
        }
      ]
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
