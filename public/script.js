// public/script.js

// 【修正点 2】トップレベルで Firebase サービスとコレクションを初期化する
// これにより、フォーム送信イベントが発生したときには既に準備ができている状態になります。
const db = firebase.firestore();
const requestsCollection = db.collection('requests');
// ボタンとフォームコンテナの要素を取得
const addRequestBtn = document.getElementById('add-request-btn');
const postFormContainer = document.getElementById('post-form-container');
const closeFormBtn = document.getElementById('close-form-btn');

const requestListElement = document.getElementById('request-list'); 
// フォーム要素の取得
const requestForm = document.getElementById('request-form');

/**
* Firestoreから依頼データを取得し、HTMLとして画面に表示する関数
 */
function fetchAndRenderRequests() {

    // 画面のローディングメッセージをクリア (最初の一回だけ)
    requestListElement.innerHTML = ''; 

    // Firestoreの requests コレクションを監視する（リアルタイム更新）
    // createdAt で降順（desc:新しい順）に並べ替える
    requestsCollection.orderBy('createdAt', 'desc').onSnapshot(snapshot => {
        
        requestListElement.innerHTML = ''; // データが更新されたらリストをクリア
        
        if (snapshot.empty) {
            requestListElement.innerHTML = '<p class="empty-message">まだ依頼がありません。</p>';
            return;
        }

        // 取得した各ドキュメント（依頼）に対して処理を行う
        snapshot.forEach(doc => {
            const data = doc.data(); // 依頼データ本体
            const requestId = doc.id; // 【✅ 修正点 1】ドキュメントIDをここで定義！
            
            // 依頼カード（HTML要素）を作成
            const card = document.createElement('div');
            card.className = 'request-card'; 

            

            // createdAt (Timestamp) を読みやすい形式に変換
            let dateString = "日付不明";
            if (data.createdAt) {
                // TimestampオブジェクトをJavaScriptのDateオブジェクトに変換
                const date = data.createdAt.toDate();
                // 例: 2025/12/14 08:00
                dateString = date.toLocaleDateString('ja-JP') + ' ' + date.toLocaleTimeString('ja-JP').substring(0, 5);
            }

            card.innerHTML = `
                <div class="card-image-placeholder">
                    <img src="${data.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}" alt="依頼画像">
                </div>
                
                <div class="card-body" style="padding: 15px;">
                <div class="card-header">
                    <h3 class="card-title">${data.title}</h3>
                    <span class="status-tag">${data.status}</span>
                </div>
                
                <p><strong>学科:</strong> ${data.discipline}</p>
                <p class="date-info">投稿日時: ${dateString}</p>
                <button class="detail-button">詳細を見る</button>
            `;
    const detailButton = card.querySelector('.detail-button');
    detailButton.addEventListener('click', () => {
        
        // 🚨 詳細画面へ進む前に、まずはクリックされたか確認しましょう。
        console.log(`詳細ボタンがクリックされました。依頼ID: ${requestId}`);
        alert(`依頼ID ${requestId} の詳細を開きます`);

        // ★ 実際の詳細ページ遷移処理 (例: 次のステップで実装)
        // window.location.href = `/request-detail.html?id=${requestId}`;
    });      
            
            // 作成したカードを画面上のリスト要素に追加
            requestListElement.appendChild(card);
        });

    }, error => {
        console.error("Firestoreデータ取得エラー: ", error);
        requestListElement.innerHTML = '<p class="error-message">データの取得に失敗しました。コンソールを確認してください。</p>';
    });
}

// ページが完全に読み込まれたら、データ取得関数を実行
window.onload = fetchAndRenderRequests;

// 下記day4lllllllllllllllllllllllllllllllllllllllllllllllllllllllllll


// フォーム送信時のイベントリスナー
requestForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // ページの再読み込み（デフォルト動作）を防ぐ

    // フォームからのデータ取得
    const newRequest = {
        title: document.getElementById('title').value,
        discipline: document.getElementById('discipline').value,
        description: document.getElementById('description').value,
        status: '募集中', // 新規投稿時は固定値
        // サーバー側で安全かつ正確な時刻を記録
        createdAt: firebase.firestore.FieldValue.serverTimestamp() 
    };

    try {
        // Firestoreのrequestsコレクションに新しいドキュメントを追加 (add)
        await requestsCollection.add(newRequest);
        
        // 投稿成功後、フォームをリセット
        requestForm.reset();
        alert('依頼が正常に投稿されました！');

    } catch (error) {
        console.error("データ書き込みエラー: ", error);
        alert('投稿に失敗しました。コンソールを確認してください。');
    }
});



// ① ページ内のすべての「fieldsetの中にあるlegend」を探して、一つずつ処理する
document.querySelectorAll('fieldset legend').forEach(legend => {


// ② そのlegend（「依頼元」などの文字）がクリックされるのを待ち構える
    legend.addEventListener('click', ()=> {

// ③ クリックされたlegendの「親親分（fieldsetタグ）」を見つける
// ※ legendにクラスをつけるのではなく、箱全体（fieldset）につけるため
        const parentFieldset = legend.parentElement;

// ④ 親分（fieldset）に「open」クラスがあれば消す、なければ付ける（トグル）
         parentFieldset.classList.toggle('open')
});
});


//　「＋ 依頼を投稿」ボタンが押された時の処理　
//   背景黒幕バージョン

// フォームを開く
addRequestBtn.addEventListener('click', () => {
    postFormContainer.style.display = 'flex'; // blockではなくflexにすると中央寄せが効く
});

// キャンセルボタンで閉じる
closeFormBtn.addEventListener('click', () => {
    postFormContainer.style.display = 'none';
});

// 【おまけ】背景の黒い部分をクリックしても閉じるようにする
postFormContainer.addEventListener('click', (e) => {
    if (e.target === postFormContainer) {
        postFormContainer.style.display = 'none';
    }
});

