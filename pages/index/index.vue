<template>
	<u-tabbar
		:value="page"
		@change="(name) => PageChange(name)"
		:fixed="true"
		:placeholder="false"
		:safeAreaInsetBottom="true"
	>
		<u-tabbar-item name="home" text="首页" icon="home" @click="(name) => PageChange(name)" ></u-tabbar-item>
		<u-tabbar-item name="mine" text="我的" icon="account" @click="(name) => PageChange(name)" ></u-tabbar-item>
	</u-tabbar>
	
	<view v-if="login == false && page == 'login'">
		<view class="page">
			<view class="avatar_display">
				<button class="avatar_wrapper" style="z-index: 1;opacity: 0;" open-type="chooseAvatar" @chooseavatar="ChooseAvatar"></button>
				<image class="avatar_wrapper" :src="avatar_url"></image>	
			</view>
			<view class="nickname_input_box">
				<label class="nickname_label" for="nickname">昵称</label>
				<input 
					class="nickname_input" 
					id="nickname" 
					type="nickname" 
					placeholder="请输入昵称"
					maxlength="16"
					@confirm="NicknameConfirm"
					@nicknamereview="NicknameCheck"
				/>
				<view style="position: absolute;margin-top: 10vh;width: 90vw; margin-left: 5vw;">
					<button 
						type="primary" 
						:disabled="!login_access"
						:hairline="true" 
						open-type="agreePrivacyAuthorization" 
						@click="UserLogin()" 
					>
					登录</button>
				</view>
			</view>
		</view>
	</view>
	
	<view v-if="page == 'home'">
		<view class="page">
			<view class="container">
				<view class="row">
				  <view class="card">
					<text style="font-size: 4vh;color: white;margin-top: 2vh;margin-left: 2vw;">一键合影</text>
					<text style="color: #e7e7e7;margin-top: 1vh;margin-left: 2vw;">快来一起“云游”四方</text>
					<view style="width:36vw;height:5vh;margin-bottom: 3vh;margin-left: 2vw;">
						<u-button shape="circle" text="开始使用" @click="PageChange('GPOS')"></u-button>
					</view>
				  </view>
				  <view class="card">
					  
				  </view>
				</view>
				<view class="row">
					
				</view>
			</view>
		</view>
	</view>
	
	<view v-if="page == 'mine'">
		<view class="page">
			<view class="user_info" >
				<view class="avatar">
					<u-avatar size="100" :src="avatar_url"></u-avatar>	
				</view>
				<view class="nickname_display">
					<u--text color="#000000" :text="nickname" :size="30" :bold="true" :lines="1" ></u--text>
					<button style="position: absolute;width: 30vw;height: 4vh;margin-top: 2vh;border-radius: 10px;" v-if="login == false" @click="PageChange('login')"></button>
					<text style="position: absolute;margin-top: 2vh;margin-left: 10vw;font-size: 20px;" v-if="login == false">登录</text>
					<button style="position: absolute;width: 40vw;height: 4vh;margin-top: 2vh;border-radius: 10px;" v-if="login == true"></button>
					<text style="position: absolute;margin-top: 2vh;width: 30vw;margin-left: 6vw;font-size: 20px;" v-if="login == true">编辑个人资料</text>
				</view>
			</view>
			<u-cell-group :customStyle="cellgroups_style">
				<u-cell name="graph" title="我的合影" isLink=true @click="(name) => PageChange(name)"></u-cell>
				<u-cell name="settings" title="设置" isLink=true @click="(name) => PageChange(name)"></u-cell>
			</u-cell-group>
		</view>
	</view>
	<view v-if="page == 'GPOS'">
		<u-navbar v-if="gpos_steps==0" :safeAreaInsetTop='false' left-text='返回' right-text="选择图片" title="选择背景图" @leftClick="GPOS_Steps('back')" @rightClick="ChooseImage('0')"></u-navbar>
		<u-navbar v-if="gpos_steps==1" :safeAreaInsetTop='false' left-text='返回' right-text="选择图片" title="选择人像图" @leftClick="GPOS_Steps('back')" @rightClick="ChooseImage('1')"></u-navbar>
		<u-navbar v-if="gpos_steps==2" :safeAreaInsetTop='false' left-text='返回' right-text="下一步" title="图像分割" @leftClick="GPOS_Steps('back')" @rightClick="GPOS_Steps('forward')"></u-navbar>
		<view v-if="gpos_steps==0" class="page">
			<view class="image_container">
				<u--image :src="image_bgr" mode="aspectFit" shape="squre" width="80vw" height="60vh" radius="10"></u--image>
			</view>
			<view class="next_step">
				<button type="primary" hairline="true" @click="GPOS_Steps('forward')">下一步</button>
			</view>
		</view>
		<view v-if="gpos_steps==1" class="page">
			<view class="image_container">
				<u--image :src="image_src" mode="aspectFit" shape="squre" width="80vw" height="60vh" radius="10"></u--image>
			</view>
			<view class="next_step">
				<button type="primary" hairline="true" @click="GPOS_Upload()">下一步</button>
			</view>
		</view>
		<view v-if="gpos_steps==2" class="page">
			<u-overlay :show="matting_ready">
				<view class="matting_check">
					<view class="check_image_container">
						<view class="check_image_preview">
							<u--image :src="image_bgr" mode="aspectFit" shape="squre" width="42.5vw" height="30vh" radius="10"></u--image>
						</view>
						<view class="check_image_preview">
							<u--image :src="image_src" mode="aspectFit" shape="squre" width="42.5vw" height="30vh" radius="10"></u--image>
						</view>
					</view>
					<u--text type="warning" text="请确认要抠图的图片是否正确" align="center"></u--text>
					<view class="check_confirm">
						<button type="primary" hairline="true" @click="GPOS_Matting()">确认</button>
					</view>
				</view>
			</u-overlay>
			<view class="image_container">
				<u--image :src="image_com" mode="aspectFit" shape="squre" width="80vw" height="60vh" radius="10"></u--image>
			</view>
		</view>
	</view>
</template>

<script>
	const default_avatar_url = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
	export default {
		data() {
			return {
				login_access: true,
				login: false,
				avatar_url: default_avatar_url,
				nickname: "默认用户",
				nicknamepass: false,
				page: "login",
				sessionID: "",
				cellgroups_style: {
					'position': 'relative',
					'width': '100vw',
					'margin-top': '20vh',
					'background-color': '#ffffff'
				},
				gpos_steps: 0,
				image_src: "",
				image_bgr: "",
				bg_chosen: "",
				image_com: "",
				matting_ready: true,
			} 
		},
		methods: {
			ChooseAvatar(e) {
				this.avatar_url = e.detail.avatarUrl;
			},
			LoginClick() {
				if(nickname != "默认用户" && nickname != "") {
					this.login_access = true;
				}
			},
			NicknameCheck(e) {
				if(e.detail.pass) {
					this.nicknamepass = true;
				} else {
					wx.showToast({
						title: '昵称审核超时',
						icon: 'error'
					})
				}
			},
			NicknameConfirm(e) {
				if(this.nicknamepass) {
					this.nickname = e.detail.value;
					this.login_access = true;
				}
			},
			PageChange(index) {
				this.page = index;
			},
			UserLogin() {
				wx.login({
					success: (res) => {
						if (res.code) {
							wx.request({
								url: 'https://antaresz.cc:21026/GPOS/login',
								method: 'POST',
								data: {
									code: res.code,
									nickname: this.nickname
								},
								success: (res) => {
									this.sessionID = res.data.sessionID;
									this.login = true;
									console.log(this.sessionID);
									this.PageChange("home");
								},
								fail (error) {
									wx.showToast({
										title: '服务器未响应',
										icon: 'error'
									})
								}
							})
						} else {
							wx.showToast({
								title: '登录失败！'
							})
						}
					}
				})
			},
			GPOS_Steps(action) {
				if(action == 'back') {
					this.gpos_steps--;
				} else if(action == 'forward') {
					this.gpos_steps++;
				}
				if(this.gpos_steps == -1) {
					this.gpos_steps = 0;
					this.PageChange('home');
				}
			},
			ChooseImage(step) {
				wx.chooseMedia({
					success: (res) => {
						if(step == '0') {
							this.image_bgr = res.tempFiles[0].tempFilePath;
						} else if(step == '1') {
							this.image_src = res.tempFiles[0].tempFilePath;
						}
					}, 
					fail (error) {
						wx.showToast({
							title: '选择图片失败！',
							icon: 'error'
						})
					}
				})
			},
			GPOS_Upload() {
				wx.uploadFile({
					url: 'https://antaresz.cc:21026/GPOS/upload',
					filePath: this.image_bgr,
					name: 'upload_image',
					formData: {
						type: 'bgr',
						sessionID: this.sessionID,
					},
					success: (res) => {
						wx.uploadFile({
							url: 'https://antaresz.cc:21026/GPOS/upload',
							filePath: this.image_src,
							name: 'upload_image',
							formData: {
								type: 'src',
								sessionID: this.sessionID,
							},
							success: (res) => {
								console.log(res.statusCode+res.data);
								if(res.statusCode == '200' ) {
									wx.showToast({
										title: '图片上传成功',
										icon: 'success'
									});
									this.gpos_steps++;
									this.matting_ready = true;
								}
							},
							fail: (res) => {
								wx.showToast({
									title: '人像上传失败',
									icon: 'error'
								});
							}
						})
					},
					fail (error) {
						wx.showToast({
							title: '背景上传失败',
							icon: 'error'
						})
					}
				})
			},
			GPOS_Matting() {
				wx.request({
					url: 'https://antaresz.cc:21026/GPOS/matting',
					data: {
						sessionID: this.sessionID,
					},
					method: 'GET',
					success: (res) => {
						this.image_com = res.data.url;
						this.matting_ready = false;
						wx.showToast({
							title: '图片抠图成功',
							icon: 'success'
						})
					},
					fail (error) {
						wx.showToast({
							title: '图片抠图失败',
							icon: 'error'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import '@/uni_modules/uview-ui/theme.scss';
	
	.page {
		position: fixed;
		width: 100vw;
		height: 84vh;
		top: 5vh;
	}
	
	//Page "mine"
	.user_info {
		position: fixed;
		top: 0vh;
		background-color: #9acafc;
		width: 100vw;
		height: 130px;
		display: flex;
	}
	.avatar {
		width: 100px;
		height: 100px;
		margin-top: 15px;
		margin-left: 3vw;
		border-radius: 50%;
	}
	.nickname_display {
		position: relative;
		margin-top: 30px;
		margin-left: 10vw;
	}
	
	//Page "login"
	.avatar_display {
		background-color: #ffffff;
		width: 100vw;
		height: 20vh;
		position: fixed;
		top: 0vh;
		display: flex;
		justify-content: center;
	}
	.avatar_wrapper {
		position: absolute;
		width: 15vh;
		height: 15vh;
		margin-top: 2.5vh;
		border-radius: 50%;
	}
	.nickname_input_box {
		background-color: #ffffff;
		position: fixed;
		top: 24vh;
		width: 100vw;
		height: 5vh;
		display: flex;	
	}
	.nickname_label {
		width: 15vw;
		height: 5vh;
		font-size: 2vh;
		text-align: center;
		line-height: 5vh;
		border: 0.1px solid grey;
		border-radius: 2px;
	}
	.nickname_input {
		width: 85vw;
		height: 5vh;
		line-height: 5vh;
		border: 0.1px solid grey;
	}

	//Page "home"
	.container {
		width: 100vw;
		height: 81vh;
	}
	.row {
		width: 100vw;
		height: 27vh;
		display: flex;
		justify-content: space-around;
	}
	.card {
		width: 41vw; 
		height: 25vh; 
		display: flex;
		flex-direction: column;
		background-color: $u-primary;
		border-radius: 10px; 
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
	
	//Page 'GPOS'
	.image_container {
		position: relative;
		width: 80vw;
		height: 60vh; 
		align-items: center;
		margin-top: 5vh;
		margin-left: 10vw;
		background-color: #ffffee;
		border-radius: 10px; 
		padding: 3px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
	.next_step {
		position: relative;
		width: 80vw;
		margin-top: 5vh;
		margin-left: 10vw;
	}
	.matting_check {
		position: relative;
		width: 90vw;
		height: 50vh;
		margin-left: 5vw;
		margin-top: 10vh;
		background-color: #f3f3f3;
	}
	.check_image_container {
		position: relative;
		width: 90vw;
		height: 35vh;
		display: flex;
		flex-direction: row;
	}
	.check_image_preview {
		width: 42.5vw;
		height: 30vh;
		margin-top: 2.5vh;
		margin-left: 1.25vw;
		margin-right: 1.25vw;
		margin-bottom: 2.5vh;
	}
	.check_confirm {
		width: 60vw;
		height: 10vh;
		margin-top: 2vh;
		margin-left: 15vw;
	}
</style>
