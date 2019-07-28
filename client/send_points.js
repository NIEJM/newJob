$(function(){
	var names = tools.decodeParam(tools.getQueryString('names'));
	var send_points = {
		init:function(){
			this.getPoints();
			this.getUsers();
			this.sendPoints();
			this.backToList();
		},
		getPoints:function(){
			var option = {
				type: "get",
				contentType: "application/json",
				memo: "获取优惠券",
				url: "/points/batchs?status=0",
				callback: function(data, status, res){
					var pointsTemp = $("#pointsTemp").html();
					laytpl(pointsTemp).render(data, function(html) {
						$("#pointBatchID").html(html);
					});
				}
			};
			tools.ajaxRequest(option);
		},
		getUsers:function(){
			var usersTemp = $("#usersTemp").html();
			laytpl(usersTemp).render(names, function(html) {
				$("#users").val(html);
			});
		},
		sendPoints:function(){
			$("#save").click(function(){///需要增加批量发放优惠券的接口
				if(confirm("确定要发放优惠券吗？")){
					var ids = tools.getQueryString('ids');
					var names = tools.decodeParam(tools.getQueryString('names'));
					console.log(ids);
					ids = ids.split(",");
					names = names.split(",");
					for(var i=0;i<ids.length;i++){
						var id = ids[i];
						var name = names[i];
						var formData = [];
						formData = $('#sendPointsForm').serializeObject();
						formData.userName = name;
						var option = {
							type: "post",
							contentType: "application/json",
							data: JSON.stringify(formData),
							memo: "优惠券发放",
							url: "/points/" + id + "/add",
							callback: function(data, status, res){
								layer.msg(name+'发放成功', {icon: 6 });
							}
						};
						tools.ajaxRequest(option);
					}
				}
			});
		},
		backToList:function(){
			$("#cancel").click(function(){
				history.go(-1);
			});
		}
	};
	send_points.init();
});