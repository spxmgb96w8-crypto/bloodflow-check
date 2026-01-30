(() => {
  const STORAGE_KEY = "bloodflow_check_v1";
  const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
  const countBlue = document.getElementById("countBlue");
  const countYellow = document.getElementById("countYellow");
  const countRed = document.getElementById("countRed");
  const countTotal = document.getElementById("countTotal");

  const severityTitle = document.getElementById("severityTitle");
  const severityDesc = document.getElementById("severityDesc");

  const resetBtn = document.getElementById("resetBtn");
  const copyResultBtn = document.getElementById("copyResultBtn");

  function getCounts(){
    const c = { blue:0, yellow:0, red:0, total:0 };
    for (const cb of checkboxes){
      if (cb.checked){
        c[cb.value] += 1;
        c.total += 1;
      }
    }
    return c;
  }

  // 判定ルール（ユーザー要望：今のまま）
  // 赤に1つでもチェック → 重度
  // 赤0で黄に1つでもチェック → 中度
  // 赤0・黄0で青に1つでもチェック → 軽度
  function getSeverity(counts){
    if (counts.red > 0) return "heavy";
    if (counts.yellow > 0) return "mid";
    if (counts.blue > 0) return "light";
    return "none";
  }

  function setSeverityUI(sev, counts){
    if (sev === "none"){
      severityTitle.textContent = "まだチェックされていません";
      severityDesc.textContent = "当てはまる項目にチェックを入れると、結果が表示されます。";
      return;
    }
    if (sev === "heavy"){
      severityTitle.textContent = "重度（赤）に当てはまるサインがあります";
      severityDesc.textContent = "冷え・だるさ・コリなどが出やすいゾーン。まずは一度、血流改善体験でリセットしてみましょう。";
      return;
    }
    if (sev === "mid"){
      severityTitle.textContent = "中度（黄）に当てはまるサインがあります";
      severityDesc.textContent = "巡りと代謝が落ちやすいゾーン。生活習慣の見直し＋ケアの継続が大切です。";
      return;
    }
    if (sev === "light"){
      severityTitle.textContent = "軽度（青）に当てはまるサインがあります";
      severityDesc.textContent = "姿勢・運動・入浴などの習慣で変化が出やすいゾーン。早めのケアが◎";
      return;
    }
  }

  function render(){
    const counts = getCounts();
    countBlue.textContent = counts.blue;
    countYellow.textContent = counts.yellow;
    countRed.textContent = counts.red;
    countTotal.textContent = counts.total;

    const sev = getSeverity(counts);
    setSeverityUI(sev, counts);

    saveState();
  }

  function saveState(){
    const checked = checkboxes.map(cb => cb.checked);
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    }catch(_){}
  }

  function loadState(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const checked = JSON.parse(raw);
      if (!Array.isArray(checked)) return;
      for (let i=0;i<checkboxes.length;i++){
        if (typeof checked[i] === "boolean") checkboxes[i].checked = checked[i];
      }
    }catch(_){}
  }

  function resetAll(){
    for (const cb of checkboxes) cb.checked = false;
    render();
  }

  function buildShareText(){
    const counts = getCounts();
    const sev = getSeverity(counts);

    let sevText = "未チェック";
    if (sev === "light") sevText = "軽度（青）";
    if (sev === "mid") sevText = "中度（黄）";
    if (sev === "heavy") sevText = "重度（赤）";

    return [
      "【血流改善チェック 結果】",
      `判定：${sevText}`,
      `青：${counts.blue} / 黄：${counts.yellow} / 赤：${counts.red} / 合計：${counts.total}`,
      "",
      "（この画面をスタッフに見せてください）"
    ].join("\n");
  }

  async function copyResult(){
    const text = buildShareText();
    try{
      await navigator.clipboard.writeText(text);
      copyResultBtn.textContent = "コピーしました！";
      setTimeout(() => copyResultBtn.textContent = "結果をコピー（スタッフに見せる用）", 1600);
    }catch(_){
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      copyResultBtn.textContent = "コピーしました！";
      setTimeout(() => copyResultBtn.textContent = "結果をコピー（スタッフに見せる用）", 1600);
    }
  }

  // Wire up
  for (const cb of checkboxes){
    cb.addEventListener("change", render);
  }
  resetBtn?.addEventListener("click", resetAll);
  copyResultBtn?.addEventListener("click", copyResult);

  loadState();
  render();
})();