$(function(){
	var order_id = tools.getQueryString('id');
	var handledata = tools.decodeParam(tools.getQueryString('handledata'));
	var returnPointsStatus = false;
	var fineTeacherStatus = false;
	var payTeacherStatus = false;
	var points = {};
	var orders = {};
	var order_info = {
		init:function(){
			this.getPoints();
			this.newOrder();
			this.cancelDetail();
			this.fineComplete();
			this.setReturnMoney();
		},
		getInfo:function(){
			var option = {
				type: "get",
				contentType: "application/json",
				memo: "获取订单信息",
				url: "/orders/" + order_id,
				callback: function(data, status, res){
					orders = data;
					data.points = points;
					var orderInfoTmp = $("#orderInfoTmp").html();
					laytpl(orderInfoTmp).render(data, function(html) {
						$("#orderInfoForm").html(html);
						if(isNull(handledata)==''){
							$("#fineComplete").hide();
							$("#new").hide();
							$("#cancelDetail").hide();
						}
					});
				}
			};
			tools.ajaxRequest(option);
		},
		getPoints:function(){
			var $this = this;
			var option = {
				type: "get",
				contentType: "application/json",
				memo: "获取优惠券",
				url: "/points/batchs?status=0",
				callback: function(data, status, res){
					points = data;
					$this.getInfo();
				}
			};
			tools.ajaxRequest(option);
		},
		//跳转到新建订单页面
		newOrder:function(){
			$("#orderInfoForm").on('click','button#new',function(){
				window.location.href = "order_new.html?id=" + order_id + "&handledata=" + tools.encodeParam(handledata);
			});
		},
		//取消订单-弹层
		cancelDetail:function(){
			var $this = this;
			$("#orderInfoForm").on('click','button#cancelDetail',function(){
				var html = $("#orderDetail");
				layer.open({
					type: 1,
					btn: ['去退款', '取消', '处理', '完成'],
					yes: function(){
						$this.payBack();
					},
					btn3: function(){
						layer.msg('正在处理中，请稍候……',{closeBtn: 0},function(){
							$this.returnPoints();
							$this.fineTeacher();
							$this.payTeacher();
						});
					},
					btn4: function(){
						if(returnPointsStatus && fineTeacherStatus && payTeacherStatus){
							$this.cancelOrder();
						}else if(!returnPointsStatus && !fineTeacherStatus && !payTeacherStatus){
							layer.msg("请先执行【处理】操作");
						}else if(!returnPointsStatus){
							layer.msg("尚未返还优惠券");
						}else if(!fineTeacherStatus){
							layer.msg("尚未对老师罚款");
						}else if(!payTeacherStatus){
							layer.msg("尚未支付教师课酬");
						}
					},
					title: ["取消订单","text-align:center"],
					area: ['500px', '490px'],
					closeBtn: 2,
					shadeClose: false,
					content: html
				});
			});
		},
		//学生取消-弹层
		fineComplete:function(){
			var $this = this;
			$("#orderInfoForm").on('click','button#fineComplete',function(){
				var html = $("#orderDetail");
				$("#memo").attr("disabled","");
				$("#fineMoney").attr("disabled","");
				$("#pointBatchID").attr("disabled","");
				layer.open({
					type: 1,
					btn: ['去退款', '取消', '处理', '完成'],
					yes: function(){
						$this.payBack();
					},
					btn3: function(){
						layer.msg('正在处理中，请稍候……',{closeBtn: 0},function(){
							$this.payTeacher();
						});
					},
					btn4: function(){
						if(payTeacherStatus){
							if(isNull(handledata)!=''){
								$this.processHandle();
							}
						}else{
							layer.msg("请先执行【处理】操作");
						}
					},
					title: ["给学生退款","text-align:center"],
					area: ['500px', '490px'],
					closeBtn: 2,
					shadeClose: false,
					content: html
				});
			});
		},
		//设置退款金额（不会超过总金额）
		setReturnMoney:function(){
			$("#orderInfoForm").on('blur','#returnMoney',function(){
				if(parseFloat($("#returnMoney").val())>orders.grandTotal){
					$("#returnMoney").val(orders.grandTotal);
				}
			});
		},
		processHandle:function(){
			handledata = eval("(" + handledata + ")");
			var formData = handledata;
			formData.status = 'PROCESSED';
			formData.handleOn = getTimestamp();
			var option = {
				type: "post",
				contentType: "application/json",
				memo: "处理被拒绝的订单",
				data: JSON.stringify(formData),
				url: "/callcenter",
				callback: function(data, status, res){
					console.log("待处理信息处理完成");
					layer.closeAll();
					window.location.href = "handle_center.html";
				}
			};
			tools.ajaxRequest(option);
		},
		//退款接口尚无，手动去退款
		payBack:function(){
			//手动退款
			var orderPayments = orders.orderPayments;
			if(isNull(orderPayments)!=''){
				orderPayments.sort(function(a,b){return a.createOn-b.createOn});
				var paymentMethod = orderPayments[0].paymentMethod;
				switch(paymentMethod){
					case 'ALIPAY':var payment = "https://www.alipay.com/";break;
					case 'WEIXIN':var payment = "https://pay.weixin.qq.com/index.php/core/home/login?return_url=%2F";break;
					default:var payment = "https://www.alipay.com/";break;
				}
				window.open(payment);
			}else{
				alert("支付方式为空");
			}
		},
		//取消订单
		cancelOrder:function(){
			var $this = this;
			var formData = {};
			formData.memo = $('#memo').val();
			var option = {
				type: "post",
				contentType: "application/json",
				memo: "取消订单",
				data: JSON.stringify(formData),
				url: "/orders/" + order_id + "/ADMIN_CANCEL",
				callback: function(data, status, res){
					console.log("取消订单成功");
					if(isNull(handledata)!=''){
						$this.processHandle();
					}
				}
			};
			tools.ajaxRequest(option);
		},
		//补偿优惠券
		returnPoints:function(){
			var $this = this;
			var formData = {};
			var user_id = orders.userID;
			var point_id = $("#pointBatchID").val();
			formData.pointBatchID = point_id;
			formData.userName = orders.userNickName;
			formData.pointType = "POINT";
			formData.valueToAdd = $("#pointBatchID").find("option:selected").text();
			formData.memo = "补偿优惠券，订单号："+orders.orderNo;
			var option = {
				type: "post",
				contentType: "application/json",
				memo: "补偿优惠券",
				data: JSON.stringify(formData),
				url: "/points/" + user_id + "/add",
				callback: function(data, status, res){
					console.log("补偿优惠券成功");
					returnPointsStatus = true;
				}
			};
			if(isNull(point_id)!=''){
				tools.ajaxRequest(option);
			}else{
				returnPointsStatus = true;
			}
		},
		//对教师罚款
		fineTeacher:function(){
			var $this = this;
			var formData = {};
			var user_id = orders.storeID;
			formData.userName = orders.storeName;
			formData.pointDescription = "罚款";
			formData.pointType = "BILL";
			formData.valueToAdd = "-" + $("#fineMoney").val();
			formData.memo = "罚款，订单号："+orders.orderNo;
			formData.pointPreferenceId = order_id;
			formData.pointPreferenceUserName = orders.userNickName;
			formData.pointPreferenceImgUrl = orders.userImgUrl;
			var option = {
				type: "post",
				contentType: "application/json",
				memo: "对教师罚款",
				data: JSON.stringify(formData),
				url: "/points/" + user_id + "/add",
				callback: function(data, status, res){
					console.log("对教师罚款成功");
					fineTeacherStatus = true;
				}
			};
			if($("#fineMoney").val()!='' && $("#fineMoney").val()!='0'){
				tools.ajaxRequest(option);
			}else{
				fineTeacherStatus = true;
			}
		},
		//付给教师课酬
		payTeacher:function(){
			var $this = this;
			var formData = {};
			var user_id = orders.storeID;
			formData.userName = orders.storeName;
			formData.pointDescription = "课酬";
			formData.pointType = "BILL";
			formData.valueToAdd = $("#payMoney").val();
			formData.memo = "订单结算，订单号："+orders.orderNo;
			formData.pointPreferenceId = order_id;
			formData.pointPreferenceUserName = orders.userNickName;
			formData.pointPreferenceImgUrl = orders.userImgUrl;
			var option = {
				type: "post",
				contentType: "application/json",
				memo: "付给教师课酬",
				data: JSON.stringify(formData),
				url: "/points/" + user_id + "/add",
				callback: function(data, status, res){
					console.log("付给教师课酬成功");
					payTeacherStatus = true;
				}
			};
			if($("#payMoney").val()!='' && $("#payMoney").val()!='0'){
				tools.ajaxRequest(option);
			}else{
				payTeacherStatus = true;
			}
		}
	};
	order_info.init();
});