$(function(){
	var allChekcBox = document.getElementsByName("selectStu");
	var ids=[];
	var names=[];
	var students_list = {
		init:function(){
			this.settHaF();
			this.getStudents();
			this.searchStudents();
			this.selectAll();
			this.selectStudents();
			this.sendPoints();
		},
		settHaF:function(){
			setHaF();
		},
		getStudents:function(){
			var option = {
				type: "get",
				contentType: "application/json",
				memo: "获取学生信息",
				url: "/accounts/students",
				callback: function(data, status, res){
					console.log(data);
					var dataTableTemp = $("#dataTableTemp").html();
					laytpl(dataTableTemp).render(data, function(html) {
						$("#dataTableView").html(html);
						$(".dataTables-example").DataTable({
							"columnDefs":[{"orderable": false, "targets": 0},{"orderable": false, "targets": 1}],
							"order": [[4,"desc"]],
							"stateSave": true
						});
					});
					layer.close(index);
				}
			};
			var index = layer.msg('数据玩命加载中，请稍候……',{time:0});
			tools.ajaxRequest(option);
		},
		searchStudents:function(){
			$("#search").click(function(){
				alert("搜索学生");
			});
		},
		selectAll:function(){
			$(".checkAll").click(function(){
			// $('.table').on('click','tr th input.checkAll',function(){
				ids = [];
				names = [];
				for(var i=0;i<allChekcBox.length;i++){
					allChekcBox[i].checked=$(this).prop("checked")?true:false;
				}
				$.each($('input[name="selectStu"]:checked'),function(i,item){
					ids.push($(item).attr('data-id'));
					names.push($(item).attr('data-name'));
				});
			});
		},
		selectStudents:function(){
			$('#dataTableView').on('click','tr td input.selectStu',function(){
				ids = [];
				names = [];
				$.each($('input[name="selectStu"]:checked'),function(i,item){
					ids.push($(item).attr('data-id'));
					names.push($(item).attr('data-name'));
				});
			});
		},
		sendPoints:function(){
			$("#sendPoints").click(function(){
				var sta=false;
				for(var i=0;i<allChekcBox.length;i++){
					if(allChekcBox[i].checked){
						sta = true;
						break;
					}else{
						sta = false;
					}
				}
				var selectLength = $('input[name="selectStu"]:checked').length;
				if(selectLength>50){
					alert("不能超过50个学生");
				}else if(sta){
					window.location.href = "send_points.html?ids=" + ids + "&names=" + tools.encodeParam(names);
				}else{
					alert("请至少选择一个学生");
				}
			});
		}
	};
	students_list.init();
});