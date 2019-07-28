/*
 * 登录接口
 */
 $(function(){
 	var login = {
 		init:function(){
	 		this.login();
	 	},
 		login:function(){
 			var $this = this;
 			$("#loginbtn").click(function(){
 				var username = $("#username");
	 			var password = $("#password");
	 			//判断用户
	 			if (username.val().trim() == '') {
					layer.tips('用戶名不能为空', '#username', {tips: 2});
					return;
				};
				// 判断密码
				if(password.val().trim() == "") {
					layer.tips("请输入密码" , "#password" , {tips: 2});
					return;
				};
 				var params = $('#loginForm').serializeObject();
	 			$.ajax({
	 				type:"post",
		    		contentType:"application/json",
		    		url: config.server_url+"/oauth/token?" + $.param(params),
		    		success: function(data, status, res){
		    			if (res.status === 200) {
							store.set('accessToken', data.access_token);
							layer.msg('登录成功', {icon: 6 , time: 2000}, function()
							 {
								window.location.href = "index.html";
							});
						}
		    		},
		    		error: function(e) {
						layer.msg("登录失败" , {icon: 5});
						console.log('error');
					},
					beforeSend: function(xhr) {
						// 设置头信息
						xhr.setRequestHeader("Authorization", "Basic " + tools.base64_encode(params.client_id + ":" + params.client_secret));
						xhr.setRequestHeader("Content-Type", "text/html");
						xhr.setRequestHeader('X-Request-With', null);
					}
	 			});
 			});
 		}
 	};
 	login.init();
 });