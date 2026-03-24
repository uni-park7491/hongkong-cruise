// =============================================
// community.js - Firebase 게시판 (투표, 방명록)
// =============================================


function getDB(){ return window._db; }

function getFS(){ return window._fs; }

function onNickChange(){
  // 로그인 시 자동 호출 - myNick은 이미 설정됨
  const badge = document.getElementById('communityNickBadge');
  if(badge && myNick) badge.textContent = myNick + ' 님';
}

function openNewPoll(){
  if(!myNick){ alert('로그인 후 이용해주세요!'); return; }
  document.getElementById('pollModalContent').innerHTML = `
    <h2 style="font-family:Barlow,sans-serif;font-size:1.2rem;font-weight:700;color:var(--navy);margin-bottom:6px">🗳️ 안건 올리기</h2>
    <p style="font-size:13px;color:var(--gray);margin-bottom:18px">제시자: <strong>${myNick}</strong></p>
    <label style="font-size:13px;font-weight:700;color:var(--navy);display:block;margin-bottom:6px">안건 내용</label>
    <textarea id="pollTitleInput" placeholder="예) 4월 27일 오후 빅토리아 피크 방문 어떠세요?" rows="3"
      style="width:100%;padding:12px 14px;border:1.5px solid var(--border);border-radius:8px;font-size:14px;font-family:inherit;resize:vertical;outline:none;box-sizing:border-box;margin-bottom:16px"
      onfocus="this.style.borderColor='var(--blue)'" onblur="this.style.borderColor='var(--border)'"></textarea>
    <button onclick="submitNewPoll()"
      style="width:100%;background:var(--teal);color:#fff;border:none;border-radius:8px;padding:13px;font-size:15px;font-weight:700;font-family:inherit;cursor:pointer">
      안건 등록하기
    </button>`;
  document.getElementById('pollOverlay').classList.add('show');
}

async function submitNewPoll(){
  const title = document.getElementById('pollTitleInput').value.trim();
  const btn = document.querySelector('#pollModalContent button');
  if(!title){ alert('안건 내용을 입력해주세요'); return; }
  if(!window._db){ alert('Firebase 연결 중입니다. 잠시 후 다시 시도해주세요'); return; }
  try {
    if(btn){ btn.textContent='등록 중...'; btn.disabled=true; }
    const { collection, addDoc, serverTimestamp } = getFS();
    const now = new Date();
    const time = `${now.getMonth()+1}/${now.getDate()} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    await addDoc(collection(getDB(),'polls'), {
      title, author: myNick, time,
      agree: [], disagree: [],
      ts: serverTimestamp()
    });
    closeAll();
  } catch(e) {
    console.error('안건 등록 오류:', e);
    alert('등록 실패: ' + e.message);
    if(btn){ btn.textContent='안건 등록하기'; btn.disabled=false; }
  }
}

function openVoteModal(pollId){
  if(!myNick){ alert('로그인 후 이용해주세요!'); return; }
  currentPollId = pollId;
  const poll = pollsCache.find(p=>p.id===pollId);
  if(!poll) return;
  const myAgree = poll.agree.includes(myNick);
  const myDisagree = poll.disagree.includes(myNick);
  const total = poll.agree.length + poll.disagree.length;
  const agPct = total>0 ? Math.round(poll.agree.length/total*100) : 0;
  const diPct = total>0 ? Math.round(poll.disagree.length/total*100) : 0;
  document.getElementById('pollModalContent').innerHTML = `
    <p style="font-size:12px;color:var(--gray);margin-bottom:4px">📋 안건</p>
    <h2 style="font-family:Barlow,sans-serif;font-size:1.1rem;font-weight:700;color:var(--navy);margin-bottom:4px;line-height:1.4">${poll.title}</h2>
    <p style="font-size:12px;color:var(--gray);margin-bottom:20px">제시: ${poll.author} · ${poll.time}</p>
    <div style="display:flex;gap:10px;margin-bottom:20px">
      <button onclick="castVote('agree')" class="p-vote-btn agree ${myAgree?'my-vote':''}" style="flex:1;padding:16px;border-radius:10px;border:2px solid;font-size:15px;font-weight:700;font-family:inherit;cursor:pointer;background:${myAgree?'#0e8a7c':'#e0f5f2'};color:${myAgree?'#fff':'#0e8a7c'};border-color:#0e8a7c">
        👍 찬성<br><span style="font-size:20px;font-weight:800">${poll.agree.length}</span>표
      </button>
      <button onclick="castVote('disagree')" class="p-vote-btn disagree ${myDisagree?'my-vote':''}" style="flex:1;padding:16px;border-radius:10px;border:2px solid;font-size:15px;font-weight:700;font-family:inherit;cursor:pointer;background:${myDisagree?'#d63b3b':'#fdeaea'};color:${myDisagree?'#fff':'#d63b3b'};border-color:#d63b3b">
        👎 반대<br><span style="font-size:20px;font-weight:800">${poll.disagree.length}</span>표
      </button>
    </div>
    <div style="margin-bottom:6px">
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px"><span style="color:#0e8a7c">찬성 ${agPct}%</span><span style="color:#d63b3b">반대 ${diPct}%</span></div>
      <div style="background:#e8effe;border-radius:8px;height:12px;overflow:hidden;display:flex">
        <div style="background:#0e8a7c;width:${agPct}%;transition:width .4s"></div>
        <div style="background:#d63b3b;width:${diPct}%;transition:width .4s"></div>
      </div>
    </div>
    <p style="font-size:12px;color:var(--gray);text-align:center;margin-top:10px">총 ${total}명 참여 · 재투표 가능</p>
    ${poll.agree.length>0?`<p style="font-size:12px;color:#0e8a7c;margin-top:6px">👍 ${poll.agree.join(', ')}</p>`:''}
    ${poll.disagree.length>0?`<p style="font-size:12px;color:#d63b3b;margin-top:4px">👎 ${poll.disagree.join(', ')}</p>`:''}`;
  document.getElementById('pollOverlay').classList.add('show');
}

async function castVote(type){
  if(!currentPollId||!myNick) return;
  const { doc, updateDoc, arrayUnion, arrayRemove } = getFS();
  const ref = doc(getDB(),'polls',currentPollId);
  const other = type==='agree'?'disagree':'agree';
  await updateDoc(ref, {
    [type]: arrayUnion(myNick),
    [other]: arrayRemove(myNick)
  });
  // 팝업 내용 갱신
  openVoteModal(currentPollId);
}

function listenPolls(){
  const { collection, query, orderBy, onSnapshot } = getFS();
  const q = query(collection(getDB(),'polls'), orderBy('ts','desc'));
  onSnapshot(q, snap=>{
    pollsCache = snap.docs.map(d=>({id:d.id,...d.data()}));
    renderPolls();
  });
}

function renderPolls(){
  const el = document.getElementById('pollList');
  if(!el) return;
  if(!pollsCache.length){
    el.innerHTML='<div class="msg-empty">아직 등록된 안건이 없어요.<br>+ 안건 올리기를 눌러 의견을 제시해보세요!</div>';
    return;
  }
  el.innerHTML = pollsCache.map(p=>{
    const total = p.agree.length + p.disagree.length;
    const agPct = total>0?Math.round(p.agree.length/total*100):0;
    const diPct = total>0?Math.round(p.disagree.length/total*100):0;
    return `<div class="poll-card" onclick="openVoteModal('${p.id}')" style="cursor:pointer">
      <div class="p-title">${p.title}</div>
      <div class="p-author">제시: ${p.author} · ${p.time} · 총 ${total}명 참여</div>
      <div style="display:flex;gap:8px;margin-bottom:8px">
        <span style="background:#e0f5f2;color:#0e8a7c;border-radius:6px;padding:4px 12px;font-size:13px;font-weight:700">👍 찬성 ${p.agree.length}</span>
        <span style="background:#fdeaea;color:#d63b3b;border-radius:6px;padding:4px 12px;font-size:13px;font-weight:700">👎 반대 ${p.disagree.length}</span>
      </div>
      <div style="background:#e8effe;border-radius:6px;height:8px;overflow:hidden;display:flex">
        <div style="background:#0e8a7c;width:${agPct}%"></div>
        <div style="background:#d63b3b;width:${diPct}%"></div>
      </div>
    </div>`;
  }).join('');
}

function listenMessages(){
  const { collection, query, orderBy, onSnapshot } = getFS();
  const q = query(collection(getDB(),'messages'), orderBy('ts','asc'));
  onSnapshot(q, snap=>{
    const msgs = snap.docs.map(d=>d.data());
    renderMessages(msgs);
  });
}

function renderMessages(msgs){
  const el = document.getElementById('msgList');
  if(!el) return;
  if(!msgs||!msgs.length){
    el.innerHTML='<div class="msg-empty">아직 작성된 글이 없어요.<br>첫 번째 글을 남겨보세요!</div>';
    return;
  }
  el.innerHTML=[...msgs].reverse().map(m=>{
    const isMyMsg = m.name === myNick;
    const photoHtml = m.photo ? `<img src="${m.photo}" style="max-width:100%;border-radius:8px;max-height:260px;object-fit:cover;display:block;margin-top:8px" loading="lazy">` : '';
    const myBtns = isMyMsg ? `
      <div style="display:flex;gap:6px;margin-top:8px">
        <button onclick="editMsg('${m.id}')" style="flex:1;background:var(--blue-light);border:1px solid var(--blue);border-radius:6px;padding:5px 0;font-size:12px;font-weight:700;color:var(--blue);cursor:pointer;font-family:inherit">✏️ 수정</button>
        <button onclick="deleteMsg('${m.id}')" style="flex:1;background:var(--red-light);border:1px solid var(--red);border-radius:6px;padding:5px 0;font-size:12px;font-weight:700;color:var(--red);cursor:pointer;font-family:inherit">🗑️ 삭제</button>
      </div>` : '';
    return `<div class="msg-card" id="msgCard_${m.id}">
      <div class="m-header">
        <span class="m-name">${m.name}${isMyMsg?'<span style="font-size:10px;background:var(--blue);color:#fff;border-radius:10px;padding:1px 7px;margin-left:6px;font-weight:700">나</span>':''}</span>
        <span class="m-time">${m.time||''}</span>
      </div>
      <div class="m-text" id="msgText_${m.id}">${escHtml(m.text||'')}</div>
      ${photoHtml}
      ${myBtns}
    </div>`;
  }).join('');
}

async function submitMsg(){
  const text = document.getElementById('msgText').value.trim();
  const btn = document.querySelector('button[onclick="submitMsg()"]');
  if(!myNick){ alert('로그인 후 이용해주세요!'); return; }
  if(!text){ alert('내용을 입력해주세요'); return; }
  if(!window._db){ alert('연결 중입니다. 잠시 후 다시 시도해주세요'); return; }
  try {
    if(btn){ btn.textContent='전송 중...'; btn.disabled=true; }
    const { collection, addDoc, serverTimestamp } = getFS();
    const now = new Date();
    const time = `${now.getMonth()+1}/${now.getDate()} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    await addDoc(collection(getDB(),'messages'), { name:myNick, text, time, ts: serverTimestamp() });
    document.getElementById('msgText').value='';
    if(btn){ btn.textContent='✅ 완료!'; setTimeout(()=>{ btn.textContent='✉️ 글 남기기'; btn.disabled=false; },1500); }
  } catch(e){
    alert('전송 실패: '+e.message);
    if(btn){ btn.textContent='✉️ 글 남기기'; btn.disabled=false; }
  }
}

async function deleteMsg(docId){
  if(!confirm('이 글을 삭제할까요?')) return;
  try{
    const { doc, deleteDoc } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
    await deleteDoc(doc(getDB(), 'messages', docId));
  } catch(e){ alert('삭제 실패: '+e.message); }
}

function editMsg(docId){
  const textEl = document.getElementById('msgText_'+docId);
  const card = document.getElementById('msgCard_'+docId);
  if(!textEl || !card) return;
  const currentText = textEl.innerText;

  // 인라인 수정 UI
  textEl.innerHTML = `
    <textarea id="editArea_${docId}" style="width:100%;padding:10px;border:1.5px solid var(--blue);border-radius:8px;font-size:14px;font-family:inherit;resize:vertical;outline:none;box-sizing:border-box;line-height:1.6;min-height:80px">${currentText}</textarea>
    <div style="display:flex;gap:6px;margin-top:6px">
      <button onclick="saveEdit('${docId}')" style="flex:1;background:var(--blue);border:none;border-radius:6px;padding:8px;font-size:13px;font-weight:700;color:#fff;cursor:pointer;font-family:inherit">✅ 저장</button>
      <button onclick="cancelEdit('${docId}','${currentText.replace(/'/g,"&#39;")}')" style="flex:1;background:var(--bg);border:1.5px solid var(--border);border-radius:6px;padding:8px;font-size:13px;font-weight:700;color:var(--gray);cursor:pointer;font-family:inherit">✕ 취소</button>
    </div>`;
  // 수정/삭제 버튼 숨기기
  card.querySelectorAll('button[onclick^="editMsg"],button[onclick^="deleteMsg"]').forEach(b=>b.parentElement.style.display='none');
}

async function saveEdit(docId){
  const ta = document.getElementById('editArea_'+docId);
  if(!ta) return;
  const newText = ta.value.trim();
  if(!newText){ alert('내용을 입력해주세요.'); return; }
  try{
    const { doc, updateDoc } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
    await updateDoc(doc(getDB(), 'messages', docId), { text: newText });
    // 렌더링은 onSnapshot이 자동으로 업데이트
  } catch(e){ alert('저장 실패: '+e.message); }
}

function cancelEdit(docId, originalText){
  const textEl = document.getElementById('msgText_'+docId);
  if(textEl) textEl.innerHTML = escHtml(originalText);
  const card = document.getElementById('msgCard_'+docId);
  if(card) card.querySelectorAll('div[style*="display:none"]').forEach(d=>d.style.display='flex');
}

function escHtml(t){
  return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
}

function closePollModal(e){ if(e.target===document.getElementById('pollOverlay')) closeAll(); }

function initCommunity(){
  if(!window._db){ console.error('DB not ready'); return; }
  listenPolls();
  listenMessages();
}
