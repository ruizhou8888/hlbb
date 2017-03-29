import axios from 'axios'
import qs from 'qs'


export default {
	get:function(url,params){
		return axios.get("/hlbb/" +url,{
			params:params
		}).catch(function (error) {
		    console.log(error);
	  	});
	},
	post:function(url,params){
		return axios.post("/hlbb/" +url,qs.stringify(params));
	}
}