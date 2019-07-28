$(function(){
	var teacher_accounts_list = {
		init:function(){
			this.settHaF();
			this.getAccounts();
		},
		settHaF:function(){
			setHaF();
		},
		getAccounts:function(){
			var option = {
				type: "get",
				contentType: "application/json",
				memo: "获取教师账目",
				url: "/points/admin/BILL/ALL",
				callback: function(data, status, res){
					var dataTableTemp = $("#dataTableTemp").html();
					laytpl(dataTableTemp).render(data, function(html) {
						$("#dataTableView").html(html);
						$(".dataTables-example").dataTable({
							"columnDefs":[{"orderable": false, "targets": 0}],
							"order": [[1,"desc"]],
							"stateSave": true
						});
					});
				}
			};
			tools.ajaxRequest(option);
		}
	};
	teacher_accounts_list.init();
});