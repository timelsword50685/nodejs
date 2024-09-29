function openCity(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
  }
      // 默认点击第一个标签
      document.addEventListener("DOMContentLoaded", function() {
        document.getElementsByClassName("tablinks")[1].click();
    });


          // Initialize Datepicker Timepicker
          $(document).ready(function() {
            $('input[name="date"]').datepicker({
                dateFormat: "yy-mm-dd",
                changeMonth: true,      // 允许选择月份
                changeYear: true,       // 允许选择年份
                yearRange: "1900:2100"  // 设置年份范围
            });
            $('input[name="time"]').timepicker({
              timeFormat: 'HH:mm',  // 设置时间格式
              showSecond: false,     // 不显示秒
              controlType: 'select', // 使用下拉菜单选择
              oneLine: true          // 将时间选择器放在一行
          }); 
            // 格式化日期和時間函數
          function formatDateTimeInput(value) {
            return value.padStart(2, '0');
          }

          $('#date-input').on('blur', function() {
            const dateParts = $(this).val().split('-');
 
            if (dateParts.length === 3) {
                const formattedDate = [
                    formatDateTimeInput(dateParts[0]),
                    formatDateTimeInput(dateParts[1]),
                    formatDateTimeInput(dateParts[2])
                ].join('-');
                $(this).val(formattedDate);
            }
        });
    
        $('#time-input').on('blur', function() {
            const timeParts = $(this).val().split(':');
            if (timeParts.length === 2) {
                const formattedTime = [
                    formatDateTimeInput(timeParts[0]),
                    formatDateTimeInput(timeParts[1])
                ].join(':');
                $(this).val(formattedTime);
            }
        });
        // 函数：将公历生日转换为农历生日
        function convertToLunar(solarDate) {
          if (typeof Lunar === 'undefined') {
              console.error('Lunar library is not loaded.');
              return null;
          }
          const [year, month, day] = solarDate.split('-').map(Number);
          // const solar = new Lunar.Solar(year, month, day);
          // const lunar = Lunar.Solar.fromSolar(solar);

          let solar = Solar.fromYmd(year,month,day);

          const lunar = solar.getLunar();
  
          const lunarYear = lunar.getYear();
          const lunarMonth = String(lunar.getMonth()).padStart(2, '0');
          const lunarDay = String(lunar.getDay()).padStart(2, '0');
  
          return `${lunarYear}-${lunarMonth}-${lunarDay}`;

          // // 解析公历日期
          // const [year, month, day] = solarDate.split('-').map(Number);

          // // 创建 Solar 对象
          // const solar = new Lunar.getSolar(year, month, day);

          // // 转换为农历
          // const lunar = Lunar.Lunar.fromSolar(solar);

          // // 获取农历年月日
          // const lunarYear = lunar.getYear();
          // const lunarMonth = String(lunar.getMonth()).padStart(2, '0');
          // const lunarDay = String(lunar.getDay()).padStart(2, '0');

          // // 返回格式化后的农历日期
          // return `${lunarYear}-${lunarMonth}-${lunarDay}`;
      }
          //階段數&流年查詢
          $('#queryButton_Fleeting_Time').on('click', function() {

            const dateInput  = $('#date-input02').val();
            const timeInput  = $('#time-input02').val();
            const forgetTime_minute  = $('#forgettimebox2').is(':checked');  //只忘記分
            const forgetTime  = $('#forgettimebox3').is(':checked');  //忘記時分
            const usernameinput  = $('#username-input').val();
            const usergenderinput  = $('#usergender-input').val();
            var Symbol = '+';
            if ((!forgetTime || !forgetTime_minute) && timeInput === ""){
              throw new Error(alert("請輸入時跟分")); //方法一
            }
            

            $("#Fleeting_Time_result").toggle(); // 切換div的顯示與隱藏
            if (!dateInput) {
              alert('請輸入生日');                    //方法二
              return;
            }
            //計算國曆
            $.ajax({
                url: '/api/basicAnalysis.js',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({symbol_input:Symbol, date: dateInput, time: timeInput,forgetTime_minute : forgetTime_minute, forgetTime: forgetTime }),
                success: function(response) {
                  let formattedResponse = response.result;
                  let SymbolNumber = Number(formattedResponse.split("&&")[1]);
                  formattedResponse = formattedResponse.split("&&")[0];
                  formattedResponse = formattedResponse.replace(/\n/g, "</br>");
                  //$('#basicResult_title').html('老年數   中年數   青年數   青少年數   幼年數');
                  formattedResponse = formattedResponse.replace(/\*/g, "");
                    $('#basicResult').html(formattedResponse);
                    let Result_arr = [];
                    var basicResult = "#basicResult_SoulNumber";
                    Result_arr  = SoulNumber(formattedResponse);
                    // let result = Result_arr.join("、"); // 使用 "、" 作为分隔符
                    // 遍历数组，将每个值放入一个 span 中
                    // alert(Result_arr);
                    SoulNumberSpan(Result_arr,basicResult);

                    // $('#basicResult_SoulNumber').html(result);
                    // let lastCharA = Number(formattedResponse.charAt(formattedResponse.length - 1));
                    var NumberIndex = 1;
                    NumberIndex = TriangleNumberInput(SymbolNumber,NumberIndex); //帶入三角形每邊的值
                    var FluentYear = GetFluentYear(dateInput);                //取得流年數
                    //alert(FluentYear);
                    var lastCharFluentYear = FluentYear.charAt(FluentYear.length - 1);
                    //alert(lastCharFluentYear);
                    //alert(TargetPosition(lastCharFluentYear));
                    var containerid = "container_1_1";
                    $('#'+TargetPosition(lastCharFluentYear,containerid)).html(FluentYear);
                    
                    //計算農曆
                    Symbol = '-';
                    const lunarBirthday = convertToLunar(dateInput);
                    $.ajax({
                      url: '/api/basicAnalysis.js',
                      method: 'POST',
                      contentType: 'application/json',
                      data: JSON.stringify({symbol_input:Symbol, date: lunarBirthday, time: timeInput,forgetTime_minute : forgetTime_minute, forgetTime: forgetTime }),
                      success: function(response) {
                        let formattedResponse2 = response.result;
                        let SymbolNumber = Number(formattedResponse2.split("&&")[1]);
                        formattedResponse2 = formattedResponse2.split("&&")[0];
                        formattedResponse2 = formattedResponse2.replace(/\n/g, "</br>");
                        formattedResponse2 = formattedResponse2.replace(/\*/g, "");
                        //$('#basicResult2_title').html('老年數   中年數   青年數   青少年數   幼年數');
                        $('#basicResult_Lunar').html(formattedResponse2); 
                        let Result_arr02 = [];
                        basicResult = "#basicResult_SoulNumber_Lunar";
                        Result_arr02  = SoulNumber(formattedResponse2,basicResult);
                        // let result = Result_arr.join("、"); // 使用 "、" 作为分隔符
                        // 遍历数组，将每个值放入一个 span 中
                        // alert(Result_arr);
                        SoulNumberSpan(Result_arr02,basicResult);                        
                        // let lastCharB = Number(formattedResponse2.charAt(formattedResponse2.length - 1));
                        // $('#basicResult3').html(`lastCharB:${lastCharB},NumberIndex:${NumberIndex}`);
                        NumberIndex = TriangleNumberInput(SymbolNumber,NumberIndex); 
                        var FluentYear = GetFluentYear(lunarBirthday);                //取得流年數 
                        var lastCharFluentYear = FluentYear.charAt(FluentYear.length - 1);
                        containerid = "container_1_2";
                        $('#'+TargetPosition_2(lastCharFluentYear,containerid)).html(FluentYear);                                              
                      },
                      error: function(error) {
                          console.error('Error:', error);
                          $('#basicResult_Lunar').html('<p>發生錯誤，請稍後再試。</p>');
                      }
                  });                    
                },
                error: function(error) {
                    console.error('Error:', error);
                    $('#basicResult').html('<p>發生錯誤，請稍後再試。</p>');
                }
            });
            const age = calculateAge(dateInput);
            $('#username_gender').html(`${usernameinput}  ${age}歲  ${usergenderinput}`);
            $('#Fleeting_Time_query').addClass('hidden');            
        });

        //配對查詢
        $('#queryButton_Destiny').on('click', function() {
          let datecompare  = new Date($('#date-input03').val());  // 取得第一個日期
          let datecompare02  = new Date($('#date-input04').val());  // 取得第二個日期
          // 比較日期的值
          if (datecompare02 < datecompare) {
            // 如果 dateInput02 比 dateInput 大，則交換它們的值
            var dateInput02  = $('#date-input03').val();
            var timeInput02  = $('#time-input03').val();
            var forgetTime_minute02  = $('#forgettimebox4').is(':checked');  //只忘記分
            var forgetTime02  = $('#forgettimebox5').is(':checked');  //忘記時分
            var usernameinput02  = $('#username-input02').val();
            var usergenderinput02  = $('#usergender-input02').val();
  
            var dateInput  = $('#date-input04').val();
            var timeInput  = $('#time-input04').val();
            var forgetTime_minute  = $('#forgettimebox6').is(':checked');  //只忘記分
            var forgetTime  = $('#forgettimebox7').is(':checked');  //忘記時分
            var usernameinput  = $('#username-input03').val();
            var usergenderinput  = $('#usergender-input03').val();
          }
          else{
            var dateInput  = $('#date-input03').val();
            var timeInput  = $('#time-input03').val();
            var forgetTime_minute  = $('#forgettimebox4').is(':checked');  //只忘記分
            var forgetTime  = $('#forgettimebox5').is(':checked');  //忘記時分
            var usernameinput  = $('#username-input02').val();
            var usergenderinput  = $('#usergender-input02').val();
  
            var dateInput02  = $('#date-input04').val();
            var timeInput02  = $('#time-input04').val();
            var forgetTime_minute02  = $('#forgettimebox6').is(':checked');  //只忘記分
            var forgetTime02  = $('#forgettimebox7').is(':checked');  //忘記時分
            var usernameinput02  = $('#username-input03').val();
            var usergenderinput02  = $('#usergender-input03').val();
          } 
          
        
          if ((!forgetTime || !forgetTime_minute) && timeInput === ""){
            throw new Error(alert("請輸入時跟分"));
          }
          
          if ((!forgetTime02 || !forgetTime_minute02) && timeInput02 === ""){
            throw new Error(alert("請輸入時跟分"));
          }


	        var Counselor = $('#userConsultant-input03').val();          

          var Symbol = '+';
          let Result_arr_mantissa_mine = [];   
          let Result_arr_mantissa_mine_lunar = [];  
          let Result_arr_mantissa_your = [];  
          let Result_arr_mantissa_your_lunar = []; 
          let Result_arr_mantissa_add = [];
          let Result_arr_mantissa_add_lunar = [];
          let Result_arr_mantissa_add_National_Calendar_lunar = [];
          let Final_Result_arr_mantissa_add_National_Calendar_lunar = [];
          let Result_arr_mantissa_add_mine_your = 0;
          var status = false;
          var finalajax = false;
          //$("#Destiny_result").toggle(); // 切換div的顯示與隱藏
          if (!dateInput) {
            alert('請輸入生日');
            return;
          }
          //計算自己國曆
          $.ajax({
              url: '/api/basicAnalysis.js',
              method: 'POST',
              async : false,
              contentType: 'application/json',
              data: JSON.stringify({symbol_input:Symbol, date: dateInput, time: timeInput,forgetTime_minute:forgetTime_minute, forgetTime: forgetTime }),
              success: function(response) {
                // alert("1,"+dateInput);
                let formattedResponse = response.result;
                let SymbolNumber = Number(formattedResponse.split("&&")[1]);
                formattedResponse = formattedResponse.split("&&")[0];
                formattedResponse = formattedResponse.replace(/\n/g, "</br>");
                //$('#basicResult_title').html('老年數   中年數   青年數   青少年數   幼年數');
                let match_formula = formattedResponse.match(/\*(.*?)\*/g);
                let number_1_mine = match_formula[0].replace(/\*/g, "");   
                $('#stage_number_1').html(number_1_mine);
                number_1_mine = match_formula[1].replace(/\*/g, "");               
                $('#stage_number_22').html(number_1_mine);
                number_1_mine = match_formula[2].replace(/\*/g, ""); 
                $('#stage_number_39').html(number_1_mine);


                if (match_formula[3] && match_formula[3].includes('*')) {
                  number_1_mine = match_formula[3].replace(/\*/g, ""); 
                  $('#stage_number_56').html(number_1_mine);  
                }

                if (match_formula[4] && match_formula[4].includes('*')) {
                  number_1_mine = match_formula[4].replace(/\*/g, ""); 
                  $('#stage_number_73').html(number_1_mine); 
                }


                           
                 


                
                

                formattedResponse = formattedResponse.replace(/\*/g, "")
                  $('#basicResult_Destiny').html(formattedResponse);
                  let Result_arr = [];
                              
                  var basicResult = "#basicResult_SoulNumber_Destiny";
                  Result_arr  = SoulNumber(formattedResponse);
                  Result_arr_mantissa_mine = mantissa(formattedResponse);

                  $('#stage_number_12').html(Result_arr[0]);
                  $('#stage_number_33').html(Result_arr[1]);
                  $('#stage_number_50').html(Result_arr[2]);




                  $('#stage_number_67').html(Result_arr[3]); 
                  $('#stage_number_84').html(Result_arr[4]);         



                 


                  
                  
                  
                  
                  
                  // let result = Result_arr.join("、"); // 使用 "、" 作为分隔符
                  // 遍历数组，将每个值放入一个 span 中
                  // alert(Result_arr);
                  SoulNumberSpan(Result_arr,basicResult);
                  // alert("2,"+dateInput);
                  // $('#basicResult_SoulNumber').html(result);
                  // let lastCharA = Number(formattedResponse.charAt(formattedResponse.length - 1));
                  var NumberIndex = 20;
                  NumberIndex = TriangleNumberInput(SymbolNumber,NumberIndex); //帶入三角形每邊的值
                  var FluentYear = GetFluentYear(dateInput);                //取得流年數
                  var lastCharFluentYear = FluentYear.charAt(FluentYear.length - 1);
                  var containerid = "container_10_1";
                  //alert(lastCharFluentYear);
                  //alert('#'+TargetPosition(lastCharFluentYear,containerid));
                  //alert(FluentYear);
                  $('#'+TargetPosition(lastCharFluentYear,containerid)).html(FluentYear);
                  // alert("forgetTime_minute,"+forgetTime_minute);
                  // alert("forgetTime,"+forgetTime);
                  //計算自己農曆
                  Symbol = '-';
                  // alert("3,"+dateInput);
                  // alert(response.result);
                  const lunarBirthday = convertToLunar(dateInput);
                  // alert(lunarBirthday);
                  $.ajax({
                    url: '/api/basicAnalysis.js',
                    method: 'POST',
                    async : false,
                    contentType: 'application/json',
                    data: JSON.stringify({symbol_input:Symbol, date: lunarBirthday, time: timeInput,forgetTime_minute:forgetTime_minute, forgetTime: forgetTime }),
                    success: function(response) {
                      // alert(response.result);
                      let formattedResponse2 = response.result;
                      let SymbolNumber = Number(formattedResponse2.split("&&")[1]);
                      formattedResponse2 = formattedResponse2.split("&&")[0];
                      formattedResponse2 = formattedResponse2.replace(/\n/g, "</br>");
                      let match_formula = formattedResponse2.match(/\*(.*?)\*/g);
                      let number_4_lunar_mine = match_formula[0].replace(/\*/g, "");                
                      $('#stage_number_4').html(number_4_lunar_mine);
                      number_4_lunar_mine = match_formula[1].replace(/\*/g, "");                
                      $('#stage_number_25').html(number_4_lunar_mine);
                      number_4_lunar_mine = match_formula[2].replace(/\*/g, "");                
                      $('#stage_number_42').html(number_4_lunar_mine);



                      if (match_formula[3] && match_formula[3].includes('*')) {
                        number_4_lunar_mine = match_formula[3].replace(/\*/g, "");                
                        $('#stage_number_59').html(number_4_lunar_mine); 
                      }

                      if (match_formula[4] && match_formula[4].includes('*')) {
                        number_4_lunar_mine = match_formula[4].replace(/\*/g, "");                
                        $('#stage_number_76').html(number_4_lunar_mine);
                      }                      

 
                                        
                      
    

                                                                
                      
                      //$('#basicResult2_title').html('老年數   中年數   青年數   青少年數   幼年數');
                      formattedResponse2 = formattedResponse2.replace(/\*/g, "");
                      $('#basicResult_Lunar_Destiny').html(formattedResponse2); 
                      let Result_arr02 = [];
                                          
                      basicResult = "#basicResult_SoulNumber_Lunar_Destiny";
                      Result_arr02  = SoulNumber(formattedResponse2,basicResult);
                      Result_arr_mantissa_mine_lunar = mantissa(formattedResponse2);
                      $('#stage_number_14').html(Result_arr02[0]);
                      $('#stage_number_35').html(Result_arr02[1]);
                      $('#stage_number_52').html(Result_arr02[2]);




                      $('#stage_number_69').html(Result_arr02[3]);  
                      $('#stage_number_86').html(Result_arr02[4]);              
                   
     



                      
                      
                      
                      
                      // let result = Result_arr.join("、"); // 使用 "、" 作为分隔符
                      // 遍历数组，将每个值放入一个 span 中
                      // alert(Result_arr);
                      SoulNumberSpan(Result_arr02,basicResult);                        
                      // let lastCharB = Number(formattedResponse2.charAt(formattedResponse2.length - 1));
                      // $('#basicResult3').html(`lastCharB:${lastCharB},NumberIndex:${NumberIndex}`);
                      NumberIndex = TriangleNumberInput(SymbolNumber,NumberIndex); 
                      var FluentYear = GetFluentYear(lunarBirthday);                //取得流年數 
                      var lastCharFluentYear = FluentYear.charAt(FluentYear.length - 1);
                      containerid = "container_10_2";
                      $('#'+TargetPosition_2(lastCharFluentYear,containerid)).html(FluentYear);                                              
                    },
                    error: function(error) {
                        console.error('Error:', error);
                        $('#basicResult_Lunar_Destiny').html('<p>發生錯誤，請稍後再試。</p>');
                    }
                });                    
              },
              error: function(error) {
                  console.error('Error:', error);
                  $('#basicResult_Destiny').html('<p>發生錯誤，請稍後再試。</p>');
              }
          });
          var age = calculateAge(dateInput);
          $('#username_gender_Destiny').html(`${usernameinput}  ${age}歲  ${usergenderinput}`);
          $('#Destiny_Query').addClass('hidden');  
          

          Symbol = '+';
          $("#Destiny_result").toggle(); // 切換div的顯示與隱藏
          if (!dateInput) {
            alert('請輸入生日');
            return;
          }
          //計算對方國曆
          $.ajax({
              url: '/api/basicAnalysis.js',
              method: 'POST',
              async : false,
              contentType: 'application/json',
              data: JSON.stringify({symbol_input:Symbol, date: dateInput02, time: timeInput02,forgetTime_minute:forgetTime_minute02, forgetTime: forgetTime02 }),
              success: function(response) {
                let formattedResponse = response.result;
                let SymbolNumber = Number(formattedResponse.split("&&")[1]);
                formattedResponse = formattedResponse.split("&&")[0];
                formattedResponse = formattedResponse.replace(/\n/g, "</br>");
                let match_formula = formattedResponse.match(/\*(.*?)\*/g);
                let number_1_your = match_formula[0].replace(/\*/g, "");                
              $('#stage_number_2').html(number_1_your);
              number_1_your = match_formula[1].replace(/\*/g, "");                
              $('#stage_number_23').html(number_1_your);
              number_1_your = match_formula[2].replace(/\*/g, "");                
              $('#stage_number_40').html(number_1_your);


       


              if (match_formula[3] && match_formula[3].includes('*')) {
                  number_1_your = match_formula[3].replace(/\*/g, "");                
                  $('#stage_number_57').html(number_1_your);
              } 
              if (match_formula[4] && match_formula[4].includes('*')) {   
                  number_1_your = match_formula[4].replace(/\*/g, "");                
                  $('#stage_number_74').html(number_1_your);         
                }                   

             
              
              
              formattedResponse = formattedResponse.replace(/\*/g, "");
                  $('#basicResult_Destiny_yours').html(formattedResponse);
                  let Result_arr = [];
                                    
                  var basicResult = "#basicResult_SoulNumber_Destiny_yours";
                  Result_arr  = SoulNumber(formattedResponse,basicResult);
                  Result_arr_mantissa_your = mantissa(formattedResponse);
                  $('#stage_number_13').html(Result_arr[0]);
                  $('#stage_number_34').html(Result_arr[1]);
                  $('#stage_number_51').html(Result_arr[2]);

 


                  $('#stage_number_68').html(Result_arr[3]);  
                  $('#stage_number_85').html(Result_arr[4]);           
                     
   
   


                  SoulNumberSpan(Result_arr,basicResult);

                  var NumberIndex = 40;
                  NumberIndex = TriangleNumberInput(SymbolNumber,NumberIndex); //帶入三角形每邊的值
                  var FluentYear = GetFluentYear(dateInput02);                //取得流年數
                  var lastCharFluentYear = FluentYear.charAt(FluentYear.length - 1);
                  var containerid = "container_20_1";
                  $('#'+TargetPosition(lastCharFluentYear,containerid)).html(FluentYear);
                  
                  //計算對方農曆
                  Symbol = '-';
                  const lunarBirthday = convertToLunar(dateInput02);
                  finalajax = $.ajax({
                    url: '/api/basicAnalysis.js',
                    method: 'POST',
                    async : false,
                    contentType: 'application/json',
                    data: JSON.stringify({symbol_input:Symbol, date: lunarBirthday, time: timeInput02,forgetTime_minute:forgetTime_minute02, forgetTime: forgetTime02 }),
                    success: function(response) {
                      let formattedResponse2 = response.result;
                      let SymbolNumber = Number(formattedResponse2.split("&&")[1]);
                      formattedResponse2 = formattedResponse2.split("&&")[0];
                      formattedResponse2 = formattedResponse2.replace(/\n/g, "</br>");
                      let match_formula = formattedResponse2.match(/\*(.*?)\*/g);
                      let number_3_lunar_your = match_formula[0].replace(/\*/g, "");                
                      $('#stage_number_3').html(number_3_lunar_your);
                      number_3_lunar_your = match_formula[1].replace(/\*/g, "");                
                      $('#stage_number_24').html(number_3_lunar_your);
                      number_3_lunar_your = match_formula[2].replace(/\*/g, "");                
                      $('#stage_number_41').html(number_3_lunar_your);

        


                      if (match_formula[3] && match_formula[3].includes('*')) {
                          number_3_lunar_your = match_formula[3].replace(/\*/g, "");                
                          $('#stage_number_58').html(number_3_lunar_your); 
                      }
                      if (match_formula[4] && match_formula[4].includes('*')) {    
                          number_3_lunar_your = match_formula[4].replace(/\*/g, "");                
                          $('#stage_number_75').html(number_3_lunar_your);                                          
                      }
          
                         
                                                               
                      formattedResponse2 = formattedResponse2.replace(/\*/g, "");
                      $('#basicResult_Lunar_Destiny_yours').html(formattedResponse2); 
                      let Result_arr02 = [];                   
                      basicResult = "#basicResult_SoulNumber_Lunar_Destiny_yours";
                      Result_arr02  = SoulNumber(formattedResponse2,basicResult);
                      Result_arr_mantissa_your_lunar = mantissa(formattedResponse2);
                      // alert('1 : ' + Result_arr_mantissa_mine);
                      // alert('2 : ' + Result_arr_mantissa_mine_lunar);
                      // alert('3 : ' + Result_arr_mantissa_your);
                      // alert('4 : ' + Result_arr_mantissa_your_lunar);
                      // alert(`add 1+2 = ${mantissa_add(Result_arr_mantissa_mine,Result_arr_mantissa_mine_lunar)}`);
                      // alert(`add 3+4 = ${mantissa_add(Result_arr_mantissa_your,Result_arr_mantissa_your_lunar)}`);


                      //老年配對
                      //計算自己跟自己，對方跟對方
                      let Result_arr_mantissa_add_mime = mantissa_add(Result_arr_mantissa_mine,Result_arr_mantissa_mine_lunar);
                      let Result_arr_mantissa_add_your = mantissa_add(Result_arr_mantissa_your,Result_arr_mantissa_your_lunar);
                      let Array_Number_Result = 0;
                      Result_arr_mantissa_add_National_Calendar_lunar = processAndSumArrays(Result_arr_mantissa_add_mime,Result_arr_mantissa_add_your);
                      Final_Result_arr_mantissa_add_National_Calendar_lunar = processArray(Result_arr_mantissa_add_National_Calendar_lunar);
                      $('#stage_number_7').html(Final_Result_arr_mantissa_add_National_Calendar_lunar[0]);
                      $('#stage_number_28').html(Final_Result_arr_mantissa_add_National_Calendar_lunar[1]);
                      $('#stage_number_45').html(Final_Result_arr_mantissa_add_National_Calendar_lunar[2]);
                      $('#stage_number_15').html(Result_arr02[0]);
                      $('#stage_number_36').html(Result_arr02[1]);
                      $('#stage_number_53').html(Result_arr02[2]);

        

                      
                      if (String(Final_Result_arr_mantissa_add_National_Calendar_lunar[3]).includes("NaN")) {
                        $('#stage_number_62').html("");
                      }else{
                        $('#stage_number_62').html(Final_Result_arr_mantissa_add_National_Calendar_lunar[3]);
                      }    

                      if (String(Final_Result_arr_mantissa_add_National_Calendar_lunar[4]).includes("NaN")) {
                        $('#stage_number_79').html("");
                      }else{
                        $('#stage_number_79').html(Final_Result_arr_mantissa_add_National_Calendar_lunar[4]); 
                      }                                        
                      
                      
                        


                      $('#stage_number_70').html(Result_arr02[3]); 
                      $('#stage_number_87').html(Result_arr02[4]);                
                        
     
  



                      //計算自己跟對方
                      

                      Result_arr_mantissa_add_mine_your = parseInt(Result_arr_mantissa_mine[0]) + parseInt(Result_arr_mantissa_your[0]);  //國曆相加
                      Array_Number_Result = Result_arr_mantissa_carry(Result_arr_mantissa_add_mine_your);
                      $('#stage_number_8').html(Array_Number_Result);
                      Result_arr_mantissa_add_mine_your = parseInt(Result_arr_mantissa_mine[1]) + parseInt(Result_arr_mantissa_your[1]);  //國曆相加
                      Array_Number_Result = Result_arr_mantissa_carry(Result_arr_mantissa_add_mine_your);
                      $('#stage_number_29').html(Array_Number_Result);
                      Result_arr_mantissa_add_mine_your = parseInt(Result_arr_mantissa_mine[2]) + parseInt(Result_arr_mantissa_your[2]);  //國曆相加
                      Array_Number_Result = Result_arr_mantissa_carry(Result_arr_mantissa_add_mine_your);
                      $('#stage_number_46').html(Array_Number_Result);

                      Result_arr_mantissa_add_mine_your = parseInt(Result_arr_mantissa_mine_lunar[0]) + parseInt(Result_arr_mantissa_your_lunar[0]);  //農曆相加
                      Array_Number_Result = Result_arr_mantissa_carry(Result_arr_mantissa_add_mine_your);
                      $('#stage_number_9').html(Array_Number_Result);
                      Result_arr_mantissa_add_mine_your = parseInt(Result_arr_mantissa_mine_lunar[1]) + parseInt(Result_arr_mantissa_your_lunar[1]);  //農曆相加
                      Array_Number_Result = Result_arr_mantissa_carry(Result_arr_mantissa_add_mine_your);
                      $('#stage_number_30').html(Array_Number_Result);
                      Result_arr_mantissa_add_mine_your = parseInt(Result_arr_mantissa_mine_lunar[2]) + parseInt(Result_arr_mantissa_your_lunar[2]);  //農曆相加
                      Array_Number_Result = Result_arr_mantissa_carry(Result_arr_mantissa_add_mine_your);
                      $('#stage_number_47').html(Array_Number_Result);     

                      Result_arr_mantissa_add_mine_your = parseInt(Result_arr_mantissa_mine[0]) + parseInt(Result_arr_mantissa_your_lunar[0]);  //國農曆相加
                      Array_Number_Result = Result_arr_mantissa_carry(Result_arr_mantissa_add_mine_your);
                      $('#stage_number_10').html(Array_Number_Result);
                      Result_arr_mantissa_add_mine_your = parseInt(Result_arr_mantissa_mine[1]) + parseInt(Result_arr_mantissa_your_lunar[1]);  //國農曆相加
                      Array_Number_Result = Result_arr_mantissa_carry(Result_arr_mantissa_add_mine_your);
                      $('#stage_number_31').html(Array_Number_Result);
                      Result_arr_mantissa_add_mine_your = parseInt(Result_arr_mantissa_mine[2]) + parseInt(Result_arr_mantissa_your_lunar[2]);  //國農曆相加
                      Array_Number_Result = Result_arr_mantissa_carry(Result_arr_mantissa_add_mine_your);
                      $('#stage_number_48').html(Array_Number_Result);

                      Result_arr_mantissa_add_mine_your = parseInt(Result_arr_mantissa_mine_lunar[0]) + parseInt(Result_arr_mantissa_your[0]);  //國農曆相加
                      Array_Number_Result = Result_arr_mantissa_carry(Result_arr_mantissa_add_mine_your);
                      $('#stage_number_11').html(Array_Number_Result);   
                      Result_arr_mantissa_add_mine_your = parseInt(Result_arr_mantissa_mine_lunar[1]) + parseInt(Result_arr_mantissa_your[1]);  //國農曆相加
                      Array_Number_Result = Result_arr_mantissa_carry(Result_arr_mantissa_add_mine_your);
                      $('#stage_number_32').html(Array_Number_Result);   
                      Result_arr_mantissa_add_mine_your = parseInt(Result_arr_mantissa_mine_lunar[2]) + parseInt(Result_arr_mantissa_your[2]);  //國農曆相加
                      Array_Number_Result = Result_arr_mantissa_carry(Result_arr_mantissa_add_mine_your);
                      $('#stage_number_49').html(Array_Number_Result);      
                      
                      $('#stage_number_20').html(Result_arr_mantissa_add_mime[0]);
                      $('#stage_number_21').html(Result_arr_mantissa_add_your[0]);

                      $('#stage_number_37').html(Result_arr_mantissa_add_mime[1]);
                      $('#stage_number_38').html(Result_arr_mantissa_add_your[1]);

                      $('#stage_number_54').html(Result_arr_mantissa_add_mime[2]);
                      $('#stage_number_55').html(Result_arr_mantissa_add_your[2]);








                      $('#stage_number_71').html(Result_arr_mantissa_add_mime[3]);   
                      $('#stage_number_88').html(Result_arr_mantissa_add_mime[4]);            
                        





   

                                               
                      Result_arr_mantissa_add_mine_your = parseInt(Result_arr_mantissa_mine[3]) + parseInt(Result_arr_mantissa_your[3]);  //國曆相加
                      Array_Number_Result = Result_arr_mantissa_carry(Result_arr_mantissa_add_mine_your);                                    
                      // 檢查並替換 undefined 為空白
                      if (String(Array_Number_Result).includes("undefined")) {
                        Array_Number_Result = Array_Number_Result.replace("");
                      }else{
                        $('#stage_number_63').html(Array_Number_Result);
                      }
                                              




                      Result_arr_mantissa_add_mine_your = parseInt(Result_arr_mantissa_mine[4]) + parseInt(Result_arr_mantissa_your[4]);
                      Array_Number_Result = Result_arr_mantissa_carry(Result_arr_mantissa_add_mine_your);                       
                      // 檢查並替換 undefined 為空白
                      if (String(Array_Number_Result).includes("undefined")) {
                        Array_Number_Result = Array_Number_Result.replace("");
                      }else{
                        $('#stage_number_80').html(Array_Number_Result);
                      }                      

                      Result_arr_mantissa_add_mine_your = parseInt(Result_arr_mantissa_mine_lunar[3]) + parseInt(Result_arr_mantissa_your_lunar[3]);  //農曆相加
                      Array_Number_Result = Result_arr_mantissa_carry(Result_arr_mantissa_add_mine_your);
                      
                      // 檢查並替換 undefined 為空白
                      if (String(Array_Number_Result).includes("undefined")) {
                        Array_Number_Result = Array_Number_Result.replace("");
                      }else{
                        $('#stage_number_64').html(Array_Number_Result);
                      } 

                      Result_arr_mantissa_add_mine_your = parseInt(Result_arr_mantissa_mine_lunar[4]) + parseInt(Result_arr_mantissa_your_lunar[4]);  //農曆相加
                      Array_Number_Result = Result_arr_mantissa_carry(Result_arr_mantissa_add_mine_your);                        
                      // 檢查並替換 undefined 為空白
                      if (String(Array_Number_Result).includes("undefined")) {
                        Array_Number_Result = Array_Number_Result.replace("");
                      }else{
                        $('#stage_number_81').html(Array_Number_Result); 
                      }                         

                      Result_arr_mantissa_add_mine_your = parseInt(Result_arr_mantissa_mine[3]) + parseInt(Result_arr_mantissa_your_lunar[3]);  //國農曆相加
                      Array_Number_Result = Result_arr_mantissa_carry(Result_arr_mantissa_add_mine_your);
                      
                      // 檢查並替換 undefined 為空白
                      if (String(Array_Number_Result).includes("undefined")) {
                        Array_Number_Result = Array_Number_Result.replace("");
                      }else{
                        $('#stage_number_65').html(Array_Number_Result); 
                      }                       

                      Result_arr_mantissa_add_mine_your = parseInt(Result_arr_mantissa_mine[4]) + parseInt(Result_arr_mantissa_your_lunar[4]);  //國農曆相加
                      Array_Number_Result = Result_arr_mantissa_carry(Result_arr_mantissa_add_mine_your);
                       
                      // 檢查並替換 undefined 為空白
                      if (String(Array_Number_Result).includes("undefined")) {
                        Array_Number_Result = Array_Number_Result.replace("");
                      }else{
                        $('#stage_number_82').html(Array_Number_Result); 
                      }                          
                      
                      Result_arr_mantissa_add_mine_your = parseInt(Result_arr_mantissa_mine_lunar[3]) + parseInt(Result_arr_mantissa_your[3]);  //國農曆相加
                      Array_Number_Result = Result_arr_mantissa_carry(Result_arr_mantissa_add_mine_your);
                      
                      // 檢查並替換 undefined 為空白
                      if (String(Array_Number_Result).includes("undefined")) {
                        Array_Number_Result = Array_Number_Result.replace("");
                      }else{
                        $('#stage_number_66').html(Array_Number_Result); 
                      }                        

                      Result_arr_mantissa_add_mine_your = parseInt(Result_arr_mantissa_mine_lunar[4]) + parseInt(Result_arr_mantissa_your[4]);  //國農曆相加
                      Array_Number_Result = Result_arr_mantissa_carry(Result_arr_mantissa_add_mine_your);                        
                      
                      // 檢查並替換 undefined 為空白
                      if (String(Array_Number_Result).includes("undefined")) {
                        Array_Number_Result = Array_Number_Result.replace("");
                      }else{
                        $('#stage_number_83').html(Array_Number_Result); 
                      }                         

                      $('#stage_number_72').html(Result_arr_mantissa_add_your[3]);                        
                      $('#stage_number_89').html(Result_arr_mantissa_add_your[4]);   

                                              



                     


                      // 遍历数组，将每个值放入一个 span 中
                      // alert(Result_arr);
                      SoulNumberSpan(Result_arr02,basicResult);                        
                      // let lastCharB = Number(formattedResponse2.charAt(formattedResponse2.length - 1));
                      // $('#basicResult3').html(`lastCharB:${lastCharB},NumberIndex:${NumberIndex}`);
                      NumberIndex = TriangleNumberInput(SymbolNumber,NumberIndex); 
                      var FluentYear = GetFluentYear(lunarBirthday);                //取得流年數 
                      var lastCharFluentYear = FluentYear.charAt(FluentYear.length - 1);
                      containerid = "container_20_2";
                      $('#'+TargetPosition_2(lastCharFluentYear,containerid)).html(FluentYear);                                              
                    },
                    error: function(error) {
                        console.error('Error:', error);
                        $('#basicResult_Lunar_Destiny_yours').html('<p>發生錯誤，請稍後再試。</p>');
                    }
                });                   
              },
              error: function(error) {
                  console.error('Error:', error);
                  $('#basicResult_Destiny_yours').html('<p>發生錯誤，請稍後再試。</p>');
              }
          });
          age = calculateAge(dateInput02);
          $('#username_gender_Destiny_yours').html(`${usernameinput02}  ${age}歲  ${usergenderinput02}`);
          $('#Destiny_Query').addClass('hidden'); 
          // 调用执行函数
          
          // performAsyncOperation();
          // alert(`${Result_arr_mantissa_mine},${Result_arr_mantissa_mine_lunar},${Result_arr_mantissa_your},${Result_arr_mantissa_your_lunar}`);
          // afterClickCallback(allResults);
          // alert(`${Result_arr_mantissa_mine},${Result_arr_mantissa_mine_lunar},${Result_arr_mantissa_your},${Result_arr_mantissa_your_lunar}`);
        
        }); 
        function Result_arr_mantissa_carry(num) {
          // Helper function to sum the digits of a number
          function sumDigits(n) {
            return [...n.toString()].reduce((acc, char) => acc + parseInt(char), 0);
          }
        
          // If the number is greater than 12
          if (num > 12) {
            // Sum the digits of the number
            let result = sumDigits(num);
            
            // If the result is still greater than 12, continue summing digits
            while (result > 12) {
              result = sumDigits(result);
            }
        
            return result;
          }
        
          // If the number is not greater than 12, return it as is
          return num;
        }

        function processAndSumArrays(arr1, arr2) {
          // 輔助函數：如果數字 > 12，則將十位數與個位數相加，否則返回原數
          function processNumber(num) {
            if (num > 12) {
              const digits = num.toString().split('');
              return parseInt(digits[0]) + parseInt(digits[1]);
            }
            return num;
          }
        
          // 將兩個陣列中的元素逐個處理並相加
          let result = arr1.map((num, index) => {
            let processedNum1 = processNumber(num);
            let processedNum2 = processNumber(arr2[index]);
            return processedNum1 + processedNum2;
          });
        
          return result;
        }

        function processArray(arr) {
          // 輔助函數：將數字的十位數與個位數相加
          function sumDigits(num) {
            const digitsSum = num.toString().split('').reduce((acc, char) => acc + parseInt(char), 0);
            // 如果加總結果大於 9，則再相加一次
            return digitsSum > 9 ? `${digitsSum}/${sumDigits(digitsSum)}` : digitsSum;
          }
        
          // 逐個處理陣列中的每個元素
          return arr.map(num => {
            // 將 num 格式化為兩位數，例如 5 會被格式化為 "05"
            const formattedNum = num.toString().padStart(2, '0');
            const summedDigits = sumDigits(num); // 計算數字十位數與個位數的加總
            return `${formattedNum}/${summedDigits}`; // 將格式化後的數與結果用斜線區分
          });
        }   

        function finaladdresult(status){
          var myresultarray = [];
          var yourresultarray = [];
          $.when(finalajax).done(function(){
            if (status){
              alert(myresultarray = mantissa_add(Result_arr_mantissa_mine, Result_arr_mantissa_mine_lunar));
              alert(yourresultarray = mantissa_add(Result_arr_mantissa_your, Result_arr_mantissa_your_lunar));
            }
          });
          // return myresultarray,yourresultarray;
        }       
        function afterClickCallback(allResults) {
          alert(`${Result_arr_mantissa_mine},${Result_arr_mantissa_mine_lunar},${Result_arr_mantissa_your},${Result_arr_mantissa_your_lunar}`);
          alert(allResults);
        }
        function mantissa_add(Result_arr_mantissa, Result_arr_mantissa_lunar) {
          // 辅助函数，用于处理大于 12 的数字
          function processNumber(num) {
            while (num > 12) {
              num = [...num.toString()].reduce((acc, char) => acc + parseInt(char), 0);
            }
            return num;
          }
        
          // 先將每個元素轉換為數字，然後進行對應位置的相加，並進行處理
          let sumArray = Result_arr_mantissa.map((num, index) => {
            // 將數字轉換為數字類型
            const sum = Number(num) + Number(Result_arr_mantissa_lunar[index]);
            // 處理大於 12 的數字
            return processNumber(sum);
          });
        
          return sumArray;
        }     
        // function performAsyncOperation() {
        //   const createPromise = (result_mine, result_mine_lunar, delay) => {
        //     return new Promise((resolve) => {
        //       setTimeout(() => {
        //         resolve(mantissa_add(result_mine, result_mine_lunar));
        //       }, delay);
        //     });
        //   };
          
        //   Promise.all([          
        //     createPromise(Result_arr_mantissa_mine, Result_arr_mantissa_mine_lunar, 1000),
        //     createPromise(Result_arr_mantissa_your, Result_arr_mantissa_your_lunar, 1500)
        //   ])
        //   .then((results) => {
        //     afterClickCallback(results.flat());
        //   })
        //   .catch((error) => {
        //     console.error("其中一个请求失败了", error);
        //   });
        // }

        function calculateAge(birthdate) {
          const birthDate = new Date(birthdate);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
        
          if (today.getMonth() < birthDate.getMonth() || 
              (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
            age--;
          }
        
          return age;
        }
      // function mantissa(formattedResponse){
      //   let reduceDateTime = formattedResponse.split("</br>")[1];//21/3 、 23/5 、 30/3 、 35/8 、 35/8
      //   let matches = [...reduceDateTime.matchAll(/\/(\d+)\b/g)];
      //   let result = matches.map(match => match[1]); // 取得每個匹配中的數字部分
      //   return result;
      // }  
      function mantissa(formattedResponse) {
        // 取得 split 出來的字串
        let reduceDateTime = formattedResponse.split("</br>")[1];
        
        // 將每個元素分割出來
        let elements = reduceDateTime.split(" 、 ");
        
        // 針對每個元素，捕捉最後一個 "/" 之後的數字
        let result = elements.map(element => {
          let parts = element.split("/"); // 按 "/" 分割
          return parts[parts.length - 1]; // 取得最後一個部分
        });
      
        return result;
      }

      function SoulNumber(formattedResponse) {
        const [birthdayParts, reduceDateTime] = formattedResponse.split("</br>");
        const formattedBirthday = birthdayParts.replace(/\+ |- /g, "").replace(/ . /g, "").trim();
        const combinedReduceDateTime = reduceDateTime.replace(/\//g, "").replace(/ 、 /g, "").trim();
      
        const countMap = calculateCountMap(formattedBirthday);
        const loopResult = getLoopResult(combinedReduceDateTime, countMap);
      
        return reduceDateTime.split(" 、 ").map((item, index) => {
          // alert(item);
          // alert(formattedBirthday);
        let Symbol_Count = countSymbol(item.trimEnd(),'/');
        if (Symbol_Count === 1){
          return calculateResult(item.trimEnd(), formattedBirthday, loopResult);
        }else{
          return calculateResultTwo(item.trimEnd(), formattedBirthday, loopResult);
        }
          
        });
      }
      function countSymbol(str, symbol) {
        const matches = str.match(new RegExp(`\\${symbol}`, 'g')); // 用正規表達式全局匹配符號
        return matches ? matches.length : 0; // 返回匹配到的次數
    }
      
      function calculateCountMap(formattedBirthday) {
        return [...formattedBirthday].reduce((acc, char) => {
          // 只計算 '1' 到 '9' 的出現次數
          if (char >= '1' && char <= '9') {
            acc[char] = (acc[char] || 0) + 1;
          }
          return acc;
        }, {});
      }
      
      function getLoopResult(reduceDateTime, countMap) {
        // return [...countMap].filter(char => countMap[char] >= 3 && char !== '0');
        // 獲取物件的值作為陣列
        let values = Object.values(countMap);
        
        // 過濾值大於或等於3，並且不是0的項目
        return values.filter(num => num >= 3 && num !== 0).length;
      }
      
      function calculateResult(item, formattedBirthday, loopResult) {
        const [first, second] = item.trim().slice(0, 2);
        const third = item.split("/")[1];
        // alert(first);
        // alert(second);
        // alert(third);
        const counts = [first, second, third].map(char => (formattedBirthday.split(char).length - 1));
        // alert(counts);
        const [firstResult, secondResult, thirdResult] = counts.map(count => count > 0);
      
        return determineResult(firstResult, secondResult, thirdResult, counts, loopResult ,item);
      }
      function determineResult(firstResult, secondResult, thirdResult, counts, loopResult ,item) {
        // alert(firstResult);
        // alert(secondResult);
        // alert(thirdResult);
        var result_number = 0;
        if (!firstResult && !secondResult && !thirdResult) result_number = 1;

        let isTrue = checkBooleanValues(firstResult, secondResult);
        if ((isTrue) && !thirdResult) result_number = 2;
        if (firstResult && secondResult && !thirdResult) result_number = 3;
        if (!firstResult && !secondResult && thirdResult) result_number = 4;
        if ((isTrue) && thirdResult) result_number = 5;
        if (firstResult && secondResult && thirdResult) {
          if (loopResult !== 0){
            result_number = 6
          }else
          {
            result_number = 7
          }
        }
        return result_number;
      }      
      function checkBooleanValues(firstResult, secondResult){
        // 計算 true 的個數
        const trueCount = [firstResult, secondResult].filter(val => val === true).length;
        const falseCount = [firstResult, secondResult].filter(val => val === false).length;
    
        // 檢查是否有恰好一個 true 和一個 false
        if (trueCount === 1 && falseCount === 1) {
            return true;  // 回傳特定值
        } else {
            return false; // 不符合條件時回傳其他值
        }
      }
      function calculateResultTwo(item, formattedBirthday, loopResult) {
        const [first, second, third, fourth] = item.trim().slice(0, 2) + item.trim().slice(3, 5);
        const fifth = item.split("/")[2];
        // alert(first);
        // alert(second);
        // alert(third);
        const counts = [first, second, third, fourth, fifth].map(char => (formattedBirthday.split(char).length - 1));
        // alert(counts);
        const [firstResult, secondResult, thirdResult, fourthResult, fifthResult] = counts.map(count => count > 0);
      
        return determineResultTwo(firstResult, secondResult, thirdResult, fourthResult, fifthResult, counts, loopResult ,item);
      }      
      
      function determineResultTwo(firstResult, secondResult, thirdResult, fourthResult, fifthResult, counts, loopResult ,item) {
        // alert(firstResult);
        // alert(secondResult);
        // alert(thirdResult);
        var result_number = 0;
        if (!firstResult && !secondResult && !thirdResult && !fourthResult && !fifthResult) result_number = 1;

        let isTrue = checkBooleanValuesTwo(firstResult, secondResult, thirdResult, fourthResult);
        if ((isTrue) && !fifthResult) result_number = 2;
        if (firstResult && secondResult && thirdResult && fourthResult && !fifthResult) result_number = 3;
        if (!firstResult && !secondResult && !thirdResult  && !fourthResult && fifthResult) result_number = 4;
        if ((isTrue) && fifthResult) result_number = 5;
        if (firstResult && secondResult && thirdResult  && fourthResult && fifthResult) {
          if (loopResult !== 0){
            result_number = 6
          }else
          {
            result_number = 7
          }
        }
        return result_number;
      }
      function checkBooleanValuesTwo(firstResult, secondResult, thirdResult, fourthResult) {
        // 計算 true 的個數
        const trueCount = [firstResult, secondResult, thirdResult, fourthResult].filter(val => val === true).length;
        const falseCount = [firstResult, secondResult, thirdResult, fourthResult].filter(val => val === false).length;
    
        // 檢查是否有恰好一個 true 和一個 false
        if (trueCount >= 1 && falseCount >= 1) {
            return true;  // 回傳特定值
        } else {
            return false; // 不符合條件時回傳其他值
        }
    }      
      function SoulNumberSpan(Result_arr,basicResult){
        $.each(Result_arr, function(index, value) {
          // 创建一个新的 span 元素，并设置内容
          const span = $('<span></span>').text(value).addClass('circle');
          // 将 span 元素添加到容器中
          $(basicResult).append(span);
      });
      }        
      function TriangleNumberInput(number,NumberIndex) {
        let NumberIndexEnd = NumberIndex + 8;
        for (NumberIndex ; NumberIndex <= NumberIndexEnd; NumberIndex++) {
          let formattedNum = NumberIndex.toString().padStart(2, '0');
          
          $('#DeltaNumber_'+ formattedNum).html(number);
          if(number===9){
            number = 1;
          }else{
            number += 1;
          }
      }
        return NumberIndex;
      } 
      // function GetFluentYear(birthday) {
      //   const [year, month, day] = birthday.split("-");
      //   const currentYear = (new Date().getMonth() + 1 < month || (new Date().getMonth() + 1 == month && new Date().getDate() < day))
      //     ? new Date().getFullYear() - 1
      //     : new Date().getFullYear();
      
      //   const sumDigits = (str) => [...str].reduce((acc, char) => acc + +char, 0);
      //   const combinedSum = sumDigits(month + day) + sumDigits(currentYear.toString());
      
      //   return `${combinedSum}/${sumDigits(combinedSum.toString())}`;
      // }
      function GetFluentYear(birthday) {
        const [year, month, day] = birthday.split("-");
        const currentYear = (new Date().getMonth() + 1 < month || (new Date().getMonth() + 1 == month && new Date().getDate() < day))
          ? new Date().getFullYear() - 1
          : new Date().getFullYear();
      
        const sumDigits = (str) => [...str].reduce((acc, char) => acc + +char, 0);
        
        // 計算月份+日期的位數和
        let combinedSum = sumDigits(month + day) + sumDigits(currentYear.toString());
      
        // 計算 combinedSum 的位數和
        let denominator = sumDigits(combinedSum.toString());
      
        // 確保分母是個位數，如果不是則繼續將十位和個位相加
        while (denominator >= 10) {
          denominator = sumDigits(denominator.toString());
        }
      
        // 判斷第二個分母是否為個位數
        const secondDenominator = sumDigits(combinedSum.toString());
        if (secondDenominator < 10) {
          if (combinedSum < 10){
            combinedSum = combinedSum.toString().padStart(2, '0');
          }
          return `${combinedSum}/${secondDenominator}`;
        } else {
          return `${combinedSum}/${secondDenominator}/${denominator}`;
        }
      }


      const TargetPosition = (lastCharFluentYear, containerid) => {
        let FindDivId = "";
        $("#" + containerid + " .text").each(function() {
          if ($(this).text() === lastCharFluentYear) {
            const divId = $(this).attr('id');
            FindDivId = $(`div[id*='FluentNumber_${divId.slice(-2)}']`).attr('id') || "";
          }
        });
        return FindDivId;
      };


      const TargetPosition_2 = (lastCharFluentYear,containerid) =>{
        var FindDivId = "";
        $("#" + containerid + " .text").each(function() {       
          if ($(this).text() === lastCharFluentYear) {
            const divId = $(this).attr('id');
            
            var DivIdLastChar = divId.substring(divId.length - 2);
            const div = $("div[id*='FluentNumber_" + DivIdLastChar + "']");
            
            if (div.length > 0) {
              FindDivId = div.attr('id');
              // $('#basicResult4').html(div.attr('id'));
            }
          }
      });   
        return FindDivId;                   
      };       
        
        var currentYear = new Date().getFullYear();
        $('#year').text(currentYear);

         
        });   
        
        function toggleCheckbox(checkedId, otherId) {
          const checkedBox = document.getElementById(checkedId);
          const otherBox = document.getElementById(otherId);
          
          // 如果当前复选框被选中，则取消另一个复选框的选择
          if (checkedBox.checked) {
              otherBox.checked = false;
          }
        }
