$(function(){
	var id = tools.getQueryString('id');
	var teacher_order = {
		init:function(){
			this.getOrder();
		},
		getOrder:function(){
			//获取订单信息
			$.ajax({
				type: "get",
				contentType: "application/json",
				url: config.server_url + "/orders/" + id,
				success: function(data, status, res){
					if(res.status === 200){
						console.log(data);
						var detailTemp = $("#detailTemp").html();
						laytpl(detailTemp).render(data, function(html) {
							$("#detailView").html(html);
						});
					}
				},
				error: function(err){
					console.log(err);
				}
			});
		}
	};
	teacher_order.init();
});