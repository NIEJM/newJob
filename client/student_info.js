$(function(){
	var student_id = tools.getQueryString('id');
	var student_info = {
		init:function(){
			this.getInfo();
			this.formSubmit();
			this.saveInfo();
			this.backToList();
		},
		getInfo:function(){
			var option = {
				type: "get",
				contentType: "application/json",
				memo: "获取学生信息",
				url: "/accounts/students/" + student_id,
				callback: function(data, status, res){
					var studentInfoTemp = $("#studentInfoTemp").html();
					laytpl(studentInfoTemp).render(data, function(html) {
						$("#studentInfoForm").html(html);
					});
				}
			};
			tools.ajaxRequest(option);
		},
		formSubmit:function(){
			$("#save").click(function(){
				$("#studentInfoForm").submit();
			});
		},
		saveInfo:function(){
			$("#studentInfoForm").validate({
				submitHandler: function (form) {
					var formData = [];
					formData = $('#studentInfoForm').serializeObject();
					console.log(JSON.stringify(formData));
					var option = {
						type:"put",
						contentType: "application/json",
						data: JSON.stringify(formData),
						url: "/accounts/admin/student/" + student_id,
						memo: "更新学生信息",
						callback: function(data, status, res){
							layer.msg(option.memo + '成功', {icon: 6 , time: 2000},function(){
								history.go(-1);
							});
						}
					};
					tools.ajaxRequest(option);
				}
			});
		},
		backToList:function(){
			$("#cancel").click(function(){
				history.go(-1);
			});
		}
	};
	student_info.init();
});