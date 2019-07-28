$(function(){
	var sta = tools.getQueryString('sta');
	var id = tools.getQueryString('id');
	var points_data =  tools.decodeParam(tools.getQueryString('points_data'));
	var a = "<i class='fa fa-times-circle'></i> ";
	var points_add = {
		init:function(){
			this.setTitle();
			this.setPage();
			this.formSubmit();
			this.createPoint();
			this.backToList();
		},
		setTitle:function(){
			var subtitleTemp = $("#subtitleTemp").html();
			laytpl(subtitleTemp).render(sta, function(html) {
				$("#subtitle").html(html);
			});
		},
		setPage:function(){
			var newPointTemp = $("#newPointTemp").html();
			var data = {
				"pointName":"",
				"pointDescription":"",
				"pointType":"POINT",
				"value":"",
				"createBy":"",
				"createOn":"",
				"issueCount":0,
				"status":"0"
			};
			points_data = $.trim(points_data) == "" ? data :eval('('+ points_data +')');
			laytpl(newPointTemp).render(points_data, function(html) {
				$("#newPointForm").html(html);
			});
		},
		formSubmit:function(){
			$("#save").click(function(){
				$("#newPointForm").submit();
			});
		},
		createPoint:function(){
			$("#newPointForm").validate({
				submitHandler: function (form) {
					var formData = [];
					formData = $('#newPointForm').serializeObject();
					var option = {
						type:"post",
						contentType: "application/json",
						data: JSON.stringify(formData),
						url: "",
						memo: "",
						callback: function(data, status, res){
							layer.msg(option.memo + '成功', {icon: 6 , time: 2000},function(){
								history.go(-1);
							});
						}
					};
					if(sta=="edit"){
						option.memo = "编辑优惠券";
						option.url = "/points/batchs/" + id;
						
					}else{
						option.memo = "创建优惠券";
						option.url = "/points/batchs";
					}
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
	points_add.init();
});