function togglePeriod(period) {
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.subscription-toggle-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    event.target.classList.add('active');
  }

// Cost table logic for feature checkboxes (simplified)
(function initFeatureCosts(){
  const container = document.querySelector('.feature-boxes');
  const tbody = document.getElementById('costTableBody');
  const totalEl = document.getElementById('costTotal');
  const savingEl = document.getElementById('savingValue');
  if(!container || !tbody || !totalEl) return;

  function updateCosts(){
    // Rebuild table from checked inputs
    tbody.innerHTML = '';
    let monthly = 0;
    container.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
      const name = cb.getAttribute('data-feature') || '';
      const cost = parseFloat(cb.getAttribute('data-cost') || '0') || 0;
      monthly += cost;
      const tr = document.createElement('tr');
      tr.setAttribute('data-cost', String(cost));
      tr.innerHTML = `<td>${name}</td><td>${cost.toLocaleString('en-US')}</td>`;
      tbody.appendChild(tr);
    });
    const yearly = monthly * 12;
    totalEl.textContent = yearly.toLocaleString('en-US');
    if (savingEl) {
      const baseline = 10000; // SAR/year
      const saving = Math.max(0, yearly - baseline);
      savingEl.textContent = saving.toLocaleString('en-US');
    }
  }

  container.addEventListener('change', function(e){
    if(e.target && e.target.matches('input[type="checkbox"]')) updateCosts();
  });

  // initial render
  updateCosts();
})();

// Toggle section functionality for comparison table
function toggleSection(headerElement) {
  const sectionHeader = headerElement;
  const sectionContent = [];
  
  // Find all content rows that belong to this section
  let currentRow = sectionHeader.nextElementSibling;
  while (currentRow && currentRow.classList.contains('section-content')) {
    sectionContent.push(currentRow);
    currentRow = currentRow.nextElementSibling;
  }
  
  // Toggle the collapsed class on header and content
  sectionHeader.classList.toggle('collapsed');
  sectionContent.forEach(row => {
    row.classList.toggle('collapsed');
  });
}


function switchTab(tabId) {
  // Remove active class from all tabs and panels
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
  
  // Add active class to clicked tab and corresponding panel
  event.target.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}