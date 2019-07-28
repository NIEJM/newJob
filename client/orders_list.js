$(function(){
	var id = tools.getQueryString('id');
	var lab = tools.getQueryString('lab');
	var url = "";
	var ordersData = {};
	var orders_list = {
		init:function(){
			this.settHaF();
			this.setTitle();
			this.getOrders();
			this.searchOrders();
		},
		settHaF:function(){
			setHaF();
		},
		setTitle:function(){
			var listNameTemp = $("#listNameTemp").html();
			var titleData = [];
			switch(lab){
				case 'student': 
					titleData.url = 'students_list.html';
					// url = "/orders/users/" + id + "?page=0&size=10000";
				break;
				case 'teacher': 
					titleData.url = 'teacher_list.html';
					// url = "/orders/stores/" + id + "?page=0&size=10000";
				break;
				default: 
					titleData.url = 'orders_list.html';
					// url = "/orders/admin?size=100&page=" + page;
					$("#subtitle").remove();
				break;
			}
			titleData.lab = lab;
			laytpl(listNameTemp).render(titleData, function(html) {
				$("#listName").html(html);
			});
		},
		getOrders:function(){
			var $this = this;
			// var page = curr-1 || 0;
			switch(lab){
				case 'student': 
					url = "/orders/users/" + id + "?size=10000&page=0";break;
				case 'teacher': 
					url = "/orders/stores/" + id + "?size=10000&page=0";break;
				default:
					url = "/orders/admin?size=10000&page=0";break;
			}
			var option = {
				type: "get",
				contentType: "application/json",
				memo: "获取订单列表",
				url: url,
				callback: function(data, status, res){
					ordersData = data;
					var dataTableTemp = $("#dataTableTemp").html();
					laytpl(dataTableTemp).render(data, function(html) {
						$("#dataTableView").html(html);
						$(".dataTables-example").dataTable({
							"columnDefs":[{"orderable": false, "targets": 0}],
							"order": [[8,"desc"]],
							"stateSave": true
						});
						//设置分页
						// laypage({
						// 	cont: $("#pages"),
						// 	pages: ordersData.totalPages,
						// 	curr: curr || 0,
						// 	skin: 'molv',
						// 	first: 1,
						// 	skip: true,
						// 	last: ordersData.totalPages,
						// 	jump: function(e, first){
						// 		if(!first){
						// 			$this.getOrders(e.curr);
						// 		}
						// 	}
						// });
					});
					layer.close(index);
				}
			};
			var index = layer.msg('数据玩命加载中，请稍候……',{time:0});
			tools.ajaxRequest(option);
		},
		searchOrders:function(){
			$("#search").click(function(){
				alert("搜索订单");
			});
		}
	};
	orders_list.init();
});