import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js'
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "#############################",
    authDomain: "#########################",
    projectId: "#########################",
    storageBucket: "#######################",
    messagingSenderId: "##########",
    appId: "###################################",
    measurementId: "#################"
};

const admin = initializeApp(firebaseConfig);
const auth = getAuth(admin);
auth.languageCode = 'en';
const storage = getStorage(admin);
const database = getFirestore(admin);
const analytics = getAnalytics(admin);
const provider = new GoogleAuthProvider();

//PDF Gen API Integration
const PDF_API_URL = "https://pdfgen.app/api";
const TEMPLATE_ID = "#######";

async function pdfGenAPI(data, pdfFileName) {
    const response = await fetch(
        `${PDF_API_URL}/generate?templateId=${TEMPLATE_ID}`,
        {
            method: "POST",
            body: JSON.stringify({data}),
            headers: {
                api_key: "#################",
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
            logEvent(analytics, 'signup', { method: 'email' });
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

export const loginByGoogleAuth0 = async function(window) {
    signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            window.location.href = '/index.html';
        })
        .catch((error) => {

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
                logEvent(analytics, 'issue-report', { ward: data.ward });
                console.log("Document written with ID: ", docRef.id);
                pdfGenAPI(data,pdfFileName);
            })
        })
        .catch((error) => {
            console.error('Error uploading image or adding Firestore document:', error.message);
        });
}

export const uploadImage = function(imageFile,imageName,landmark,http) {
    const storageRef = ref(storage, imageName);

    uploadBytesResumable(storageRef, imageFile)
        .then((uploadTaskSnapshot) => {
            return getDownloadURL(uploadTaskSnapshot.ref);
        })
        .then((downloadURL) => {
            const data = {
                name: landmark.name,
                type: landmark.type,
                wardnumber: landmark.wardnumber,
                zone: landmark.zone,
                address: landmark.address,
                contact: landmark.contact,
                imgsrc: downloadURL
            };
            http.post('https://ap-south-1.aws.data.mongodb-api.com/app/ward-connect-bnhaj/endpoint/addlandmark', data)
                .then(function(response) {
                    alert(response.data);
                })
                .catch(function(error) {
                    alert(error);
                });
        })
        .catch((error) => {
            alert("Error uploading image!!");
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