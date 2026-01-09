// 确保页面加载完成后执行所有交互逻辑
// 依赖：需在HTML页面中先引入jQuery库（如 <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>）
$(function() {
    // ===================== 1. 茶类板块切换功能 =====================
    // 点击导航按钮切换对应内容板块
    $(".tea-nav-btn").click(function() {
        // 容错：判断按钮是否存在，避免报错
        if (!$(this).attr("data-tab")) return;
        
        const tabId = $(this).attr("data-tab");
        // 移除所有按钮和内容的激活状态
        $(".tea-nav-btn").removeClass("active");
        $(".tea-tab-content").removeClass("active");
        // 为当前点击的按钮和对应内容添加激活状态
        $(this).addClass("active");
        $("#" + tabId).addClass("active");
    });

    // ===================== 2. 茶叶元素颜色切换功能 =====================
    // 定义不同茶类的颜色和描述数据
    const teaTypes = [
        { color: "#81C784", name: "绿茶", ferment: "0%（不发酵）" },
        { color: "#AED581", name: "黄茶", ferment: "10-20%（轻发酵）" },
        { color: "#FFF9C4", name: "白茶", ferment: "5-10%（微发酵）" },
        { color: "#66BB6A", name: "青茶", ferment: "10-70%（半发酵）" },
        { color: "#E57373", name: "红茶", ferment: "80-100%（全发酵）" },
        { color: "#424242", name: "黑茶", ferment: "100%（后发酵）" }
    ];
    let currentIndex = 0; // 初始选中第一个茶类

    // 点击叶子元素切换颜色和描述
    $("#leaf-element").click(function() {
        // 循环切换索引（0→1→2→3→4→5→0…）
        currentIndex = (currentIndex + 1) % teaTypes.length;
        // 修改叶子颜色
        $(this).css("color", teaTypes[currentIndex].color);
        // 更新茶类描述文本
        $("#tea-desc").html(`<strong>${teaTypes[currentIndex].name}</strong> - 发酵程度：${teaTypes[currentIndex].ferment}`);
    });

    // ===================== 3. 茶产地地图标记点击功能 =====================
    // 点击地图标记触发动画和页面跳转
    $(".area-marker").click(function() {
        // 容错：判断标记的属性是否存在
        if (!$(this).attr("data-area") || !$(this).attr("data-emoji")) return;
        
        const area = $(this).attr("data-area");
        const teaEmoji = $(this).attr("data-emoji");
        
        // 1. 显示茶叶飘落动画（需配合CSS的teaFall动画）
        $("#falling-tea")
            .html(teaEmoji)
            .css("animation", "none") // 重置动画，确保每次点击都能触发
            .show()
            .offset(); // 强制重绘
        $("#falling-tea").css("animation", "teaFall 2s ease forwards");
        
        // 2. 容器渐隐效果
        $(".container").addClass("fade-out");
        
        // 3. 2秒后跳转到对应产地详情页
        setTimeout(() => {
            window.location.href = `subpages/${area}-detail.html`;
        }, 2000);
    });

    // ===================== 4. BGM音频控制功能 =====================
    // 获取音频DOM元素（jQuery对象转原生DOM）
    const bgmAudio = $("#bgm-audio")[0];
    // 容错：如果音频元素不存在，跳过BGM控制
    if (!bgmAudio) {
        console.warn("未找到BGM音频元素（#bgm-audio），BGM控制功能失效");
    } else {
        // 播放/暂停按钮点击事件
        $("#bgm-play-btn").click(function() {
            if (bgmAudio.paused) {
                bgmAudio.play().catch(err => {
                    console.error("BGM播放失败：", err);
                    alert("音频播放需要用户交互，请先点击页面任意位置再尝试播放");
                });
                $(this).text("⏸️"); // 暂停图标
            } else {
                bgmAudio.pause();
                $(this).text("▶️"); // 播放图标
            }
        });

        // 音量调节滑块事件
        $("#bgm-volume").on("input", function() {
            // 限制音量范围0-1
            const volume = Math.max(0, Math.min(1, $(this).val()));
            bgmAudio.volume = volume;
            $(this).val(volume); // 确保值在合法范围
        });

        // 页面卸载时暂停音频，避免残留播放
        $(window).on("beforeunload", function() {
            bgmAudio.pause();
        });
    }
});