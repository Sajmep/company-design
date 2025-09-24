// Income Target Graph

document.querySelectorAll('.circle').forEach(el => {
    const target = +el.getAttribute('data-target');
    const current = +el.getAttribute('data-current');
    const percent = Math.min(100, (current / target) * 100);

    const percentText = el.querySelector('.percent');
    const subText = el.querySelector('.sub');

    let start = 0;
    function animate() {
      start++;
      const progress = Math.min(start, percent);
      el.style.setProperty("--percent", progress);
      percentText.textContent = Math.round(progress) + "%";
      subText.textContent = `SAR ${current.toLocaleString()} / SAR ${target.toLocaleString()}`;
      if (start < percent) requestAnimationFrame(animate);
    }
    animate();
  });


  // Traffic Graph
  const ctx = document.getElementById('trafficChart').getContext('2d');


const chartData = {
labels: ["Jan 01", "Jan 02", "Jan 03", "Jan 04", "Jan 05", "Jan 06", "Jan 07", "Jan 08", "Jan 09", "Jan 10", "Jan 11", "Jan 12"],
datasets: [
{
label: 'Website Blog',
data: [400,500,350,650,200,300,180,350,720,400,280,200],
backgroundColor: 'rgba(0,123,255,0.6)',
borderRadius: 5,
yAxisID: 'y'
},
{
label: 'Social Media',
data: [300,700,600,450,700,300,250,350,300,280,180,220],
borderColor: 'rgba(0,200,150,1)',
borderWidth: 2,
type: 'line',
fill: false,
yAxisID: 'y1'
}
]
};


const config = {
type: 'bar',
data: chartData,
options: {
responsive: true,
interaction: { mode: 'index', intersect: false },
stacked: false,
plugins: { legend: { position: 'bottom' } },
scales: {
y: {
type: 'linear',
display: true,
position: 'left',
title: { display: true, text: 'Website Blog' }
},
y1: {
type: 'linear',
display: true,
position: 'right',
grid: { drawOnChartArea: false },
title: { display: true, text: 'Social Media' }
}
}
}
};


let trafficChart = new Chart(ctx, config);


function updateChart() {
const blogValues = document.getElementById('blogData').value.split(',').map(Number);
const socialValues = document.getElementById('socialData').value.split(',').map(Number);


trafficChart.data.datasets[0].data = blogValues;
trafficChart.data.datasets[1].data = socialValues;
trafficChart.update();
}