$(function(){
	var id = tools.getQueryString('id');
	var handledata = tools.decodeParam(tools.getQueryString('handledata'));
	var teachers = {},teacher = {},order = {},productList = {};
	var start = getTimestamp(),end = start+604800000;//end比start多7天
	var orderItems = [];
	var productsId = [];
	var order_new = {
		init:function(){
			this.getInfo();
			this.getTeachers();
			this.getTeacher();
			this.setAddress();
			this.saveOrder();
			this.backToList();
		},
		getInfo:function(){
			var option = {
				type: "get",
				contentType: "application/json",
				memo: "获取订单信息",
				url: "/orders/" + id,
				callback: function(data, status, res){
					order = data;
					console.log(data);
					for(var i=0;i<data.orderItems.length;i++){
						productsId.push(data.orderItems[i].productID);
					}
					$("#userNickName").val(data.userNickName);
					$("#contactPhone").val(data.contactPhone);
					var tag = false;
					if(data.addressType=='OTHER'){
						tag = true;
					}
					$("#storeID").val(data.storeID);
					$("#storeImgUrl").val(data.storeImgUrl);
					$("#storeName").val(data.storeName);
					$("#storeContactPhone").val(data.storeContactPhone);
					$("#userID").val(data.userID);
					$("#userImgUrl").val(data.userImgUrl);
					$("#userAge").val(data.userAge);
					$("#eta").val(data.eta);
					$("#etc").val(data.etc);
					$("#userCount").val(data.userCount);
					$("#description").val(data.description);

					$("#addressType1").prop('checked',tag);
					$("#orderType").val(data.orderType=='REGULAR'?'一对一':'拼课');
					$("#address").val(data.address);
					$("#unitPrice").val(data.orderItems[0].unitPrice);
					$("#groupCount").val(data.groupCount);
					$("#groupAmount").val(data.groupAmount);
					$("#totalAmount").val(data.totalAmount);
					$("#discountAmount").val(data.discountAmount);
					$("#grandTotal").val(data.grandTotal);
				}
			};
			tools.ajaxRequest(option);
		},
		getTeachers:function(){
			var option = {
				type: "get",
				contentType: "application/json",
				memo: "获取教师列表",
				url: "/accounts/teachers?page=0&size=1000&tSort=PRAISE",
				callback: function(data, status, res){
					console.log(data);
					teachers = data;
					var html = '<option value="">请选择</option>';
					for(var i=0;i<data.content.length;i++){
						var item = data.content[i];
						html += '<option value="'+item.id+'">'+item.nickName+'</option>';
					}
					$("#teachers").html(html);
				}
			};
			tools.ajaxRequest(option);
		},
		getTeacher:function(){
			$("#teachers").change(function(){
				var teacher_id = $(this).val();
				var option = {
					type: "get",
					contentType: "application/json",
					memo: "获取教师信息",
					url: "/accounts/teachers/" + teacher_id,
					callback: function(data, status, res){
						teacher = data;
						if($("#addressType1").prop('checked')){
							$("#address").val(data.defaultAddress);
						}
						// $("#unitPrice").val(data.oneToOneRackRate);
						// $("#totalAmount").val(data.oneToOneRackRate*order.groupAmount);
						// $("#grandTotal").val($("#totalAmount").val());
						$("#storeID").val(data.id);
						$("#storeImgUrl").val(data.avatarUrl);
						$("#storeName").val(data.nickName);
						$("#storeContactPhone").val(data.phone);
					}
				};
				if(teacher_id!=""){
					tools.ajaxRequest(option);
				}

				var optionProd = {
					type: "get",
					contentType: "application/json",
					memo: "获取课时信息",
					url: "/products/stores/" + teacher_id + "?end_date=" + tStamp2Normal(end,"date") + "&start_date=" + tStamp2Normal(start,"date"),
					callback: function(data, status, res){
						productList = data;
						var html = '';
						for(var i=0;i<data.productList.length;i++){
							var products = data.productList[i];
							var date = tStamp2Normal(products.timeOfSale,"WC");
							for(var j=0;j<products.productItemQueue.length;j++){
								var product = products.productItemQueue[j];
								var time = product.timeSeries;
								var cla = '';
								switch(product.productStatus){
									case 0: cla = ' disabled="disabled" class="gray" ';break;
									case 1: cla = ' class="black" ';break;
									case 2: cla = ' disabled="disabled" class="blue" ';break;
									default: cla = '';break;
								}
								for(var m=0;m<productsId.length;m++){
									if(product.id==productsId[m]){
										cla = ' class="green" ';
									}
								}
								html += '<option ' + cla + 'value="' + product.id + '_' + products.timeOfSale + '_' + time +'" >' + date + ' ' + time + '</option>';
							}
						}
						$("#products").html(html);
					}
				};
				if(teacher_id!=""){
					tools.ajaxRequest(optionProd);
				}
			});
		},
		setAddress:function(){
			$("#addressType0").click(function(){
				$("#address").val(order.address);
			});
			$("#addressType1").click(function(){
				$("#address").val(teacher.defaultAddress);
			});
		},
		saveOrder:function(){
			var $this = this
			$("#save").click(function(){
				if(confirm("确定要生成新订单吗？")){
					var formData = [];
					formData = $("#teacherInfoForm").serializeObject();
					if(order.orderType=='REGULAR'){
						var clearing = teacher.oneToOneClearingPrice;
						var rack = teacher.oneToOneRackRate;
					}else{
						var clearing = teacher.togetherClearingPrice;
						var rack = teacher.togetherRackRate;
					}
					var idAndDate = $("#products").val();
					var names = [];
					var times = [];
					$("#products").find("option:selected").each(function(){
						names.push($(this).text());
						var time = $(this).val().split('_')[2];
						times.push(time2Stamp(time));
					});
					//拼接orderItems
					for(var i=0;i<(order.groupAmount/0.5);i++){
						var arry = {
							costUnitPrice: clearing,
							productID:idAndDate[i].split('_')[0],
							quantity: "0.5",
							seqID:i,
							groupID: "0",
							deliveryOn:parseInt(idAndDate[i].split('_')[1])+parseInt(times[i]),
							itemName:names[i].split(' ')[2],
							itemAmount:rack*0.5,
							unitPrice:rack,
							groupDescription:"",
							itemDescription:"",
							costItemAmount:clearing*0.5
						};
						orderItems.push(arry);
					}
					formData.orderType = order.orderType;
					formData.orderItems = orderItems;
					formData.orderPoints = order.orderPoints;
					formData.memo = "后台撮合订单";
					var option = {
						type: "post",
						contentType: "application/json",
						memo: "生成新订单",
						data: JSON.stringify(formData),
						url: "/orders/" + id + "/admin",
						callback: function(data, status, res){
							layer.msg(option.memo+'成功',{icon:6});
							if(isNull(handledata)!=''){
								$this.processHandle();
							}
						}
					};
					tools.ajaxRequest(option);
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
					layer.msg('被拒绝的订单处理成功',{icon:6});
				}
			};
			tools.ajaxRequest(option);
		},
		backToList:function(){
			$("#cancel").click(function(){
				history.go(-1);
			});
		}
	};
	order_new.init();
});