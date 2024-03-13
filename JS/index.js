var mySwiper = new Swiper('.swiper', {
    direction: 'vertical', // 垂直切换选项
    loop: false, // 循环模式选项
    init:false,//创建swiper实例时是否初始化
    on: {//切换时改变播放状态
        slideChangeTransitionEnd: function(){
        //1.让所有play按钮都处于暂停状态 
        $(".play").removeClass("playing")
        //2.触发当前slide的play按钮点击事件
        $(".play").eq(this.activeIndex).trigger("click")
        },
        //当滑动到最后一个swiper时执行
        reachEnd: function(){
            //再次发送请求，加载下一页视频数据
            getVideoList(0, 10, function(data) {
                let videoList = data.result.list
                    //遍历 videoList 创建 swiper-slide 将创建好的swiper-slide添加到swiper-wrapper
                videoList.forEach(function(item, index, arr) {
                        let swiperSlide = $(`
                            <div class="swiper-slide">
                                <div class="video_box">
                                        <div class="video_title">${item.title}。</div>
                                        <div class="video_wrap">
                                            <video src="${item.playurl}" poster="${item.picurl}"></video>
                                        </div>
                                        <div class="video_name">${item.alias}</div>
                                        <div class="play"></div>
                                </div>
                            </div>
                            `)
                            $(".swiper-wrapper").append(swiperSlide)
                        })
                        //当swiperSlide添加到页面完毕后 初始化swiper
                        mySwiper.update()//更新swiper实例
                })
      }
 
      },
})
//发送请求，Ajax，将请求到的数据 动态创建出来渲染到页面上
getVideoList(0, 10, function(data) {
            let videoList = data.result.list
                //遍历 videoList 创建 swiper-slide 将创建好的swiper-slide添加到swiper-wrapper
            videoList.forEach(function(item, index, arr) {
                    let swiperSlide = $(`
                        <div class="swiper-slide">
                            <div class="video_box">
                                    <div class="video_title">${item.title}。</div>
                                    <div class="video_wrap">
                                        <video src="${item.playurl}" poster="${item.picurl}"></video>
                                    </div>
                                    <div class="video_name">${item.alias}</div>
                                    <div class="play"></div>
                            </div>
                        </div>
                        `)
                        $(".swiper-wrapper").append(swiperSlide)
                    })
                    //当swiperSlide添加到页面完毕后 初始化swiper
                    mySwiper.init()//完成初始化
            })
// 通过事件绑定的方式给播放按钮绑定点击事件
$(".swiper-wrapper").on("click",".play",function(){
    console.log(this)
    //1.让其他视频都暂停
    $("video").each(function(index,video){
        video.pause()
        // console.log(index,video)
    })  
  //2.播放时让play按钮隐藏 替换类名 this是play按钮
    $(this).toggleClass("playing")
    //3.play按钮对应的video标签 让视频进行播放
    let video = $(this).prevAll(".video_wrap").children("video").get(0)
    //判断播放状态
    if($(this).hasClass("playing")){
        video.play()
    }
    else{
        video.pause()
    }
    let _this = this//保证接下来的this是play 而不是video
    //监听当前视频播放结束事件
    $(video).on("ended",function(){
        //播放完成后 自动播放下一个视频
        mySwiper.slideNext()
    })


})

        //定义一个函数 专门用来发送Ajax请求 获取服务器数据
        function getVideoList(page, size, cb) {
            //创建xhr对象 
            let xhr = new XMLHttpRequest()
                //配置请求参数
            xhr.open("GET",
                    `https://api.apiopen.top/api/getMiniVideo?page=${page}&size=${size}`)
                //发送请求
            xhr.send()
                //监听事件
            xhr.onload = function() {
                if (xhr, this.status >= 200 && xhr.status < 300) {
                    let data = JSON.parse(xhr.responseText)
                    cb && cb(data)
                }
            }
        }