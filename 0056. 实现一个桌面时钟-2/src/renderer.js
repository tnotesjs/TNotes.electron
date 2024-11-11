const dateDOM = document.getElementById('date');
const dayDOM = document.getElementById('day');
const timeDOM = document.getElementById('current-time');

function updateTime() {
    const now = new Date();

    // 获取日期和时间信息
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString(undefined, options);
    const dayString = now.toLocaleDateString(undefined, { weekday: 'long' });
    const timeString = now.toLocaleTimeString();

    // 更新 DOM
    dateDOM.textContent = dateString;
    dayDOM.textContent = dayString;
    timeDOM.textContent = timeString;
}

// 每秒更新时间
setInterval(updateTime, 1000);
updateTime();
