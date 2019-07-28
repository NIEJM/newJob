$(function(){
	var lab = tools.getQueryString('lab');
	var banner_manage = {
		init:function(){
			this.getBannerInfo();
			this.saveFormSubmit();
			this.saveBannerInfo();
			this.backToList();
		},
		getBannerInfo:function(){
			var $this = this;
			var option = {
				type: "get",
				contentType: "application/json",
				memo: "获取banner信息",
				url: "/config/banner/info?type=" + lab,
				callback: function(data, status, res){
					layer.msg(option.memo+"成功" , {icon: 6});
					data.type = lab;
					var bannerManageTemp = $("#bannerManageTemp").html();
					laytpl(bannerManageTemp).render(data,function(html){
						$("#bannerManageForm").html(html);
						$this.imgUpload();
					});
				}
			};
			tools.ajaxRequest(option);
		},
		saveFormSubmit:function(){
			$("#bannerManageForm").on('click','button#save',function(){
				$("#bannerManageForm").submit();
			});
		},
		saveBannerInfo:function(){
			$("#bannerManageForm").validate({
				submitHandler: function (form) {
					var formData = {};
					formData.items = [];
					$('.banner_form').each(function(){
						formData.items.push($(this).serializeObject());
					});
					var option = {
						type: "post",
						contentType: "application/json",
						memo: "保存banner信息",
						data: JSON.stringify(formData),
						url: "/config/banner/upload",
						callback: function(data, status, res){
							layer.msg(option.memo+"成功" , {icon: 6});
						}
					};
					tools.ajaxRequest(option);
				}
			});
		},
		imgUpload:function(){
			for(var i=0;i<3;i++){
				tools.fileUpload('#upload_banner'+i,$('#banner'+i+'_box'),$('#imgAddress'+i));
			}
		},
		backToList:function(){
			$("#bannerManageForm").on('click','button#cancel',function(){
				history.go(-1);
			});
		}
	};
	banner_manage.init();
});