// year
document.querySelectorAll('#yyyy').forEach(el => el.textContent = new Date().getFullYear());

// copy buttons
document.querySelectorAll('.copy').forEach(btn => {
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy || btn.previousElementSibling?.textContent.trim());
      btn.textContent = 'Copied!';
      setTimeout(() => (btn.textContent = 'Copy'), 1400);
    } catch (e) { btn.textContent = 'Ctrl+C'; }
  });
});

// Releases loader (used on releases.html)
window.loadReleases = async function(){
  const owner = (window.DOG && window.DOG.owner) || 'YOUR_ORG_OR_USER';
  const repo  = (window.DOG && window.DOG.repo)  || 'dog_community';
  const API = `https://api.github.com/repos/${owner}/${repo}/releases?per_page=15`;
  const list = document.getElementById('releaseList');
  if(!list) return;

  list.innerHTML = '<li class="tiny">Loading releases…</li>';
  try{
    const res = await fetch(API, { headers: { 'Accept': 'application/vnd.github+json' }});
    if(!res.ok) throw new Error('GitHub API error');
    const data = await res.json();
    if(!Array.isArray(data) || !data.length){
      list.innerHTML = '<li class="tiny">No releases yet. Check back soon.</li>';
      return;
    }
    list.innerHTML = '';
    data.forEach(rel => {
      const created = new Date(rel.published_at || rel.created_at);
      const li = document.createElement('li');
      li.className = 'release';
      li.innerHTML = `
        <h4>${rel.name || rel.tag_name}</h4>
        <p class="meta">${rel.prerelease ? 'Pre-release' : 'Release'} • ${created.toLocaleDateString()} •
          <a target="_blank" rel="noopener" href="${rel.html_url}">View on GitHub</a></p>
        ${rel.body ? `<details><summary>Notes</summary><pre class="block" style="white-space:pre-wrap">${escapeHtml(rel.body)}</pre></details>` : ''}
        ${Array.isArray(rel.assets) && rel.assets.length
          ? `<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">
               ${rel.assets.map(a => `<a class="btn secondary" href="${a.browser_download_url}" target="_blank" rel="noopener">${a.name} (${Math.max(1, Math.round(a.size/1024/1024))} MB)</a>`).join('')}
             </div>`
          : '' }
      `;
      list.appendChild(li);
    });
  }catch(err){
    list.innerHTML = `<li class="tiny">Could not load releases. <a target="_blank" rel="noopener" href="https://github.com/${owner}/${repo}/releases">Open on GitHub</a>.</li>`;
  }
};

function escapeHtml(str){return str.replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));}
