$(function(){
	var change_passwd = {
		init:function(){
			this.updatePasswd();
		},
		updatePasswd:function(){
			$("#save").click(function(){
				var newPwd = $("#newPwd").val();
				var confirm = $("#confirm").val();
				var formData = $("#changePasswd").serializeObject();
				var option = {
					type: "put",
					contentType: "application/json",
					memo: "修改密码",
					data: JSON.stringify(formData),
					url: "/accounts/admin/password",
					callback: function(data, status, res){
						layer.msg(option.memo+"成功",{icon:1},function(){
							window.location.href = "change_passwd.html";
						});
					}
				};
				if(newPwd!=confirm){
					layer.msg("确认密码不一致");
				}else{
					tools.ajaxRequest(option);
				}
			});
		}
	};
	change_passwd.init();
});