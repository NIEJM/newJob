$(function(){
	var id = tools.getQueryString('id');
	var teacher_accounts_history = {
		init:function(){
			this.settHaF();
			this.setPage();
			this.getWithdraw();
		},
		settHaF:function(){
			setHaF();
		},
		setPage:function(){
			var option = {
				type: "get",
				contentType: "application/json",
				memo: "获取教师账目",
				url: "/points/" + id + "/BILL/ALL",
				callback: function(data, status, res){
					data.pointItems.sort(function(a,b){return b.createOn-a.createOn});
					var accountsTemp = $("#accountsTemp").html();
					laytpl(accountsTemp).render(data, function(html) {
						$("#accountsView").html(html);
					});
					var dataTableTemp = $("#dataTableTemp").html();
					laytpl(dataTableTemp).render(data, function(html) {
						$("#dataTableView").html(html);
						$(".dataTables-example").dataTable({searching:false});
					});
				}
			};
			tools.ajaxRequest(option);
		},
		getWithdraw:function(){
			var option = {
				type: "get",
				contentType: "application/json",
				memo: "获取教师账目",
				url: "/points/" + id + "/WITHDRAW/ALL",
				callback: function(data, status, res){
				}
			};
			tools.ajaxRequest(option);
		}
	};
	teacher_accounts_history.init();
});