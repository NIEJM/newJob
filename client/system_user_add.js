$(function(){
	var user_id = tools.getQueryString('id');
	var sta = tools.getQueryString('sta');
	var system_user_add = {
		init:function(){
			this.setTitle();
			this.getSystemUser();
			this.addFormSubmit();
			this.addUser();
			this.backToList();
		},
		setTitle:function(){
			var subtitleTemp = $("#subtitleTemp").html();
			laytpl(subtitleTemp).render(sta, function(html) {
				$("#subtitle").html(html);
			});
		},
		getSystemUser:function(){
			if(sta=="edit"){
				var option = {
					type: "get",
					contentType: "application/json",
					memo: "获取系统用户信息",
					url: "/accounts/teachers/" + user_id,
					callback: function(data, status, res){
						layer.msg(option.memo+"成功" , {icon: 6});
					}
				};
				tools.ajaxRequest(option);
			}
			var addSystemUserTemp = $("#addSystemUserTemp").html();
			laytpl(addSystemUserTemp).render("data", function(html) {
				$("#addSystemUserForm").html(html);
			});
			
		},
		addFormSubmit:function(){
			$("#addSystemUserForm").on('click','button#save',function(){
				$("#addSystemUserForm").submit();
			});
		},
		addUser:function(){
			var $this = this;
			$("#addSystemUserForm").validate({
				submitHandler: function (form) {
					var formData = [];
					formData = $('#addSystemUserForm').serializeObject();
					var option = {
						type: "post",
						contentType: "application/json",
						data: JSON.stringify(formData),
						memo: "增加系统用户",
						url: "/accounts/admin",
						callback: function(data, status, res){
							layer.msg(option.memo+"成功" , {icon: 6});
						}
					};
					// tools.ajaxRequest(option);
				}
			});
		},
		backToList:function(){
			$("#addSystemUserForm").on('click','button#cancel',function(){
				history.go(-1);
			});
		}
	};
	system_user_add.init();
});