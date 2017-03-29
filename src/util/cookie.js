export default {
	setCookie:function(cookieName,value,time){
		if(time){
			var date = new Date();
			date.setDate(date.getDate()+time);
			document.cookie = cookieName+"="+value+";expires="+date.toUTCString();
		}else{
			document.cookie = cookieName+"="+value;
		}
	},
	getCookie:function(cookieName){
		if(document.cookie.length>0){
			if(document.cookie.indexOf(cookieName+"=") !=-1){
				var array = [];
				array = document.cookie.split(';');
				for(var i=0;i<array.length;i++){
					if(array[i].indexOf(cookieName+"=")!=-1){
						return array[i].replace(cookieName+"=","");
					}
				}
				return "";
			}else{
				return null;
			}
		}else{
			return null;
		}
	},
	delCookie:function(cookieName){
		if(document.cookie.length>0){
			if(document.cookie.indexOf(cookieName+"=") !=-1){
				var date = new Date();
				date.setDate(date.getDate()-1);
				console.log(date);
				document.cookie = cookieName+"="+this.getCookie(cookieName)+";expires="+date.toUTCString();
			}
		}
	}
}