import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js'
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "#####################",
    authDomain: "################",
    projectId: "##################",
    storageBucket: "#####################",
    messagingSenderId: "###############",
    appId: "########################",
    measurementId: "###########"
};

const admin = initializeApp(firebaseConfig);
const auth = getAuth(admin);
const storage = getStorage(admin);
const database = getFirestore(admin);

//PDF Gen API Integration
const PDF_API_URL = "https://pdfgen.app/api";
const TEMPLATE_ID = "######";

async function pdfGenAPI(data, pdfFileName) {
    const response = await fetch(
        `${PDF_API_URL}/generate?templateId=${TEMPLATE_ID}`,
        {
            method: "POST",
            body: JSON.stringify({data}),
            headers: {
                api_key: "##################",
            },
        }
    );
    //console.log(response);

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;

    a.setAttribute('download', pdfFileName);
    a.click();

    setTimeout(() => {
        window.URL.revokeObjectURL(url);
    }, 1000);
}

export const signUpWardConnect = function(email,password,username,window) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            updateProfile(user, {
                displayName: username
            })
            alert("Account created successfully!!");
            window.location.href = '/login.html';
        })
        .catch((error) => {
            const errorMessage = error.message;
            alert(`Error: ${errorMessage}`);
        });
}

export const loginWardConnect = function(email,password,window) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert("Logged in Successfully!!");
            window.location.href = '/index.html';
        })
        .catch((error) => {
            const errorMessage = error.message;
            alert(`Error in Signing In: ${errorMessage}`);
        });
}

export const signOutWardConnect = function(window) {
    auth.signOut()
        .then(()=> {
            console.log('Signed Out!!!');
            window.location.href = '/login.html';
        })
        .catch((error)=>{
            console.log(`Error signing out ${error}`);
        })
}

export const uploadToFirebase = function(imageFile,imageName,reportData,pdfFileName) {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();

    const storageRef = ref(storage, imageName);

    uploadBytesResumable(storageRef, imageFile)
        .then((uploadTaskSnapshot) => {
            return getDownloadURL(uploadTaskSnapshot.ref);
        })
        .then((downloadURL) => {
            const data = {
                username: reportData.username,
                zone: reportData.zone,
                ward: reportData.ward,
                issue: reportData.issue,
                description: reportData.description,
                imageurl: downloadURL,
                dateandtime: formattedDate
            }

            addDoc(collection(database, 'reports'), data)
            .then(function(docRef) {
                console.log("Document written with ID: ", docRef.id);
                pdfGenAPI(data,pdfFileName);
            })
        })
        .catch((error) => {
            console.error('Error uploading image or adding Firestore document:', error.message);
        });
}

export const app = angular.module("mobilexpress",['ngMessages', 'ngAnimate']);

app.service('authService', function() {
    let currentUser = null;
    if(localStorage.getItem('currentUser')) {
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
  
    this.setCurrentUser = function(user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    };
  
    this.getCurrentUser = function() {
      return currentUser?currentUser.displayName:'';
    };

    onAuthStateChanged(auth, (user) => {
        this.setCurrentUser(user);
    });
});