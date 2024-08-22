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
                dateFormat: "yy-mm-dd"
            });
            $('input[name="time"]').timepicker({
              timeFormat: "HH:mm", // Format the time as "HH:mm"
              showHour: true, // Show the hour picker
              showMinute: true, // Show the minute picker
              showSecond: false, // Hide the second picker
              showMillisec: false, // Hide the millisecond picker
              showMicrosec: false, // Hide the microsecond picker
              showTimezone: false, // Hide the timezone picker
              stepMinute: 1 // Set minute steps to 1
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
         
          $('#queryButton_Fleeting_Time').on('click', function() {

            const dateInput  = $('#date-input02').val();
            const timeInput  = $('#time-input02').val();
            const forgetTime  = $('#forgettimebox3').is(':checked');  //忘記時分
            const usernameinput  = $('#username-input').val();
            const usergenderinput  = $('#usergender-input').val();
            var Symbol = '+';
            $("#Fleeting_Time_result").toggle(); // 切換div的顯示與隱藏
            if (!dateInput) {
              alert('請輸入生日');
              return;
            }
            //計算國曆
            $.ajax({
                url: '/api/basicAnalysis.js',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({symbol_input:Symbol, date: dateInput, time: timeInput, forgetTime: forgetTime }),
                success: function(response) {
                  let formattedResponse = response.result;
                  let SymbolNumber = Number(formattedResponse.split("&&")[1]);
                  formattedResponse = formattedResponse.split("&&")[0];
                  formattedResponse = formattedResponse.replace(/\n/g, "</br>");
                  //$('#basicResult_title').html('老年數   中年數   青年數   青少年數   幼年數');

                    $('#basicResult').html(formattedResponse);
                    let Result_arr = [];
                    Result_arr  = SoulNumber(formattedResponse);
                    // let result = Result_arr.join("、"); // 使用 "、" 作为分隔符
                    // 遍历数组，将每个值放入一个 span 中
                    // alert(Result_arr);
                    SoulNumberSpan(Result_arr);

                    // $('#basicResult_SoulNumber').html(result);
                    // let lastCharA = Number(formattedResponse.charAt(formattedResponse.length - 1));
                    var NumberIndex = 1;
                    NumberIndex = TriangleNumberInput(SymbolNumber,NumberIndex); //帶入三角形每邊的值
                    var FluentYear = GetFluentYear(dateInput);                //取得流年數
                    var lastCharFluentYear = FluentYear.charAt(FluentYear.length - 1);
                    $('#'+TargetPosition(lastCharFluentYear)).html(FluentYear);
                    
                    //計算農曆
                    Symbol = '-';
                    const lunarBirthday = convertToLunar(dateInput);
                    $.ajax({
                      url: '/api/basicAnalysis.js',
                      method: 'POST',
                      contentType: 'application/json',
                      data: JSON.stringify({symbol_input:Symbol, date: lunarBirthday, time: timeInput, forgetTime: forgetTime }),
                      success: function(response) {
                        let formattedResponse2 = response.result;
                        let SymbolNumber = Number(formattedResponse2.split("&&")[1]);
                        formattedResponse2 = formattedResponse2.split("&&")[0];
                        formattedResponse2 = formattedResponse2.replace(/\n/g, "</br>");
                        //$('#basicResult2_title').html('老年數   中年數   青年數   青少年數   幼年數');
                        $('#basicResult2').html(formattedResponse2); 
                        // let lastCharB = Number(formattedResponse2.charAt(formattedResponse2.length - 1));
                        // $('#basicResult3').html(`lastCharB:${lastCharB},NumberIndex:${NumberIndex}`);
                        NumberIndex = TriangleNumberInput(SymbolNumber,NumberIndex); 
                        var FluentYear = GetFluentYear(lunarBirthday);                //取得流年數 
                        var lastCharFluentYear = FluentYear.charAt(FluentYear.length - 1);
                        $('#'+TargetPosition_2(lastCharFluentYear)).html(FluentYear);                                              
                      },
                      error: function(error) {
                          console.error('Error:', error);
                          $('#basicResult2').html('<p>發生錯誤，請稍後再試。</p>');
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
        function calculateAge(birthdate) {
          const today = new Date();
          const birthDate = new Date(birthdate);
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              age--;
          }
          return age;
      }
        function SoulNumber(formattedResponse){
          // alert(formattedResponse);
          var birthdayParts = formattedResponse.split("</br>")[0]; //+ 1992 . 11 . 16 . 23 . 00
          var reduceDateTime = formattedResponse.split("</br>")[1];//21/3 、 23/5 、 30/3 、 35/8 、 35/8
          var reduceDateTimeSplitSplit = "";
          var reduceDateTimeSplit = "";
          var reduceDateTimeSplitFirst = "";
          var reduceDateTimeSplitFirst_1 = "";
          var reduceDateTimeSplitFirst_2 = "";
          var reduceDateTimeSplitSecond = "";
          var formattedbirthdayParts = birthdayParts.replace("+ ", "").replace(/ . /g, "");//199211162300  把0去除
          formattedbirthdayParts = formattedbirthdayParts.replace(/\s+/g, '');
          var result;
          var result_six = false;
          var Result_arr = [];
          // formattedbirthdayParts = formattedbirthdayParts.split("");//1,9,9,2,1,1,1,6,2,3,0,0
          reduceDateTimeSplitSplit = reduceDateTime.replace(/\//g, "").replace(/ 、 /g, "");  //213235303358358 把0去除
          reduceDateTimeSplitSplit = reduceDateTimeSplitSplit.replace(/\s+/g, '');
          // alert(reduceDateTimeSplitSplit);
          // alert(formattedbirthdayParts);
          // 创建一个对象来存储 str2 中每个数字的出现次数
          let countMap = {};

          // 遍历 str2，统计每个数字的出现次数
          for (let char of formattedbirthdayParts) {
            if (countMap[char]) {
              countMap[char]++;
            } else {
              countMap[char] = 1;
            }
          }
          // // 將 countMap 的內容轉換為字符串格式
          // let result_map = "";
          // for (let char in countMap) {
          //   result_map += `字符 ${char} 出现了 ${countMap[char]} 次\n`;
          // }

          // // 使用 alert 來顯示結果
          // alert(result_map);




          // 遍历 str1，检查每个数字在 str2 中是否出现了至少 3 次
          let loop_result = [];
          for (let char of reduceDateTimeSplitSplit) {
            if (countMap[char] >= 3 && !loop_result.includes(char)) {
              loop_result.push(char);
            }
          }
          // alert(loop_result);
          reduceDateTime = reduceDateTime.split(" 、 ");
          for (let i = 0; i < reduceDateTime.length; i++) {
            reduceDateTimeSplit = reduceDateTime[i];  //99/18/9
            let Count_Slash = reduceDateTimeSplit.split('/').length - 1;  //假如 99/18/9 則/出現兩次
            reduceDateTimeSplitFirst = reduceDateTimeSplit.split("/")[0]; //99
            if(i === 0){        //第一個數會為正負號需跳過
              reduceDateTimeSplitFirst_1 = reduceDateTimeSplitFirst.split('')[1];//第一個9
              reduceDateTimeSplitFirst_2 = reduceDateTimeSplitFirst.split('')[2];//第二個9
            }else{
              reduceDateTimeSplitFirst_1 = reduceDateTimeSplitFirst.split('')[0];//第一個9
              reduceDateTimeSplitFirst_2 = reduceDateTimeSplitFirst.split('')[1];//第二個9
            }
            //  alert(reduceDateTimeSplitFirst);            
            //  alert(reduceDateTimeSplitFirst_1);            
            //  alert(reduceDateTimeSplitFirst_2);
            let parts = formattedbirthdayParts.split(reduceDateTimeSplitFirst_1);
            
            let First_Count_Circle = parts.length - 1; //9在199211162300出現的次數
            //alert(First_Count_Circle);
                parts = formattedbirthdayParts.split(reduceDateTimeSplitFirst_2);
            
            let Second_Count_Circle = parts.length - 1; //9在199211162300出現的次數
            //  alert(Second_Count_Circle);
            
            if(Count_Slash > 1){
              reduceDateTimeSplitSecond = reduceDateTimeSplit.split("/")[2]; //9
            }else{              
              reduceDateTimeSplitSecond = reduceDateTimeSplit.split("/")[1]; //個位數的話，則取得最後一個數字
            }
            parts = formattedbirthdayParts.split(reduceDateTimeSplitSecond);
            
            let Third_Count_Circle = parts.length - 1; //9在199211162300出現的次數
            //alert(Third_Count_Circle);
            let First_Result  = false; // 布尔值 false
            let Second_Result = false; // 布尔值 false
            let Third_Result  = false; // 布尔值 false
            if(First_Count_Circle > 0){First_Result = true};
            if(Second_Count_Circle > 0){Second_Result = true};
            if(Third_Count_Circle > 0){Third_Result = true};
            //  alert(`${First_Result},${Second_Result},${Third_Result}`);
            if((!First_Result && !Second_Result) && !Third_Result){
              result = 1  //1
            }else
            if(((First_Result && !Second_Result) || (!First_Result && Second_Result)) && !Third_Result){
              result = 2  //2
            }else
            if((First_Result && Second_Result) && !Third_Result){
              result = 3  //3
            }else
            if((!First_Result && !Second_Result) && Third_Result){
              result = 4  //4
            }else
            if(((First_Result && !Second_Result) || (!First_Result && Second_Result)) && Third_Result){
              result = 5  //5
            }else
            if((First_Result && Second_Result) && Third_Result){
              if((First_Count_Circle >= 3 && reduceDateTimeSplitFirst_1 != 0) || (Second_Count_Circle >= 3 && reduceDateTimeSplitFirst_2 != 0) || (Third_Count_Circle >= 3 && reduceDateTimeSplitSecond != 0)){
                result = 6 //6
              }else{
                if(loop_result.length != 0 && !loop_result.includes(0)){  //陣列長度不為0且不包含0的數
                  result = 6 //6 
                }else{
                  result = 7 //7
                }
                
              }             
            }
            // alert(result);
            Result_arr[i] = result;
          }
          return Result_arr;
        }  
      function SoulNumberSpan(Result_arr){
        $.each(Result_arr, function(index, value) {
          // 创建一个新的 span 元素，并设置内容
          const span = $('<span></span>').text(value).addClass('circle');
          // 将 span 元素添加到容器中
          $('#basicResult_SoulNumber').append(span);
      });
      }        
      function TriangleNumberInput(number,NumberIndex) {
        let NumberIndexEnd = NumberIndex + 8;
        for (NumberIndex ; NumberIndex <= NumberIndexEnd; NumberIndex++) {
          $('#DeltaNumber_'+ NumberIndex).html(number);
          if(number===9){
            number = 1;
          }else{
            number += 1;
          }
      }
        return NumberIndex;
      } 
      function GetFluentYear(birthday){
        // 使用 split() 方法将字符串按 '-' 分割为数组
        var dateParts = birthday.split("-");
        var currentYear = new Date().getFullYear();
        // 取得月份和日期
        var month = dateParts[1];
        var day = dateParts[2];
        var today_month = new Date().getMonth() + 1;
        var today_day = new Date().getDate();

        // 将月份和日期组合成一个字符串
        var combined = month + day; // "1116"
        var today_combined = today_month.toString() + today_day.toString();
        //$('#basicResult4').html(`combined:${combined},today_combined:${today_combined}`);
        if (+combined > +today_combined) {
          currentYear = currentYear - 1;
        }
        // 使用 split() 方法将字符串分割成单个字符数组
        var digitsA = combined.split(""); // ["1", "1", "1", "6"]

        // 使用 reduce() 方法将所有数字相加
        var sumA = digitsA.reduce((accumulator, currentValue) => {
            return accumulator + parseInt(currentValue);
        }, 0);  
          
        // 使用 split() 方法将字符串分割成单个字符数组
        var digitsB = currentYear.toString().split(""); // ["2", "0", "2", "4"]
        var sumB = digitsB.reduce((accumulator, currentValue) => {
          return accumulator + parseInt(currentValue);
      }, 0); 
        var sumc = sumA + sumB;
        var sumd = sumc;
        if (sumc > 10){
          sumc = sumc.toString().split("");
          sumc = sumc.reduce((accumulator, currentValue) => {
            return accumulator + parseInt(currentValue);
          }, 0); 
        }
        return `${sumd}/${sumc}`;
      }
      const TargetPosition = (lastCharFluentYear) =>{
        var FindDivId = "";
        $('#container_1_1 .text').each(function() {       
          if ($(this).text() === lastCharFluentYear) {
            const divId = $(this).attr('id');
            
            var DivIdLastChar = divId.charAt(divId.length - 1);
            const div = $("div[id*='FluentNumber_" + DivIdLastChar + "']");
            
            if (div.length > 0) {
              FindDivId = div.attr('id');
              // $('#basicResult4').html(div.attr('id'));
            }
          }
      });   
        return FindDivId;                   
      }; 


      const TargetPosition_2 = (lastCharFluentYear) =>{
        var FindDivId = "";
        $('#container_1_2 .text').each(function() {       
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
