var container = document.getElementById('handsontable');
var dataSet = null;
var headerSet = [];
var minRows = 21;
var minCols = 20;
var nRow = 0;
var nCol = 0;

var hot = new Handsontable(container,
    {
        colHeaders: true,
        rowHeaders: true,
        height: 520,
        minRows: minRows,
        minCols: minCols,
        stretchH: 'all',
        outsideClickDeselects: false,
        contextMenu: false
    });

var vueOne = new Vue({
    el: '#vueOne',
    data: {
        roadSelected: '',
        typeSelected: '',
        laySelected: '',
        depthSelected: '',
        sensorsSelected: [],
        options: {
            depthList: [],
            roadList: [],
            typeList: [],
            layList: [],
            sensorList: []
        }
    },
    methods: {
        updateVueOptions: function (event) {
        	var strFullPath=window.document.location.href;  
            var strPath=window.document.location.pathname;  
            var pos=strFullPath.indexOf(strPath);  
            var prePath=strFullPath.substring(0,pos);  
            var postPath=strPath.substring(0,strPath.substr(1).indexOf('/')+1);  
            var basePath = prePath;  
            basePath = prePath + postPath;  
            var url = basePath+'/bi/sel-condition.do';
            
            var params = [];
            if (this.roadSelected != '')
                params.push(  'road=' + this.roadSelected ) ;
            if (this.typeSelected != '')
                params.push('type=' + this.typeSelected);
            if (this.laySelected != '')
                params.push( 'lay=' + this.laySelected);
            if (this.depthSelected != '')
                params.push('depvalue=' + this.depthSelected);

            if(params.length > 0 )
                url += '?' + params.join('&');

            console.log(url);
            var thisVue = this;

            $.get( url,  function (data) {
                    thisVue.options = data.result;
                }, 'json');
        }
    }
});

vueOne.updateVueOptions();

var vueFilterMenu = new Vue({
	el: '#filterMenu',
	data: {
		filters: []
	},
	methods: {
		getFilters: function(){
			console.log("refresh filter menu items");
			var thisVue = this;
			var strFullPath=window.document.location.href;  
            var strPath=window.document.location.pathname;  
            var pos=strFullPath.indexOf(strPath);  
            var prePath=strFullPath.substring(0,pos);  
            var postPath=strPath.substring(0,strPath.substr(1).indexOf('/')+1);  
            var basePath = prePath;  
            basePath = prePath + postPath;  
			$.get(basePath+"/bi/filters/getFilters.do", function(data){
				thisVue.filters = data.result;
				$('#filterScript').text(data.result.map(function(filter){return filter.functionBody;}).join("\n"));
			},'json');
		},
		applyFilter: function(event){
			var functionName = event.target.getAttribute('filter');
			$('#filterSubmitButton').click(function(){
				$('#filterDialog').modal('hide');
				var selectedCol = +$('#filterSelectCol').val();
				var vec =[], len = dataSet.length;
				for(var i=0; i<len; i++)
				{
					vec.push(dataSet[i][selectedCol]);
				}
				// trim end
				for(var i=len-1; i>=0; i--)
				{
					if(vec[i] == "" || vec[i] == null){
						vec.pop();
					}else
						break;
				}
				vec = vec.map(function(ele){return +ele});
				var newVec = window[functionName](vec);
				hot.alter('insert_col', selectedCol+1);
				for(var i=0; i<vec.length; i++)
				{
					hot.setDataAtCell(i, selectedCol+1, newVec[i])
				}
				console.log(headerSet);
				//var origin_col_name = headerSet[selectedCol];
				//headerSet.splice(selectedCol+1, 0,  origin_col_name + ' Filterd')
				//setHeader(headerSet);
				headerSet[selectedCol+1] = headerSet[selectedCol] + ' Filterd';
				setHeader(headerSet);
			});
			$('#filterDialog').modal();
		}
	}
});

vueFilterMenu.getFilters();

function applyCheckTime(event){
	var _this = $(event.target);
	var next_select = _this.parent("div").parent("div").siblings("div.col-lg-4").find("div").find("select");
	var checkTime = null,company=null,unitType=null,startTime=null,endTime=null,pileNo=null;
	if(_this.attr("id")=="basic"){
		checkTime = _this.val();
		company = next_select.val();
		unitType = "jiguang";
	}else if(_this.attr("id")=="basic1"){
		company = _this.val();
		checkTime = next_select.val();
		unitType = "jiguang";
	}else if(_this.attr("id")=="basic3"){
		checkTime = _this.val();
		company = next_select.val();
		unitType = "beikemanl";
	}else if(_this.attr("id")=="basic4"){
		company = _this.val();
		checkTime = next_select.val();
		unitType = "beikemanl";
	}else if(_this.attr("id")=="basic5"){
		checkTime = _this.val();
		company = next_select.val();
		unitType = "zidongwanc";
	}else if(_this.attr("id")=="basic6"){
		company = _this.val();
		checkTime = next_select.val();
		unitType = "zidongwanc";
	}else if(_this.attr("id")=="basic7"){
		checkTime = _this.val();
		company = next_select.val();
		unitType = "fwd10m";
	}else if(_this.attr("id")=="basic8"){
		company = _this.val();
		checkTime = next_select.val();
		unitType = "fwd10m";
	}else if(_this.attr("id")=="basic9"){
		checkTime = _this.val();
		company = next_select.val();
		unitType = "duidianfwd10m";
	}else if(_this.attr("id")=="basic10"){
		company = _this.val();
		checkTime = next_select.val();
		unitType = "duidianfwd10m";
	}else if(_this.attr("id")=="startTime"){
		startTime = _this.val();
		endTime = $("#endTime").val();
		company = _this.parent("div").siblings("div.col-lg-4").find("div").find("select").val();
		unitType = "roadCrack";
	}else if(_this.attr("id")=="endTime"){
		startTime = $("#startTime").val();
		endTime = _this.val();
		company = _this.parent("div").siblings("div.col-lg-4").find("div").find("select").val();
		unitType = "roadCrack";
	}else if(_this.attr("id")=="basic12"){
		company = _this.val();
		startTime = $("#startTime").val();
		endTime = $("#endTime").val();
		unitType = "roadCrack";
	}else if(_this.attr("id")=='pileNo'){
		pileNo = _this.val();
		unitType = "pressure";
	}else if(_this.attr("id")=='pileNo1'){
		checkTime = _this.val();
		unitType = "rutPileNo";
	}
	
	$.ajax({
	         url:unitType!='fwd10m'?(unitType!='duidianfwd10m'?(unitType!='roadCrack'?(unitType!='pressure'?(unitType!='rutPileNo'?'/otp4-app/wancheng/jiguanwancheng.do':'/otp4-app/wancheng/rutPileNo.do'):'/otp4-app/wancheng/roadBasePressure.do'):'/otp4-app/wancheng/roadCrack.do'):'/otp4-app/wancheng/duidianfwd10m.do'):'/otp4-app/wancheng/fwd10m.do',
	         data:unitType=="roadCrack"?{startTime:startTime,endTime:endTime,company:company,unitType:unitType}:(unitType!='pressure'?(unitType!='rutPileNo'?{time:checkTime,company:company,unitType:unitType}:{time:checkTime,unitType:unitType}):{pileNo:pileNo}),
	         dataType:"json",
	         success:function(p){
			         value = p['data'];
			         if(value!=null){
			        	 if(_this.attr("id")=="basic"||_this.attr("id")=="basic1"){
			        		 option5.series[0]['data']=value[0];
					         option5.series[1]['data']=value[1];
					         myChart5.hideLoading();
					         option5.xAxis.data = p['x_axis'];
					         myChart5.setOption(option5);  
					         if((value[0]==''||value[0]==',')&&(value[1]==''||value[1]==',')){
					        	 layer.msg('查无数据');
					         }
			        	 }else if(_this.attr("id")=="basic3"||_this.attr("id")=="basic4"){
			        		 option3.series[0]['data']=value[0];
						     option3.series[1]['data']=value[1];
						     myChart3.hideLoading();
						     option3.xAxis.data = p['x_axis'];
						     myChart3.setOption(option3);  
						     if((value[0]==''||value[0]==',')&&(value[1]==''||value[1]==',')){
					        	 layer.msg('查无数据');
					         }
			        	 }else if(_this.attr("id")=="basic5"||_this.attr("id")=="basic6"){
			        		 option6.series[0]['data']=value[0];
						     option6.series[1]['data']=value[1];
						     myChart6.hideLoading();
						     option6.xAxis.data = p['x_axis'];
						     myChart6.setOption(option6);  
						     if((value[0]==''||value[0]==',')&&(value[1]==''||value[1]==',')){
					        	 layer.msg('查无数据');
					         }
			        	 }else if(_this.attr("id")=="basic7"||_this.attr("id")=="basic8"){
			        		 option2.series[0]['data']=value[0];
						     option2.series[1]['data']=value[1];
						     option2.series[2]['data']=value[2];
						     option2.series[3]['data']=value[3];
						     option2.series[4]['data']=value[4];
						     option2.series[5]['data']=value[5];
						     option2.series[6]['data']=value[6];
						     option2.series[7]['data']=value[7];
						     myChart2.hideLoading();
						     option2.xAxis.data = p['x_axis'];
						     myChart2.setOption(option2);  
						     if((value[0]==''||value[0]==',')&&(value[1]==''||value[1]==',')&&(value[2]==''||value[2]==',')&&(value[3]==''||value[3]==',')&&(value[4]==''||value[4]==',')&&(value[5]==''||value[5]==',')&&(value[6]==''||value[6]==',')&&(value[7]==''||value[7]==',')){
					        	 layer.msg('查无数据');
					         }
			        	 }else if(_this.attr("id")=="basic9"||_this.attr("id")=="basic10"){
			        		 option4.series[0]['data']=value[0];
						     option4.series[1]['data']=value[1];
						     option4.series[2]['data']=value[2];
						     option4.series[3]['data']=value[3];
						     myChart4.hideLoading();
						     option4.xAxis.data = p['x_axis'];
						     myChart4.setOption(option4);  
						     if((value[0]==''||value[0]==',')&&(value[1]==''||value[1]==',')&&(value[2]==''||value[2]==',')&&(value[3]==''||value[3]==',')){
					        	 layer.msg('查无数据');
					         }
			        	 }else if(_this.attr("id")=="startTime"||_this.attr("id")=="endTime"||_this.attr("id")=="basic12"){
			        		 option10.series[0]['data']=value[0];
						     option10.series[1]['data']=value[1];
						     myChart10.hideLoading();
						     option10.xAxis.data = p['x_axis'];
						     option10.title.subtext = '所有段面病害总条数:'+p['count']+'条';
						     myChart10.setOption(option10);  
						     if((value[0]==''||value[0]==',')&&(value[1]==''||value[1]==',')){
					        	 layer.msg('查无数据');
					         }
			        	 }else if(_this.attr("id")=="pileNo"){
			        		 option7.series.length = 0;
			        		 myChart7.hideLoading();
					         option7.xAxis.data = p['x_axis'];
					         option7.legend.data = p['legend'];
			        		 for(var j=0;j<value.length;j++){
					        	 var item={data:value[j],name:p['legend'][j],type:'line'};
					        	 option7.series.push(item);
					         }
					         myChart7.setOption(option7); 
			        	 }else if(_this.attr("id")=="pileNo1"){
			        		 option9.series[0]['data']=value[0];
			        		 option9.series[1]['data']=value[1];
					         myChart9.hideLoading();
					         option9.xAxis.data = p['x_axis'];
					         myChart9.setOption(option9);  
					         if((value[0]==''||value[0]==',')&&(value[1]==''||value[1]==',')){
					        	 layer.msg('查无数据');
					         }
			        	 }
				        
			         }
			         
	         }
     });
	 event.preventDefault();
}
var vueCheckTimeMenu = new Vue({
	el: '#checkTimeMenu',
	data: {
		list: []
	},
	methods: {
		getCheckTimes: function(){
			console.log("refresh checkTime menu items");
			var thisVue = this;
			$.get("/otp4-app/wancheng/getCheckTimes.do", {jianceType:'3'},function(data){
				var optionString="";
				for(var i=0;i<data.list.length;i++){
					optionString +="<option value='"+data.list[i].checkTime.substring(0,10)+"'>"+data.list[i].checkTime.substring(0,10)+"</option>";  
				}
				var myobj = document.getElementById("basic");
                if (myobj.options.length == 0)
                {
                    $("#basic").html(optionString);
                    $("#basic").selectpicker('refresh');
                }
			},'json');
			$.get("/otp4-app/wancheng/getCompany.do", function(data){
				var optionString="";
				for(var i=0;i<data.list.length;i++){
					optionString +="<option value='"+data.list[i].value+"'>"+data.list[i].text+"</option>";  
				}
				var myobj = document.getElementById("basic1");
				var myobj4 = document.getElementById("basic4");
				var myobj6 = document.getElementById("basic6");
				var myobj8 = document.getElementById("basic8");
				var myobj10 = document.getElementById("basic10");
				var myobj12 = document.getElementById("basic12");
                if (myobj.options.length == 0||myobj4.options.length == 0||myobj6.options.length == 0||myobj8.options.length == 0||myobj10.options.length == 0||myobj12.options.length == 0)
                {
                    $("#basic1").html(optionString);
                    $("#basic1").selectpicker('refresh');
                    $("#basic4").html(optionString);
                    $("#basic4").selectpicker('refresh');
                    $("#basic6").html(optionString);
                    $("#basic6").selectpicker('refresh');
                    $("#basic8").html(optionString);
                    $("#basic8").selectpicker('refresh');
                    $("#basic10").html(optionString);
                    $("#basic10").selectpicker('refresh');
                    $("#basic12").html(optionString);
                    $("#basic12").selectpicker('refresh');
                }
			},'json');
			$.get("/otp4-app/wancheng/getCheckTimes.do", {jianceType:'1',dataType:'1'},function(data){
				var optionString="";
				for(var i=0;i<data.list.length;i++){
					optionString +="<option value='"+data.list[i].checkTime.substring(0,10)+"'>"+data.list[i].checkTime.substring(0,10)+"</option>";  
				}
				var myobj = document.getElementById("basic3");
                if (myobj.options.length == 0)
                {
                    $("#basic3").html(optionString);
                    $("#basic3").selectpicker('refresh');
                }
			},'json');
			$.get("/otp4-app/wancheng/getCheckTimes.do", {jianceType:'4'},function(data){
				var optionString="";
				for(var i=0;i<data.list.length;i++){
					optionString +="<option value='"+data.list[i].checkTime.substring(0,10)+"'>"+data.list[i].checkTime.substring(0,10)+"</option>";  
				}
				var myobj = document.getElementById("basic5");
                if (myobj.options.length == 0)
                {
                    $("#basic5").html(optionString);
                    $("#basic5").selectpicker('refresh');
                }
			},'json');
			$.get("/otp4-app/wancheng/getCheckTimes.do", {jianceType:'0'},function(data){
				var optionString="";
				for(var i=0;i<data.list.length;i++){
					optionString +="<option value='"+data.list[i].checkTime.substring(0,10)+"'>"+data.list[i].checkTime.substring(0,10)+"</option>";  
				}
				var myobj = document.getElementById("basic7");
                if (myobj.options.length == 0)
                {
                    $("#basic7").html(optionString);
                    $("#basic7").selectpicker('refresh');
                }
			},'json');
			$.get("/otp4-app/wancheng/getCheckTimes.do", {jianceType:'2'},function(data){
				var optionString="";
				for(var i=0;i<data.list.length;i++){
					optionString +="<option value='"+data.list[i].checkTime.substring(0,10)+"'>"+data.list[i].checkTime.substring(0,10)+"</option>";  
				}
				var myobj = document.getElementById("basic9");
                if (myobj.options.length == 0)
                {
                    $("#basic9").html(optionString);
                    $("#basic9").selectpicker('refresh');
                }
			},'json');
			$.get("/otp4-app/wancheng/getCheckPileNo.do",function(data){
				var optionString="";
				for(var i=0;i<data.list.length;i++){
					optionString +="<option value='"+data.list[i]+"'>"+data.list[i]+"</option>";  
				}
				var myobj = document.getElementById("pileNo");
				if (myobj.options.length == 0)
				{
					$("#pileNo").html(optionString);
					$("#pileNo").selectpicker('refresh');
				}
			},'json');
			$.get("/otp4-app/wancheng/getRutCheckTimes.do", function(data){
				var optionString="";
				for(var i=0;i<data.list.length;i++){
					optionString +="<option value='"+data.list[i].checktime.substring(0,10)+"'>"+data.list[i].checktime.substring(0,10)+"</option>";  
				}
				var myobj = document.getElementById("pileNo1");
                if (myobj.options.length == 0)
                {
                    $("#pileNo1").html(optionString);
                    $("#pileNo1").selectpicker('refresh');
                }
			},'json');
		}
	}
});
vueCheckTimeMenu.getCheckTimes();

function export_excel() {
	var result_table =  [];
	result_table.push(headerSet);
	var len = dataSet.length;
	for(var i=0; i<len; i++){
		result_table.push(dataSet[i]);
	}
    var lineArray = [];
    result_table.forEach(function (infoArray, index) {
       var line = infoArray.join(",");
       lineArray.push(index == 0 ? line : line);
    });
    var csvContent = lineArray.join("\n");
    var excel_file = document.createElement('a');
    excel_file.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    excel_file.setAttribute('download', 'result.csv');
    document.body.appendChild(excel_file);
    excel_file.click();
    document.body.removeChild(excel_file);
}

function InitData(data) {
    var header = data.shift();
    setHeader(header);
    setData(data);
}

function setHeader(header) {
    headerSet = header;
    hot.getSettings().colHeaders = headerSet;
    InitSelectHeader('.selectCol', false);
}

function setData(data) {
    nRow = data.length;
    nCol = data[0].length;
    dataSet = data;
    hot.loadData(dataSet);
    console.log("Row: " + nRow + ", Col: " + nCol);
}

function LoadCsv() {
    var file = document.getElementById('file').files[0];
    if (file != null) {
        var reader = new FileReader();
        reader.onload = function () {
            var resultData = Papa.parse(this.result).data;
            InitData(resultData);
        };
        reader.readAsText(file);
    }
}

function onQueryDialog() {
    $('#queryDialog').modal();
}

Number.prototype.pad = function (size) {
    var n = size || 2;
    var s = String(this);
    while (s.length < n) { s = "0" + s; }
    return s;
}

/**
 * @param {Date} date 
 * @returns {String}
 */
function formatLocalDate(date) {
    return date.getFullYear() + "-" + date.getMonth().pad() + "-" + date.getDay().pad() + " " + date.getHours().pad() + ":" +
        date.getMinutes().pad() + ":" + date.getSeconds().pad();
}

function startQuery() {
	var thisVue = this;
	var strFullPath=window.document.location.href;  
    var strPath=window.document.location.pathname;  
    var pos=strFullPath.indexOf(strPath);  
    var prePath=strFullPath.substring(0,pos);  
    var postPath=strPath.substring(0,strPath.substr(1).indexOf('/')+1);  
    var basePath = prePath;  
    basePath = prePath + postPath;  
    var url = basePath+'/bi/sel-data.do?cgqNo=YASTR2_GIJ1089_H-5,YASTR2_GI1376_H-3,&startTime=2016-12-22 00:00:00&endTime=2017-01-04 00:00:00';

    $.get( url, function (data) {
        var columns = [];
        var content = [];
        $.each(data.result, function (k, v) {
            columns.push(k);
            if (k == 'time')
                content.push(v.map(function (n) { return formatLocalDate(new Date(parseInt(n))) }));
            else
                content.push(v);
        });
        //transpose
        var newContent = content[0].map(function (col, i) {
            return content.map(function (row) {
                return row[i]
            })
        });
        setHeader(columns);
        setData(newContent);
    }, 'json');
}

function InitSelectHeader(selector, include_blank) {
    var sx = $(selector);
    sx.html('');

    if (include_blank) {
        $("<option />").attr("value", -1).html("--Empty--").appendTo(sx);
    }

    $.each(headerSet, function (index, name) {
        $("<option />").attr("value", index).html(name).appendTo(sx);
    });
}

function OutlierDetect() {
    $('#outlierResult').text('...');
    $('#outlierDialog').modal();
}

function OnGraph() {
    $('#graphDialog').modal();
}

function onCheZhe(){
	$('#chezhe').modal();
}

function onCheZhe1(){
	$('#chezhe1').modal();
}

function onCheZhe2(){
	$('#chezhe2').modal();
}

function onCheZhe3(){
	$('#chezhe3').modal();
}

function onCheZhe4(){
	$('#chezhe4').modal();
}

function onCheZhe5(){
	$('#chezhe5').modal();
}

function onCheZhe6(){
	$('#chezhe6').modal();
}

function onCheZhe7(){
	$('#chezhe7').modal();
}

function onCheZhe8(){
	$('#chezhe8').modal();
}

function onCheZhe9(){
	$('#chezhe9').modal();
}

$('body').on('click', '.link_to_remove', function () {
    if ($(this).parent().siblings().length > 0){
        $(this).parent().remove();
    }else{
    	$(this).parent().css("display","none");
    }
});

$('body').on('click', '.link_to_add', function () {
    var add_element = $(this).attr('add_element');
    var clone = $(add_element).children().eq(0);
    if(clone.css("display")=="none"){
    	clone.css("display","block");
    }else{
    	clone.clone().appendTo($(add_element));
    }
});

function onFilter() {
    var sel = hot.getSelected();
    if (sel != null && dataSet != null && sel[0] == 0 && sel[2] >= (nRow - 1)) {
        var beginCol = sel[1], endCol = sel[3];
        if (beginCol > endCol) {
            var tmp = beginCol;
            beginCol = endCol;
            endCol = tmp;
        }
        var newData = [];
        for (var i = 0; i < nRow; i++) {
            var newRow = [];
            for (var j = 0; j < nCol; j++) {
                if (j >= beginCol && j <= endCol && i > 0) {
                    var val = (+dataSet[i][j] + (+dataSet[i - 1][j])) / 2;
                    if (isNaN(val)) {
                        newRow.push(null);
                    }
                    else {
                        newRow.push(val);
                    }

                } else {
                    newRow.push(dataSet[i][j]);
                }
            }
            newData.push(newRow);
        }
        setData(newData);
    } else {
        console.log('no columns selected');
    }
}

function Polyfit() {
    $('#polyfitDialog').modal();
}

function startGraph() {
    var charttype = $('input[name=charttype]:checked').val();

    var traces = [];
    $('.lineChartCoord').each(function () {
        var ix = +$(this).children('.graphSelectColX').val();
        var iy = +$(this).children('.graphSelectColY').val();
        var name = $(this).children('.graphLabel').val();
        var filter = $(this).children('.filterInput').val().trim();

        if (name == null || name.length == 0) {
            name = headerSet[iy];
        }

        if (charttype == 'scatter') {
            var coordinates = RetrieveCoordinates(ix, iy);
            //console.log(coordinates);
            var xs = coordinates.map(function (row) { return row[0] });
            var ys = coordinates.map(function (row) { return row[1] });

            if (charttype == 'scatter') {
                var trace = { x: xs, y: ys, type: 'scatter', mode: 'lines+markers', name: name };
                traces.push(trace);
            } else {
                var trace = { x: xs, y: ys, type: 'scatter', mode: 'lines', name: name };
                traces.push(trace);
            }
        } else {
            var vals = RetrieveValues(ix, iy, filter);
            //console.log(values);
            var xy = aggregate(vals, '');
            //console.log(xy);
            if (charttype == 'pie') {
                var trace = { labels: xy[0], values: xy[1], type: charttype, name: name };

                traces.push(trace);
            } else {
                var trace = { x: xy[0], y: xy[1], type: charttype, name: name };

                traces.push(trace);
            }
        }
    });
    Plotly.newPlot('graphCanvas', traces);

}

function aggregate(vals, method) {
    var dict = {};
    var xs = [];
    for (var i = 0; i < vals.length; i++) {
        var row = vals[i];
        var x = row[0];
        var y = +row[1];
        if (!isNaN(y)) {
            if (dict[x] == null) {
                xs.push(x);
                dict[x] = y;
            } else {
                dict[x] = dict[x] + y;
            }
        }

    }

    var ys = [];
    for (var i = 0; i < xs.length; i++) {
        ys.push(dict[xs[i]]);
    }
    return [xs, ys];
}

function startPolyfit() {
    var colx = +$('#polyfitSelectX').val();
    var coly = +$('#polyfitSelectY').val();

    var coordinates = RetrieveCoordinates(colx, coly);
    //console.log(coordinates);

    var n = $('#poly_n').val()
    if (n == 'exponential' || n == 'logarithmic' || n == 'linearThroughOrigin' || n == 'power' || n == 'linear') {
        var method = n;
        var myRegression = regression(n, coordinates);
    }
    else {
        var method = 'polynomial';
        var n = parseInt(n);
        var myRegression = regression('polynomial', coordinates, n);
    }

    $.plot($('#polyfitCanvas'), [
        { data: myRegression.points, label: method },
        { data: coordinates, lines: { show: false }, points: { show: true } },
    ]);

    $('#polyTitle').text(myRegression.string);
}

function RetrieveValues(colx, coly, filter) {
    var result = [];
    for (var i = 0; i < nRow; i++) {
        var row = dataSet[i];
        var xs = row[colx];
        var ys = +row[coly];
        if (xs != null && xs != "") {
            if (filter == null || filter == "" || eval(filter)) {
                result.push([xs, ys]);
            }
        }
    }
    return result;
}

function RetrieveCoordinates(colx, coly) {
    var xs = dataSet.map(function (row) { return row[colx] });
    var ys = dataSet.map(function (row) { return row[coly] });

    var len = Math.min(xs.length, ys.length);
    var result = [];

    for (i = 0; i < len; i++) {
        var x = parseFloat(xs[i]);
        var y = parseFloat(ys[i]);

        if (!isNaN(x) && !isNaN(y)) {
            result.push([x, y]);
        }
    }
    result.sort(function (a, b) { return a[0] - b[0] });
    return result;
}

function startOutlierDetect() {
    var outlier_method = $('input[name=outlier_method]:checked').val();
    var selectedCol = +$('#outlierSelectCol').val();
    var xout = [];
    var someArray = dataSet.map(function (row) { return row[selectedCol]; });
    someArray = TrimAndConvertNumbers(someArray);
    console.log(someArray);
    if (outlier_method == 'Chauvenet')
        xout = outliers_Chauvenet(someArray);
    else if (outlier_method == 'IQR')
        xout = outliers_IQR(someArray);
    else if (outlier_method == 'PauTa')
        xout = outliers_PauTa(someArray);
    else if (outlier_method == 'Grubbs')
        xout = outliers_Grubbs(someArray);

    if (xout.length == 0)
        $('#outlierResult').text('没有异常值');
    else
        $('#outlierResult').text('异常值有: ' + xout.join(', '));
}

function TrimAndConvertNumbers(someArray) {
    var i = someArray.length - 1;
    while (i >= 0) {
        var item = someArray[i];
        if (item == null || item == '') {
            someArray.pop();
            i--;
        }
        else
            break;
    }
    return someArray.map(function (item) { return +item });
}

function sortNumbers(a, b) {
    return a - b;
}

var grubbs_table = [1.1543, 1.4812, 1.715, 1.8871, 2.02, 2.1266, 2.215, 2.29, 2.3547, 2.4116, 2.462, 2.5073, 2.5483, 2.5857, 2.62, 2.6516, 2.6809, 2.7082];
//格拉布斯
function outliers_Grubbs(someArray) {
    var count = someArray.length;
    someArray.sort(sortNumbers);
    var sum = 0.0;
    var vx = 0.0;

    for (i = 0; i < count; i++) {
        sum += someArray[i];
    }

    var meanX = sum / count;
    for (i = 0; i < count; i++) {
        vx += (someArray[i] - meanX) * (someArray[i] - meanX);
    }

    var stdX = Math.sqrt(vx / count);

    var min = someArray[0];
    var max = someArray[count - 1];
    var dif0 = (meanX - min) / stdX;
    var dif1 = (max - meanX) / stdX;
    var current = dif0 > dif1 ? min : max;
    var dif = Math.max(dif0, dif1);
    var critical_value = grubbs_critical_value(count);
    if (dif > critical_value)
        return [current];
    else
        return [];
}

function grubbs_critical_value(n) {
    if (n < 3)
        throw "too few numbers";
    else if (n <= 20)
        return grubbs_table[n - 3];
    else if (n < 25)
        return 2.7082;
    else if (n < 30)
        return 2.8217;
    else if (n < 40)
        return 2.9085;
    else if (n < 50)
        return 3.0361;
    else if (n < 60)
        return 3.1282;
    else if (n < 70)
        return 3.1997;
    else if (n < 80)
        return 3.2576;
    else if (n < 90)
        return 3.3061;
    else if (n < 100)
        return 3.3477;
    else if (n < 120)
        return 3.3841;
    else if (n < 140)
        return 3, 4451;
    else if (n < 160)
        return 3.4951;
    else if (n < 180)
        return 3.5373;
    else if (n < 200)
        return 3.5736;
    else if (n < 300)
        return 3.6055;
    else if (n < 400)
        return 3.7236;
    else if (n < 500)
        return 3.8032;
    else if (n < 600)
        return 3.8631;
    else return 3.9109;
}

//肖维勒准则 
function outliers_Chauvenet(someArray) {
    var count = someArray.length;
    var w = 1 + 0.4 * Math.log(count);
    someArray.sort(sortNumbers);
    var sum = 0.0;
    var vx = 0.0;

    for (i = 0; i < count; i++) {
        sum += someArray[i];
    }

    var meanX = sum / count;
    for (i = 0; i < count; i++) {
        vx += (someArray[i] - meanX) * (someArray[i] - meanX);
    }

    var stdX = Math.sqrt(vx / (count - 1));

    var ans = [];
    for (i = 0; i < count; i++) {
        var dif = (someArray[i] - meanX) / stdX;
        if (Math.abs(dif) > w)
            ans.push(someArray[i]);
    }
    return ans;
}

//拉依达准则 
function outliers_PauTa(someArray) {
    var count = someArray.length;
    if (count < 3) {
        alert("数据太少");
        return [];
    }
    someArray.sort(sortNumbers);
    var sum = 0.0;
    var vx = 0.0;

    for (i = 0; i < count; i++) {
        sum += someArray[i];
    }

    var meanX = sum / count;
    for (i = 0; i < count; i++) {
        vx += (someArray[i] - meanX) * (someArray[i] - meanX);
    }

    var stdX = Math.sqrt(vx / (count - 1));

    var ans = [];
    for (i = 0; i < count; i++) {
        var dif = (someArray[i] - meanX) / stdX;
        if (dif < -3 || dif > 3)
            ans.push(someArray[i]);
    }
    return ans;
}

//四分位距法
function outliers_IQR(someArray) {

    // Copy the values, rather than operating on references to existing values
    var values = someArray.concat();

    // Then sort
    values.sort(sortNumbers);

    /* Then find a generous IQR. This is generous because if (values.length / 4) 
     * is not an int, then really you should average the two elements on either 
     * side to find q1.
     */
    var q1 = values[Math.floor((values.length / 4))];
    // Likewise for q3. 
    var q3 = values[Math.ceil((values.length * (3 / 4)))];
    var iqr = q3 - q1;

    // Then find min and max values
    var maxValue = q3 + iqr * 1.5;
    var minValue = q1 - iqr * 1.5;

    // Then filter anything beyond or beneath these values.
    var filteredValues = values.filter(function (x) {
        return (x > maxValue) || (x < minValue);
    });

    // Then return
    return filteredValues;
}