<template>
	<view>
		<view style="margin-top: 30rpx;" v-if="page > 0 && page < 5">
			<u-steps :list="step_list" activeIcon='https://jsd.onmicrosoft.cn/npm/gpos_image_antaresz@latest/icon/checkmark.svg' inactiveIcon='https://jsd.onmicrosoft.cn/npm/gpos_image_antaresz@latest/icon/wrongstep.svg' current="page-1">
				<u-steps-item title="选择背景"></u-steps-item>
				<u-steps-item title="上传背景"></u-steps-item>
				<u-steps-item title="上传人像"></u-steps-item>
				<u-steps-item title="合成图片"></u-steps-item>
			</u-steps>
		</view>
		
		<view v-if="page == 0">
			<view  class="content">
				<img class="logo" src="https://jsd.onmicrosoft.cn/npm/gpos_image_antaresz@latest/icon/logo.jpg"></img>
			</view>
			<view class="start_gpos">
				<u-button type="success" size="large" hairline @click="UserLogin">开始你的一键合成之旅</u-button>
			</view>
			<view class="footer">
			    <text>版权所有 &copy; 2023 Antaresz</text>
			    <text>更多信息请访问我们的Github:</text>
				<text>https://www.github.com/Antaresz1026</text>
			</view>
		</view>
		
		<view v-if="page == 1">
			<view>
				<view class="content">
					<view class="preview_docker" >
						<view v-if="selected_image">
							<img :src="selected_image" alt="Preview Image" class="preview_image">
						</view>
					</view>
					<view class="image_scroll">
					    <u-scroll-list :indicator="indicator">
							<view v-for="(item, index) in images" :key="index" class="scroll_docker" @click="ScrollImageClick(index)">
								<img :src="item.url" style="width: 40vw; height: 20vh;"></img>	   
							</view>			 				   
					    </u-scroll-list>
					</view>
				</view>
				<view class="next_page">
					<u-button type="success" size="large" hairline @click="IncreasePage">下一步</u-button>
				</view>
				<view class="back_page">
					<u-button type="success" size="large" hairline @click="BackTo">上一步</u-button>
				</view>
			</view>
		</view>
		
		<view v-if="page == 2">
			<view>
				<view class="content">
					<view class="upload_image">
						<u-upload :fileList="file_list1" name="1" :maxCount="1" width="100vw" height="40vh" :previewFullImage="true" imageMode @afterRead="(e) => AfterRead(e, 'bgr')" @delete="DeleteImage" ></u-upload>
					</view>
				</view>

				<view class="next_page">
					<u-button type="success" size="large" hairline @click="IncreasePage">下一步</u-button>
				</view>
				<view class="back_page">
					<u-button type="success" size="large" hairline @click="BackTo">上一步</u-button>
				</view>
			</view>
		</view>
		
		<view v-if="page == 3">
			<view>
			<view>
				<view class="content">
					<view class="upload_image">
						<u-upload :fileList="file_list2" name="2" :maxCount="1" width="100vw" height="40vh" :previewFullImage="true" imageMode @afterRead="(e) => AfterRead(e, 'src')" @delete="DeleteImage" ></u-upload>
					</view>
				</view>

				<view class="next_page">
					<u-button type="success" size="large" hairline @click="ShowMattingImage">下一步</u-button>
				</view>
				<view class="back_page">
					<u-button type="success" size="large" hairline @click="BackTo">上一步</u-button>
				</view>
			</view>
			</view>
		</view>
		
		<view v-if="page == 4">
			<view>
				<view class="content">
					<img :src="matting_image_url" alt="Preview Image" class="matting_image">
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sessionID: [],
				user_info: {},
				has_user_info: false,
				can_i_use_get_user_profile: false,
				page: 0,
				tabbar_value: 0,
				indicator: true,
				selected_src: [],
				selected_bgr: [],
				selected_image: [],
				selected_index: 0,
				step_list: [{
					name: '选择背景'
				}, {
					name: '上传背景'
				}, {
					name: '上传人像'
				}, {
					name: '合成图片'
				}],
				matting_image_url: [],
				file_list1: [],
				file_list2: [],
				images: [
					{ url: 'https://jsd.onmicrosoft.cn/npm/gpos_image_antaresz@latest/background/image1.jpg' },
					{ url: 'https://jsd.onmicrosoft.cn/npm/gpos_image_antaresz@latest/background/image2.jpg' },
					{ url: 'https://jsd.onmicrosoft.cn/npm/gpos_image_antaresz@latest/background/image3.jpg' },
					{ url: 'https://jsd.onmicrosoft.cn/npm/gpos_image_antaresz@latest/background/image4.jpg' },
					{ url: 'https://jsd.onmicrosoft.cn/npm/gpos_image_antaresz@latest/background/image5.jpg' },
					{ url: 'https://jsd.onmicrosoft.cn/npm/gpos_image_antaresz@latest/background/image6.jpg' },
					{ url: 'https://jsd.onmicrosoft.cn/npm/gpos_image_antaresz@latest/background/image7.jpg' },
					{ url: 'https://jsd.onmicrosoft.cn/npm/gpos_image_antaresz@latest/background/image8.jpg' },
				],
			}
		},
		onLoad() {
			if(this.GetUserInfoProfile) {
				console.log("i can get");
				this.can_i_use_get_user_profile = true;
			}
		},
		methods: {
			UserLogin() {
				wx.login({
					success: (res) => {
						if (res.code) {
						//发起网络请求
						wx.request({
							url: 'https://antaresz.cc:21026/GPOS/login',
							method: 'POST',
							data: {
								code: res.code
							},
							success: (res) => {
								this.IncreasePage();
								this.sessionID = res.data.sessionID;
								console.log(this.sessionID);
							},
							fail (error) {
								wx.showToast({
									title: `发送网络请求失败:error${error}`
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
			IncreasePage() {
				this.page ++;
			},
			BackTo() {
				this.page --;
			},
			ScrollImageClick(i) {
				this.selected_image = this.images[i].url;
			},

			DeleteImage(event) {
				this[`file_list${evemt.name}`].splice(event.index, 1)
			},

			async AfterRead(event, image_type) {
				// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let file_list_len = this[`file_list${event.name}`].length
				lists.map((item) => {
					this[`file_list${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.UploadImage(lists[i].url, image_type)
					let item = this[`file_list${event.name}`][file_list_len]
					this[`file_list${event.name}`].splice(file_list_len, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					file_list_len++
				}
			},
			UploadImage(url, image_type) {
				return new Promise((resolve, reject) => {
					console.log(image_type)
					let a = uni.uploadFile({
						url: 'https://antaresz.cc:21026/GPOS/upload', // 仅为示例，非真实的接口地址
						filePath: url,
						name: 'upload_img',
						formData: {
							sessionID: this.sessionID,
							type: image_type,
						},
						success: (res) => {
							setTimeout(() => {
								resolve(res.data.data)
							}, 1000)
						}
					});
				})
			},
			GetUserInfoProfile(e) {
				wx.getUserProfile({
				    desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
				    success: (res) => {
						console.log("get success");
						this.page++;
				        this.user_info = res.userInfo;
				        this.has_user_info = true;
				    },
					fail: (res) => {
						console.log("get fail");
					}
				})
			},
			ShowMattingImage() {
				this.IncreasePage();
				wx.request({
					url: `https://antaresz.cc:21026/GPOS/matting?sessionid=${this.sessionID}`,
					success: (res) => {
						console.log(res);
						this.matting_image_url=res.data;
					},
					fail: (res) => {
						console.log(res.body);
					}
				})
			},
			SendLogToServer(log) {
			  wx.request({
			    url: 'https://antaresz.cc:21026/log',
			    method: 'POST',
			    data: log,
			  });
			},
			TabbarClick(e) {
				
			}
		}
	}
</script>

<style>
	.content {
		width: 100vw;
		height: 70vh;
		border: 1px solid white;
	}
	
	.logo {
		height: 50vh;
		width: 85vw;
		margin-top: 10vh;
		margin-left: 7.5vw;
		margin-right: 7.5vw;
		
	}
	.footer {
		position: fixed;
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	    justify-content: center;
		width: 90vw;
		height: 150rpx;
		left: 5vw;
		right: auto;
		bottom: 5vh;
	    background-color: #f8f8f8; /* 背景色，根据需要调整 */
	    color: #666; /* 文字颜色，根据需要调整 */
		
	}
	
	.footer text {
	    margin: 5px; /* 文字间距，根据需要调整 */
		font-size: 1ch;
	}
	
	.user_info {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  color: #aaa;
	  
	}
	
	.user_info_avatar {
	  overflow: hidden;
	  width: 128rpx;
	  height: 128rpx;
	  margin: 20rpx;
	  border-radius: 50%;
	}
	
	.next_page {
		width: 90vw;
		margin-top: 2.5vh;
		margin-left: 5vw;
	}
	
	.preview_docker {/*预览图容器*/
		margin-top: 5vh;
		margin-bottom: 5vh;
		width: 95vw;
		height: 30vh;
		margin-left: 2.5vw;
		
	}
		
	.preview_image {
		margin-left: 2.5vw;
		width: 90vw;
		height: 30vh;
		background-color: white;
		
	}

	.image_scroll {
		position: static;
		width: 95vw;
		bottom: 1vh;
		margin-left: 2.5vw;
		margin-right: auto;
	}
	.scroll_docker {
		display: flex;
		flex-direction: column;
		align-items: center;
		cursor: pointer;
		border: 1px solid #ddd; /* 默认边框样式 */
		padding: 10px;
	}
	
	.back_page {
		margin-top: 2.5vh;
		width: 90vw;
		margin-left: 5vw;
	}
	.upload_image {
		width: 100vw;
		height: 40vh;
		margin-top: 15vh;
	}
	.matting_image {
		width: 100vw;
		height: 40vh;
		margin-top: 15vh;
		
	}
</style>
