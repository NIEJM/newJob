$(function(){
	var handledata = tools.decodeParam(tools.getQueryString('handledata'));
	datas = handledata;
	handledata = eval("(" + handledata + ")");
	var formData = handledata;
	var tag = false;
	if(handledata.orderID!=null){
		tag = true;
	}
	var handle_info = {
		init:function(){
			this.getHandleInfo();
			this.processOrder();
			this.yzz();
			this.backToList();
		},
		getHandleInfo:function(){
			if(tag){
				var orderInfoTmp = $("#orderInfoTmp").html();
				laytpl(orderInfoTmp).render(handledata, function(html){
					$("#handleInfoView").html(html);
				});
			}else{
				var withdrawTmp = $("#withdrawTmp").html();
				laytpl(withdrawTmp).render(handledata, function(html){
					$("#handleInfoView").html(html);
				});
			}
		},
		processOrder:function(){
			$("#handleInfoView").on('click','#save',function(){
				window.location.href = "order_info.html?id=" + handledata.orderID + "&handledata=" + tools.encodeParam(datas);
			});
		},
		yzz:function(){
			$("#yzz").click(function(){
				if(confirm("确定已经转账了吗？")){
					formData.status = 'PROCESSED';
					formData.handleOn = getTimestamp();
					var optionStatus = {
						type: "post",
						contentType: "application/json",
						memo: "处理申请提现信息",
						data: JSON.stringify(formData),
						url: "/callcenter",
						callback: function(data, status, res){
							layer.msg(optionStatus.memo+"成功" , {icon: 6});
							window.location.href = "handle_center.html";
						}
					};

					var formDataAddBill = {};
					formDataAddBill.pointType = "BILL";
					formDataAddBill.valueToUse = handledata.withdrawValue;
					formDataAddBill.memo = "提现";
					var optionAddBill = {
						type: "post",
						contentType: "application/json",
						memo: "教师提现",
						data: JSON.stringify(formDataAddBill),
						url: "/points/" + handledata.sendBy + "/use",
						callback: function(data, status, res){
							tools.ajaxRequest(optionStatus);//执行处理请求
						}
					};
					tools.ajaxRequest(optionAddBill);//执行提现请求
				}
			});
		},
		backToList:function(){
			$("#handleInfoView").on('click','#cancel',function(){
				history.go(-1);
			});
		}
	};
	handle_info.init();
});