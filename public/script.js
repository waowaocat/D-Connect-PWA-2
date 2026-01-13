// public/script.js

// 2. Firestore設定
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
    if (!requestListElement) return;
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
                
                <div class="card-body">
                <div class="card-header">
                    <h3 class="card-title">${data.title}</h3>
                    <span class="status-tag">${data.status}</span>
                </div>
                
                <p><strong>学科:</strong> ${data.discipline}</p>
                <p class="date-info">投稿日時: ${dateString}</p>
                <button class="detail-button">詳細を見る</button>
                </div> `;
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
// ーーーーーーーーーーーーーーーーーーーー
// 作品追加ーーーーーーーーーーーーーーーー
// ーーーーーーーーーーーーーーーーーーーー
// 作品追加ーーーーーーーーーーーーーーーー
// ーーーーーーーーーーーーーーーーーーーー
// 作品追加ーーーーーーーーーーーーーーーー
// ーーーーーーーーーーーーーーーーーーーー

// フォーム送信時のイベントリスナー
if (requestForm) {
requestForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // ページの再読み込み（デフォルト動作）を防ぐ

    // 1. 画像ファイルを取得
    const fileInput = document.getElementById('image');
    const file = fileInput ? fileInput.files[0] : null

    let imageUrl = "";

    const portfolio_Post_Btn = requestForm.querySelector('button[type="submit"]');

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
}


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
if(closeFormBtn) {
closeFormBtn.addEventListener('click', () => {
    postFormContainer.style.display = 'none';
});
}

// 【おまけ】背景の黒い部分をクリックしても閉じるようにする
if(postFormContainer) {
postFormContainer.addEventListener('click', (e) => {
    if (e.target === postFormContainer) {
        postFormContainer.style.display = 'none';
    }
});
}

// ----------------------
// ----------------------
// ----------------------
// ----------------------
// ----------------------
// ----------------------
// ----------------------
// ----------------------
// ----------------------

// @@@@@@@@@@@ 作品を追加するためのJS @@@@@@@@

// 1. Cloudinary設定
const CLOUD_NAME = "dsdjwlh1u";
const UPLOAD_PRESET = "portfolios-page";

// 2. Firestore設定
// const db = firebase.firestore();
const portfoliosCollection = db.collection('portfolios');

// --- 3. HTML要素の取得
const portfolioFileInput = document.getElementById('portfolio-file-input');
const portfolioPostBtn = document.getElementById('portfolio-post-btn');
const portfolioDropArea = document.getElementById('portfolio-drop-area');

// 🌟重要：要素が取得できているか確認（デバッグ用）
if (!portfolioPostBtn) {
    console.error("エラー：portfolio-post-btn が見つかりません。HTMLのIDを確認してください。");
}
// --- 4. 投稿処理 ---
if (portfolioPostBtn){
portfolioPostBtn.addEventListener('click', async () => {
    console.log("公開ボタンが押されました");
    // 1. 入力値（画像・タイトル・説明）を今この瞬間の状態で取得する
    const file = portfolioFileInput.files[0];
    const title = document.getElementById('portfolio-title').value;
    const desc = document.getElementById('portfolio-desc').value;

    // 2. 入力チェック（バリデーション）
    if (!file || !title) {
        return alert("画像とタイトルを入力してください");
    }
    const originalBtnText = portfolioPostBtn.innerText;
    portfolioPostBtn.disabled = true;
    portfolioPostBtn.innerText = "アップロード中...";   

try {
    console.log("Cloudinaryへ送信開始...");
    // --- ステップ1：Cloudinaryへ画像をアップロード ---
    const formData = new FormData();

    // 2. 封筒に「画像」と「合言葉」を入れる
    formData.append('upload_preset' , UPLOAD_PRESET);
    formData.append('file', file);

    // 3. 郵便屋さん（fetch）に頼んでCloudinaryへ発送する
    const url = "https://api.cloudinary.com/v1_1/" + CLOUD_NAME + "/image/upload";
    const clResponse = await fetch(url, {    method: 'POST',
    body: formData
    });

    // 4. 無事に届いたか確認し、中身（返事）を取り出す
    if (!clResponse.ok) throw new Error('Cloudinaryへのアップロードに失敗しました');
    const clData = await clResponse.json();
    const imageUrl = clData.secure_url;
    console.log("画像URL取得成功:", imageUrl);

    // ステップ2：Firestoreへデータを保存
    console.log("Firestoreへの保存を開始します...");

    const postData = {
        title: title || "タイトルなし",
        description: desc || "",
        imageUrl: imageUrl,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
        console.log("保存するデータ:", postData);

        // 保存実行
        console.log("Firestoreへの書き込み命令を送りました...");
        const docRef = await db.collection('portfolios').add(postData);
        
        console.log("Firestore保存成功！ ID:", docRef.id); // IDが出れば確実に保存されている
        alert("作品が正常に公開されました！");
        window.location.href = "check-portfolio.html";

    } catch (fsError) {
        // Firestore特有のエラー（権限不足など）をここで捕まえる
        console.error("Firestore保存中にエラーが発生しました:", fsError);
        throw new Error("データベースへの保存に失敗しました: " + fsError.message);
    }
});
}

if(portfolioDropArea && portfolioFileInput) {
    portfolioDropArea.addEventListener('click', () => {
        portfolioFileInput.click();
    });
    portfolioFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const previewImg = document.getElementById('portfolio-preview-img');
                const previewCont = document.getElementById('portfolio-preview-container');
                const defaultMsg = document.getElementById('portfolio-upload-default');

                if(previewImg) previewImg.src = event.target.result;
                if(previewCont) previewCont.style.display = 'block' ;
                if(defaultMsg) defaultMsg.style.display = 'none';
            };

            reader.readAsDataURL(file);
        }
    });
}


// ----------------------
// ----------------------
// ----------------------
// ----------------------
// ----------------------
// ----------------------
// ----------------------
// ----------------------
// ----------------------

// 投稿作品一覧表示

const FIREBASE = {
    COLLECTION_PORTGOLIOS: 'portfolios',
    FIELD_CREATED_AT: 'createdAt'
};







