<template>
	<div class="header">
		<div class="nav">
			<div class="logo">
				<a href="">
					<img src="../assets/logo.png" alt="海里巴巴">
					<span>
						<b>海里巴巴</b><br>
						<span>hilibaba.com</span>
					</span>
				</a>
				<div class="clear"></div>
			</div>
			<div class="login-tag">
				<a class="link">我要求职</a>
				<span class="space">|</span>
				<a class="link">我要招聘</a>
			</div>
		</div>
	</div>
</template>
<script>
export default{
	data () {
		return {

		}
	}
}
</script>
<style>
body {
  font-family: Helvetica, sans-serif;
  margin:0;
  padding:0;
  height:100%;
}
.clear{
	clear: both;
}
.header{
	height: 70px;
	background-color:rgba(248,248,248,0.8);
	border-bottom: 1px solid #ddd;
	position: fixed;
	top:0;
	width: 100%;
	z-index:1;
}
.header .nav{
	width: 1280px;
	height: 70px;
	margin: 0 auto;
	position: relative;
}
.header .nav .logo{
	height:70px;
	width: 250px;
}
.header .nav .logo a{
	margin-top:10px;
	height:70px;
	display: inline-block;
	text-decoration: none;
}
.header .nav .logo a img{
	width:60px;
	height:60px;
	vertical-align: middle;
	border-radius: 50%;
	float: left;
}
.header .nav .logo a span{
	color:#01A0E9;
	font-size: 17px;
	font-family: '微软雅黑';
	float: left;
}
.header .login-tag{
	position: absolute;
	top: 30px;
	right: 0;
	font-size: 13px;
	color:#333;
}
.header .login-tag span{
	padding: 0 8px;
	color:#66666A;
}
.header .login-tag .link:hover{
	cursor: pointer;
	color:#01A0E9;
}
</style>