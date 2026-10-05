import { initializeApp }
    from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


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
const db = getFirestore(app);


/* =========================================
   FIREBASE AUTH STATE
========================================= */

onAuthStateChanged(auth, (user) => {

    if (user) {

        console.log(
            "Cart: logged in as",
            user.email
        );

    } else {

        console.log(
            "Cart: not logged in"
        );

    }

});


/* =========================================
   GET FIREBASE ID TOKEN
   Used by script.js checkout
========================================= */

window.getFirebaseIdToken = async function () {

    const user = auth.currentUser;

    if (!user) {
        return null;
    }

    return await user.getIdToken();

};