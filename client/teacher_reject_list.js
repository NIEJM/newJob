$(function(){
	var teacher_reject_list = {
		init:function(){
			this.settHaF();
			this.getTeachers();
			this.searchTeachers();
		},
		settHaF:function(){
			setHaF();
		},
		getTeachers:function(){
			var name = $("#name").val();
			var login = $("#login").val();
			var option = {
				type:"get",
				contentType: "application/json",
				url: "/accounts/teachers/admin?page=0&size=1000&activateStatus=FAIL",
				memo: "获取未通过教师列表",
				callback: function(data, status, res){
					var dataTableTemp = $("#dataTableTemp").html();
					laytpl(dataTableTemp).render(data, function(html) {
						$("#dataTableView").html(html);
						$(".dataTables-example").dataTable({
							"columnDefs":[{"orderable": false, "targets": 0}],
							"order": [[3,"asc"]],
							"stateSave": true
						});
					});
					layer.close(index);
				}
			};
			var index = layer.msg('数据玩命加载中，请稍候……',{time:0});
			tools.ajaxRequest(option);
		},
		searchTeachers:function(){
			$("#search").click(function(){
				var name = $("#name").val();
				var login = $("#login").val();
				var option = {
					type: "get",
					contentType: "application/json",
					memo: "搜索教师",
					url: "/accounts/teachers/admin?page=0&size=1000&activateStatus=FAIL&name=" + name + "&login=" +login,
					callback: function(data, status, res){
						var dataTableTemp = $("#dataTableTemp").html();
						$(".dataTables-example").DataTable().destroy();
						laytpl(dataTableTemp).render(data, function(html) {
							$("#dataTableView").html(html);
							$(".dataTables-example").DataTable({
								"order": [[3,"asc"]]
							});

						});
						layer.close(index);
					}
				};
				var index = layer.msg('数据玩命加载中，请稍候……',{time:0});
				tools.ajaxRequest(option);
			});
		}
	};
	teacher_reject_list.init();
});