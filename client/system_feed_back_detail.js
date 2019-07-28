$(function(){
	var id = tools.getQueryString('id');
	var data = tools.decodeParam(tools.getQueryString('data'));
	var system_feed_back_detail = {
		init:function(){
			this.getFeedBack();
			this.backToList();
		},
		getFeedBack:function(){
			data = eval("(" + data + ")");
			var feedBackTemp = $("#feedBackTemp").html();
			laytpl(feedBackTemp).render(data,function(html){
				$("#feedBackForm").html(html);
			})
		},
		backToList:function(){
			$("#cancel").click(function(){
				history.go(-1);
			});
		}
	};
	system_feed_back_detail.init();
});