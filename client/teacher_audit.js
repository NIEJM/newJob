$(function(){
	var teacher_id = tools.getQueryString('id');
	var teacher_audit = {
		init:function(){
			this.getInfo();
			this.activeTeacher();
			this.backToList();
		},
		getInfo:function(){
			var option = {
				type: "get",
				contentType: "application/json",
				memo: "获取教师信息",
				url: "/accounts/teachers/" + teacher_id,
				callback: function(data, status, res){
					var teacherInfoTemp = $("#teacherInfoTemp").html();
					laytpl(teacherInfoTemp).render(data, function(html) {
						$("#auditTeacherForm").html(html);
					});
				}
			};
			tools.ajaxRequest(option);
		},
		activeTeacher:function(){
			$("#activate").click(function(){
				if(confirm("确定要激活该教师吗？")){
					var formData = [];
					formData = $('#auditTeacherForm').serializeObject();
					formData.id = teacher_id;
					formData.activateStatus = "SUCCESS";
					var option = {
						type: "put",
						contentType: "application/json",
						data: JSON.stringify(formData),
						url: "/accounts/admin/activate",
						callback: function(data, status, res){
							layer.msg("教师激活成功" , {icon: 1}, function(){
								history.go(-1);
							});
						}
					};
					tools.ajaxRequest(option);
				}
			});
		},
		backToList:function(){
			$("#reject").click(function(){
				if(confirm("确定要该教师审核不通过吗？")){
					var formData = [];
					formData = $('#auditTeacherForm').serializeObject();
					formData.id = teacher_id;
					formData.activateStatus = "FAIL";
					var option = {
						type: "put",
						contentType: "application/json",
						data: JSON.stringify(formData),
						url: "/accounts/admin/activate",
						callback: function(data, status, res){
							layer.msg("教师审核不通过成功" , {icon: 1}, function(){
								history.go(-1);
							});
						}
					};
					tools.ajaxRequest(option);
				}
			});
		}
	};
	teacher_audit.init();
});