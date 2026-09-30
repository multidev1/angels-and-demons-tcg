import { initializeApp }
    from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyC8SYGuCnamD8EXHppwDfx3Px4kFREy68Q",
    authDomain: "angels-and-demons-tcg.firebaseapp.com",
    projectId: "angels-and-demons-tcg",
    storageBucket: "angels-and-demons-tcg.firebasestorage.app",
    messagingSenderId: "824060828922",
    appId: "1:824060828922:web:ad0c4f5bf978a738aa3d43",
    measurementId: "G-LT9RPTDKCE"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


onAuthStateChanged(auth, (user) => {

    console.log("Firebase user:", user);

    const accountLink =
        document.querySelector('a[href="account.html"]');

    if (!accountLink) {
        return;
    }

    if (user) {
        accountLink.textContent = "My Account";
    } else {
        accountLink.textContent = "Account";
    }

});